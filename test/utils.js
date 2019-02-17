const chai = require("chai"),
  chaiAsPromised = require("chai-as-promised"),
  utils = require("../utils");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Utils", () => {
  describe("Minify function", () => {
    it("empty text", () => {
      expect(() => utils.minify("")).to.throw("Empty string");
    });
  });
  describe("Sign function", () => {
    it("empty text", async () => {
      expect(utils.sign("")).be.rejectedWith("Empty string");
    });
  });
  describe("Verify function", () => {
    it("empty text", async () => {
      expect(utils.verify("")).be.rejectedWith("Empty string");
    });
    it("short text", async () => {
      expect(utils.verify("test")).be.rejectedWith("File don't have sign");
    });
  });
  describe("getFileFromURL function", () => {
    it("empty text", async () => {
      expect(utils.getFileFromURL("")).be.rejectedWith("File URL required");
    });
    it("bad file URL without http(s)", async () => {
      expect(utils.getFileFromURL("test.ry/re.js")).be.rejectedWith(
        "File URL not valid"
      );
    });
    it("bad file URL", async () => {
      expect(utils.getFileFromURL("https://test.ru/re.js")).be.rejectedWith(
        "Bad file response"
      );
    });
    it("ok URL", async () => {
      expect(utils.getFileFromURL("https://statad.ru/tracker.js?d=mvideo.ru"))
        .be.fulfilled;
    });
  });
});
