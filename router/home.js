const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('첫페이지 접속됨');

    let fruits = ['apple', 'banana', 'orange']
    const sendData = {
        name: "jio",
        fruits
    }
    res.render('index', sendData);
}); 

module.exports = router;
/*  
module.exports = {
    router
}
*/