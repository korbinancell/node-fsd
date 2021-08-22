@{%

const moo = require("moo");

const lexer = moo.compile({
	space: { match: /\s+/, lineBreaks: true },
	symbol: '{}:[](),;<>!'.split(''),
	summary: { match: /\/\/\/(?:[^\r\n]*)(?=(?:\r\n?|\n|$))/, value: d => d.substring(3).trim() },
	comment: /\/\/(?:[^\r\n]*)(?=(?:\r\n?|\n|$))/,
	int: { match: /[0-9]+/, value: d => Number.parseInt(d) },
	attrValue: /(?<=:(?:[ \t]))[a-zA-Z_.][0-9a-zA-Z_.-]*(?=[,)])/,
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

%}

@lexer lexer

main -> _ service _ remarks													{% d => ({ api: d[1], remarks: d[3] }) %}

# Service
service -> descriptors "service" _ %name _ serviceBody						{% d => ({ ...d[0], type: d[1], name: d[3], members: d[5], remarks: '' }) %}
serviceBody -> "{" (_ serviceMembers):* _ "}"								{% d => d[1].flat().filter(Boolean) %}
serviceMembers ->
	  method																{% id %}
	| dto																	{% id %}
	| enum																	{% id %}
	| errors																{% id %}

# Method
method -> descriptors "method" _ %name _ dataBody _ ":" _ dataBody			{% d => ({ ...d[0], type: d[1], name: d[3], requestBody: d[5], responseBody: d[9], remarks: '' }) %}

# Dto
dto -> descriptors "data" _ %name _ dataBody								{% d => ({ ...d[0], type: d[1], name: d[3], members: d[5], remarks: '' }) %}
dataBody -> "{" (_ dataMember):* _ "}"										{% d => d[1].flat().filter(Boolean) %}
dataMember -> descriptors %key _ ":" _ dataType "!":? _ ";"					{% d => ({ ...d[0], name: d[1], type: d[5], isRequired: d[6]?.value === '!' }) %}
dataType ->
	  dataType "[" "]"														{% extractDataType %}
	| %templateTypes "<" dataType ">"										{% extractDataType %}
	| %primativeDataType													{% extractDataType %}
	| %name																	{% extractDataType %}

# Errors
errors -> descriptors "errors" _ %name _ enumBody							{% d => ({ ...d[0], type: d[1], name: d[3], errors: d[5], remarks: '' }) %}

# Enum
enum -> descriptors "enum" _ %name _ enumBody								{% d => ({ ...d[0], type: d[1], name: d[3], types: d[5], remarks: '' }) %}
enumBody -> "{" (_ enumType _ ","):* (_ enumType):? _ "}"					{% d => [...d[1].flat().filter(x => !!x && x.type !== 'symbol'), d[2]?.[1]].filter(Boolean) %}
enumType -> descriptors %ident												{% d => ({ ...d[0], name: d[1] }) %}



# Descriptors
descriptors ->
	  null																	{% () => extractDescriptors(null) %}
	| (descriptor _):+														{% d => extractDescriptors(d) %}
descriptor ->
	  summary																{% id %}
	| attributes															{% id %}

summary -> %summary															{% id %}

attributes -> "[" _ attribute (_ "," _ attribute):* _ "]"					{% d => [d[2], ...d[3].flat().filter(x => !!x && x.type !== 'symbol')] %}
attribute -> %ident (_ params):?											{% d => ({ name: d[0], params: d[1] && d[1][1]}) %}
params -> "(" _ pair (_ "," _ pair):* _ ")"									{% d => [d[2], ...d[3].flat().filter(x => !!x && x.type !== 'symbol')] %}
pair -> %key _ ":" _ parameterValue											{% d => ({ key: d[0], value: d[4] }) %}
parameterValue ->
	  %string																{% id %}
	| %int																	{% id %}
	| %attrValue															{% id %}

# Remarks
remarks ->
	  null																	{% () => [] %}
	| (%remark _):* %lastRemark _											{% formatRemarks %}

# Shared
_ ->
	  null																	{% () => null %}
	| %space																{% () => null %}

@{%

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

%}