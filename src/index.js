#! /usr/bin/env node
"use strict";

const fs = require("fs");
// import fs from "fs";
// import _ from "lodash";
const PEG = require("pegjs");

const bolFormulaGrammar = fs.readFileSync(
  "./src/bolFormulaGrammar.pegjs",
  "utf8"
);
const bolFormulaParser = PEG.buildParser(bolFormulaGrammar);

// const nodeOfTerm = (term) => {
//   return {content: term, children: []};
// };
//
// const atomTerms = (formula) => {
//   if (!formula.relation) {
//     throw new Error("atomTerms called with bad imput");
//   }
//   let terms;
//   if (formula.arity === 0) {
//     terms = [];
//   }
//   if (formula.arity === 1) {
//     terms = [formula.term1];
//   }
//   if (formula.arity === 2) {
//     terms = [formula.term1, formula.term2];
//   }
//   return terms.map(nodeOfTerm);
// };

// formula2d3(
//  ""
// )
function formula2d3 (formulaParsed) {
  // const formulaParsed = bolFormulaParser.parse(formulaString);
  let node = {};
  if (!formulaParsed.relation && !formulaParsed.negation && !formulaParsed.junctor) {
    throw new Error("formula2d3 called with bad imput");
  }
  if (formulaParsed.relation) {
    node.content = formulaParsed.relation;
    // node.children = atomTerms(formulaParsed);
    node.children = []; // atomTerms(formulaParsed);
  }
  if (formulaParsed.negation) {
    node.content = formulaParsed.negation;
    node.children = [formula2d3(formulaParsed.content)];
  }
  if (formulaParsed.junctor) {
    node.content = formulaParsed.junctor;
    node.children = [formula2d3(formulaParsed.left), formula2d3(formulaParsed.right)];
  }
  // if (formulaParsed.quantifier) {
  //   node.content = formulaParsed.quantifier;
  //   node.children = [nodeOfTerm(formulaParsed.variable), formula2d3(formulaParsed.formula)];
  // }
  // if (formulaParsed.guard) {
  //   node.content = "&";
  //   node.children = [
  //     formula2d3(formulaParsed.guard),
  //     {content: "~", children: [formula2d3(formulaParsed.formula)]}
  //   ];
  // }
  return node;
}

function string2latex(string) {
  return string
    .replace(/\{/g, "\\{ ") // this needs to be first, before any other {}inro rule
    .replace(/~/g, "\\lnot{}")
    .replace(/&/g, "\\land{}")
    .replace(/\|/g, "\\lor{}")
    .replace(/\>/g, "\\rightarrow{}")
    .replace(/\^/g, "\\leftrightarrow{}")
    .replace(/#/g, "\\Box{}")
    .replace(/\*/g, "\\Diamond{}")
    .replace(/\$/g, "\\forall{}")
    .replace(/!/g, "\\exists{}")
    .replace(/@/g, "@{}")
    .replace(/</g, "<{}");
}

function parsed2string(parsedFormula) {
  let string = "";
  if (parsedFormula.relation) {
    string = parsedFormula.relation;
  } else
  if (parsedFormula.negation) {
    string = `~${parsed2string(parsedFormula.content)}`;
  } else
  if (parsedFormula.junctor) {
    let jc = "";
    if (parsedFormula.junctor === "and") { jc = "&"; } else
    if (parsedFormula.junctor === "or") { jc = "|"; } else
    if (parsedFormula.junctor === "if-then") { jc = ">"; } else
    if (parsedFormula.junctor === "if-and-only-if") { jc = "^"; } else
    {
      throw new Error("parsed2string called with unknown junctor");
    }
    string = `(${parsed2string(parsedFormula.left)}${jc}${parsed2string(parsedFormula.right)})`;
  }
  else {
    throw new Error("parsed2string called with bad imput");
  }
  return string;
}

module.exports = {
  parser: bolFormulaParser,
  getD3: formula2d3,
  getLatex: string2latex,
  getString: parsed2string
};

// JSON.stringify(formula2d3(FormulaPEG.parse("(R(a,b)&~R(a,b))")))

// tip library:
// http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js

/* tributary code:

var treeData = [
{"content":"&","children":[{"content":"R","children":[{"content":"a","children":[]},{"content":"b","children":[]}]},{"content":"~","children":[{"content":"R","children":[{"content":"a","children":[]},{"content":"b","children":[]}]}]}]}
]

// ************** Generate the tree diagram	 *****************
var margin = {top: 40, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];

update(root);

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 100; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")"; });

  nodeEnter.append("circle")
    .attr("r", 10)
    .style("stroke", "steelblue")
    .style("stroke-width", "3px")
    .style("fill", "#fff");

  nodeEnter.append("text")
    .attr("y", function(d) {
      return d.children || d._children ? -18 : 18; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.content; })
    .style("fill-opacity", 1)
    .style("font", "12px sans-serif");

  // Declare the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", diagonal)
    .style("fill", "none")
    .style("stroke", "#ccc")
    .style("stroke-width", "2px");

}

*/
