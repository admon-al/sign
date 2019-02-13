const
    fs = require('fs'),
    express = require('express'),
    openpgp = require('openpgp'),
    router = express.Router(),
    multer  = require('multer'),
    keys = require("../keys"),
    utils = require('../utils');

const sign = async (original, text) => {
    var privKeyObj = (await openpgp.key.readArmored(keys.privkey)).keys[0];
    await privKeyObj.decrypt(keys.passphrase);

    const options = {
        message: openpgp.cleartext.fromText(text),
        privateKeys: [privKeyObj],
        detached: true
    };

    const signed = await openpgp.sign(options);
    let detachedSig = signed.signature;

    detachedSig = detachedSig
    //.replace(/(\r\n|\n|\r)/gm, "")
        .replace("Version: OpenPGP.js v4.4.6\r\n", "")
        .replace("Comment: https://openpgpjs.org\r\n", "");

    return `${original}/*${Buffer.from(detachedSig).toString('base64')}*/`;
};

router.get('/url', async(req, res) => {
    const url = req.query.url;
    if (!utils.ValidURL(url)){
        res.send('Error: file URL not valid');
        return;
    }

    const [error, response, body] = await utils.getFileFromURL(url);
    if (error){
        res.send('Error: bad file URL');
        return;
    }

    const [minify_error, minify_text] = utils.minify(body);
    if(minify_error){
        res.send('Error: JS not valid');
        return;
    }
    const data = await sign(body, minify_text);
    res.type('js');
    res.send(data);
});

router.post('/text', async(req, res)=>{
    const text = req.body.text;
    const [minify_error, minify_text] = utils.minify(text);
    if(minify_error){
        res.send('Error: JS not valid');
        return;
    }
    const data = await sign(text, minify_text);
    res.render('sign', {data});
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
        const data = await sign(body, minify_text);
        const fileName = originalFileName.replace(/(\.[\w\d_-]+)$/i, '_sign$1');
        res.set('Content-disposition', `attachment; filename=${fileName}`);
        res.set('Content-Type', 'text/javascript');
        res.send(data);
    });
});

module.exports = router;
