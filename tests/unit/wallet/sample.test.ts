import("mocha");
import config from "config";
import chai from "chai";
import chaiaspromised from "chai-as-promised";
import sinon from "sinon";

const { expect } = chai;

chai.use(chaiaspromised);

describe("Mocha", function() {
  it("should assert that mocha is working", function() {
    expect(true).to.be.ok;
  });
});
