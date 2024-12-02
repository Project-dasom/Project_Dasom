// MySQL 연결 풀
const pool = require('/opt/nodejs/db');

// Lambda 함수 핸들러
exports.handler = async (event) => {
    // 요청 바디에서 userId와 userPw를 파싱
    const { userId, userPw } = JSON.parse(event.body);

    try {
        // userId와 userPw가 모두 존재하는지 확인
        if (userId && userPw) {
            // SQL 쿼리 준비
            const query = "SELECT userId, userPw FROM member WHERE userId=?"; // 비밀번호는 나중에 비교
            const values = [userId];

            // 비동기 DB 쿼리 실행
            const [result] = await pool.promise().query(query, values);

            // 사용자가 존재하면 비밀번호 확인
            if (result.length > 0) {
                // 결과에서 비밀번호 추출
                const storedPassword = result[0].userPw;

                // bcrypt를 사용해 비밀번호 비교
                const bcrypt = require('bcryptjs');
                const isMatch = await bcrypt.compare(userPw, storedPassword);

                // 비밀번호가 일치하면 성공, 아니면 실패 반환
                if (isMatch) {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ success: true, message: "비밀번호 확인 성공" })
                    };
                } else {
                    return {
                        statusCode: 401,
                        body: JSON.stringify({ success: false, message: "비밀번호가 올바르지 않습니다" })
                    };
                }
            } else {
                // 아이디가 존재하지 않는 경우
                return {
                    statusCode: 404,
                    body: JSON.stringify({ success: false, message: "아이디가 존재하지 않습니다" })
                };
            }
        } else {
            // userId 또는 userPw가 없는 경우
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "아이디와 비밀번호를 모두 입력해 주세요" })
            };
        }
    } catch (error) {
        console.error("오류 발생:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "서버 오류가 발생했습니다" })
        };
    }
};
