@{%
const moo = require("moo");

const lexer = moo.compile({
	space: {match: /\s+/, lineBreaks: true},
	summary: /\/\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	comment: /\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	name: /[a-zA-Z_][0-9a-zA-Z_]*/,
	value: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"|(?:[0-9a-zA-Z.+_-]+)/,
	keyword: ['method'],
	'[': '[',
	']': ']',
	'(': '(',
	')': ')',
	'{': '{',
	'}': '}',
	'<': '<',
	'>': '>',
	',': ',',
	'"': '"',
	':': ':',
	';': ';',
	'!': '!'
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

@builtin "number.ne"
@builtin "whitespace.ne"
@builtin "string.ne"

main -> nl "{" (nl method):* nl "}"

# Method
method ->
	(descriptors nl):* "method" _ %name nl "{" ((nl descriptors):* nl methodAttr):* nl "}" nl ":" nl "{" ((nl descriptors):* nl methodAttr):* nl "}" {% extractMethod %}
methodAttr -> %name _ ":" _ attrValue _ "!":? _ ";"							{% d => ({ name: d[0].value, value: d[4], isRequired: !!d[6] }) %}
attrValue ->
	  %name																	{% d => ({ type: d[0].value }) %}
	| %name _ "<" _ attrValue _ ">"											{% d => ({ type: d[0].value, value: d[4] }) %}
	| attrValue _ "[" "]"													{% d => ({ type: d[0], isArray: true }) %}

# FSD Desc
descriptors ->
	  summary																{% d => d %}
	| attributes															{% d => d %}

# Summary
summary -> %summary															{% d => ({ summary: [d[0].value.substring(3).trim()] }) %}

# Attributes
attributes -> "[" _ attribute (_ "," _ attribute):* _ "]"					{% extractAttributes %}
attribute -> %name (_ params):?												{% d => ({ name: d[0].value, params: d[1] ? d[1][1] : null }) %}

params -> "(" _ pair (_ "," _ pair):* _ ")"									{% extractParams %}
pair -> %name _ ":" _ value													{% d => [d[0], d[4]] %}
value ->
	  %name																	{% id %}
	| %value																{% id %}

# Shared
nl ->
	  null
	| %space:? comment:? %space:?											{% d => null %}
comment -> _ %comment _														{% d => null %}

@{%

function extractDescriptors(d) {
	const clean = d.flat().filter(Boolean).flat();
	const attributes = clean.map(x => x.attributes).filter(Boolean).flat();
	const summaryLines = clean.map(x => x.summary).filter(Boolean).flat();
	return { summaryLines, attributes };
}

function extractMethod(d) {
	return {
		...extractDescriptors(d[0]),
		type: 'method',
		name: d[3].value,
		requestAttrs: d[6].map(x => ({ ...extractDescriptors(x[0]), ...x[2] })).flat(),
		responseAttrs: d[13].map(x => ({ ...extractDescriptors(x[0]), ...x[2] })).flat(),
	}
}

function gatherAttributes(d) {
	return d[2][0] ? { attributes: d[2].flat().filter(Boolean).flat() } : null
}

function extractPair([key, value], output) {
	if (key) {
		let cleanValue = value.value.replace(/['"]+/g, '');
		if (cleanValue && !isNaN(cleanValue)) {
			cleanValue = Number.parseInt(cleanValue);
		}
		output[key] = cleanValue
	}
}

function extractParams(d) {
	const output = {};

	extractPair(d[2], output);

	for (let i in d[3]) {
		extractPair(d[3][i][3], output);
	}

	return output;
}

function extractAttributes(d) {
	let output = [d[2]];

	for (let i in d[3]) {
		output.push(d[3][i][3]);
	}

	return { attributes: output };
}

%}