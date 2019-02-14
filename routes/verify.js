const
    express = require('express'),
    router = express.Router(),
    utils = require('../utils'),
    VerofyController = require('../controllers/VerifyController');

router.get('/url', VerofyController.url);
router.post('/text', VerofyController.text);
router.post('/file', utils.upload, VerofyController.file);

module.exports = router;
