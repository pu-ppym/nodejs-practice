const express = require('express');

const router = express.Router();

const controller = require('../controller/boardController');

router.get('/', controller.list);


module.exports = router;