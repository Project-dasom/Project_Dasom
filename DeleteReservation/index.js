const pool = require('/opt/nodejs/db');

exports.handler = async (event) => {
    const { userId, id } = JSON.parse(event.body).deleteData;
    console.log(event.body);
    try {
        // 유효한 값인지 확인
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid date/time or sitNum values provided.' })
            };
        }
        // 예약 취소 쿼리
        const query = `
            DELETE FROM reservation
            WHERE userId = ? AND id = ?;
        `;
        
        // 쿼리 실행
        const [results] = await pool.promise().query(query, [
            userId, id
        ]);

        // 결과 확인
        if (results.affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: '예약 정보가 존재하지 않습니다.' })
            };
        }

        // 예약 취소 성공
        return {
            statusCode: 200,
            body: JSON.stringify({ message: '예약이 성공적으로 취소되었습니다.' })
        };

    } catch (error) {
        console.error('예약 취소 중 오류 발생:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 오류가 발생했습니다.', error: error.message })
        };
    }
};
