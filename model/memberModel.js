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

module.exports = {
    loginCheck
}