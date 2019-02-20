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
    it("sign -> verify", async () => {
      const text = 'function test(){alert("test")}';
      const res = await utils.sign(text);
      const res_verify = await utils.verify(res);
      expect(res_verify.length).to.equal(text.length);
      expect(text).to.equal(res_verify);
    });
  });
  describe("Verify function", () => {
    it("empty text", async () => {
      expect(utils.verify("")).be.rejectedWith("Empty string");
    });
    it("short text", async () => {
      expect(utils.verify("test")).be.rejectedWith("File don't have sign");
    });
    it("good text", async () => {
      const text = 'function test(){alert("test")}';
      const sign_text = await utils.sign(text);
      expect(utils.verify(sign_text)).be.fulfilled;
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
