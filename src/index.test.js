/* eslint no-unused-expressions: false */
/* jshint -W030 */

// const expect = require('chai').expect;
import {expect} from 'chai';
import bolFormula from './index.js';

describe("bolFormulaParser", function () {
  describe("parser", function () {
    it("should parse a boolean formula", function () {
      expect(bolFormula.parser.parse(
        `(p&q)`
      )).to.deep.equal(
        JSON.parse(
          `{"junctor":"and","left":{"relation":"p","arity":0},"right":{"relation":"q","arity":0}}`
        )
      );
    });
  });
  describe("getD3", function () {
    it("should return a D3 tree layout object", function () {
      expect(bolFormula.getD3(
        `p`
      )).to.deep.equal(
        JSON.parse(
          `"p"`
        )
      );
    });
  });
});
