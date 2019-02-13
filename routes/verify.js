const
    express = require('express'),
    router = express.Router(),
    openpgp = require('openpgp'),
    multer  = require('multer'),
    keys = require("../keys"),
    utils = require('../utils');

const verify=async(original, text)=>{
    let detachedSig = original.slice(-1096);
    const data = original.slice(0, -1096);
    detachedSig = detachedSig.slice(2, -2);

    options = {
        message: openpgp.cleartext.fromText(text),
        signature: await openpgp.signature.readArmored(Buffer.from(detachedSig, "base64").toString('ascii')),
        publicKeys: (await openpgp.key.readArmored(keys.pubkey)).keys
    };

    const verified = await openpgp.verify(options);
    const validity = verified.signatures[0].valid;
    return [validity, data];
};

router.get('/verify', async(req, res)=>{
    const url = req.query.url;
    if (!ValidURL(url)){
        res.send('error file');
        return;
    }
    const [error, response, body] = await utils.getFileFromURL(url);
    if (error){
        res.send('Error: bad file URL');
        return;
    }

    if(body.length < 1096){
        res.send('Error: file not sign');
        return;
    }

    const [minify_error, minify_text] = utils.minify(body);
    if(minify_error){
        res.send('Error: JS not valid');
        return;
    }
    const [validity, text] = await verify(text, minify_text);

    if (validity) {
        //console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
        res.type('js');
        res.send(data);
    }else{
        res.send("error sign");
    }
});

router.post('/text', async(req, res)=>{
    const text = req.body.text;

    if(body.length < 1096){
        res.send('Error: file not sign');
        return;
    }

    const [minify_error, minify_text] = utils.minify(text);
    if(minify_error){
        res.send('Error: JS not valid');
        return;
    }
    const [validity, data] = await verify(text, minify_text);
    if(validity){
        res.send('verify', {data});
    }else{
        res.send('Not valid text');
    }
});

router.post('/file', async(req, res)=>{
    utils.upload(req, res, async (err) => {
        if(!req.file){
            res.send("Error: File don't upload");
            return;
        }
        if (err instanceof multer.MulterError) {
            res.send('Error: invalid file');
            return;
        } else if (err) {
            res.send('Error: upload file');
            return;
        }
        const originalFileName = req.file.originalname;
        const body = Buffer.from(req.file.buffer).toString("utf8");

        const [minify_error, minify_text] = utils.minify(body);
        if(minify_error){
            res.send('Error: JS not valid');
            return;
        }

        const [validity, text] = await verify(body, minify_text);
        if (validity) {
            const fileName = originalFileName;
            res.set('Content-disposition', `attachment; filename=${fileName}`);
            res.set('Content-Type', 'text/javascript');
            res.send(text);
        }else{
            res.send('Error: not valid file');
        }
    });
});

module.exports = router;
