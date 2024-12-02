const { insertUser, hashPassword } = require("/opt/nodejs/query/");

exports.handler = async (event) => {
  const { userId, userPw, userName, userPhone, userBirthDate } = JSON.parse(event.body);

  try {
    if(!userId | !userPw | !userName | !userPhone | !userBirthDate){
        return {
            statusCode: 400,
            body: JSON.stringify({success:false, message: "빈칸이 없게 작성해 주세요"})
        };
    }

    // userBirthDate를 Date 객체로 변환한 후, ISO 형식의 날짜 문자열(YYYY-MM-DD)로 변환
    const birthDate = new Date(userBirthDate).toISOString().split('T')[0];

    // 비밀번호 암호화
    const hashPw = await hashPassword(userPw);

    // 데이터베이스에 정보 등록
    await insertUser(userId, hashPw, userName, userPhone, birthDate);

    return{
        statusCode: 200,
        body: JSON.stringify({success:true, message:"회원가입에 성공했습니다"})
    };

  } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      return {
          statusCode: 500,
          body: JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
      };
  }
};
