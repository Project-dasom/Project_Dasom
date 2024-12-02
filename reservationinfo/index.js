const pool = require('/opt/nodejs/db');

exports.handler = async (event) => {
    const { userId } = event.pathParameters; // URL 파라미터에서 userId 추출

    try {

        // 예약 정보 조회 쿼리
        const query = `
            SELECT id, userId, sitNum, reserveDate, startTime, endTime
            FROM reservation
            WHERE userId = ?;
        `;
        
        // 쿼리 실행
        const [results] = await pool.promise().query(query, [userId]);

        // 예약 정보가 없으면 404 오류 반환
        if (results.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ success: false, message: '해당 사용자의 예약 정보를 찾을 수 없습니다.' })
            };
        }

        // 예약 정보가 존재하면 200 반환
    return {
        statusCode: 200,
        body: JSON.stringify(results),  // results만 그대로 반환
      };

    } catch (error) {
        console.error('예약 조회 중 오류 발생:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 오류가 발생했습니다.' })
        };
    }
};
