import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { useState, useEffect } from 'react';
import api from '../api/api';
import DatePicker from 'react-datepicker';

function ReservationInfo(props) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("id");
    
    const [tableInfo, setTableInfo] = useState([]);  
    const [filteredInfo, setFilteredInfo] = useState([]); // 필터링된 예약 정보를 위한 상태

    const [fetchReserve, setFetchReserve] = useState({
        startDate: null,
        endDate: null,
    });

    // 삭제 요청할 예약 정보 변수
    const [reserveInfo, setReserveInfo] = useState({
        userId: userId,
        reserveDate: null,
        startTime: null,
        endTime: null,
        sitNum: '',
    });

    const getReservationInfo = () => {
        api.get(`reservationInfo/${userId}`)
            .then(res => {
                setTableInfo(res.data);
                setFilteredInfo(res.data); // 초기 필터링 정보를 전체 예약으로 설정
                console.log(res.data);
            }).catch(e => {
                console.log(e);
                setFilteredInfo([]);
            });
    };

    const reqDeleteReservation = (deleteData) => {
        api.post(`reservationInfo/cancel`, { deleteData })
            .then(res => {
                alert('예약이 성공적으로 취소되었습니다.');
                getReservationInfo();
            })
            .catch(e => {
                console.error("Error during deletion:", e);
                alert("예약 취소에 실패했습니다. 서버에 문의하세요.");
            });
    };

    const handleCancel = (info) => {
        const confirmed = window.confirm("정말 취소하시겠습니까?");
    
        if (confirmed) {
            const formattedDeleteData = {
                userId: userId,
                id: info.id
                // reserveDate: new Date(info.reserveDate).toLocaleDateString('sv-SE'),
                // startTime: new Date(info.startTime).toLocaleString('sv-SE'),
                // endTime: new Date(info.endTime).toLocaleString('sv-SE'),
                // sitNum: info.sitNum,
            };

            setReserveInfo(formattedDeleteData);
            reqDeleteReservation(formattedDeleteData);
            setFetchReserve({ ...fetchReserve, startDate: null, endDate: null });
        }
    };

    const handleFilter = () => {
        const { startDate, endDate } = fetchReserve;
        if (startDate && endDate) {
            const filtered = tableInfo.filter(info => {
                const reserveDate = new Date(info.reserveDate);
                return reserveDate >= startDate && reserveDate <= endDate;
            });
            setFilteredInfo(filtered);
        } else {
            alert("시작 날짜와 종료 날짜를 선택하세요.");
        }
    };

    useEffect(() => {
        getReservationInfo();
    }, [userId]);

    useEffect(() => {
        setFetchReserve((prev) => ({ ...prev, endDate: null }));
    }, [fetchReserve.startDate]);

    return (
        <main className="my-page" style={{ flexDirection: 'column', padding: '20px' }}>            
            {isLoggedIn && (
                <div className="reservation-table">
                    <p className="sub-title" style={{ textAlign: 'left' }}>예약 정보</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <DatePicker
                            className="small-datepicker"
                            showIcon
                            selected={fetchReserve.startDate}
                            onChange={(date) => setFetchReserve({ ...fetchReserve, startDate: date })}
                        />
                        ~
                        <DatePicker
                            className="small-datepicker"
                            showIcon
                            selected={fetchReserve.endDate}
                            minDate={fetchReserve.startDate}
                            onChange={(date) => setFetchReserve({ ...fetchReserve, endDate: date })}
                        />
                        <CButton className="p-button" size="sm" style={{ width: '15%' }} onClick={handleFilter}>
                            조회
                        </CButton>
                    </div>                    
                    <div style={{
                        overflowY: 'auto', 
                        scrollbarWidth: 'none', 
                        maxHeight: '400px', 
                        width: '100%', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        margin: '0 auto',
                        marginTop: '20px', 
                        textAlign: 'left',
                    }}>
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">구분</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">날짜</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">사용 시간</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">좌석번호</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">좌석 유형</CTableHeaderCell>
                                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {(Array.isArray(filteredInfo) && filteredInfo.length === 0) 
                                ? <CTableRow>
                                    <CTableDataCell colSpan="6">예약 정보가 없습니다</CTableDataCell>
                                </CTableRow> 
                                : filteredInfo.map((info, index) => (  
                                    <CTableRow key={index}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        {/* <CTableDataCell>{new Date(info.reserveDate).toLocaleDateString('sv-SE')}</CTableDataCell>
                                        <CTableDataCell>
                                            {new Date(info.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(info.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </CTableDataCell> */}
                                        <CTableDataCell>
                                            {new Date(new Date(info.reserveDate).getTime() - 9 * 60 * 60 * 1000).toLocaleDateString('sv-SE')}
                                        </CTableDataCell>

                                        <CTableDataCell>
                                            {new Date(new Date(info.startTime).getTime() - 9 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - 
                                            {new Date(new Date(info.endTime).getTime() - 9 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </CTableDataCell>

                                        <CTableDataCell>{info.sitNum}번</CTableDataCell>
                                        <CTableDataCell>{(info.sitNum >= 1 && info.sitNum <= 20) ? `1인실(Common)` : 
                                            (info.sitNum >= 21 && info.sitNum <= 31) ? `고정석` : 
                                            (info.sitNum >= 32 && info.sitNum <= 48) ? `1인실(Private)` : ''}</CTableDataCell>
                                        <CTableDataCell>
                                            <a 
                                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                                onClick={() => handleCancel(info)}>
                                                취소
                                            </a>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))} 
                            </CTableBody>
                        </CTable>
                    </div>                    
                </div>
            )}
        </main>
    );
}

export default ReservationInfo;
