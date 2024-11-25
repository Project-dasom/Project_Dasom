const bcrypt = require('bcryptjs');
const pool = require('/opt/nodejs/db'); // RDS 연결 풀

exports.handler = async (event) => {
    const { userId, currentPw, newPw } = JSON.parse(event.body);

    try {
        // 1. 현재 비밀번호 확인
        const query = "SELECT userPw FROM member WHERE userId = ?";
        const values = [userId];
        const [result] = await pool.promise().query(query, values);

        if (result.length === 0) {
            // 사용자가 존재하지 않는 경우
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "사용자가 존재하지 않습니다." })
            };
        }

        const currentHashedPw = result[0].userPw;

        // 2. 현재 비밀번호와 입력된 비밀번호 비교
        const isMatch = await bcrypt.compare(currentPw, currentHashedPw);

        if (!isMatch) {
            // 비밀번호가 일치하지 않으면
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "현재 비밀번호가 일치하지 않습니다." })
            };
        }

        // 3. 새 비밀번호와 확인 비밀번호가 일치하는지 확인
        if (newPw === currentPw) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "새 비밀번호는 기존 비밀번호와 다르게 설정해야 합니다." })
            };
        }

        // 4. 새 비밀번호 암호화
        const salt = await bcrypt.genSalt(10);
        const hash_pw = await bcrypt.hash(newPw, salt);

        // 5. 새 비밀번호 업데이트
        const updateQuery = "UPDATE member SET userPw = ? WHERE userId = ?";
        const updateValues = [hash_pw, userId];
        await pool.promise().query(updateQuery, updateValues);

        // 비밀번호 변경 성공
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "비밀번호가 성공적으로 변경되었습니다." })
        };
        
    } catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error); // 서버 로그에 에러 기록
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "서버 오류가 발생했습니다." })
        };
    }
};
