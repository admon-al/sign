const
    chai = require('chai'),
    chaiHttp = require('chai-http');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Verify', ()=>{
    describe('URL', () => {
        it('empty URL', async () => {
            const res = await chai.request(app)
                .get('/verify/url');
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: File URL required');
        });
        it('bad file URL without http(s)', async ()=> {
            const res = await chai.request(app)
                .get('/verify/url?url=test.ry/re.js');

            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: File URL not valid');
        });
    });
    describe('Text', () => {

    });
    describe('File', () => {

    });
});
