import "mocha";
import { expect } from "chai";
import { describe } from "node:test";

function add(a: number, b: number): number {
  return a + b;
}

describe("test init", function() {
  it("should assert that everything is fine", function() {
    let a: number = 3;
    let b: number = 5;

    expect(add(a, b)).to.equal(a + b);
    expect(add(4, 5)).to.equal(4 + 5);
  });
});
