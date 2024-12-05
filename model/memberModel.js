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


const insertData = async(user_id, user_pw, name) => {
    try {
        const sql = "insert into member(user_id, user_pw, name) values (?, ?, ?);";
        const param = [user_id, user_pw, name];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result;
    } catch (error) {
        throw "SQL Query Error on insertData";
    }
}


const logout = async(sessionId) => {
    try {
        const sql = "DELETE FROM sessions WHERE session_id = ?";
        const param = [sessionId];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result;
    } catch (error) {
        throw "SQL Query Error on logout";
    }
}



const modifyMember = async(user_id, user_pw, name, pkid) => {
    try {
        const sql = "update member SET user_id = ?, user_pw = ?, name = ? where pkid = ?";
        const param = [user_id, user_pw, name, pkid];

        await db.runSql(sql, param);

        console.log('회원 수정');

    } catch (error) {
        throw "SQL Query Error on modifyMember" + error;
    }
};


const deleteData = async(pkid) => {
    try {
        const sql = "delete from member where pkid = ?";
        const param = [pkid];

        await db.runSql(sql, param);

        console.log('회원 삭제');

    } catch (error) {
        throw "SQL Query Error on deleteData" + error;
    }
};



module.exports = {
    loginCheck,
    getList,
    getData,
    getTotalRecordCount,
    getUserIdCount,
    insertData,
    logout,
    modifyMember,
    deleteData
}