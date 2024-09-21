const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('member/list');
});

router.get('/login', (req, res) => {
    res.render('member/login');
});

module.exports = router;