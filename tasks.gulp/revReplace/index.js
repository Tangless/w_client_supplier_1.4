'use strict';
var _            = require('underscore');
var gutil        = require('gulp-util');
var PluginError  = gutil.PluginError;
var through      = require('through2');
var path         = require('path');

var PLUGIN_NAME  = 'gulp-rev-collector';

var defaults = {
    revSuffix: '-[0-9a-f]{8,10}-?'
};

function _getManifestData(file, opts) {
    var data;
    var ext = path.extname(file.path);
    if (ext === '.json') {
        var json = {};
        try {
            var content = file.contents.toString('utf8');
            if (content) {
                json = JSON.parse(content);
            }
        } catch (x) {
            this.emit('error', new PluginError(PLUGIN_NAME,  x));
            return;
        }
        if (_.isObject(json)) {
            var isRev = 1;
            Object.keys(json).forEach(function (key) {
                if ( !_.isString(json[key]) || path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !==  path.basename(key) ) {
                    isRev = 0;
                }
            });

            if (isRev) {
                data = json;
            }
        }

    }
    return data;
}

function escPathPattern(pattern) {
    return pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|\/\\]/g, "\\$&");
}

function closeDirBySep(dirname) {
    return dirname + (!dirname || new RegExp( escPathPattern('/') + '$' ).test(dirname) ? '' : '/');
}

function revCollector(opts) {
    opts = _.defaults((opts || {}), defaults);

    var manifest  = {};
    var mutables = [];
    return through.obj(function (file, enc, cb) {
        if (!file.isNull()) {
            var mData = _getManifestData.call(this, file, opts);
            if (mData) {
                _.extend( manifest, mData );
            } else {
                mutables.push(file);
            }
        }
        cb();
    }, function (cb) {
        var regRep = new RegExp('([. :(])(url|src|href)([ \'"=(]+)([^\'"+\\\s,]+?)\\\.('+opts.rev+')',"igm");

        var changes = [];
        var dirReplacements = [];
        if ( _.isObject(opts.dirReplacements) ) {
            Object.keys(opts.dirReplacements).forEach(function (srcDirname) {
                dirReplacements.push({
                    dirRX:  escPathPattern( closeDirBySep(srcDirname) ),
                    dirRpl: opts.dirReplacements[srcDirname]
                });
            });
        }

        for (var key in manifest) {
            var patterns = [ escPathPattern(key) ];
            if (opts.replaceReved) {
                patterns.push( escPathPattern( (path.dirname(key) === '.' ? '' : closeDirBySep(path.dirname(key)) ) + path.basename(key, path.extname(key)) )
                            + opts.revSuffix
                            + escPathPattern( path.extname(key) )
                        );
            }

            if ( dirReplacements.length ) {
                dirReplacements.forEach(function (dirRule) {
                    patterns.forEach(function (pattern) {
                        changes.push({
                            regexp: new RegExp(  dirRule.dirRX + pattern, 'g' ),
                            patternLength: (dirRule.dirRX + pattern).length,
                            replacement: _.isFunction(dirRule.dirRpl)
                                            ? dirRule.dirRpl(manifest[key])
                                            : closeDirBySep(dirRule.dirRpl) + manifest[key]
                        });
                    });
                });
            } else {
                patterns.forEach(function (pattern) {
                    // without dirReplacements we must leave asset filenames with prefixes in its original state
                    changes.push({
                        regexp: new RegExp( '([\'"(=])' + pattern, 'g' ),
                        patternLength: pattern.length,
                        replacement: '$1' + opts.cdn + manifest[key]
                    });
                });
            }
        }

        // Replace longer patterns first
        // e.g. match `script.js.map` before `script.js`
        changes.sort(
            function(a, b) {
                return b.patternLength - a.patternLength;
            }
        );
        mutables.forEach(function (file){
            if (!file.isNull()) {

                var src = file.contents.toString('utf8');/*.replace( regRep, function($0,$1,$2,$3,$4,$5){
                    var str = $4.substr(0,6);
                    if(str=="http:/"||str=="cdn://"||str=="https:"){return $0;}
                    if($4.substr(0,$4.indexOf("/",2)).indexOf(".")>0){return $0;}
                    return $1+$2+$3+"cdn://"+opts.site+($4.substr(0,1)=="/"?"":"/")+$4+"."+$5;
                });*/
                changes.forEach(function (r) {
                    src = src.replace(r.regexp, r.replacement);
                    //console.log(r.regexp,'=',r.replacement);
                });
                file.contents = new Buffer(src);
            }
            this.push(file);
        }, this);

        cb();
    });
}

module.exports = revCollector;
