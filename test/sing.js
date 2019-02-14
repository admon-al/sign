const
    chai = require('chai'),
    chaiHttp = require('chai-http');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Sign', () => {
    describe('URL', () => {
        it('empty URL', async () => {
            const res = await chai.request(app)
                .get('/sign/url');

            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: File URL required');
        });
        it('bad file URL without http(s)', async ()=> {
            const res = await chai.request(app)
                .get('/sign/url?url=test.ry/re.js');

            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: File URL not valid');
        });
        it('bad file URL', async()=> {
            const res = await chai.request(app)
                .get('/sign/url?url=https://test.ry/re.js');

            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: Bad file response');
        });
    });

    describe('Text', ()=>{
        it('without data', async ()=>{
            const res = await chai.request(app)
                .post('/sign/text');
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: JS not valid');
        });
        it('empty', async ()=>{
            const res = await chai.request(app)
                .post('/sign/text')
                .send({text:''});
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: JS not valid');
        });
        it('bad js', async ()=>{
            const res = await chai.request(app)
                .post('/sign/text')
                .send({text: 'hello'});
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: JS not valid');
        });
    });

    describe('File', ()=>{
        it('without file', async ()=>{
            const res = await chai.request(app)
                .post('/sign/file');
            expect(res).to.have.status(200);
            expect(res.text).to.equal('Error: File don\'t upload');
        });
    });
});
