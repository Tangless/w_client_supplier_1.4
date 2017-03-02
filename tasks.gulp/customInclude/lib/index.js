'use strict';

var replaceOperator = require('./replace-operator');
var replaceFunction = require('./replace-function');
var replaceVariable = require('./replace-variable');
var parseDefault = require('./parse-default');
var concat = require('concat-stream');
var setIndent = require('./indent');
var through = require('through2');
var gutil = require('gulp-util');
var extend = require('extend');
var path = require('path');
var fs = require('fs');

module.exports = function(opts) {
    if (typeof opts === 'string') {
        opts = {prefix: opts};
    }

    opts = extend({}, {
        basepath: '@file',
        prefix: '@@',
        suffix: '',
        context: {},
        filters: false,
        indent: false
    }, opts);

    if (opts.basepath !== '@file') {
        opts.basepath = opts.basepath === '@root' ? process.cwd() : path.resolve(opts.basepath);
    }
    var includeMaps, fileMaps;
    function fileInclude(file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
        } else if (file.isStream()) {
            file.contents.pipe(concat(function(data) {
                try {
                    data = include(file, String(data));
                    cb(null, data);
                } catch (e) {
                    cb(new gutil.PluginError('gulp-file-include', e.message));
                }
            }));
        } else if (file.isBuffer()) {
            if(opts.record){
                fileMaps = fileMaps || {};
                //var arr = file.path.split(/[\\/]/);
                var str = path.relative(opts.basepath, file.path).replace(/[\\/]/g,"/");
                fileMaps[str.substr(str.indexOf("/")+1)+(String(file.contents).indexOf("{{DONE}}")!="-1"?"":"_")] = includeMaps = [];
            }
            try {
                file = include(file, String(file.contents));
                cb(null, file);
            } catch (e) {
                cb(new gutil.PluginError('gulp-file-include', e.message));
            }
        }
    }

    return through.obj(fileInclude, function (cb) {
        if(opts.record){
            var mapFile = new gutil.File({
                path: opts.context.site+"/"+opts.record+".json",
                contents: new Buffer(JSON.stringify(fileMaps, null, '  '))
            });
            this.push(mapFile);
        }
        cb();
    });

    /**
     * utils
     */
    function stripCommentedIncludes(content, opts) {
        // remove single line html comments that use the format: <!-- @@include() -->
        var regex = new RegExp('<\!--(.*)' + opts.prefix + '[ ]*include([\\s\\S]*?)[ ]*' + opts.suffix + '-->', 'g');
        return content.replace(regex, '');
    }

    function include(file, text, data) {
        
        var filebase = opts.basepath === '@file' ? path.dirname(file.path) : opts.basepath;
        var currentFilename = path.resolve(file.base, file.path);
        text = replaceID(path.relative(file.cwd, currentFilename),text,file);
        if(currentFilename.substr(currentFilename.lastIndexOf("."))=='.scss'){
            text = addScssID(path.relative(file.cwd, currentFilename),text,file);
        }
        /*  console.log("+++++++")
         console.log(currentFilename);
         console.log(file);
         console.log(text);
         console.log("=========")*/

        // 解析出default参数们
        var defaultx;
		text = parseDefault(text, {
            prefix: opts.prefix,
            name: 'default',
			handler: function(def_param) {
			    defaultx = def_param;	
			}  
		});

        // 参数优先级(索引值越小，优先级越高):
        // 1. include时传入的
        // 2. default(本文件头部声明) 
        // 3. context(在gulp task中，相当于全局) 
        data = extend(true, {}, opts.context, defaultx, data || {});
        data.content = text;

        text = stripCommentedIncludes(text, opts);
        text = replaceOperator(text, {
            prefix: opts.prefix,
            suffix: opts.suffix,
            name: 'if',
            handler: conditionalHandler
        });
        text = replaceVariable(text, data, opts);
        text = replaceFunction(text, {
            prefix: opts.prefix,
            suffix: opts.suffix,
            name: 'include',
            handler: includeHandler
        });

        function conditionalHandler(inst) {
            // jshint ignore: start
            var condition = new Function('var context = this; with (context) { return ' + inst.args + '; }').call(data);
            // jshint ignore: end

            return condition ? inst.body : '';
        }

        function includeHandler(inst) {
            var args = /[^)"\']*["\']([^"\']*)["\'](,\s*({[\s\S]*})){0,1}\s*/.exec(inst.args);

            if (args) {
                var includePath = path.resolve(filebase, args[1]);
                // for checking if we are not including the current file again
                if (currentFilename.toLowerCase() === includePath.toLowerCase()) {
                    throw new Error('recursion detected in file: ' + currentFilename);
                }

                var includeContent = fs.readFileSync(includePath, 'utf-8');

                if (opts.indent) {
                    includeContent = setIndent(inst.before, inst.before.length, includeContent);
                }

                // need to double each `$` to escape it in the `replace` function
                // includeContent = includeContent.replace(/\$/gi, '$$$$');

                // apply filters on include content
                if (typeof opts.filters === 'object') {
                    includeContent = applyFilters(includeContent, args.input);
                }
                //includeContent = replaceID(path.relative(file.cwd, includePath), includeContent, file);

                var recFile = new gutil.File({
                    cwd: process.cwd(),
                    base: file.base,
                    path: includePath,
                    contents: new Buffer(includeContent)
                });

                recFile = include(recFile, includeContent, args[3] ? JSON.parse(args[3]) : {});

                return String(recFile.contents);
            }
        }

        file.contents = new Buffer(text);

    return file;
  }
  function addScssID(filepath, text, file) {
    var arr = filepath.split(/[\\/]/);
    var id = arr[arr.length-2];
      var pre = (id.substr(0,1)=="_" || filepath.indexOf("iwidgets")==4)?".":"#";
      var find = text.match(/^[\.#\w]+/m);
      if(find){
          var s = text.substr(0,find.index);
          var e = text.substr(find.index);
          var t = e.indexOf(pre+id);
          if(t!=0){
              text = s+pre+id+"{"+e+"}";
              console.log("=====warning====== The IModule's CSS must be start with ID :"+id);
          }
      }
    return text;
  }

  function replaceID(filepath, text, file) {
        var arr = filepath.split(/[\\/]/);
        var id = arr[arr.length-2];
        if(includeMaps && filepath.substr(filepath.length-8)==".md.html"){
            var str = path.relative(opts.basepath, file.path).replace(/[\\/]/g,"/");
            includeMaps.push(str.substr(str.indexOf("/")+1));
        }
        arr.pop();
        arr.shift();
        arr.shift();
        var mpath = arr.join("/");
        /* console.log("00000000000000");
         console.log(filepath);
         console.log(file);
         console.log(text);
         console.log("1111111111111111111");*/
      var meatData = {
          ID:id,
          MPATH:mpath,
          MCSS:mpath+'/main.css.min',
          MIMAGE:'/images/imodules/'+id,
          IMODULE:'imodule="/iscripts/imodules/'+id+'.js"',
          IncludeMCSS:'<style>@@include("'+mpath+'/main.css.min'+'")</style>',
          GetMCSS: '@@include("'+mpath+'/main.css.min'+'")',
          IncludeMTPL:'<script idom="tpl" type="text/tpl">@@include("'+mpath+'/main.mus.html.min'+'")</script>',
          GetMTPL:'@@include("'+mpath+'/main.mus.html.min'+'")',
          VERSION: opts.context.ver,
          WIMAGE:'/images/iwidgets/'+id,
          IncludeWCSS:'<style>@@include("../iwidgets/'+mpath+'/main.css.min'+'")</style>',
          GetWCSS:'@@include("'+mpath+'/main.css.min'+'")',

          DONE:''
      };
      return embString(text, meatData);
      /*if(opts.context.ver){
          text = text.replace(/(['"])(\/[^'"]+?)(\.html)/gm,function($0,$1,$2,$3){return $1+'/'+opts.context.ver+$2+$3});
      }*/
      //return text;
        /*return text.replace(/([\. :(])(url|src|href)([ '"=(]+)([^'"+]+?)\.(jpg|png|gif|jpeg|css|js|tpl)/gm,function($0,$1,$2,$3,$4,$5){
            var str = $4.substr(0,6);
            if(str=="http:/"||str=="cdn://"||str=="https:"){return $0;}
            if($4.substr(0,$4.indexOf("/",2)).indexOf(".")>0){return $0;}
            return $1+$2+$3+"cdn://"+opts.context.site+($4.substr(0,1)=="/"?"":"/")+$4+"."+$5;
        });*/
    }
    function embString (template, data, splitter) {
        if (!splitter) {
            splitter = { start: "{{", end: "}}" };
        }
        var re = new RegExp("\\" + splitter.start + "([^\\" + splitter.start + "\\" + splitter.end + "]*)\\" + splitter.end, "gm");
        if (re.test(template)) {
            template = template.replace(re, function (substring) {
                var arr = arguments[1].split("@");
                var value = data[arr.shift()];
                return (value !== undefined) ? (arr.length?data[value+"@"].apply(null,arr):value) : substring;
            });
        }
        return template;
    }
    function applyFilters(includeContent, match) {
        if (!match.match(/\)+$/)) {
            // nothing to filter return unchanged
            return includeContent;
        }

        // now get the ordered list of filters
        var filterlist = match.split('(').slice(0, -1);
        filterlist = filterlist.map(function(str) {
            return opts.filters[str.trim()];
        });

        // compose them together into one function
        var filter = filterlist.reduce(compose);

        // and apply the composed function to the stringified content
        return filter(String(includeContent));
    }
};

function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}
