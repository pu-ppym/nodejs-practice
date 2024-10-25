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

const getList = async(pageSize, page, search_key) => {
    try {
        let start = (page - 1) * pageSize;
        const sql = "select pkid, user_id, name, regdate from member where (user_id like ? or name like ?) order by pkid desc limit ?, ?";
        const param = ["%"+search_key+"%", "%"+search_key+"%", start, pageSize];

        const result = await db.runSql(sql, param);

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

const getTotalRecordCount = async (search_key) => {
    try {
        const sql = "select count(pkid) as cnt from member where (user_id like ? or name like ?)";
        const param = ["%"+search_key+"%", "%"+search_key+"%"];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0].cnt;
    } catch (error) {
        throw "SQL Query Error on getTotalRecordCount";
    }
}


const getUserIdCount = async (user_id) => {
    try {
        const sql = "select count(pkid) as cnt from member where user_id = ?";
        const param = [user_id];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0].cnt;
    } catch (error) {
        throw "SQL Query Error on getUserIdCount";
    }
}



module.exports = {
    loginCheck,
    getList,
    getData,
    getTotalRecordCount,
    getUserIdCount
}