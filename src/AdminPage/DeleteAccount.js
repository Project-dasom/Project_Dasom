import { useState } from 'react';
import api from '../api/api';
import {
  CForm,
  CCard,
  CCardBody,
  CCardText,
} from '@coreui/react';
import Button from 'react-bootstrap/Button';

function DeleteAccount(props) {
  const userId = props.userId; // 전달된 userId를 사용
  const [isAgreed, setIsAgreed] = useState(false); // 동의 여부 상태
  const [visible, setVisible] = useState(false); // 경고창 표시 여부

  // 회원 탈퇴 처리 함수
  const handleAccountDelete = () => {
    if (!isAgreed) {
      alert('탈퇴에 동의해주세요.');
      return;
    }

    const deleteData = { userId }; // 사용자 ID만 포함
    api
      .post('/deleteAccount', deleteData)
      .then((res) => {
        if (res.data.success) {
          alert('회원 탈퇴가 완료되었습니다.');
          props.setVisible(false);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('회원 탈퇴를 실패했습니다.');
      });
  };

  // 경고창 표시 함수
  const handleShowWarning = () => {
    setVisible(true);
  };

  // 폼 제출 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (visible) {
      handleAccountDelete(); // 경고창이 보이면 탈퇴 진행
    } else {
      handleShowWarning(); // 경고창을 표시
    }
  };

  return (
    <main className="delete-account">
      <div>
        <CForm className="mypage-form mt-5" style={{ width: '55%' }} onSubmit={handleSubmit}>
          {/* 경고창 */}
          {visible && (
            <CCard color="danger" textColor="white" className="mb-3 border-top-danger border-top-3">
              <CCardBody>
                <CCardText>
                  정말 탈퇴하시겠습니까? <br />
                  탈퇴 후 아이디 및 데이터를 복구할 수 없습니다. <br />
                  신중히 진행하시길 바랍니다.
                </CCardText>
                <CCardText>
                  <label className="mt-2">
                    <b style={{ marginRight: '5px' }}>
                      유의 사항을 모두 숙지하였고 동의합니다.
                    </b>
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={() => setIsAgreed(!isAgreed)}
                    />
                  </label>
                </CCardText>
              </CCardBody>
            </CCard>
          )}

          {/* 탈퇴 버튼 */}
          <Button
            type="submit"
            className="p-button"
            variant="mb-3 p-2 px-3"
            style={{ borderRadius: '7px', borderWidth: '2px', width: '100%' }}
          >
            {visible ? '회원 탈퇴 진행' : '회원 탈퇴 확인'}
          </Button>
        </CForm>
      </div>
    </main>
  );
}

export default DeleteAccount;
