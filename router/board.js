const common = require('../common/common');
const express = require('express');
const router = express.Router();
const controller = require('../controller/boardController');


// upload file 처리를 위해
const multer = require('multer');
const upload = multer({
    // 저장 장소
    dest: 'uploads/board/',
    // 용량 제한
    limits: {
        fileSize: 1000000000, // 100MB ==> 1byte * 1kbyte => 1024byte
    }, 
    // 업로드 하는 파일 유형을 제한함
    fileFilter: common.fileFilter,     // 정상일때 여기로 fileFilter에서 
});


router.get('/', controller.list);

router.get('/register', controller.register);

router.post('/register', upload.array('attach_file'), controller.registerProc);   //upload.single 첨부파일 한개  , form 에서 지정한 필드이름 attach_file


///Rest-api 용
router.get('/ajax', controller.ajax);
router.get('/getAjaxList', controller.getAjaxList);




module.exports = router;