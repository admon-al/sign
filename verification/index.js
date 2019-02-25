const
  validator = require("validator"),
  utils = require("../utils");

const verificationCode = async text => {
  const re = /\/\*\*[\w\W]*\\*\*\/$/gi;

  if (validator.isEmpty(text)) throw new Error("Empty string");
  const result = text.match(re);
  if (result === null) throw new Error("File don't have signature");

  let detachedSig = result[0];
  // remove /* ... */
  detachedSig = detachedSig.slice(3, -3);
  let data = text.replace(re, "");

  const minify_text = utils.minify(data);
  const validity = await utils.verify(minify_text, Buffer.from(detachedSig, "base64").toString("ascii"));
  if (!validity) throw new Error("File not verified");
  return data;
};

const signatureCode = async original => {
  const minify_text = utils.minify(original);
  let detachedSig = await utils.sign(minify_text);

  detachedSig = detachedSig
  //.replace(/(\r\n|\n|\r)/gm, "")
    .replace("Version: OpenPGP.js v4.4.6\r\n", "")
    .replace("Comment: https://openpgpjs.org\r\n", "");
  return `${original}/**${Buffer.from(detachedSig, "utf8").toString("base64")}**/`;
};


module.exports = {
  signatureCode,
  verificationCode
};
