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



module.exports = {
    list,
    register,
    registerProc
};