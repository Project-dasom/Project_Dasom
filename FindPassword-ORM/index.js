const Sequelize = require('sequelize');
const config = require('/opt/nodejs/config/config.json');
const db = require('/opt/nodejs/models');

const sequelize = new Sequelize('config.database', 'config.username', 'config.password', {
    host: 'config.host',
    dialect: 'mysql'
});

exports.handler = async (event) => {
    const { userId, userPhone } = JSON.parse(event.body);

    try {
        // 아이디와 폰번호로 맞는 아이디 찾기
        const result = await db.Member.findOne({
            atrributes: ['userId'],
            where: { userId: userId, userPhone: userPhone }
        });
        console.log("result : ", result)

        if (!result) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "조건에 맞는 아이디가 없습니다" })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: "조건에 맞는 아이디가 있습니다", userId: result.userId })
            };
        };
    } catch (error) {
        console.error("비밀번호 찾기 사용자 정보 확인 중 오류 발생:", error); // 서버 로그에 에러 기록
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "서버 오류가 발생했습니다" })
        }
    }
};
