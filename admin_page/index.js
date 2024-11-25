const pool = require('/opt/nodejs/db'); // 데이터베이스 연결 객체

exports.handler = async (event) => {
    const id = event.pathParameters?.userId; // URL 경로에서 id 추출

    // 관리자만 접근 가능하도록 조건 설정
    if (id !== "admin") {
        console.error('Access denied: not admin');
        return {
            statusCode: 403,
            body: JSON.stringify({ success: false, message: '관리자만 접근 가능합니다.' }),
        };
    }

    try {
        // 관리자 요청 시 회원 정보와 로그인 이력을 조회하는 쿼리
        console.log('djeldi')
        const query = `
            SELECT 
                m.userId, 
                m.userName, 
                m.userPhone, 
                m.created_at, 
                lh.history
            FROM member m
            LEFT JOIN login_history lh 
                ON m.userId = lh.userId
                AND lh.history = (
                    SELECT MAX(history)
                    FROM login_history
                    WHERE userId = m.userId
                );
        `;

        // 데이터베이스 쿼리 실행
        const [results] = await pool.promise().query(query);
        console.log('!!!!!!!!!!!!!!!!!!!!', results)

        // 조회된 결과가 없을 때 처리
        if (results.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: false, result: [] }),
            };
        }

        // 결과가 있을 경우 데이터 반환
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, result: results }),
        };

    } catch (error) {
        console.error('Error during query execution:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: '서버 오류가 발생했습니다.' }),
        };
    }
};
