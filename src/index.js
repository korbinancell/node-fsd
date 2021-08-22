const nearley = require("nearley");
const grammar = require('./fsd-parser.g.js');

const commentCleaner = /"(\\[\s\S]|[^"])*"|'(\\[\s\S]|[^'])*'|((?<!\/)\/\/(?!\/).*)/g

function parseFsd(fsdString) {
	// Remove all comments
	const cleanFsd = fsdString.replace(commentCleaner, (all, _s, _d, comment) => {
		if (comment) {
			return all.replace(comment, '');
		}
		return all;
	});

	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	parser.feed(cleanFsd);
	return parser.results[0];
}

module.exports = parseFsd;