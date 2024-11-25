const pool = require('/opt/nodejs/db'); // DB 연결 Layer 

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));

    try {
        // 요청 본문에서 데이터 추출
        const { userId, sitNum, reserveDate, chargeTime } = JSON.parse(event.body);

        // 시작 시간과 종료 시간 계산
        const startDateTime = parseDate(reserveDate);
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + chargeTime); // chargeTime에 따라 종료 시간 설정

        console.log('예약 정보:', {
            userId,
            sitNum,
            reserveDate,
            startDateTime: formatDate(startDateTime),
            endDateTime: formatDate(endDateTime)
        });

        // 예약이 겹치는지 확인하는 쿼리
        const checkQuery = `
            SELECT * FROM reservation 
            WHERE sitNum = ? 
            AND reserveDate = ? 
            AND (
                (startTime < ? AND endTime > ?)  -- 겹치는 시간
             )
        `;

        // 쿼리 실행 (예약이 겹치는지 체크)
        const [rows] = await pool.promise().query(checkQuery, [
            sitNum, 
            reserveDate.split(' ')[0],  // 'YYYY-MM-DD' 형식으로만 비교
            formatDate(endDateTime),  // endTime
            formatDate(startDateTime), // startTime
        ]);

        // 중복 예약이 있을 경우 응답
        if (rows.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "좌석이 이미 예약되어 있습니다." })
            };
        }

        // SQL 쿼리 실행 (reservation 테이블에 데이터 삽입)
        const query = `
            INSERT INTO reservation (userId, sitNum, reserveDate, startTime, endTime)
            VALUES (?, ?, ?, ?, ?)
        `;

        // 데이터 삽입
        await pool.promise().query(query, [
            userId, 
            sitNum, 
            reserveDate, 
            formatDate(startDateTime), 
            formatDate(endDateTime)
        ]);

        // 성공 응답
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "성공" })
        };
    } catch (error) {
        console.error('예약 오류:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: '예약 중 오류가 발생했습니다.' })
        };
    }
};

// 날짜 파싱 함수
function parseDate(dateString) {
    // ISO 8601 형식 처리
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?$/;
    if (isoRegex.test(dateString)) {
        return new Date(dateString);
    }

    // YYYY-MM-DD HH:mm:ss 형식 처리
    const customDateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (customDateRegex.test(dateString)) {
        return new Date(dateString.replace(' ', 'T') + 'Z'); // UTC로 변환
    }

    // 잘못된 형식 처리
    throw new Error('잘못된 날짜 형식입니다.');
}

// 날짜 형식화 함수 (yyyy-MM-dd HH:mm:ss)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
