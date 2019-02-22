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

const signatureCode = async original => {
  const minify_text = minify(original);
  const privateKeyObj = (await openpgp.key.readArmored(config.get("privkey")))
    .keys[0];
  await privateKeyObj.decrypt(config.get("passphrase"));
  const options = {
    message: openpgp.cleartext.fromText(minify_text),
    privateKeys: [privateKeyObj],
    detached: true
  };
  const signed = await openpgp.sign(options);
  let detachedSig = signed.signature;

  detachedSig = detachedSig
    //.replace(/(\r\n|\n|\r)/gm, "")
    .replace("Version: OpenPGP.js v4.4.6\r\n", "")
    .replace("Comment: https://openpgpjs.org\r\n", "");
  return `${original}/*${Buffer.from(detachedSig).toString("base64")}*/`;
};

const verificationCode = async text => {
  if (validator.isEmpty(text)) throw new Error("Empty string");
  if (text.length < 1096) throw new Error("File don't have signature");

  let detachedSig = text.slice(-1096);
  const data = text.slice(0, -1096);
  detachedSig = detachedSig.slice(2, -2);

  const minify_text = minify(data);
  const options = {
    message: openpgp.cleartext.fromText(minify_text),
    signature: await openpgp.signature.readArmored(
      Buffer.from(detachedSig, "base64").toString("ascii")
    ),
    publicKeys: (await openpgp.key.readArmored(config.get("pubkey"))).keys
  };
  const verified = await openpgp.verify(options);
  const validity = verified.signatures[0].valid;
  if (!validity) throw new Error("File not verified");
  return data;
};

module.exports = {
  minify,
  getFileFromURL,
  upload,
  signatureCode,
  verificationCode
};
