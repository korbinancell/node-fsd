const nearley = require('nearley');
const grammar = require('./fsd-parser.g.js');

function parseFsd(fsdString) {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	parser.feed(fsdString);
	const { api, remarks } = parser.results[0];

	if (parser.results.length > 1) {
		throw new Error(`Grammar regression found. Found ${parser.results.length} results.`);
	}

	// TODO warn about remainingRemarks
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

	// TODO check for duplicate members
	// TODO check for unknown field types

	return api;
}

module.exports = parseFsd;
