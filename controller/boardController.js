const model = require('../model/boardModel');

const list = ((req, res) => {
    try {
        res.render('board/list');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    list
};