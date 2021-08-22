const nearley = require("nearley");
const beautify = require('json-beautify');
const grammar = require('./fsd-parser');
const fs = require('fs');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
const fsd = fs.readFileSync('test.fsd', 'utf8');

// Clean comments
const commentCleaner = /"(\\[\s\S]|[^"])*"|'(\\[\s\S]|[^'])*'|((?<!\/)\/\/(?!\/).*)/g
cleanFsd = fsd.replace(commentCleaner, (all, _s, _d, comment) => {
    if (comment) {
        return all.replace(comment, '');
    }
    return all;
})
// console.log(cleanFsd)

parser.feed(cleanFsd);
const value = parser.results;

console.log(beautify({  output: value, resultCount: value.length }, null, 2, 100));