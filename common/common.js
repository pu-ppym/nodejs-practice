const xss = require('xss');
const path = require('path');
const fs = require('fs');    // 기본 모듈, 설치x


const dateFormat = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}



const checkLogin = (req, res, isMust = true) => {
    let loginUserInfo = req.session.user;

    if(loginUserInfo == null) {  // 로그인 안함
        if(isMust) {
            alertAndGo(res, "로그인이 필요합니다.", "/member/login");
        }
        return null;
    }

    return loginUserInfo;
};

const alertAndGo = (res, msg, url) => {
    res.render('common/alert', {msg, url})
}

const isNumber = (n) => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);    // 정규 표현식 
};

const reqeustFilter = (data, type, isHtml, defaultvalue = null) => {
    switch (type) {
        case 0:     // 숫자만
            if(data != null) {
                let checkVal = data.replaceAll(',', '');
                if(!isNumber(checkVal)) {
                    throw "parameter is not number Error";
                }
            }
            break;
        case -1:     // 길이 제한 없음
            if(!isHtml) {
                data = xss(data);
            }
            break; 
        default:     // 길이 제한 있음
            if(type < data.length) {   
                throw "input length is too long";
            }

            if(!isHtml) {
                data = xss(data);
            }

            break;
    }

    if(data == null || data == '') {
        if(defaultvalue != null) {
            data = defaultvalue;
        } else {
            throw "input parameter not allow null";
        }
    }

    return data;
}

const pageNavigation = (printSize, page, pageSize, totalcount, url, params) => {
    let html = '';

    let totalPage = parseInt(totalcount / pageSize);
    if (totalcount % pageSize != 0) {
        totalPage++;
    }

    if (totalPage > 0 && page <= totalPage) {
        start = parseInt((page - 1) / printSize) * printSize + 1;
        end = start + (printSize - 1);

        if (end > totalPage) end = totalPage;

        html += '<nav aria-label="Page navigation ">';
        html += '   <ul class="pagination justify-content-center">';

        if (start > printSize) {
            let prevPage = start - 1;

            html += '       <li class="page-item">';
            html += '           <a class="page-link" href="' + url + '?page=' + prevPage + params + '" aria-label="Previous">';
            html += '               <span aria-hidden="true">&laquo;</span>';
            html += '           </a>';
            html += '       </li>';
        } else {
            html += '       <li class="page-item">';
            html += '           <a class="page-link disabled" href="' + url + '?page=1' + params + '" aria-label="Previous">';
            html += '               <span aria-hidden="true">&laquo;</span>';
            html += '           </a>';
            html += '       </li>';
        }

        let cnt = 1;
        for (let i = start; i <= end; i++) {
            if (page == i)
                html += '<li class="page-item active"><a class="page-link disabled" href="' + url + '?page=' + i + params + '">' + i + '</a></li>';
            else
                html += '<li class="page-item"><a class="page-link" href="' + url + '?page=' + i + params + '">' + i + '</a></li>';
            if (++cnt > printSize) break;
        }

        if (totalPage - start >= printSize) {
            let nextPage = start + printSize;
            html += '<li class="page-item">';
            html += '   <a class="page-link" href="' + url + '?page=' + nextPage + params + '" aria-label="Next">';
            html += '       <span aria-hidden="true">&raquo;</span>';
            html += '   </a>';
            html += '</li>';
        } else {
            html += '<li class="page-item">';
            html += '   <a class="page-link disabled" href="#" aria-label="Next">';
            html += '       <span aria-hidden="true">&raquo;</span>';
            html += '   </a>';
            html += '</li>';
        }

        html += '   </ul>';
        html += '</nav>';
    }

    return html;
}


const fileFilter = (req, file, callbackfuc) => {
    const filetype = /.jpg|.png|.gif/   // 정규식  /.zip/ 
    const extname = filetype.test(path.extname(file.originalname).toLowerCase());   // 원래 파일명의 확장자 가져오기, 소문자로 바꿈, true/false

    if(extname) {
        // 허용된 파일
        return callbackfuc(null, true);
    } else {
        // 허용 안된 파일
        return callbackfuc('Error: Image File Only');
    }

}

const getFileExtension = (filename) => {
    return '.' + filename.split('.').pop();

}

const moveFile = (sourceFile, targetFile) => {
    try {  // 파일관련 무적권 try, e.g 공간 부족할때 오류날수있음
        if(fs.existsSync(sourceFile)) {  // 파일 있을때만
            fs.renameSync(sourceFile, targetFile)
        }
    } catch (error) {
        throw 'moveFile Error';
    }
}


const deleteFile = (fileName) => {
    try {
        if(fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);   // sync  삭제할때까지 기달
        }
    } catch (error) {
        throw 'deleteFile Error';
    }
}


module.exports = {
    checkLogin,
    alertAndGo,
    reqeustFilter,
    dateFormat,
    pageNavigation,
    fileFilter,
    getFileExtension,
    moveFile,
    deleteFile
}