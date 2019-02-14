const
    Terser = require('terser'),
    multer  = require('multer'),
    axios = require('axios');

const minify = (text) => {
    const result = Terser.minify(text);
    if (result.error !== undefined) throw new Error('JS not valid');
    return result.code;
};

const ValidURL = (str) => {
    var pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    return pattern.test(str);
};

const getFileFromURL= async (file) => {
    try {
        const response = await axios.get(file);
        return response;
    } catch (error) {
        throw new Error("Bad file response");
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileSize: 5 * 1024
}).single('file');

module.exports = {
    minify,
    ValidURL,
    getFileFromURL,
    upload
};
