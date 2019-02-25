const chai = require("chai"),
  chaiHttp = require("chai-http"),
  nock = require("nock"),
  verification = require("../verification");

const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Test network request", () => {
  describe("URL Sign", () => {
    it("status 200 URL bad js", async () => {
      nock("http://test.ru")
        .defaultReplyHeaders({ "Content-Type": "text/javascript" })
        .get("/file.js")
        .reply(200, "Hello from Google!");
      const res = await chai
        .request(app)
        .get("/sign/url?url=http://test.ru/file.js");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: JS not valid");
    });
    it("status 200 URL ok js", async () => {
      nock("http://test.ru")
        .defaultReplyHeaders({ "Content-Type": "text/javascript" })
        .get("/file.js")
        .reply(200, "function test(){return a+b;}");
      const res = await chai
        .request(app)
        .get("/sign/url?url=http://test.ru/file.js");
      expect(res).to.have.status(200);
      expect(res).to.have.header("content-type", /^text\/javascript/);
      expect(res.text.length).to.not.equal(0);
    });
  });
  describe("URL Verify", () => {
    it("status 200 URL bad js", async () => {
      nock("http://test.ru")
        .defaultReplyHeaders({ "Content-Type": "text/javascript" })
        .get("/file.js")
        .reply(200, "Hello from Google!");
      const res = await chai
        .request(app)
        .get("/verify/url?url=http://test.ru/file.js");
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Error: File don't have signature");
    });
    it("status 200 URL ok js", async () => {
      const body = "function test(){return a+b;}";
      const sign_body = await verification.signatureCode(body);
      nock("http://test.ru")
        .defaultReplyHeaders({ "Content-Type": "text/javascript" })
        .get("/file.js")
        .reply(200, sign_body);
      const res = await chai
        .request(app)
        .get("/verify/url?url=http://test.ru/file.js");
      expect(res).to.have.status(200);
      expect(res.text).to.equal(body);
    });
  });
});
