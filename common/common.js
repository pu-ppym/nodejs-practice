const xss = require('xss');

const checkLogin = () => {

};

const alertAndGo = (res, msg, url) => {
    res.render('common/alert', {msg, url})
}

const isNumber = (n) => {
    return /^-?[\d.] + (?:e-?\d+)?$/.test(n);    // 정규 표현식 
};

const reqeustFilter = (data, type, isHtml, defaultvalue = null) => {
    switch (type) {
        case 0:     // 숫자만
            let checkVal = data.replaceAll(',', '');
            if(!isNumber(checkVal)) {
                throw "parameter is not number Error";
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

module.exports = {
    checkLogin,
    alertAndGo,
    reqeustFilter
}