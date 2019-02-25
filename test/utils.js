const chai = require("chai"),
  chaiAsPromised = require("chai-as-promised"),
  verification = require("../verification"),
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
      expect(verification.signatureCode("")).be.rejectedWith("Empty string");
    });
    it("sign -> verify", async () => {
      const text = 'function test(){alert("test")}';
      const res = await verification.signatureCode(text);
      const res_verify = await verification.verificationCode(res);
      expect(res_verify.length).to.equal(text.length);
      expect(text).to.equal(res_verify);
    });
    it("diff sign two words", async () => {
      const text1 = "a+b";
      const text2 = "b+a";

      const sign1 = await utils.sign(text1);
      const sign2 = await utils.sign(text2);
      expect(sign1).to.not.equal(sign2);
    });
  });
  describe("Verify function", () => {
    it("empty text", async () => {
      expect(verification.verificationCode("")).be.rejectedWith("Empty string");
    });
    it("short text", async () => {
      expect(verification.verificationCode("test")).be.rejectedWith("File don't have signature");
    });
    it("good text", async () => {
      const text = 'function test(){alert("test")}';
      const sign_text = await verification.signatureCode(text);
      expect(verification.verificationCode(sign_text)).be.fulfilled;
    });
    it("verify diff two words, change sign", async () => {
      const text1 = "a+b";
      const text2 = "b+a";

      const sign1 = await utils.sign(text1);
      const sign2 = await utils.sign(text2);

      expect(await utils.verify(text1, sign1)).to.equal(true);
      expect(await utils.verify(text2, sign2)).to.equal(true);

      expect(await utils.verify(text1, sign2)).to.equal(false);
      expect(await utils.verify(text2, sign1)).to.equal(false);
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
