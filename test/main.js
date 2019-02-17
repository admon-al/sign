const chai = require("chai"),
  chaiHttp = require("chai-http");

const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Main page", () => {
  it("open", async () => {
    const res = await chai.request(app).get("/");
    expect(res).to.have.status(200);
  });
});
