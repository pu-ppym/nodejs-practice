const express = require('express');

const router = express.Router();

const controller = require('../controller/memberController');

router.get('/', controller.list);

router.get('/login', controller.login);

router.post('/login', controller.loginProc);

router.get('/view', controller.getView);

router.get('/register', controller.getRegister);

router.post('/register', controller.registerProc);

router.post('/checkUserId', controller.checkUserId);

router.get('/logout', controller.logout);

router.get('/modify', controller.modifyMember);

router.post('/modify', controller.modifyMemberProc);

router.post('/delete', controller.deleteProc);

module.exports = router;