const db = require('../common/db');

const loginCheck = (async(user_id, user_pw) => {
    try {
        const sql = "select pkid, user_id, user_pw, name from member where user_id = ? and user_pw = ?";
        const param = [user_id, user_pw];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on loginCheck";
    }
});

const getList = async() => {
    try {
        const sql = "select pkid, user_id, name, regdate from member order by pkid desc";
        
        const result = await db.runSql(sql);

        console.log(result);

        return result;    // result[0]은 첫번째꺼만 날라가니까
    } catch (error) {
        throw "SQL Query Error on getList";
    }
}

const getData = async(pkid) => {
    try {
        const sql = "select pkid, user_id, name, regdate from member where pkid = ?";
        const param = [pkid];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on getData";
    }
}


module.exports = {
    loginCheck,
    getList,
    getData
}