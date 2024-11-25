const bcrypt = require('bcryptjs');
const pool = require('/opt/nodejs/db');
const requestIp = require('request-ip');
const { Insert }  = require('/opt/nodejs/query');

console.log("Insert : ", {Insert});

exports.handler = async (event) => {
    const { userId, userPw } = JSON.parse(event.body);
    // IP 주소 가져오기
    const ip_address = requestIp.getClientIp(event);

    try {
        // 사용자 정보 조회 (비밀번호는 해시로 저장됨)
        const query = 'SELECT userPw, userName FROM member WHERE userId = ?'
        const values = [userId]
        const [result] = await pool.promise().query(query, values);

        // 아이디 없음
        if(result.length === 0){
          return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: "조건에 맞는 아이디가 없습니다" }),
          };
        }
        // 아이디 있음
        if (result.length > 0) {
            const user = result[0];

            // 입력한 비밀번호와 데이터베이스에 저장된 해시된 비밀번호 비교
            const isMatch = await bcrypt.compare(userPw, user.userPw);
            console.log('isMatch: ', isMatch)

            // 로그인 성공
            if (isMatch) {
                await Insert.insertLoginHistory(userId, ip_address);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ success: true, message: "로그인 성공", name: user.userName, id: userId }),
                  }
            } else {
                return {
                  statusCode: 401,
                  body: JSON.stringify({ success: false, message: "비밀번호가 일치하지 않습니다" }),
                };
            }
        }
    } catch (error) {
        console.error("로그인 실행중 오류 발생:", error); // 서버 로그에 에러 기록
        return {
          statusCode: 500,
          body: JSON.stringify({ success: false, message: "서버 오류가 발생했습니다" }),
        };
      }
};
