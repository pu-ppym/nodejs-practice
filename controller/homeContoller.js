const common = require('../common/common');

const home = ((req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res);  // req, res , false?
        if (loginUserInfo != null) {
            res.render('index', {loginUserInfo});     // 로그인정보가 있을때만 render
        }  

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    home
};