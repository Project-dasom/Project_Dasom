# VS Code 설치
=> https://code.visualstudio.com/
설치 관련된 건 인터넷에 더 정확히 나와있을 것 같아서 참고바랍니다

# node.js 설치
=> https://nodejs.org/en

# 깃허브 파일 받으신 후(.zip)
**'Code버튼->Download Zip'**

## VS Code 열어서 
**'File->Open Folder->dasom-study-cafe'**

## Ctrl+` (터미널창 열기)
**경로 확인** \frontend\dasom-study-cafe>\
dasom-study-cafe>로 끝나야 합니다

## `npm i`  (패키지 설치)
안 되면 `npm config set legacy-peer-deps true`를 먼저하고 npm i를 해주세요

# 1. 프로덕션 버전 실행
## `npm install -g serve`   (테스트용 서버 설치)
## `serve -s build` (실행)
까지 해주시면 'serve'라는 테스트용 웹서버가 구동되면서 접속 가능합니다
## nginx 구동 시 'build'폴더 내부의 'index.html'을 사용하시면 됩니다
.conf 내부에 location의 root는 build폴더를, index는 index.html로 하면 된다고 합니다(오류나면 수정하겠습니다)

# 2. 개발 버전 실행
## `npm start` (실행)
까지 해주시면 됩니당
언제나 실행할 때에는 `npm start`를 해주세요!

## 코드 파일 경로는 `/src` 밑에 있고, 폴더마다 js파일을 생성해놓았습니다
가장 기본이 되는 메인 파일은 `App.js`입니다
=======
# Project_Dasom