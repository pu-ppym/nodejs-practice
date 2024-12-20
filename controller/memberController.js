const model = require('../model/memberModel');
const common = require('../common/common');

const pageSize = 10;

const list = (async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {page, search_key} = req.query;
            page = common.reqeustFilter(page, 0, false, 1);   // 페이지요청 없을땐 기본 1페이지
            search_key = common.reqeustFilter(search_key, -1, false, "");   

            let totalRecord = await model.getTotalRecordCount(search_key);
            
            let list = await model.getList(pageSize, page, search_key);
            console.log(totalRecord);

            res.render('member/list', {loginUserInfo, list, search_key, page, pageSize, totalRecord});
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
    
});

// 회원관리 내용보기
const getView = (async (req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            // get 방식 데이터 받기
            let {pkid, page, search_key} = req.query;   // 받을게 많다
            console.log(pkid)

            pkid = common.reqeustFilter(pkid, 0, false);   
            page = common.reqeustFilter(page, 0, false, 1);   // 페이지요청 없을땐 기본 1페이지
            search_key = common.reqeustFilter(search_key, -1, false, "");   


            let viewData = await model.getData(pkid);   // 모델에 넘겨

            res.render('member/view', {loginUserInfo, viewData, page, search_key});     // view에 넘겨
        }  
    
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
        // post 방식의 데이터 받기
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

const getRegister = (req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            // get 방식 데이터 받기
            let {page, search_key} = req.query; 

            page = common.reqeustFilter(page, 0, false, 1);   // 페이지요청 없을땐 기본 1페이지
            search_key = common.reqeustFilter(search_key, -1, false, "");   

            res.render('member/register', {loginUserInfo, page, search_key});     // view에 넘겨
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}

const checkUserId = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let {user_id} = req.body;   
            
            
            user_id = common.reqeustFilter(user_id, 20, false);   
            let count = await model.getUserIdCount(user_id);   // 모델에 넘겨

            if(count == 0) {
                res.send('true');
            } else {
                res.send('false');
            }
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}


const registerProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let { user_id, user_pw, name } = req.body;

            // XSS 방지
            user_id = common.reqeustFilter(user_id, 20, false);
            user_pw = common.reqeustFilter(user_pw, 20, false);
            name = common.reqeustFilter(name, 50, false);

            const result = await model.insertData(user_id, user_pw, name);

            if (result != null) {
                common.alertAndGo(res, "등록 되었습니다.", "/member")
        
            } else {
                common.alertAndGo(res, "등록 실패", "/member/register")
            }

        }  
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}


const logout = async(req, res) => {
    try {
        const sessionId = req.sessionID; // 현재 세션 ID
        
        const result = await model.logout(sessionId);
        
        // 세션 종료
        req.session.destroy(err => {
            if (err) {
                console.error('세션 삭제 중 오류:', err);
                return res.status(500).send('로그아웃 처리 중 오류가 발생했습니다.');
            }
        });

        if (result != null) {
            common.alertAndGo(res, "로그아웃 되었습니다. ", "/member/login")
            //res.redirect('/member');
    
        } else {
            common.alertAndGo(res, "로그아웃 실패", "/member/register")
        }

    } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
        res.status(500).send('로그아웃 처리 중 오류가 발생했습니다.');
    }
}


const modifyMember = (async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            let {pkid, page, search_key} = req.query;
            let viewData = await model.getData(pkid);
            
            res.render('member/modify', { loginUserInfo, viewData, page, search_key });
    
        }
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});



const modifyMemberProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {pkid, user_id, user_pw, name} = req.body;

            console.log('수정 pkid: ', pkid);
            
            await model.modifyMember(user_id, user_pw, name, pkid);

            common.alertAndGo(res, "수정 되었습니다.", "/member/")
        }
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
        console.log(error);
    }
}



const deleteProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {pkid} = req.body;

            await model.deleteData(pkid);

            common.alertAndGo(res, "삭제 되었습니다.", "/member/")

        }
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
        console.log(error);
    }
}



module.exports = {
    list,
    login,
    loginProc,
    getView,
    getRegister,
    checkUserId,
    logout,
    modifyMember,
    modifyMemberProc,
    registerProc,
    deleteProc
};