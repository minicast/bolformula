/* eslint no-unused-expressions: false */
/* jshint -W030 */

// const expect = require('chai').expect;
import {expect} from 'chai';
// import bolFormula from './index.js';
const bolFormula = require('./index.js');

describe("bolFormulaParser", function () {
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

    const fn = function() {
      bolFormula.parser.parse(
        `badInput`
      );
    };
    it("should throw on badly formed input", function () {
      expect(fn).to.throw();
    });
  });
  describe("getD3", function () {
    it("should return a D3 tree layout object", function () {
      expect(bolFormula.getD3(bolFormula.parser.parse(
        `(~((p & q & s) | ~(q>r) ) ^ ~~s)`
      ))).to.deep.equal(
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
    const fn = function() {
      bolFormula.getD3(bolFormula.parser.parse(
        `badInput`
      ));
    };
    it("should throw on badly formed input", function () {
      expect(fn).to.throw();
    });
  });
});
