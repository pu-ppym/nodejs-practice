const model = require('../model/memberModel');

const list = ((req, res) => {
    try {
        res.render('member/list');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

const login = ((req, res) => {
    try {
        res.render('member/login');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    list,
    login
};