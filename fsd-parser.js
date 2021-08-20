// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");
// ^(\s|.)+?(?<!#)#(?=\s)
// (?:\\.[^"\\%]*)*%
const lexer = moo.compile({
	space: {match: /\s+/, lineBreaks: true},
	summary: /\/\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	comment: /\/\/(?:[^\r\n]*)(?:\r\n?|\n|$)/,
	memberRemark: /#[ \t]+(?:[a-zA-Z_][0-9a-zA-Z_]*)(?:\s|.)*?(?<!#)(?=#\s)/,
	lastRemark: /#[ \t]+(?:[a-zA-Z_][0-9a-zA-Z_]*)(?:\s|.)*/,
	name: /[a-zA-Z_][0-9a-zA-Z_]*/,
	value: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"|(?:[0-9a-zA-Z.+_-]+)/,
	keyword: ['method', 'data', 'errors', 'service'],
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



function getRemarkTarget(remark) {
	const remarkTarget = remark.trim().split(/\s/)[1];
	const remarkBody = remark.trim().substring(1).trim().substring(remarkTarget.length).trim();
	return { remarkTarget, remarkBody };
}

function extractRemarks(d) {
	console.log(d.flat().flat().flat().filter(Boolean))
	const remarks = d.flat().flat().flat().filter(Boolean);
	return remarks.map(x => getRemarkTarget(x.text));
}

function extractService(d) {
	return {
		...extractDescriptors(d[0]),
		remarks: '',
		name: d[3].value,
		members: d[6].flat().filter(Boolean).flat(),
	};
}

function extractEnumType(d) {
	return {
		...extractDescriptors(d[0]),
		name: d[2].value
	}
}

function extractEnum(d) {
	const types = d[6].map(x => x[0])
	if (d[7] && d[7].length) {
		types.push(d[7][0]);
	}

	return {
		...extractDescriptors(d[0]),
		remarks: '',
		type: 'enum',
		name: d[3].value,
		types,
	}
}

function extractErrors(d) {
	return { ...extractEnum(d), type: 'errors' };
}

function extractDescriptors(d) {
	const clean = d.flat().filter(Boolean).flat();
	const attributes = clean.map(x => x.attributes).filter(Boolean).flat();
	const summaryLines = clean.map(x => x.summary).filter(Boolean).flat();
	return { summaryLines, attributes };
}

function extractDto(d) {
	return {
		...extractDescriptors(d[0]),
		remarks: '',
		type: 'dto',
		name: d[3].value,
		members: d[6].map(x => ({ ...extractDescriptors(x[0]), ...x[2] })).flat(),
	}
}

function extractMethod(d) {
	return {
		...extractDescriptors(d[0]),
		remarks: '',
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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "main", "symbols": [{"literal":"}"}, "remarks"], "postprocess": d => d},
    {"name": "remarks$ebnf$1", "symbols": []},
    {"name": "remarks$ebnf$1$subexpression$1", "symbols": ["nl", (lexer.has("memberRemark") ? {type: "memberRemark"} : memberRemark)]},
    {"name": "remarks$ebnf$1", "symbols": ["remarks$ebnf$1", "remarks$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "remarks$ebnf$2$subexpression$1", "symbols": ["nl", (lexer.has("lastRemark") ? {type: "lastRemark"} : lastRemark)]},
    {"name": "remarks$ebnf$2", "symbols": ["remarks$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "remarks$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "remarks", "symbols": ["remarks$ebnf$1", "remarks$ebnf$2"], "postprocess": extractRemarks},
    {"name": "service$ebnf$1", "symbols": []},
    {"name": "service$ebnf$1$subexpression$1", "symbols": ["descriptors", "nl"]},
    {"name": "service$ebnf$1", "symbols": ["service$ebnf$1", "service$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "service$ebnf$2", "symbols": []},
    {"name": "service$ebnf$2$subexpression$1", "symbols": ["nl", "serviceMembers"]},
    {"name": "service$ebnf$2", "symbols": ["service$ebnf$2", "service$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "service", "symbols": ["service$ebnf$1", {"literal":"service"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", {"literal":"{"}, "service$ebnf$2", "nl", {"literal":"}"}], "postprocess": extractService},
    {"name": "serviceMembers", "symbols": ["method"]},
    {"name": "serviceMembers", "symbols": ["dto"]},
    {"name": "serviceMembers", "symbols": ["enum"]},
    {"name": "serviceMembers", "symbols": ["errors"]},
    {"name": "errors$ebnf$1", "symbols": []},
    {"name": "errors$ebnf$1$subexpression$1", "symbols": ["descriptors", "nl"]},
    {"name": "errors$ebnf$1", "symbols": ["errors$ebnf$1", "errors$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "errors$ebnf$2", "symbols": []},
    {"name": "errors$ebnf$2$subexpression$1", "symbols": ["enumMember", "_", {"literal":","}]},
    {"name": "errors$ebnf$2", "symbols": ["errors$ebnf$2", "errors$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "errors$ebnf$3$subexpression$1", "symbols": ["enumMember"]},
    {"name": "errors$ebnf$3", "symbols": ["errors$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "errors$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "errors", "symbols": ["errors$ebnf$1", {"literal":"errors"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", {"literal":"{"}, "errors$ebnf$2", "errors$ebnf$3", "nl", {"literal":"}"}], "postprocess": extractErrors},
    {"name": "enum$ebnf$1", "symbols": []},
    {"name": "enum$ebnf$1$subexpression$1", "symbols": ["descriptors", "nl"]},
    {"name": "enum$ebnf$1", "symbols": ["enum$ebnf$1", "enum$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enum$ebnf$2", "symbols": []},
    {"name": "enum$ebnf$2$subexpression$1", "symbols": ["enumMember", "_", {"literal":","}]},
    {"name": "enum$ebnf$2", "symbols": ["enum$ebnf$2", "enum$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enum$ebnf$3$subexpression$1", "symbols": ["enumMember"]},
    {"name": "enum$ebnf$3", "symbols": ["enum$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "enum$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "enum", "symbols": ["enum$ebnf$1", {"literal":"enum"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", {"literal":"{"}, "enum$ebnf$2", "enum$ebnf$3", "nl", {"literal":"}"}], "postprocess": extractEnum},
    {"name": "enumMember$ebnf$1", "symbols": []},
    {"name": "enumMember$ebnf$1$subexpression$1", "symbols": ["nl", "descriptors"]},
    {"name": "enumMember$ebnf$1", "symbols": ["enumMember$ebnf$1", "enumMember$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enumMember", "symbols": ["enumMember$ebnf$1", "nl", (lexer.has("name") ? {type: "name"} : name)], "postprocess": extractEnumType},
    {"name": "dto$ebnf$1", "symbols": []},
    {"name": "dto$ebnf$1$subexpression$1", "symbols": ["descriptors", "nl"]},
    {"name": "dto$ebnf$1", "symbols": ["dto$ebnf$1", "dto$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dto$ebnf$2", "symbols": []},
    {"name": "dto$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "dto$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": ["nl", "descriptors"]},
    {"name": "dto$ebnf$2$subexpression$1$ebnf$1", "symbols": ["dto$ebnf$2$subexpression$1$ebnf$1", "dto$ebnf$2$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dto$ebnf$2$subexpression$1", "symbols": ["dto$ebnf$2$subexpression$1$ebnf$1", "nl", "attrPair"]},
    {"name": "dto$ebnf$2", "symbols": ["dto$ebnf$2", "dto$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dto", "symbols": ["dto$ebnf$1", {"literal":"data"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", {"literal":"{"}, "dto$ebnf$2", "nl", {"literal":"}"}], "postprocess": extractDto},
    {"name": "method$ebnf$1", "symbols": []},
    {"name": "method$ebnf$1$subexpression$1", "symbols": ["descriptors", "nl"]},
    {"name": "method$ebnf$1", "symbols": ["method$ebnf$1", "method$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "method$ebnf$2", "symbols": []},
    {"name": "method$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "method$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": ["nl", "descriptors"]},
    {"name": "method$ebnf$2$subexpression$1$ebnf$1", "symbols": ["method$ebnf$2$subexpression$1$ebnf$1", "method$ebnf$2$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "method$ebnf$2$subexpression$1", "symbols": ["method$ebnf$2$subexpression$1$ebnf$1", "nl", "attrPair"]},
    {"name": "method$ebnf$2", "symbols": ["method$ebnf$2", "method$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "method$ebnf$3", "symbols": []},
    {"name": "method$ebnf$3$subexpression$1$ebnf$1", "symbols": []},
    {"name": "method$ebnf$3$subexpression$1$ebnf$1$subexpression$1", "symbols": ["nl", "descriptors"]},
    {"name": "method$ebnf$3$subexpression$1$ebnf$1", "symbols": ["method$ebnf$3$subexpression$1$ebnf$1", "method$ebnf$3$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "method$ebnf$3$subexpression$1", "symbols": ["method$ebnf$3$subexpression$1$ebnf$1", "nl", "attrPair"]},
    {"name": "method$ebnf$3", "symbols": ["method$ebnf$3", "method$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "method", "symbols": ["method$ebnf$1", {"literal":"method"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", {"literal":"{"}, "method$ebnf$2", "nl", {"literal":"}"}, "nl", {"literal":":"}, "nl", {"literal":"{"}, "method$ebnf$3", "nl", {"literal":"}"}], "postprocess": extractMethod},
    {"name": "attrPair$ebnf$1", "symbols": [{"literal":"!"}], "postprocess": id},
    {"name": "attrPair$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attrPair", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_", {"literal":":"}, "_", "attrValue", "_", "attrPair$ebnf$1", "_", {"literal":";"}], "postprocess": d => ({ name: d[0].value, value: d[4], isRequired: !!d[6] })},
    {"name": "attrValue", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": d => ({ type: d[0].value })},
    {"name": "attrValue", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_", {"literal":"<"}, "_", "attrValue", "_", {"literal":">"}], "postprocess": d => ({ type: d[0].value, value: d[4] })},
    {"name": "attrValue", "symbols": ["attrValue", "_", {"literal":"["}, {"literal":"]"}], "postprocess": d => ({ type: d[0], isArray: true })},
    {"name": "descriptors", "symbols": ["summary"], "postprocess": d => d},
    {"name": "descriptors", "symbols": ["attributes"], "postprocess": d => d},
    {"name": "summary", "symbols": [(lexer.has("summary") ? {type: "summary"} : summary)], "postprocess": d => ({ summary: [d[0].value.substring(3).trim()] })},
    {"name": "attributes$ebnf$1", "symbols": []},
    {"name": "attributes$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "attribute"]},
    {"name": "attributes$ebnf$1", "symbols": ["attributes$ebnf$1", "attributes$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attributes", "symbols": [{"literal":"["}, "_", "attribute", "attributes$ebnf$1", "_", {"literal":"]"}], "postprocess": extractAttributes},
    {"name": "attribute$ebnf$1$subexpression$1", "symbols": ["_", "params"]},
    {"name": "attribute$ebnf$1", "symbols": ["attribute$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "attribute$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attribute", "symbols": [(lexer.has("name") ? {type: "name"} : name), "attribute$ebnf$1"], "postprocess": d => ({ name: d[0].value, params: d[1] ? d[1][1] : null })},
    {"name": "params$ebnf$1", "symbols": []},
    {"name": "params$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "params$ebnf$1", "symbols": ["params$ebnf$1", "params$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "params", "symbols": [{"literal":"("}, "_", "pair", "params$ebnf$1", "_", {"literal":")"}], "postprocess": extractParams},
    {"name": "pair", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_", {"literal":":"}, "_", "value"], "postprocess": d => [d[0], d[4]]},
    {"name": "value", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": id},
    {"name": "value", "symbols": [(lexer.has("value") ? {type: "value"} : value)], "postprocess": id},
    {"name": "nl", "symbols": []},
    {"name": "nl$ebnf$1", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id},
    {"name": "nl$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nl$ebnf$2", "symbols": ["comment"], "postprocess": id},
    {"name": "nl$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nl$ebnf$3", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id},
    {"name": "nl$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nl", "symbols": ["nl$ebnf$1", "nl$ebnf$2", "nl$ebnf$3"], "postprocess": d => null},
    {"name": "comment", "symbols": ["_", (lexer.has("comment") ? {type: "comment"} : comment), "_"], "postprocess": d => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
