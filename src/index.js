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
	const { api, remarks } = parser.results[0];

	// Sew up remarks and members
	const remainingRemarks = new Set(remarks);
	const serviceName = api.name.value;
	const memberNames = api.members.map(x => [x.name.value, x]);

	const serviceRemark = remarks.find(x => x.for === serviceName);
	if (serviceRemark) {
		remainingRemarks.delete(serviceRemark);
		api.remarks = serviceRemark.value;
	}

	for (const [name, member] of memberNames) {
		const remark = remarks.find(x => x.for === name);
		if (remark) {
			member.remarks = remark.value;
			remainingRemarks.delete(remark);
		}
	}

	// TODO warn about remainingRemarks

	return api;
}

module.exports = parseFsd;