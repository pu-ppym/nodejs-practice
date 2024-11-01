const model = require('../model/boardModel');
const common = require('../common/common');

const list = ((req, res) => {
    try {
        res.render('board/list');
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});


const register = (req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            res.render('board/register', {loginUserInfo});     // view에 넘겨
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }

}

const registerProc = (req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {title, content} = req.body;
            
            console.log(req.files[0].filename);
            console.log(req.files[0].originalname);
    

            console.log(title);
            res.send('proc page');
            res.end();
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}



module.exports = {
    list,
    register,
    registerProc
};