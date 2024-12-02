const requestIp = require('request-ip');
const bcrypt = require('bcryptjs');
const pool = require('/opt/nodejs/db');
let fetch;  // 동적 import를 위한 변수

// 환경 변수 사용 권장 (API 키 및 URI 등)
const client_id = "u9HzRMYMNpbm2ialM47b";
const client_secret = "UQroxZiZKt";
const state = "test"; // 임의로 지정
const redirectURI = encodeURI("https://zev4wu0r0a.execute-api.ap-northeast-2.amazonaws.com/api/callback");

exports.handler = async (event) => {
  if (!fetch) {
    // 동적으로 node-fetch 불러오기
    fetch = (await import('node-fetch')).default;
  }
  const { code, state } = event.queryStringParameters;  // 쿼리 파라미터에서 code와 state 추출
  const ip_address = requestIp.getClientIp(event);  // 클라이언트 IP 주소 추출

  try {
    // 액세스 토큰을 요청할 URL 생성
    const api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;
    console.log('토큰 요청 URL:', api_url);

    // 네이버 API에서 액세스 토큰 요청
    const response = await fetch(api_url, { method: 'POST' });

    // 응답 상태 체크
    if (!response.ok) {
      console.error('토큰 불러오기 실패:', response.status);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          message: "토큰을 가져오지 못했습니다"
        })
      };
    }

    const tokenRequest = await response.json();  // 응답 JSON 파싱

    // access_token 존재 여부 체크
    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;  // access_token 추출
      const apiUrl = "https://openapi.naver.com/v1/nid/me";  // 사용자 정보 요청 URL

      // 사용자 정보 요청
      const data = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // 응답 상태 체크
      if (!data.ok) {
        console.error('데이터 불러오기 실패:', data.status);
        return {
          statusCode: data.status,
          body: JSON.stringify({
            success: false,
            message: "사용자 데이터를 가져오지 못했습니다"
          })
        };
      }

      const userData = await data.json();  // 사용자 정보 JSON 파싱

      // 사용자 데이터 추출
      const { id, name, mobile, birthday, birthyear } = userData.response;
      const userbirthDate = `${birthyear}-${birthday}`;  // 생년월일 변환
      const userPhone = mobile.replace(/-/g, '');  // 핸드폰 번호 변환

      // 사용자 존재 여부 확인
      const Checkquery = "SELECT * FROM member WHERE userId = ?";
      const [result] = await pool.promise().query(Checkquery, [id]);

      // member 테이블에 id가 없을 경우 회원가입
      if (result.length === 0) {
        const pw = userPhone;  // 핸드폰 번호를 임시 비밀번호로 사용

        // 비밀번호 암호화
        const salt = await bcrypt.genSalt(10);
        const hash_pw = await bcrypt.hash(pw, salt);

        const Insertquery = `INSERT INTO member (userId, userPw, userName, userPhone, userBirthDate, created_at)
                             VALUES(?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
        const Insertvalues = [id, hash_pw, name, userPhone, userbirthDate];

        await pool.promise().query(Insertquery, Insertvalues);  // DB에 사용자 정보 저장
      }

      // 로그인 기록
      const historyquery = `INSERT INTO login_history (userId, ip_address, history)
                            VALUES (?, ?, CURRENT_TIMESTAMP)`;
      const historyvalues = [id, ip_address];
      await pool.promise().query(historyquery, historyvalues);  // 로그인 기록 저장

      // 클라이언트로 응답
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",  // UTF-8 인코딩을 명시
          "Access-Control-Allow-Origin": "https://dasomstudy.site",  // 클라이언트 도메인 허용
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: `
          <script>
              const userData = ${JSON.stringify(userData)};
              window.opener.postMessage({ userData: userData }, 'https://dasomstudy.site');
              window.close();
          </script>
        `
      };
      
    } else {
      console.error('access_token이 없습니다:', tokenRequest);
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "access_token이 없습니다"
        })
      };
    }

  } catch (error) {
    console.log("네이버 로그인중 오류 발생", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "네이버 로그인중 서버 오류 발생"
      })
    };
  }
};
