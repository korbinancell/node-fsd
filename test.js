const nearley = require("nearley");
const beautify = require('json-beautify');
const grammar = require('./fsd-parser');
const fs = require('fs');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const fsd = fs.readFileSync('test.fsd', 'utf8');
parser.feed(fsd);
const value = parser.results[0];

console.log(beautify({output: value}, null, 2, 100));