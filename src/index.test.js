/* eslint no-unused-expressions: false */
/* jshint -W030 */

// const expect = require('chai').expect;
import {expect} from 'chai';
// import bolFormula from './index.js';
const bolFormula = require('./index.js');

// describe("description", function () {
//   it("description", function () {
//     expect(true).to.be.true;
//   });
// });

describe("bolFormula", function () {
  const parsedFormula = bolFormula.parser.parse(
    `(~((p & q & s) | ~(q>r) ) ^ ~~s)`
  );

  describe("parser", function () {
    it("should parse a boolean formula", function () {
      expect(bolFormula.parser.parse(
        `(~((p & q & s) | ~(q>r) ) ^ ~~s)`
      )).to.deep.equal(
        JSON.parse(
          `{
            "junctor":"if-and-only-if",
            "left":{
              "negation":"not",
              "content":{
                "junctor":"or",
                "left":{
                  "junctor":"and",
                  "left":{
                    "junctor":"and",
                    "left":{"relation":"p","arity":0},
                    "right":{"relation":"q","arity":0}
                  },
                  "right":{"relation":"s","arity":0}},
                  "right":{
                    "negation":"not",
                    "content":{
                      "junctor":"if-then",
                      "left":{"relation":"q","arity":0},
                      "right":{"relation":"r","arity":0}
                    }
                  }
                }
              },
              "right":{
                "negation":"not",
                "content":{
                  "negation":"not",
                  "content":{"relation":"s","arity":0}
                }
              }
            }
          `
        )
      );
    });

    it("should throw on badly formed input", function () {
      const illFormedInput = function() {
        bolFormula.parser.parse(`badInput`);
      };
      expect(illFormedInput).to.throw();
    });
  });

  describe("getD3", function () {
    it("should return a D3 tree layout object", function () {
      expect(bolFormula.getD3(parsedFormula)).to.deep.equal(
        JSON.parse(
          `{
            "content":"if-and-only-if",
            "children":[{
              "content":"not",
              "children":[{
                "content":"or",
                "children":[{
                  "content":"and",
                  "children":[{
                    "content":"and",
                    "children":[{
                      "content":"p",
                      "children":[]
                    },{
                      "content":"q",
                      "children":[]
                    }]
                  },{
                    "content":"s",
                    "children":[]
                  }]
                },{
                  "content":"not",
                  "children":[{
                    "content":"if-then",
                    "children":[{
                      "content":"q",
                      "children":[]
                    },{
                      "content":"r",
                      "children":[]
                    }]
                  }]
                }]
              }]
            },{
              "content":"not",
              "children":[{
                "content":"not",
                "children":[{
                  "content":"s",
                  "children":[]
                }]
              }]
            }]
          }`
        )
      );
    });

    it("should throw on badly formed parser input", function () {
      const badParserInput = function() {
        bolFormula.getD3(bolFormula.parser.parse(
          `badInput`
        ));
      };
      expect(badParserInput).to.throw();
    });

    it("should throw with an unparsed formula input", function () {
      const unParsedFormulaInput = function() {
        bolFormula.getD3(`badInput`);
      };
      expect(unParsedFormulaInput).to.throw();
    });
  });

  describe("getLatex", function () {
    it("should convert a string to latex", function () {
      expect(bolFormula.getLatex("(~((p&q&s)|~(q>r))^~~s)"))
      .to.equal(
        "(\\lnot{}((p\\land{}q\\land{}s)\\lor{}\\lnot{}(q\\rightarrow{}r))\\leftrightarrow{}\\lnot{}\\lnot{}s)"
      );
    });
  });

  describe("getUnicode", function () {
    it("should convert a string to unicode", function () {
      expect(bolFormula.getUnicode("(~((p&q&s)|~(q>r))^~~s)"))
      .to.equal(
        "(¬((p∧q∧s)∨¬(q→r))↔¬¬s)"
      );
    });
  });


  describe("getString", function () {
    it("should convert a parsed formula to a string", function () {
      expect(bolFormula.getString(parsedFormula))
      .to.equal(
        "(~(((p&q)&s)|~(q>r))^~~s)"
      );
    });

    it("should throw on badly formed input", function () {
      const notParsedInput = function() {
        bolFormula.getString(`badInput`);
      };
      expect(notParsedInput).to.throw();
    });

    it("should throw on unknown junctor input", function () {
      const unknownJunctor = function() {
        bolFormula.getString({
          junctor: 'nand',
            left: { relation: 'p', arity: 0 },
            right: { relation: 'q', arity: 0 }
          }
        );
      };
      expect(unknownJunctor).to.throw();
    });
  });
});
