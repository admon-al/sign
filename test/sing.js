const chai = require("chai"),
  chaiHttp = require("chai-http"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  verification = require("../verification");

const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Sign Controller", () => {
  describe("URL", () => {
    it("empty URL", async () => {
      const res = await chai.request(app).get("/sign/url");

      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File URL required");
    });
    it("bad file URL without http(s)", async () => {
      const res = await chai.request(app).get("/sign/url?url=test.ry/re.js");

      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File URL not valid");
    });
    it("bad file URL", async () => {
      const res = await chai
        .request(app)
        .get("/sign/url?url=https://test.ru/re.js");

      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: Bad file response");
    });
  });

  describe("Text", () => {
    it("send without data", async () => {
      const res = await chai.request(app).post("/sign/text");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: Empty string");
    });
    it("send empty variable", async () => {
      const res = await chai
        .request(app)
        .post("/sign/text")
        .type("form")
        .send({ text: "" });
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: Empty string");
    });
    it("send text", async () => {
      const text = "hello";
      const res = await chai
        .request(app)
        .post("/sign/text")
        .type("form")
        .send({ text });
      expect(res).to.have.status(200);

      const $ = cheerio.load(res.text);
      const content = $("#sign").val();
      expect(content.length).to.not.equal(0);

      const verify = await verification.verificationCode(content);
      expect(verify).to.equal(text);
    });
    it("send bad js code", async () => {
      const text = "function(){alert(')";
      const res = await chai
        .request(app)
        .post("/sign/text")
        .type("form")
        .send({ text });
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: JS not valid");
    });
  });

  describe("File", () => {
    it("without file", async () => {
      const res = await chai.request(app).post("/sign/file");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File don't upload");
    });
    it("upload empty file", async () => {
      const res = await chai
        .request(app)
        .post("/sign/file")
        .attach("file", "test/empty.js.txt", "empty.js");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: Empty string");
    });
    it("upload bad js file", async () => {
      const res = await chai
        .request(app)
        .post("/sign/file")
        .attach("file", "test/bad.js.txt", "bad.js");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: JS not valid");
    });
    it("upload good js file", async () => {
      const data = fs.readFileSync("test/ok.js.txt");
      const text = Buffer.from(data).toString();
      const res = await chai
        .request(app)
        .post("/sign/file")
        .attach("file", data, "ok.js");
      expect(res).to.have.status(200);
      expect(res.text.length).to.not.equal(0);

      const verify = await verification.verificationCode(res.text);
      expect(verify).to.equal(text);
    });
  });
});
