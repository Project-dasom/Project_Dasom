// index.js
const findUser = require("./query.js");

exports.handler = async (event) => {
    const {userBirthDate, userPhone} = JSON.parse(event.body);

    try {
        const birthDate = `${userBirthDate.slice(0, 4)}-${userBirthDate.slice(4, 6)}-${userBirthDate.slice(6, 8)}`;
        console.log("birthDate : ", birthDate);

        if(birthDate){
            const result = await findUser(birthDate, userPhone);

            if(result){ //아이디가 있을경우
                return{
                    statusCode: 200,
                    body: JSON.stringify({success:true, message : "조건에 맞는 아이디가 있습니다", userId:result})
                }
            } else { // 아이디가 없을경우
                return{
                    statusCode: 400,
                    body: JSON.stringify({success:false, message : "조건에 맞는 아이디가 없습니다"})
                }
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({success:false, message : "날짜를 형식에 맞게 입력해 주세요"})
            };
        }
    } catch (error) {
        console.error("오류 발생:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "서버 오류가 발생했습니다" })
        };
    }
};
