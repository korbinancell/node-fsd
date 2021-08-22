// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require("moo");

const lexer = moo.compile({
	space: { match: /\s+/, lineBreaks: true },
	symbol: '{}:[](),;<>!'.split(''),
	summary: { match: /\/\/\/(?:[^\r\n]*)(?=(?:\r\n?|\n|$))/, value: d => d.substring(3).trim() },
	comment: /\/\/(?:[^\r\n]*)(?=(?:\r\n?|\n|$))/,
	int: { match: /[0-9]+/, value: d => Number.parseInt(d) },
	attrValue: /(?<=:(?:[ \t]))[a-zA-Z_.][0-9a-zA-Z_.]*(?=[,)])/,
	string: { match: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/, value: d => d.replace(/['"]+/g, '') },
	remark: /#[ \t]+(?:[a-zA-Z_][0-9a-zA-Z_]*)(?:\s|.)*?(?<!#)(?=#\s)/,
	lastRemark: /#[ \t]+(?:[a-zA-Z_][0-9a-zA-Z_]*)(?:\s|.)*/,
	key: /[a-zA-Z_][0-9a-zA-Z_]+(?=(?:[ \t]?):)/,
	ident: /[a-zA-Z_][0-9a-zA-Z_]+(?=(?:[ \t]?)(?:[(\],]))/,
	name: {
		match: /[a-zA-Z_][0-9a-zA-Z_]*/,
		type: moo.keywords({
			service: 'service',
			serviceMembers: ['method', 'data', 'enum', 'errors'],
			primativeDataType: ['string', 'boolean', 'double', 'int32', 'int64', 'decimal', 'bytes', 'object', 'error'],
			templateTypes: ['map', 'result']
		})
	},
});




function formatRemarks(d) {
	const remarks = [...d[0].flat().filter(Boolean), d[1]]
		.filter(Boolean)
		.map(x => {
			const remark = { ...x };
			const hold = remark.value.match(/#[ \t]+(?:[a-zA-Z_][0-9a-zA-Z_]*)/g)?.[0] ?? '';
			remark.type = 'remark';
			remark.for = hold.substring(1).trim();
			remark.value = x.value.substring(hold.length).trim();
			return remark;
		})
	return remarks;
}

function extractDescriptors(d) {
	const summaryLines = []
	const attributes = []
	if (!d?.length) return { summaryLines, attributes };
	for (const desc of d[0]) {
		if (Array.isArray(desc[0])) attributes.push(...desc[0])
		else summaryLines.push(desc[0])
	}

	return { summaryLines, attributes };
}

function extractDataType(d) {
	if (d.length === 1) return d[0]
	if (d[0].type === 'templateTypes') return { type: d[0], kind: d[2] };
	return { type: 'array', kind: d[0] };
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "service", "_", "remarks"], "postprocess": d => ({ api: d[1], remarks: d[3] })},
    {"name": "service", "symbols": ["descriptors", {"literal":"service"}, "_", (lexer.has("name") ? {type: "name"} : name), "_", "serviceBody"], "postprocess": d => ({ ...d[0], type: d[1], name: d[3], members: d[5], remarks: '' })},
    {"name": "serviceBody$ebnf$1", "symbols": []},
    {"name": "serviceBody$ebnf$1$subexpression$1", "symbols": ["_", "serviceMembers"]},
    {"name": "serviceBody$ebnf$1", "symbols": ["serviceBody$ebnf$1", "serviceBody$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "serviceBody", "symbols": [{"literal":"{"}, "serviceBody$ebnf$1", "_", {"literal":"}"}], "postprocess": d => d[1].flat().filter(Boolean)},
    {"name": "serviceMembers", "symbols": ["method"], "postprocess": id},
    {"name": "serviceMembers", "symbols": ["dto"], "postprocess": id},
    {"name": "serviceMembers", "symbols": ["enum"], "postprocess": id},
    {"name": "serviceMembers", "symbols": ["errors"], "postprocess": id},
    {"name": "method", "symbols": ["descriptors", {"literal":"method"}, "_", (lexer.has("name") ? {type: "name"} : name), "_", "dataBody", "_", {"literal":":"}, "_", "dataBody"], "postprocess": d => ({ ...d[0], type: d[1], name: d[3], requestBody: d[5], responseBody: d[9], remarks: '' })},
    {"name": "dto", "symbols": ["descriptors", {"literal":"data"}, "_", (lexer.has("name") ? {type: "name"} : name), "_", "dataBody"], "postprocess": d => ({ ...d[0], type: d[1], name: d[3], members: d[5], remarks: '' })},
    {"name": "dataBody$ebnf$1", "symbols": []},
    {"name": "dataBody$ebnf$1$subexpression$1", "symbols": ["_", "dataMember"]},
    {"name": "dataBody$ebnf$1", "symbols": ["dataBody$ebnf$1", "dataBody$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dataBody", "symbols": [{"literal":"{"}, "dataBody$ebnf$1", "_", {"literal":"}"}], "postprocess": d => d[1].flat().filter(Boolean)},
    {"name": "dataMember$ebnf$1", "symbols": [{"literal":"!"}], "postprocess": id},
    {"name": "dataMember$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dataMember", "symbols": ["descriptors", (lexer.has("key") ? {type: "key"} : key), "_", {"literal":":"}, "_", "dataType", "dataMember$ebnf$1", "_", {"literal":";"}], "postprocess": d => ({ ...d[0], name: d[1], type: d[5], isRequired: d[6]?.value === '!' })},
    {"name": "dataType", "symbols": ["dataType", {"literal":"["}, {"literal":"]"}], "postprocess": extractDataType},
    {"name": "dataType", "symbols": [(lexer.has("templateTypes") ? {type: "templateTypes"} : templateTypes), {"literal":"<"}, "dataType", {"literal":">"}], "postprocess": extractDataType},
    {"name": "dataType", "symbols": [(lexer.has("primativeDataType") ? {type: "primativeDataType"} : primativeDataType)], "postprocess": extractDataType},
    {"name": "dataType", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": extractDataType},
    {"name": "errors", "symbols": ["descriptors", {"literal":"errors"}, "_", (lexer.has("name") ? {type: "name"} : name), "_", "enumBody"], "postprocess": d => ({ ...d[0], type: d[1], name: d[3], errors: d[5], remarks: '' })},
    {"name": "enum", "symbols": ["descriptors", {"literal":"enum"}, "_", (lexer.has("name") ? {type: "name"} : name), "_", "enumBody"], "postprocess": d => ({ ...d[0], type: d[1], name: d[3], types: d[5], remarks: '' })},
    {"name": "enumBody$ebnf$1", "symbols": []},
    {"name": "enumBody$ebnf$1$subexpression$1", "symbols": ["_", "enumType", "_", {"literal":","}]},
    {"name": "enumBody$ebnf$1", "symbols": ["enumBody$ebnf$1", "enumBody$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enumBody$ebnf$2$subexpression$1", "symbols": ["_", "enumType"]},
    {"name": "enumBody$ebnf$2", "symbols": ["enumBody$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "enumBody$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "enumBody", "symbols": [{"literal":"{"}, "enumBody$ebnf$1", "enumBody$ebnf$2", "_", {"literal":"}"}], "postprocess": d => [...d[1].flat().filter(x => !!x && x.type !== 'symbol'), d[2]?.[1]].filter(Boolean)},
    {"name": "enumType", "symbols": ["descriptors", (lexer.has("ident") ? {type: "ident"} : ident)], "postprocess": d => ({ ...d[0], name: d[1] })},
    {"name": "descriptors", "symbols": [], "postprocess": () => extractDescriptors(null)},
    {"name": "descriptors$ebnf$1$subexpression$1", "symbols": ["descriptor", "_"]},
    {"name": "descriptors$ebnf$1", "symbols": ["descriptors$ebnf$1$subexpression$1"]},
    {"name": "descriptors$ebnf$1$subexpression$2", "symbols": ["descriptor", "_"]},
    {"name": "descriptors$ebnf$1", "symbols": ["descriptors$ebnf$1", "descriptors$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "descriptors", "symbols": ["descriptors$ebnf$1"], "postprocess": d => extractDescriptors(d)},
    {"name": "descriptor", "symbols": ["summary"], "postprocess": id},
    {"name": "descriptor", "symbols": ["attributes"], "postprocess": id},
    {"name": "summary", "symbols": [(lexer.has("summary") ? {type: "summary"} : summary)], "postprocess": id},
    {"name": "attributes$ebnf$1", "symbols": []},
    {"name": "attributes$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "attribute"]},
    {"name": "attributes$ebnf$1", "symbols": ["attributes$ebnf$1", "attributes$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attributes", "symbols": [{"literal":"["}, "_", "attribute", "attributes$ebnf$1", "_", {"literal":"]"}], "postprocess": d => [d[2], ...d[3].flat().filter(x => !!x && x.type !== 'symbol')]},
    {"name": "attribute$ebnf$1$subexpression$1", "symbols": ["_", "params"]},
    {"name": "attribute$ebnf$1", "symbols": ["attribute$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "attribute$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attribute", "symbols": [(lexer.has("ident") ? {type: "ident"} : ident), "attribute$ebnf$1"], "postprocess": d => ({ name: d[0], params: d[1] && d[1][1]})},
    {"name": "params$ebnf$1", "symbols": []},
    {"name": "params$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "params$ebnf$1", "symbols": ["params$ebnf$1", "params$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "params", "symbols": [{"literal":"("}, "_", "pair", "params$ebnf$1", "_", {"literal":")"}], "postprocess": d => [d[2], ...d[3].flat().filter(x => !!x && x.type !== 'symbol')]},
    {"name": "pair", "symbols": [(lexer.has("key") ? {type: "key"} : key), "_", {"literal":":"}, "_", "parameterValue"], "postprocess": d => ({ key: d[0], value: d[4] })},
    {"name": "parameterValue", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": id},
    {"name": "parameterValue", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": id},
    {"name": "parameterValue", "symbols": [(lexer.has("attrValue") ? {type: "attrValue"} : attrValue)], "postprocess": id},
    {"name": "remarks", "symbols": [], "postprocess": () => []},
    {"name": "remarks$ebnf$1", "symbols": []},
    {"name": "remarks$ebnf$1$subexpression$1", "symbols": [(lexer.has("remark") ? {type: "remark"} : remark), "_"]},
    {"name": "remarks$ebnf$1", "symbols": ["remarks$ebnf$1", "remarks$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "remarks", "symbols": ["remarks$ebnf$1", (lexer.has("lastRemark") ? {type: "lastRemark"} : lastRemark), "_"], "postprocess": formatRemarks},
    {"name": "_", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
