// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
    {"name": "main", "symbols": ["nl", "service"]},
    {"name": "remarks$ebnf$1", "symbols": []},
    {"name": "remarks$ebnf$1$subexpression$1", "symbols": ["nl", (lexer.has("memberRemark") ? {type: "memberRemark"} : memberRemark)]},
    {"name": "remarks$ebnf$1", "symbols": ["remarks$ebnf$1", "remarks$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "remarks$ebnf$2$subexpression$1", "symbols": ["nl", (lexer.has("lastRemark") ? {type: "lastRemark"} : lastRemark)]},
    {"name": "remarks$ebnf$2", "symbols": ["remarks$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "remarks$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "remarks", "symbols": ["remarks$ebnf$1", "remarks$ebnf$2"], "postprocess": extractRemarks},
    {"name": "service", "symbols": ["descriptors", {"literal":"service"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", "serviceBody"], "postprocess": extractService},
    {"name": "serviceBody", "symbols": [{"literal":"{}"}], "postprocess": extractServiceBody},
    {"name": "serviceBody$ebnf$1", "symbols": []},
    {"name": "serviceBody$ebnf$1$subexpression$1", "symbols": ["nl", "serviceMembers"]},
    {"name": "serviceBody$ebnf$1", "symbols": ["serviceBody$ebnf$1", "serviceBody$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "serviceBody", "symbols": [{"literal":"{"}, "serviceBody$ebnf$1", "nl", {"literal":"}"}], "postprocess": extractServiceBody},
    {"name": "serviceMembers", "symbols": ["method"]},
    {"name": "serviceMembers", "symbols": ["dto"]},
    {"name": "serviceMembers", "symbols": ["enum"]},
    {"name": "serviceMembers", "symbols": ["errors"]},
    {"name": "errors", "symbols": ["descriptors", {"literal":"errors"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", "enumBody"], "postprocess": extractErrors},
    {"name": "enum", "symbols": ["descriptors", {"literal":"enum"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", "enumBody"], "postprocess": extractEnum},
    {"name": "enumBody", "symbols": [{"literal":"{}"}], "postprocess": extractEnumBody},
    {"name": "enumBody$ebnf$1", "symbols": []},
    {"name": "enumBody$ebnf$1$subexpression$1", "symbols": ["nl", "descriptors", (lexer.has("name") ? {type: "name"} : name), "_", {"literal":","}]},
    {"name": "enumBody$ebnf$1", "symbols": ["enumBody$ebnf$1", "enumBody$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enumBody$ebnf$2$subexpression$1", "symbols": ["nl", "descriptors", (lexer.has("name") ? {type: "name"} : name)]},
    {"name": "enumBody$ebnf$2", "symbols": ["enumBody$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "enumBody$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "enumBody", "symbols": [{"literal":"{"}, "enumBody$ebnf$1", "enumBody$ebnf$2", "nl", {"literal":"}"}], "postprocess": extractEnumBody},
    {"name": "dto", "symbols": ["descriptors", {"literal":"data"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", "methodBody"], "postprocess": extractDto},
    {"name": "method", "symbols": ["descriptors", {"literal":"method"}, "_", (lexer.has("name") ? {type: "name"} : name), "nl", "methodBody", "nl", {"literal":":"}, "nl", "methodBody"], "postprocess": extractMethod},
    {"name": "methodBody", "symbols": [{"literal":"{}"}], "postprocess": extractMethodBody},
    {"name": "methodBody$ebnf$1", "symbols": []},
    {"name": "methodBody$ebnf$1$subexpression$1", "symbols": ["nl", "descriptors", "attrPair"]},
    {"name": "methodBody$ebnf$1", "symbols": ["methodBody$ebnf$1", "methodBody$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "methodBody", "symbols": [{"literal":"{"}, "methodBody$ebnf$1", "nl", {"literal":"}"}], "postprocess": extractMethodBody},
    {"name": "attrPair$ebnf$1", "symbols": [{"literal":"!"}], "postprocess": id},
    {"name": "attrPair$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attrPair", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_", {"literal":":"}, "_", "attrValue", "_", "attrPair$ebnf$1", "_", {"literal":";"}], "postprocess": d => ({ attribute: { name: d[0].value, value: d[4], isRequired: !!d[6] }})},
    {"name": "attrValue", "symbols": [(lexer.has("value") ? {type: "value"} : value)], "postprocess": d => ({ type: d[0].value })},
    {"name": "attrValue", "symbols": [(lexer.has("value") ? {type: "value"} : value), "_", {"literal":"<"}, "_", "attrValue", "_", {"literal":">"}], "postprocess": d => ({ type: d[0].value, value: d[4] })},
    {"name": "attrValue", "symbols": ["attrValue", "_", {"literal":"["}, {"literal":"]"}], "postprocess": d => ({ type: d[0], isArray: true })},
    {"name": "descriptors$ebnf$1", "symbols": []},
    {"name": "descriptors$ebnf$1$subexpression$1", "symbols": ["descriptor", "nl"]},
    {"name": "descriptors$ebnf$1", "symbols": ["descriptors$ebnf$1", "descriptors$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "descriptors", "symbols": ["descriptors$ebnf$1"], "postprocess": extractDescriptors},
    {"name": "descriptor", "symbols": ["summary"]},
    {"name": "descriptor", "symbols": ["attributes"]},
    {"name": "summary", "symbols": [(lexer.has("summary") ? {type: "summary"} : summary)], "postprocess": extractSummary},
    {"name": "attributes$ebnf$1", "symbols": []},
    {"name": "attributes$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "attribute"]},
    {"name": "attributes$ebnf$1", "symbols": ["attributes$ebnf$1", "attributes$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attributes", "symbols": [{"literal":"["}, "_", "attribute", "attributes$ebnf$1", "_", {"literal":"]"}], "postprocess": extractAttributes},
    {"name": "attribute$ebnf$1$subexpression$1", "symbols": ["_", "params"]},
    {"name": "attribute$ebnf$1", "symbols": ["attribute$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "attribute$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "attribute", "symbols": [(lexer.has("name") ? {type: "name"} : name), "attribute$ebnf$1"], "postprocess": extractAttribute},
    {"name": "params$ebnf$1", "symbols": []},
    {"name": "params$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "params$ebnf$1", "symbols": ["params$ebnf$1", "params$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "params", "symbols": [{"literal":"("}, "_", "pair", "params$ebnf$1", "_", {"literal":")"}], "postprocess": extractParams},
    {"name": "pair", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_", {"literal":":"}, "_", "value"], "postprocess": extractPair},
    {"name": "value", "symbols": [(lexer.has("valueParams") ? {type: "valueParams"} : valueParams)]},
    {"name": "value", "symbols": [(lexer.has("value") ? {type: "value"} : value)]},
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
