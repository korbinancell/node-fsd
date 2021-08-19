@{%
const moo = require("moo");

const lexer = moo.compile({
	space: {match: /\s+/, lineBreaks: true},
	summary: /\/\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	comment: /\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	name: /[a-zA-Z_][0-9a-zA-Z_]*/,
	value: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"|(?:[0-9a-zA-Z.+_-]+)/,
	'[': '[',
	']': ']',
	'(': '(',
	')': ')',
	'{': '{',
	'}': '}',
	',': ',',
	'"': '"',
	':': ':'
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

@builtin "number.ne"
@builtin "whitespace.ne"
@builtin "string.ne"

main -> nl "{" (nl attributes):* nl "}" nl									{% function(d) { return d[2][0] ? { attributes: d[2].flat().filter(Boolean).flat() } : null } %}

# Attributes
attributes -> "[" _ attribute (_ "," _ attribute):* _ "]"					{% extractAttributes %}
attribute -> %name (_ params):?												{% function(d) { return { name: d[0].value, params: d[1] ? d[1][1] : null } } %}

params -> "(" _ pair (_ "," _ pair):* _ ")"									{% extractParams %}
pair -> %name _ ":" _ value													{% function(d) { return [d[0], d[4]]; } %}
value ->
	  %name																	{% id %}
	| %value																{% id %}

# Shared
nl ->
	  null
	| %space:? comment:? %space:?											{% function(d) { return null; } %}

# Comments / Summary
summary -> _ %summary _
comment -> _ %comment _														{% function(d) { return null; } %}

@{%

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

	return output;
}

%}