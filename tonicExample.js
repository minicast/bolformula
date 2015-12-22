
/*
by importing the package you can use the API to ...
*/
const bfm = require("bolformula");
/*
... input a formula from the keyboard ...
*/
let formulaKeyboard = "( ( (p & q) > ~(~p | ~q) ) & ( (p > q) ^ (~p | q) ) )";
/*
... display formula in unicode ...
*/
const formulaUnicode = bfm.getUnicode(formulaKeyboard);
console.log(formulaUnicode);
/*
... convert it to LaTeX ...
*/
const formulaLatex = bfm.getLatex(formulaKeyboard);
console.log(formulaLatex);
/*
... parse it into JSON format ...
*/
const formulaJSON = bfm.parser.parse(formulaKeyboard);
console.log(formulaJSON);
/*
... generate D3 tree-layout data ...
*/
const formulaD3 = bfm.getD3(formulaJSON);
console.log(formulaD3);
/*
... get the formula depth ...
*/
const formulaDepth = bfm.getD3depth(formulaJSON);
console.log(formulaDepth);
/*
... get the formula branching factor ...
*/
const formulaLeafs = bfm.getD3leafs(formulaJSON);
console.log(formulaLeafs);
/*
... convert back to keyboard input (ASCII)
*/
formulaKeyboard = bfm.getString(formulaJSON);
