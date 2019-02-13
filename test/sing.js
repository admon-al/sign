const
    chai = require('chai'),
    chaiHttp = require('chai-http');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Sign', ()=>{
    describe('URL', ()=>{
        it('empty URL', (done)=>{
            chai.request(app)
                .get('/sign/url')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Error: file URL not valid');
                    done();
                });
        });
        it('bad file URL without http(s)', (done)=>{
            chai.request(app)
                .get('/sign/url?url=test.ry/re.js')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Error: file URL not valid');
                    done();
                });
        });
        it('bad file URL', (done)=>{
            chai.request(app)
                .get('/sign/url?url=https://test.ry/re.js')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Error: bad file URL');
                    done();
                });
        });
    });

    describe('Text', ()=>{
        it('without data', (done)=>{
            chai.request(app)
                .post('/sign/text')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Error: JS not valid');
                    done();
                });
        });
        it('empty', (done)=>{
            chai.request(app)
                .post('/sign/text')
                .send({text:''})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Error: JS not valid');
                    done();
                });
        });
        it('bad js', (done)=>{
            chai.request(app)
                .post('/sign/text')
                .send({text: 'hello'})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Error: JS not valid');
                    done();
                });
        });
    });

    describe('File', ()=>{
        it('without file', (done)=>{
            chai.request(app)
                .post('/sign/file')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Error: File don\'t upload');
                    done();
                });
        });
    });
});
