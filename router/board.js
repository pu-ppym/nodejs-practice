const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('board/list');
});


module.exports = router;