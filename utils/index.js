const Terser = require("terser"),
  multer = require("multer"),
  axios = require("axios"),
  openpgp = require("openpgp"),
  validator = require("validator"),
  config = require("../config");

const minify = text => {
  if (validator.isEmpty(text)) throw new Error("Empty string");

  const result = Terser.minify(text, {
    mangle: false,
    keep_classnames: false,
    keep_fnames: false,
    compress: {
      defaults: false
    }
  });
  if (result.error !== undefined) throw new Error("JS not valid");
  return result.code;
};

const getFileFromURL = async file_url => {
  if (validator.isEmpty(file_url)) throw new Error("File URL required");
  if (!validator.isURL(file_url, { require_protocol: true })) {
    throw new Error("File URL not valid");
  }
  try {
    const response = await axios.get(file_url);
    return response.data;
  } catch (error) {
    throw new Error("Bad file response");
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileSize: 5 * 1024
}).single("file");

const sign = async(text) =>{
  const privateKeyObj = (await openpgp.key.readArmored(config.get("privkey")))
    .keys[0];
  await privateKeyObj.decrypt(config.get("passphrase"));
  const options = {
    message: openpgp.cleartext.fromText(text),
    privateKeys: [privateKeyObj],
    detached: true
  };
  const signed = await openpgp.sign(options);
  return signed.signature;
};

const verify = async (text, sig)=>{
  const options = {
    message: openpgp.cleartext.fromText(text),
    signature: await openpgp.signature.readArmored(sig),
    publicKeys: (await openpgp.key.readArmored(config.get("pubkey"))).keys
  };
  const verified = await openpgp.verify(options);
  const validity = verified.signatures[0].valid;
  return validity;
};

module.exports = {
  minify,
  getFileFromURL,
  upload,
  sign,
  verify
};
