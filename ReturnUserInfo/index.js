const pool = require('/opt/nodejs/db');  // DB 연결 Layer

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2)); // 요청 본문 로그 추가

    // API Gateway 경로 매개변수에서 userId 추출
    let userId = event.pathParameters && event.pathParameters.userId;
    console.log("Extracted userId:", userId); // userId 값 로그

    if (!userId) {
        console.log("Error: userId is not provided");
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: "userId가 제공되지 않았습니다." })
        };
    }

    try {
        const query = "SELECT userId, userName, userPhone, userBirthDate, created_at FROM member WHERE userId = ?";
        const values = [userId];

        console.log("Executing query:", query, "with values:", values); // 쿼리 실행 로그

        const [result] = await pool.promise().query(query, values); // 쿼리 실행

        console.log("Database query result:", result); // 쿼리 결과 로그

        if (result.length > 0) {
            const user = result[0];
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    userId: user.userId,
                    name: user.userName,
                    phone: user.userPhone,
                    birth: user.userBirthDate,
                    created_at: user.created_at,
                })
            };
        } else {
            console.log("Error: User not found");
            return {
                statusCode: 404,
                body: JSON.stringify({ success: false, message: "사용자를 찾을 수 없습니다." })
            };
        }
    } catch (error) {
        console.error("Error executing query:", error); // 쿼리 실행 오류 로그
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "서버 오류가 발생했습니다." })
        };
    }
};
