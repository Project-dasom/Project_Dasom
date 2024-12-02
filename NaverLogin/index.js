// 환경 변수 불러오기 구성(Configuration)->환경변수(Environment variables)
// const client_id = process.env.client_id;
// const state = process.env.state;
// const redirectURI = encodeURI(process.env.redirectURI);
// const api_url ="";
const client_id = "u9HzRMYMNpbm2ialM47b";
const client_secret = "UQroxZiZKt";
const state = "test"; //임의로 지정
const redirectURI = encodeURI("https://zev4wu0r0a.execute-api.ap-northeast-2.amazonaws.com/api/callback");
const api_url = "";


exports.handler = async (event) => {
    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}&state=${state}`;
    
    console.log('Generated API URL:', api_url);
    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            api_url: api_url
        })
    };
};
