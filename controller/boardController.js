const model = require('../model/boardModel');
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

            res.render('board/list', {loginUserInfo, list, search_key, page, pageSize, totalRecord});
        }  
    
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

const registerProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {title, content} = req.body;
            let {filePath, originalname} = ['', ''];

            if(req.files[0] != null) {
                originalname = req.files[0].originalname;

                // 파일명 변경
                filePath = 'uploads/board/' + req.files[0].filename + common.getFileExtension(req.files[0].originalname);
                
                // 파일을 실제 변경해줌
                common.moveFile('uploads/board/' + req.files[0].filename, filePath); 
            }

            await model.setBoard(loginUserInfo.pkid, title, content, filePath, originalname);

            common.alertAndGo(res, "등록 되었습니다.", "/board/")

            
            //console.log(req.files[0].filename);   // 
            //console.log(req.files[0].originalname);
            //console.log(req.files[0].size);

            //console.log(title);
            //res.send('proc page');
            //res.end();
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}


// Rest-api용
const ajax = (req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            res.render('board/ajax', {loginUserInfo});     // view에 넘겨
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}

const getAjaxList = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {page, search_key} = req.query;
            page = common.reqeustFilter(page, 0, false, 1);   // 페이지요청 없을땐 기본 1페이지
            search_key = common.reqeustFilter(search_key, -1, false, "");   

            
            let list = await model.getList(pageSize, page, search_key);
            //console.log(totalRecord);

            //res.render('board/list', {loginUserInfo, list, search_key, page, pageSize, totalRecord});
            res.send(list);
            res.end();
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
}


// 공지사항 내용보기
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

            await model.addViewCount(pkid);  // 조회수

            let viewData = await model.getData(pkid);   // 모델에 넘겨

            

            res.render('board/view', {loginUserInfo, viewData, page, search_key});     // view에 넘겨
        }  
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});



// 수정
const modify = (async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {

            //console.log('테스트: ',loginUserInfo.pkid);
            let {pkid, page, search_key} = req.query;
            let viewData = await model.getData(pkid);
            

            if (loginUserInfo.pkid != viewData.fkmember) {
                common.alertAndGo(res, "잘못된 접근입니다.", "/board/")
            } else {
                res.render('board/modify', { loginUserInfo, viewData, page, search_key });
            }
    
        }
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
});


const modifyProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {pkid, title, content} = req.body;
            let {filePath, originalname} = ['', ''];
            
            let viewData = await model.getData(pkid);      
            if (loginUserInfo.pkid != viewData.fkmember) {     // 게시글 작성자랑 로그인한 멤버 확인
                common.alertAndGo(res, "잘못된 접근입니다.", "/board/")
            }
                
            
            let dbFileData = await model.getFileData(pkid);
            console.log("db파일:",dbFileData);
            filePath = dbFileData.filepath;
            originalname = dbFileData.originalname;

            
            if(req.files[0] != null) {
            const newFilePath = req.files[0].filename;
            console.log("새로운 파일 확인: ",newFilePath); 

                if (newFilePath) {   // 기존 파일과 다를때만
                    await common.deleteFile(filePath);     // 기존 파일 삭제
                    originalname = req.files[0].originalname;
                    filePath = 'uploads/board/' + req.files[0].filename + common.getFileExtension(req.files[0].originalname);
                    
                    common.moveFile('uploads/board/' + req.files[0].filename, filePath); 
                }
            }

            await model.modifyBoard(title, content, filePath, originalname, pkid);

            common.alertAndGo(res, "수정 되었습니다.", "/board/")
        }
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
        console.log(error);
    }
}


// 삭제
const deleteProc = async(req, res) => {
    try {
        let loginUserInfo = common.checkLogin(req, res); 
        if (loginUserInfo != null) {
            let {pkid} = req.body;

            let viewData = await model.getData(pkid);      
            if (loginUserInfo.pkid != viewData.fkmember) {     
                common.alertAndGo(res, "잘못된 접근입니다.", "/board/")
            }

            let dbFileData = await model.getFileData(pkid);

            await common.deleteFile(dbFileData.filepath);
            await model.deleteBoard(pkid);


            common.alertAndGo(res, "삭제 되었습니다.", "/board/")

        }
    
    } catch (error) {
        res.status(500).send('500 Error: ' + error);
        console.log(error);
    }
}



module.exports = {
    list,
    register,
    registerProc,
    ajax,
    getAjaxList,
    getView,
    modify,
    modifyProc,
    deleteProc
};