const express = require('express');

const router = express.Router();

const controller = require('../controller/memberController');

router.get('/', controller.list);

router.get('/login', controller.login);

router.post('/login', controller.loginProc);

router.get('/view', controller.getView);

router.get('/register', controller.getRegister);

router.post('/checkUserId', controller.checkUserId);

router.get('/logout', controller.logout);

module.exports = router;