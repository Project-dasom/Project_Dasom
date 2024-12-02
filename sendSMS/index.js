const coolsms = require('coolsms-node-sdk').default;
const messageService = new coolsms('NCSDAWEAZMUMP8PP', 'D44ZLKF2E0KH45VRTKJYHUQWDUISHDCA');

const verificationCodes = {}; // 인증 번호를 저장할 객체

exports.handler = async (event) => {
    const { userPhone } = JSON.parse(event.body); // event.body에서 전화번호 추출
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 랜덤 번호 생성
    console.log(`userPhone : ${userPhone}, verificationCode : ${verificationCode}`);

    verificationCodes[userPhone] = verificationCode; // 인증번호를 저장

    console.log(`code: ${verificationCodes[userPhone]}`, verificationCodes[userPhone]);

    try {
        const response = await messageService.sendOne({
            to: userPhone,
            from: "01054459617",
            text: `[다솜 스터디 카페] 인증번호\n${verificationCode}입니다`,
        });
        console.log("문자 메시지 전송 성공 : ", response);
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "문자 메시지가 성공적으로 전송되었습니다",
                code: verificationCodes[userPhone]
            })
        };
    } catch (error) {
        console.error("문자 메시지 전송 실패:", error); // 서버 로그에 에러 기록
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "문자 메시지 전송 중 오류 발생"
            })
        };
    }
};