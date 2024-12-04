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
        const sql = "select pkid, fkmember, title, content, filepath, viewcount, regdate from board where pkid = ?";
        const param = [pkid];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on getData";
    }
}


const modifyBoard = async(title, content, filePath, originalname, pkid) => {
    try {
        const sql = "update board SET title = ?, content = ?, filepath = ?, originalname = ? where pkid = ?";
        const param = [title, content, filePath, originalname, pkid];

        await db.runSql(sql, param);

        console.log('수정');

    } catch (error) {
        throw "SQL Query Error on modifyBoard" + error;
    }
};


const getFileData = async(pkid) => {
    try {
        const sql = "select filepath, originalname from board where pkid = ?";
        const param = [pkid];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on getFileData";
    }
}


const deleteBoard = async(pkid) => {
    try {
        const sql = "delete from board where pkid = ?";
        const param = [pkid];

        await db.runSql(sql, param);

        console.log('삭제');

    } catch (error) {
        throw "SQL Query Error on deleteBoard" + error;
    }
};


const addViewCount = async(pkid) => {
    try {
        const sql = "update board SET viewcount = viewcount + 1 where pkid = ?";
        const param = [pkid];

        await db.runSql(sql, param);

        console.log('조회수 증가');

    } catch (error) {
        throw "SQL Query Error on addViewCount" + error;
    }
};


module.exports = {
    setBoard,
    getTotalRecordCount,
    getList,
    getData,
    modifyBoard,
    getFileData,
    deleteBoard,
    addViewCount
}