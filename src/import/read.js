var util = require('../util');
var tree = require('../util/tree');
var formats = require('./formats');

var parsers = {
  "number": util.number,
  "boolean": util.boolean,
  "date": util.date
};

function read(data, format) {
  var type = (format && format.type) || "json";
  data = formats[type](data, format);
  if (format && format.parse) parseValues(data, format.parse);
  return data;
}

function parseValues(data, types) {
  var cols = util.keys(types),
      parse = cols.map(function(col) { return parsers[types[col]]; });
  parseArray(tree ? [data] : data, cols, parse, tree.isTree(data));
}

function parseArray(data, cols, parse, tree) {
  var d, i, j, len, clen;
  for (i=0, len=data.length; i<len; ++i) {
    d = data[i];
    for (j=0, clen=cols.length; j<clen; ++j) {
      d[cols[j]] = parse[j](d[cols[j]]);
    }
    if (tree && d.values) {
      parseArray(d.values, cols, parse, true);
    }
  }
}

read.formats = formats;
read.parse = parseValues;

module.exports = read;