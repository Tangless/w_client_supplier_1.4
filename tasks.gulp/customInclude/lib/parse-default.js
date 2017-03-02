
module.exports = function(content, opts) {
  var r = opts.prefix + opts.name + '[ ]*(\{[^{}]*\})';
  var regex = new RegExp(r);
  var match = regex.exec(content);
  if (match) {
      var def = JSON.parse(match[1]);
      opts.handler(def);

      content = content.replace(match[0], '');
      //console.log(content);
  }

  return content;
}
