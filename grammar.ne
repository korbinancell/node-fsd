@{%
const moo = require("moo");

const lexer = moo.compile({
	space: {match: /\s+/, lineBreaks: true},
	summary: /\/\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	comment: /\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	memberRemark: /#[ \t]+(?:[a-zA-Z_][0-9a-zA-Z_]*)(?:\s|.)*?(?<!#)(?=#\s)/,
	lastRemark: /#[ \t]+(?:[a-zA-Z_][0-9a-zA-Z_]*)(?:\s|.)*/,
	valueParams: /(?<=:\s)"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
	value: /(?<=:\s).[^,)\s;{}!]+/,
	name: /[a-zA-Z_][0-9a-zA-Z_]*/,
	keyword: ['method', 'data', 'errors', 'service', "{}"],
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
	'!': '!',
});
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

@builtin "number.ne"
@builtin "whitespace.ne"
@builtin "string.ne"

main -> nl service

# Remark
remarks -> (nl %memberRemark):* (nl %lastRemark):?							{% extractRemarks %}

# Service
service -> descriptors "service" _ %name nl serviceBody						{% extractService %}
serviceBody -> 
	  "{}"																	{% extractServiceBody %}
	| "{" (nl serviceMembers):* nl "}"										{% extractServiceBody %}
serviceMembers ->
	  method
	| dto
	| enum
	| errors

# Errors
errors -> descriptors "errors" _ %name nl enumBody							{% extractErrors %}

# Enum
enum -> descriptors "enum" _ %name nl enumBody								{% extractEnum %}
enumBody ->
	  "{}"																	{% extractEnumBody %}
	| "{" (nl descriptors %name _ ","):* (nl descriptors %name):? nl "}"	{% extractEnumBody %}

# DTO
dto -> descriptors "data" _ %name nl methodBody								{% extractDto %}

# Method
method -> descriptors "method" _ %name nl methodBody nl ":" nl methodBody	{% extractMethod %}
methodBody ->
	  "{}"																	{% extractMethodBody %}
	| "{" (nl descriptors attrPair):* nl "}"								{% extractMethodBody %}

# DTO & Method pair
attrPair -> %name _ ":" _ attrValue _ "!":? _ ";"							{% d => ({ attribute: { name: d[0].value, value: d[4], isRequired: !!d[6] }}) %}
attrValue ->
	  %value																{% d => ({ type: d[0].value }) %}
	| %value _ "<" _ attrValue _ ">"										{% d => ({ type: d[0].value, value: d[4] }) %}
	| attrValue _ "[" "]"													{% d => ({ type: d[0], isArray: true }) %}

# FSD Desc
descriptors -> (descriptor nl):*											{% extractDescriptors %}
descriptor -> summary | attributes

# Summary
summary -> %summary															{% extractSummary %}

# Attributes
attributes -> "[" _ attribute (_ "," _ attribute):* _ "]"					{% extractAttributes %}
attribute -> %name (_ params):?												{% extractAttribute %}

params -> "(" _ pair (_ "," _ pair):* _ ")"									{% extractParams %}
pair -> %name _ ":" _ value													{% extractPair %}
value -> %valueParams | %value

# Shared
nl ->
	  null
	| %space:? comment:? %space:?											{% d => null %}
comment -> _ %comment _														{% d => null %}

@{%

function finalCleanup(d) {
	// console.log(d)
	return d;
}

function getRemarkTarget(remark) {
	const remarkTarget = remark.trim().split(/\s/)[1];
	const remarkBody = remark.trim().substring(1).trim().substring(remarkTarget.length).trim();
	return { remarkTarget, remarkBody };
}

function extractRemarks(d) {
	const remarks = d.flat().flat().flat().filter(Boolean);
	return remarks.map(x => getRemarkTarget(x.text));
}

function extractServiceBody(d) {
	const members = d.flat(10).filter(x => !!x && x.type !== '{' && x.type !== '}' && x.text !== '{}');

	return { members }
}

function extractService(d) {
	const flatInput = d.flat(10).filter(Boolean);
	const descriptors = flatInput[0]?.descriptors;

	return {
		...descriptors,
		remarks: '',
		name: flatInput[2].value,
		members: flatInput[3].members,
	};
}

function extractEnumBody(d) {
	const filteredInput = d.filter(x => !!x && x.type !== '{' && x.type !== '}' && x.text !== '{}');
	let flatInput;
	if (filteredInput.length === 2) {
		flatInput = filteredInput[0];
		flatInput.push(filteredInput[1]);
	} else {
		flatInput = filteredInput.flat();
	}

	if (!flatInput.length) {
		return { types: []};
	}

	return { types: flatInput.map(x => x.filter(Boolean)).reduce((acc, attr) => {
		const descriptors = attr[0].descriptors;
		const name = attr[1].value;
		acc.push({ ...descriptors, name });
		return acc;
	}, []) }
}

function extractEnum(d) {
	const flatInput = d.flat(10).filter(Boolean);
	const descriptors = flatInput[0]?.descriptors;

	return {
		...descriptors,
		remarks: '',
		type: 'enum',
		name: flatInput[2].value,
		types: flatInput[3].types,
	}
}

function extractErrors(d) {
	return { ...extractEnum(d), type: 'errors' };
}

function extractDescriptors(d) {
	const flatInput = d.flat(10).filter(Boolean);
	const attributes = flatInput.map(x => x.attributes).filter(Boolean).flat();
	const summaryLines = flatInput.map(x => x.summary).filter(Boolean).flat();

	return { descriptors: { summaryLines, attributes } };
}

function extractDto(d) {
	const flatInput = d.flat(10).filter(Boolean);
	const descriptors = flatInput[0]?.descriptors;

	return {
		...descriptors,
		remarks: '',
		type: 'dto',
		name: flatInput[2].value,
		members: flatInput[3].attributes,
	}
}

function extractMethodBody(d) {
	const flatInput = d.flat().filter(x => !!x && x.type !== '{' && x.type !== '}' && x.text !== '{}');
	if (!flatInput.length) {
		return { attributes: []};
	}

	return { attributes: flatInput.map(x => x.filter(Boolean)).reduce((acc, attr) => {
		const descriptors = attr[0].descriptors;
		const attribute = attr[1].attribute;
		acc.push({...descriptors, ...attribute});
		return acc;
	}, []) }
}

function extractMethod(d) {
	const flatInput = d.flat(10).filter(Boolean);
	const descriptors = flatInput[0]?.descriptors;

	return {
		...descriptors,
		remarks: '',
		type: 'method',
		name: flatInput[2].value,
		requestAttrs: flatInput[3]?.attributes || [],
		responseAttrs: flatInput[5]?.attributes || []
	}
}

function extractSummary(d) {
	return { summary: d.flat(10).filter(Boolean)[0].value.trim().substring(3).trim() };
}

function extractPair(d) {
	const flatInput = d.flat(10).filter(Boolean);

	const key = flatInput[0].value;
	let value = flatInput[2].value.replace(/['"]+/g, '');
	if (value && !isNaN(value)) {
		value = Number.parseInt(value);
	}
	return { pair: [key, value] }
}

function extractParams(d) {
	const flatInput = d.flat(10).filter(Boolean);
	const params = Object.fromEntries(flatInput.map(x => x.pair).filter(Boolean));

	return { params };
}

function extractAttribute(d) {
	const flatInput = d.flat(10).filter(Boolean);
	return { attribute: { name: flatInput[0].value, ...flatInput[1] } }
}

function extractAttributes(d) {
	const flatInput = d.flat(10).filter(Boolean);
	const attributes = flatInput.map(x => x.attribute).filter(Boolean);

	return { attributes };
}

%}