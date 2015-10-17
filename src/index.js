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

// formula2d3(
//  ""
// )
const formula2d3 = (formulaString) => {
  // const formulaParsed = bolFormulaParser.parse(formulaString);
  return formulaString; // {
  // };
};

module.exports = {
  parser: bolFormulaParser,
  getD3: formula2d3,
  getLatex: "getLatex"
};


// tip library:
// http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js

/* tributary code:

*/
