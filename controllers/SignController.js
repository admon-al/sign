const
    openpgp = require('openpgp'),
    config = require('../config'),
    utils = require('../utils');

const sign = async (original, text) => {
    try{
        const privateKeyObj = (await openpgp.key.readArmored(config.get('privkey'))).keys[0];
        await privateKeyObj.decrypt(config.get('passphrase'));

        const options = {
            message: openpgp.cleartext.fromText(text),
            privateKeys: [privateKeyObj],
            detached: true
        };
        const signed = await openpgp.sign(options);
        let detachedSig = signed.signature;

        detachedSig = detachedSig
            //.replace(/(\r\n|\n|\r)/gm, "")
            .replace("Version: OpenPGP.js v4.4.6\r\n", "")
            .replace("Comment: https://openpgpjs.org\r\n", "");

        return `${original}/*${Buffer.from(detachedSig).toString('base64')}*/`;
    }catch(error){
        throw new Error(error.message);
    }
};

exports.url = async(req, res) => {
    try{
        const url = req.query.url;
        if (!url)
            throw new Error('File URL required');
        if (!utils.ValidURL(url))
            throw new Error('File URL not valid');

        const body = await utils.getFileFromURL(url);
        if(body && body.trim().length === 0)
            throw new Error('Empty file');
        const minify_text = utils.minify(body);
        const data = await sign(body, minify_text);

        res.type('js');
        res.send(data);
    }catch(error){
        res.send("Error: " + error.message);
    }
};

exports.text = async(req, res)=>{
    try{
        const text = req.body.text;
        if(text && text.trim().length === 0)
            throw new Error('Empty string');

        const minify_text = utils.minify(text);
        const data = await sign(text, minify_text);
        res.render('sign', {data});
    }catch(error){
        res.send("Error: " + error.message);
    }
};

exports.file = async(req, res)=>{
    try{
        if(!req.file)
            throw new Error("File don't upload");

        const originalFileName = req.file.originalname;
        const body = Buffer.from(req.file.buffer).toString("utf8");

        if(body && body.trim().length === 0)
            throw new Error('Empty file');

        const minify_text = utils.minify(body);
        const data = await sign(body, minify_text);
        const fileName = originalFileName.replace(/(\.[\w\d_-]+)$/i, '_sign$1');

        res.set('Content-disposition', `attachment; filename=${fileName}`);
        res.set('Content-Type', 'text/javascript');
        res.send(data);
    }catch(error){
        res.send("Error: " + error.message);
    }
};
