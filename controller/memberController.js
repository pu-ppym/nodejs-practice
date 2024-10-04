const model = require('../model/memberModel');

const common = require('../common/common');

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

const loginProc = (async(req, res) => {
    try {
        let {user_id, user_pw} = req.body; // 알아서 매핑해줌?
        //console.log(user_id);
        //console.log(user_pw);
        
        // XSS 방지 -> 엄격하게
        user_id = common.reqeustFilter(user_id, 20, false);
        user_pw = common.reqeustFilter(user_pw, 20, false);


        const result = await model.loginCheck(user_id, user_pw);

        if(result != null) {
            // 로그인 ok
            req.session.user = {
                pkid: result.pkid,  // db 멤버 컬럼의 pkid
                user_id: result.user_id,
                user_name: result.name
            }

            common.alertAndGo(res, "로그인 되었습니다.", "/")

        } else {
            common.alertAndGo(res, "아이디 또는 비밀번호가 틀립니다.", "/member/login")
          
        }

        //res.send('처리페이지');
        
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});

module.exports = {
    list,
    login,
    loginProc
};