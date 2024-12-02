// query.js
const pool = require('/opt/nodejs/db');

async function findUser(userId, userPhone){
    const query = "SELECT userId FROM member WHERE userId=? AND userPhone=?";
    const values = [userId, userPhone];
    console.log(`userId : ${userId}, userPhone : ${userPhone}`);

    try {
        const [results] = await pool.promise().query(query, values);
        // 아이디가 없을경우
        if(results.length === 0) {
            return null;
        } else { // 아이디가 있을경우
            return results[0].userId;
        }

    } catch (error) {
        console.log("아이디 찾기 쿼리중 오류", error);
        throw error;
    }; 
};

module.exports = findUser;