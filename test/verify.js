const chai = require("chai"),
  chaiHttp = require("chai-http"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  utils = require("../utils");

const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Verify Controller", () => {
  describe("URL", () => {
    it("empty URL", async () => {
      const res = await chai.request(app).get("/verify/url");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File URL required");
    });
    it("bad file URL without http(s)", async () => {
      const res = await chai.request(app).get("/verify/url?url=test.ry/re.js");

      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File URL not valid");
    });
  });
  describe("Text", () => {
    it("empty text", async () => {
      const res = await chai.request(app).post("/verify/text");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: Empty string");
    });
    it("send empty variable", async () => {
      const res = await chai
        .request(app)
        .post("/verify/text")
        .type("form")
        .send({ text: "" });
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: Empty string");
    });
    it("send text", async () => {
      const data = fs.readFileSync("test/ok.js.txt");
      const text = Buffer.from(data).toString();
      const sign_text = await utils.signatureCode(text);
      const res = await chai
        .request(app)
        .post("/verify/text")
        .type("form")
        .send({ text: sign_text });
      expect(res).to.have.status(200);

      const $ = cheerio.load(res.text);
      const content = $("#verify").val();
      expect(content.length).to.equal(text.length);
      expect(content).to.equal(text);
    });
  });
  describe("File", () => {
    it("without file", async () => {
      const res = await chai.request(app).post("/verify/file");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File don't upload");
    });
    it("upload empty file", async () => {
      const res = await chai
        .request(app)
        .post("/verify/file")
        .attach("file", "test/empty.js.txt", "empty.js");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: Empty string");
    });
    it("upload bad js file", async () => {
      const res = await chai
        .request(app)
        .post("/verify/file")
        .attach("file", "test/bad.js.txt", "bad.js");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File don't have signature");
    });
    it("upload good js file", async () => {
      const data = fs.readFileSync("test/ok.js.txt");
      const text = Buffer.from(data).toString();
      const sign_text = await utils.signatureCode(text);
      const res = await chai
        .request(app)
        .post("/verify/file")
        .attach("file", Buffer.from(sign_text, "utf8"), "ok.js");
      expect(res).to.have.status(200);
      expect(res.text.length).to.not.equal(0);
      expect(res.text).to.equal(text);
    });
  });
});
