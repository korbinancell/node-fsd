const fs = require('fs');
const beautify = require('json-beautify');
const parseFsd = require('./src');

const testFsd = fs.readFileSync('test.fsd', 'utf8');
const value = parseFsd(testFsd);

console.log(beautify({ output: value, resultCount: value.length }, null, 2, 100));