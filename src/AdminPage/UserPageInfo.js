import api from '../api/api';
import { useState, useEffect } from 'react';
import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CCard, CCardHeader, CNav, CNavItem, CNavLink, CCardBody, CCardText } from '@coreui/react';
import LoginHistory from './LoginHistory';
import ReservationInfo from './ReservationInfo';
import DeleteAccount from './DeleteAccount';
import { FaSort } from "react-icons/fa6";
import { FaTimes } from 'react-icons/fa';

function UserPageInfo(props) {
    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [tableInfo, setTableInfo] = useState([]);
    const [visible, setVisible] = useState(false);
    const [userInfo, setUserInfo] = useState([]);

    const [activeTab, setActiveTab] = useState(1);  // 1: login_history, 2: reservation_info, 3: delete_account

    const [sortKey, setSortKey] = useState('userName');  // 기본 정렬 기준은 '이름'
    const [sortOrder, setSortOrder] = useState('asc');  // 기본 정렬 순서는 오름차순

    useEffect(() => {
        if (isLoggedIn) {
            // api.get(`/signUp/checkId/${userId}`)
            api.get(`/admin_page/${userId}`)
                .then(res => {
                    if(res.data.success) {
                        console.log(res.data.result);
                        setTableInfo(res.data.result);
                        setLoading(false);
                    }
                    else {
                        console.log(res.data.result);
                        setTableInfo([]);
                        setError('데이터를 가져오는 데 문제가 발생했습니다.');
                        setLoading(false);
                    }
                    
                })
                .catch(error => {
                    setTableInfo([]);
                    setError('데이터를 가져오는 데 문제가 발생했습니다.');
                    setLoading(false);
                });
        }
    }, [isLoggedIn, userId]);

    // 데이터 정렬 함수
    const sortData = (key) => {
        const newSortOrder = (sortKey === key && sortOrder === 'asc') ? 'desc' : 'asc';  // 동일한 컬럼 클릭 시 내림차순으로 변경
        setSortKey(key);
        setSortOrder(newSortOrder);

        const sortedData = [...tableInfo].sort((a, b) => {
        // 날짜 값인 경우
        if (key === 'created_at' || key === 'history') {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);

            // 날짜 비교
            if (dateA < dateB) return newSortOrder === 'asc' ? -1 : 1;
            if (dateA > dateB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
        }

        // 날짜가 아닌 다른 값에 대해서는 기본적인 비교 (숫자나 문자열)
        if (a[key] < b[key]) return newSortOrder === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return newSortOrder === 'asc' ? 1 : -1;
        return 0;
    });

        setTableInfo(sortedData);
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleUserInfo = (info) => {
        setVisible(true);
        setUserInfo(info);
        console.log(info);
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);  // 클릭한 탭으로 상태 변경
      };

    return (
        <main className="my-page" style={{ flexDirection: 'column', padding: '20px' }}>
            <div className="my-page-info" style={{ height: '70vh' }}>
                <p className="sub-title" style={{textAlign: 'left'}}>회원 정보</p>
                { (visible === false && isLoggedIn && userId === 'admin') &&
                    <CTable style={{ width: '100%' }}>
                        <CTableHead>
                            <CTableRow color="light">
                                <CTableHeaderCell scope="col" style={{ width: '8%' }} onClick={() => sortData('id')}>구분</CTableHeaderCell>
                                <CTableHeaderCell scope="col" style={{ cursor: 'pointer', width: '12%' }} onClick={() => sortData('userName')}>이름<FaSort/></CTableHeaderCell>
                                <CTableHeaderCell scope="col" style={{ 
                                    cursor: 'pointer', 
                                    maxWidth: '10%', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap' 
                                }}  onClick={() => sortData('userId')}>ID<FaSort/></CTableHeaderCell>
                                <CTableHeaderCell scope="col" style={{ cursor: 'pointer', width: '18%' }} onClick={() => sortData('created_at')}>가입일자<FaSort/></CTableHeaderCell>
                                <CTableHeaderCell scope="col" style={{ cursor: 'pointer', width: '25%' }} onClick={() => sortData('userPhone')}>전화번호<FaSort/></CTableHeaderCell>
                                <CTableHeaderCell scope="col" style={{ cursor: 'pointer', width: '35%' }} onClick={() => sortData('history')}>마지막 로그인 시각<FaSort/></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>

                        <CTableBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {(Array.isArray(tableInfo) && tableInfo.length === 0) 
                            ? <CTableRow>
                                <CTableDataCell colSpan="6">회원 정보가 없습니다</CTableDataCell>
                            </CTableRow> 
                            : tableInfo.map((info, index) => (  
                                <CTableRow key={index}>
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell>{info.userName}</CTableDataCell>
                                    <CTableDataCell>
                                        <a 
                                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                            onClick={() => handleUserInfo(info)}>
                                            {info.userId}
                                        </a>
                                    </CTableDataCell>
                                    <CTableDataCell>{new Date(info.created_at).toLocaleDateString('sv-SE')}</CTableDataCell>
                                    <CTableDataCell>
                                        {info.userPhone ? info.userPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '-'}
                                    </CTableDataCell>
                                    <CTableDataCell>{
                                        info.history ? 
                                        new Date(info.history).toLocaleDateString('sv-SE') + ' ' + 
                                        new Date(info.history).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                            .replace(/AM/, '오전').replace(/PM/, '오후') : 
                                        '-'
                                    }
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                }
                {   (visible === true && isLoggedIn && userId === 'admin' && Object.keys(userInfo).length > 0) &&
                    <CCard className="text-center p-3" style={{ height: '100%' }}>
                        <h1 className="sub-title active p-2" style={{ textAlign: 'left' }}>
                            {userInfo.userName}
                        </h1>
                        <CCardHeader style={{ backgroundColor: '#00AF50' }}>
                            <CNav variant="tabs" className="card-header-tabs d-flex justify-content-start">
                            <CNavItem className="p-button">
                                <CNavLink 
                                    style={{
                                        color: activeTab === 1 ? 'black' : 'white'  // 로그인 기록 탭만 흰색 글씨로 적용
                                    }} href="#" active={activeTab === 1} onClick={() => handleTabClick(1)}>
                                    로그인 기록
                                </CNavLink>
                            </CNavItem>
                            <CNavItem className="p-button">
                                <CNavLink style={{
                                        color: activeTab === 2 ? 'black' : 'white'  // 로그인 기록 탭만 흰색 글씨로 적용
                                    }} href="#" active={activeTab === 2} onClick={() => handleTabClick(2)}>
                                    예약 정보
                                </CNavLink>
                            </CNavItem>
                            <CNavItem className="p-button">
                                <CNavLink style={{
                                        color: activeTab === 3 ? 'black' : 'white'  // 로그인 기록 탭만 흰색 글씨로 적용
                                    }} href="#" active={activeTab === 3} onClick={() => handleTabClick(3)}>
                                    회원 관리
                                </CNavLink>
                            </CNavItem>
                            </CNav>

                            <CButton 
                                className="close-btn" 
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontSize: '20px',
                                    color: 'black'
                                }}

                                onClick={() => setVisible(false)}
                            >
                                <FaTimes />
                            </CButton>
                        </CCardHeader>
                        <CCardBody style={{ maxHeight: '100%', overflowY: 'auto' }}>
                            {activeTab === 1 && (
                                <LoginHistory userId={userInfo.userId}/>
                            )}
                            {activeTab === 2 && (
                                <ReservationInfo userId={userInfo.userId}/>
                            )}
                            {activeTab === 3 && (
                                <DeleteAccount userId={userInfo.userId}/>
                            )}
                        </CCardBody>
                    </CCard>                 
                }                
            </div>
        </main>        
    )
}
export default UserPageInfo;