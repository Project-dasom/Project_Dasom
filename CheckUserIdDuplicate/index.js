const Sequelize = require('/opt/nodejs/node_modules/sequelize');
const db = require('/opt/nodejs/models');  // 모델 파일을 불러옵니다.
const config = require('/opt/nodejs/config/config.json');  // config 파일을 불러옵니다.

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
});

exports.handler = async (event) => {
  try {
    const userId = event.pathParameters?.userId;
    console.log(`userId: ${userId}`);

    const member = await db.Member.findOne({ where: { userId: userId } });

    if (!member) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: '사용 가능한 아이디입니다' }),
      };
    } else {   
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: '사용 불가능한 아이디입니다' }),
      };
    }
  } catch (error) {
    console.error('중복 체크 중 오류 발생:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: '아이디 찾기 중 오류 발생' }),
    };
  }
};
