import { useState, useEffect } from 'react';
import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { CWidgetStatsA } from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';
import api from '../api/api';

function ReservationInfo(props) {
    const userId = props.userId;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reserveInfo, setReserveInfo] = useState({
        userId: userId,
        reserveDate: null,
        startTime: null,
        endTime: null,
        sitNum: '',
    });

    const [tableInfo, setTableInfo] = useState([]); 

    const [chartData, setChartData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            { label: '1인실(Common)', backgroundColor: 'rgba(255, 255, 255, 1)', data: Array(7).fill(0), stack: 'stack1' },
            { label: '고정석', backgroundColor: 'rgba(255, 255, 0, 1)', data: Array(7).fill(0), stack: 'stack1' },
            { label: '1인실(Private)', backgroundColor: 'rgba(75, 192, 192, 1)', data: Array(7).fill(0), stack: 'stack1' },
        ]
    });

    const updateChartData = (data) => {
        const updatedData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: '1인실(Common)', backgroundColor: 'rgba(255, 255, 255, 1)', data: Array(7).fill(0), stack: 'stack1' },
                { label: '고정석', backgroundColor: 'rgba(255, 255, 0, 1)', data: Array(7).fill(0), stack: 'stack1' },
                { label: '1인실(Private)', backgroundColor: 'rgba(75, 192, 192, 1)', data: Array(7).fill(0), stack: 'stack1' },
            ]
        };

        data.forEach(reservation => {
            const reserveDate = new Date(reservation.reserveDate);
            const dayOfWeek = reserveDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
            const seatType = reservation.sitNum <= 20 ? '1인실(Common)' :
                             reservation.sitNum <= 31 ? '고정석' : '1인실(Private)';
            
            // 좌석 유형에 해당하는 데이터셋의 값 증가
            updatedData.datasets.forEach(dataset => {
                if (dataset.label === seatType) {
                    updatedData.datasets[updatedData.datasets.indexOf(dataset)].data[dayOfWeek]++;
                }
            });
        });

        setChartData(updatedData);
    };

    const getReservationInfo = () => {
        api.get(`reservationInfo/${userId}`)
            .then(res => {
                setTableInfo(res.data);
                updateChartData(res.data);
                console.log(res.data);
                setLoading(false);
            }).catch(e => {
                setTableInfo([]);
                console.log(e);
                setLoading(false);
                // setError('데이터를 가져오는 데 문제가 발생했습니다.');
            });
    };

    const handleCancel = (deleteData) => {
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

    useEffect(() => {
        getReservationInfo();
    }, [userId]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <CWidgetStatsA
                className="mb-4"
                color="dark"
                style={{ height: '220px' }}
                // value={
                //     <div style={{ textAlign: 'left' }}>
                //     예약현황
                //     </div>
                // }
                title={
                    <div style={{ textAlign: 'left' }}>              
                    </div>}
                chart={
                    <CChartBar
                        className="mt-3 mx-3"
                        style={{ height: '80%' }}
                        data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    align: 'end',
                                    display: true,
                                    labels: {
                                        boxWidth: 20, // 레이블의 박스 크기 설정
                                        padding: 15    // 레이블과 차트 간의 거리 설정
                                    },
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',  
                                    titleColor: 'rgba(255, 255, 255, 1)', 
                                    bodyColor: 'rgba(255, 255, 255, 1)', 
                                    borderColor: '#fff', 
                                    borderWidth: 1,  
                                }
                            },
                            scales: {
                                x: {
                                    grid: { display: false, drawTicks: false },
                                    ticks: { display: true },
                                },
                                y: {
                                    grid: { display: true, drawBorder: true },
                                    ticks: { display: true },
                                    stacked: true,
                                },
                            },
                        }}
                    />
                }
            />
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
                    {(Array.isArray(tableInfo) && tableInfo.length === 0) 
                    ? <CTableRow>
                        <CTableDataCell colSpan="6">예약 정보가 없습니다</CTableDataCell>
                    </CTableRow> 
                    : tableInfo.map((info, index) => (  
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
                            {new Date(info.reserveDate).getTime() < new Date().setHours(0, 0, 0, 0) ? '' : 
                                <a 
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => handleCancel(info)}>
                                    취소
                                </a>
                            }
                                {/* <a 
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => handleCancel(info)}>
                                    취소
                                </a> */}
                            </CTableDataCell>
                        </CTableRow>
                    ))} 
                </CTableBody>
            </CTable>
        </div>
    )
}
export default ReservationInfo;