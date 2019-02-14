const
    openpgp = require('openpgp'),
    config = require('../config'),
    utils = require('../utils');

const verify = async(original, text) => {
    try{
        let detachedSig = original.slice(-1096);
        const data = original.slice(0, -1096);
        detachedSig = detachedSig.slice(2, -2);

        const options = {
            message: openpgp.cleartext.fromText(text),
            signature: await openpgp.signature.readArmored(Buffer.from(detachedSig, "base64").toString('ascii')),
            publicKeys: (await openpgp.key.readArmored(config.get('pubkey'))).keys
        };
        const verified = await openpgp.verify(options);
        const validity = verified.signatures[0].valid;
        if (!validity)
            throw new Error('File not verified');
        return data;
    }catch(error){
        throw new Error('Bad verify');
    }
};

exports.url = async(req, res)=>{
    try{
        const url = req.query.url;
        if (!url)
            throw new Error('File URL required');
        if (!utils.ValidURL(url))
            throw new Error('File URL not valid');
        const body = await utils.getFileFromURL(url);
        if(body && body.length < 1096)
            throw new Error('File not sign');

        const minify_text = utils.minify(body);
        const data = await verify(body, minify_text);
        res.type('js');
        res.send(data);
    }catch(error){
        res.send("Error: " + error.message);
    }
};

exports.text = async(req, res)=>{
    try {
        const text = req.body.text;
        if(text && text.length < 1096)
            throw new Error('File not sign');

        const minify_text = utils.minify(text);
        const data = await verify(text, minify_text);
        res.render('verify', {data});
    }catch(error){
        res.send("Error: " + error.message);
    }
};

exports.file = async(req, res)=>{
    try {
        if (!req.file)
            throw new Error("File don't upload");

        const originalFileName = req.file.originalname;
        const body = Buffer.from(req.file.buffer).toString("utf8");

        const minify_text = utils.minify(body);
        const text = await verify(body, minify_text);
        const fileName = originalFileName;
        res.set('Content-disposition', `attachment; filename=${fileName}`);
        res.set('Content-Type', 'text/javascript');
        res.send(text);
    }catch (error) {
        res.send("Error: " + error.message);
    }
};
