const db = require('../common/db');


const setBoard = async(fkmember, title, content, filePath, originalname) => {
    try {
        const sql = "insert into board(fkmember, title, content, filepath, originalname) values (?, ?, ?, ?, ?)";
        const param = [fkmember, title, content, filePath, originalname];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on setBoard" + error;
    }
};

const getTotalRecordCount = async (search_key) => {
    try {
        const sql = "select count(b.pkid) as cnt from board b inner join member m on m.pkid = b.fkmember where b.pkid = b.pkid and (b.title like ? or b.content like ?) order by b.pkid desc";
        const param = ["%"+search_key+"%", "%"+search_key+"%"];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0].cnt;
    } catch (error) {
        throw "SQL Query Error on getTotalRecordCount";
    }
}

const getList = async(pageSize, page, search_key) => {
    try {
        let start = (page - 1) * pageSize;
        const sql = "select b.pkid, b.title, m.name, b.filepath, b.originalname, b.viewcount, b.regdate from board b inner join member m on m.pkid = b.fkmember where b.pkid = b.pkid and (b.title like ? or b.content like ?) order by b.pkid desc limit ?, ?";
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
        const sql = "select pkid, title, content, filepath, viewcount, reddate from board where pkid = ?";
        const param = [pkid];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on getData";
    }
}



module.exports = {
    setBoard,
    getTotalRecordCount,
    getList,
    getData
}