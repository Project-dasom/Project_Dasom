import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import React, { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import MainPage from "./Main/MainPage"
import ChargeInfoPage from "./ChargeInfo/ChargeInfoPage";
import GalleryPage from "./Gallery/GalleryPage";
import MapPage from "./Map/MapPage";
import AnnouncementPage from "./Announcement/AnnouncementPage";
import ReservationPage from "./Reservation/ReservationPage";
import LoginPage from "./Login/LoginPage";
import SideBar from "./SideBar/SideBarPage";
import Footer from "./Footer/FooterPage";
import ProfileBar from "./ProfileBar/ProfileBar";
import MyPage from "./MyPage/MyPage";
import AdminPage from './AdminPage/AdminPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const getId = localStorage.getItem("id");
  const [shouldDisplayFooter, setShouldDisplayFooter] = useState<boolean>(true);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    }
  }, []);

  //로그인 핸들러
  const loginHandler = (): void => {    
    localStorage.setItem("isLoggedIn", "1");
    // 로그인 되었을 때 State를 true로 업데이트
    setIsLoggedIn(true);
    window.location.href = '/';
  };

  //로그아웃 핸들러
  const logoutHandler = () => {
    console.log('logout', getId);
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("isLoggedIn");    
    localStorage.removeItem("naver");
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="App">
        <header>
          <nav className="nav-bar">
            <ul>
              <li>
                <Link to="/">
                <div className="logo1"></div>
                </Link>
              </li>
              <li>
                <Link to="/" className="btn btn-header">
                <span>홈</span>
                </Link>
              </li>
              <li>
                <Link to="/chargeinfo" className="btn btn-header">
                <span>이용 요금 및 이용 안내</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="btn btn-header">
                <span>갤러리</span>
                </Link>
              </li>              
              <li>
                <Link to="/announcement" className="btn btn-header">
                <span>공지사항</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="btn btn-header">
                <span>오시는 길</span>
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="btn btn-header" 
                  onClick={(e) => {
                    if(!isLoggedIn) {
                      alert("로그인을 해주세요");
                      window.location.href = '/';
                    }
                  }}>
                <span>예약하기</span>
                </Link>
              </li>
              <li>
                {!isLoggedIn && <SideBar onLogin={loginHandler} />}
                {isLoggedIn && <ProfileBar onLogout={logoutHandler} />}
              </li>              
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/chargeinfo" element={<ChargeInfoPage/>}/>
          <Route path="/gallery" element={<GalleryPage/>}/>
          <Route path="/map" element={<MapPage/>}/>
          <Route path="/announcement" element={<AnnouncementPage/>}/>
          <Route path="/reservation" element={<ReservationPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route 
            path="/mypage" 
            element={
              getId === 'admin' ? (
                <AdminPage onLogout={logoutHandler} setShouldDisplayFooter={setShouldDisplayFooter} />
              ) : (
                <MyPage onLogout={logoutHandler} setShouldDisplayFooter={setShouldDisplayFooter} />
              )
            }
          />
        </Routes>
      </div>

      {shouldDisplayFooter && (
        <footer className="App">
          <Footer />
        </footer>
      )}

      {/* <footer className="App">
        <Footer></Footer>
      </footer> */}

    </Router>
  );
}

export default App;
