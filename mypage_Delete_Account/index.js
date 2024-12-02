const pool = require('/opt/nodejs/db'); // MySQL 연결 풀 (Layer에서 제공)

exports.handler = async (event) => {
    const { userId } = JSON.parse(event.body); // Lambda에서는 event.body가 문자열 형태로 오므로 파싱

    console.log(`userId : ${userId}`);

    try {
        // 회원탈퇴 쿼리
        const deleteUser = "DELETE FROM member WHERE userId = ?"; // 컬럼 이름 수정

        return new Promise((resolve, reject) => {
            pool.query(deleteUser, [userId], (error, results) => {
                if (error) {
                    console.error("쿼리 오류 발생:", error); // 더 상세한 오류 메시지 출력
                    reject({
                        statusCode: 500,
                        body: JSON.stringify({ success: false, message: "쿼리 실행 중 오류 발생", error: error.message }),
                    });
                    return;
                }

                console.log("회원탈퇴 성공 결과:", results); // 쿼리 실행 결과 확인

                // 결과가 없다면 해당 유저가 없다는 메시지로 처리할 수 있음
                if (results.affectedRows === 0) {
                    return reject({
                        statusCode: 404,
                        body: JSON.stringify({ success: false, message: "해당 유저를 찾을 수 없습니다." }),
                    });
                }

                console.log("회원탈퇴 성공");

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ success: true, message: "회원탈퇴 성공" }),
                });
            });
        });
    } catch (error) {
        console.error("회원탈퇴 실행 중 오류 발생:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "서버 오류가 발생했습니다", error: error.message }),
        };
    }
};
