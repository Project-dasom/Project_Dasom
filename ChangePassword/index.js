const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const config = require('/opt/nodejs/config/config.json');
const db = require('/opt/nodejs/models');

const sequelize = new Sequelize('config.database', 'config.username', 'config.password', {
    host: 'config.host',
    dialect: 'mysql'
  });

exports.handler = async (event) => {
    const{userId, newPw} = JSON.parse(event.body);

    try{
        // 기존 비밀번호 조회
        const result = await db.Member.findAll({
            attributes: ['userPw'],
            where: {
                userId: userId
            }
        });
        
        const currentHashedPw = result[0].userPw;
        console.log("currentHashedPw : ", currentHashedPw);

        // 기존 비밀번호와 새 비밀번호 비교
        const isMatch = await bcrypt.compare(newPw, currentHashedPw);

        // 새로운 비밀번호 사용 가능할 시
        if(isMatch){
            return {
                statusCode: 400,
                body: JSON.stringify({success:false, message: "이전 비밀번호는 사용할 수 없습니다"})
            };
        } else {
            // 새 비밀번호 암호화
            const salt = await bcrypt.genSalt(10);
            const hashPw = await bcrypt.hash(newPw, salt);

            // 새 비밀번호 업데이트
            await db.Member.update({
                userPw: hashPw,
            }, {
                where: { userId: userId },
            });

            return{
                statusCode: 200,
                body: JSON.stringify({success:true, message: "비밀번호가 성공적으로 변경되었습니다"})
            };
        }
    } catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error); // 서버 로그에 에러 기록
        return {
            statusCode: 500,
            body: JSON.stringify({success:false, message: "서버 오류가 발생했습니다" })
        }
    }
};
