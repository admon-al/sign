const chai = require("chai"),
  chaiHttp = require("chai-http");

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
  });
  describe("File", () => {
    it("without file", async () => {
      const res = await chai.request(app).post("/verify/file");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File don't upload");
    });
  });
});
