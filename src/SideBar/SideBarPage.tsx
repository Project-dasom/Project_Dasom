import React, {useState} from "react";

import '../App.css';

import { COffcanvas, COffcanvasBody } from '@coreui/bootstrap-react'
import Button from 'react-bootstrap/Button';

import LoginPage from "../Login/LoginPage";
import SignUpPage from "../SignUp/SignUpPage";
import ForgotUserPage from "../ForgotUser/ForgotUserPage";

interface LoginHandlerProps {
  onLogin: () => void;
}

const SideBarPage: React.FC<LoginHandlerProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [ renderPage, setRenderPage ] = useState<string>("login");

  function onChangePage(mode: string) {
    setRenderPage(mode);
  }

  function onLogin() {
    props.onLogin();
  }

  return (
    <>
      <Button onClick={() => setVisible(true)} variant="outline-dark m-2 p-0 px-2" className="b-button" style={{ borderRadius: '8px', borderWidth: '2px' }}>로그인</Button>
      <COffcanvas className="side-bar" placement="end" scroll={true} visible={visible} onHide={() => setVisible(false)}>
        <COffcanvasBody>
          {renderPage === "login" ? <LoginPage onChangePage={onChangePage} onLogin={onLogin}/> 
          :  renderPage === "signUp" ? <SignUpPage onChangePage={onChangePage}/>
          : <ForgotUserPage onChangePage={onChangePage}/>}
        </COffcanvasBody>
      </COffcanvas>
    </>
  )
};

export default SideBarPage;