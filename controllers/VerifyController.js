const
  verification = require("../verification"),
  utils = require("../utils");

exports.url = async (req, res) => {
  try {
    const url = req.query.url || "";
    const body = await utils.getFileFromURL(url);
    const data = await verification.verificationCode(body);
    res.set("Content-Type", "text/javascript");
    res.send(data);
  } catch (error) {
    res.send("Error: " + error.message);
  }
};

exports.text = async (req, res) => {
  try {
    const text = req.body.text || "";
    const data = await verification.verificationCode(text);
    res.render("verify", { data });
  } catch (error) {
    res.send("Error: " + error.message);
  }
};

exports.file = async (req, res) => {
  try {
    if (!req.file) throw new Error("File don't upload");

    const originalFileName = req.file.originalname;
    const body = Buffer.from(req.file.buffer).toString("utf8");

    const text = await verification.verificationCode(body);
    const fileName = originalFileName;
    res.set("Content-disposition", `attachment; filename=${fileName}`);
    res.set("Content-Type", "text/javascript");
    res.send(text);
  } catch (error) {
    res.send("Error: " + error.message);
  }
};
