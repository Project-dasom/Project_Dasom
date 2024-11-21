import { useState, useEffect } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { CWidgetStatsA } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';

import api from '../api/api';

function LoginHistory(props) {
    const userId = props.userId;

    const [tableInfo, setTableInfo] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState({ labels: [], data: [] });
    const [recentLogin, setRecentLogin] = useState(''); // 최신 로그인 기록
    const [recentLoginDetail, setRecentLoginDetail] = useState(''); // 최신 로그인 상세 날짜

    const getLoginInfo = () => {
        // api.get(`/signUp/checkId2/${userId}`)
        api.get(`/adminpages/${userId}`)
            .then(res => {
                setTableInfo(res.data.results);
                setLoading(false);

                processChartData(res.data.results);
                setRecentLogin(getRecentLogin(res.data.results));
                setRecentLoginDetail(getRecentLoginDetail(res.data.results));
            }).catch(e => {
                console.log(e);
                setTableInfo([]);
                setLoading(false);
                // setError('데이터를 가져오는 데 문제가 발생했습니다.');
            });
    };

    const processChartData = (data) => {
        // 로그인 기록을 날짜별로 집계
        const dateCounts = {};
        data.forEach(info => {
            const date = new Date(info.history).toLocaleDateString('sv-SE'); // 날짜 형식
            if (dateCounts[date]) {
                dateCounts[date] += 1;
            } else {
                dateCounts[date] = 1;
            }
        });

        // 차트 데이터 준비
        const labels = Object.keys(dateCounts);  // 날짜들
        const loginCounts = Object.values(dateCounts);  // 각 날짜에 해당하는 로그인 횟수들

        setChartData({
            labels: labels,
            data: loginCounts
        });
    };

    // 최신 로그인 시간 변환
    const getRecentLogin = (data) => {
        if (data.length === 0) return '로그인 기록이 없습니다'; // 로그인 기록이 없으면

        // 시간 순으로 정렬하여 마지막 항목을 가장 최신 로그인 기록으로
        const sortedData = [...data].sort((a, b) => new Date(b.history) - new Date(a.history));
        const lastLogin = new Date(sortedData[0].history); // 가장 최신 데이터
        const now = new Date();
        const diffInSeconds = Math.floor((now - lastLogin) / 1000); // 초

        const days = Math.floor(diffInSeconds / (3600 * 24)); // 일
        const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600); // 시간
        const minutes = Math.floor((diffInSeconds % 3600) / 60); // 분

        if (days > 0) {
            return `${days}일 전`;
        } else if (hours > 0) {
            return `${hours}시간 전`;
        } else if (minutes > 0) {
            return `${minutes}분 전`;
        } else {
            return '방금 전';
        }
    };

    // 최신 로그인 상세 날짜 (YYYY-MM-DD HH:MM 형식으로 표시)
    const getRecentLoginDetail = (data) => {
        if (data.length === 0) return '-'; // 로그인 기록이 없으면 빈 문자열

        const sortedData = [...data].sort((a, b) => new Date(b.history) - new Date(a.history));
        const lastLogin = new Date(sortedData[0].history);

        // 상세 날짜와 시간을 "YYYY-MM-DD HH:MM" 형식으로 반환
        const year = lastLogin.getFullYear();
        const month = String(lastLogin.getMonth() + 1).padStart(2, '0');
        const date = String(lastLogin.getDate()).padStart(2, '0');
        const hours = String(lastLogin.getHours()).padStart(2, '0');
        const minutes = String(lastLogin.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}`;

        return formattedDate;
    };

    useEffect(() => {
        getLoginInfo();
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
                color="info"
                value={
                    <div style={{ textAlign: 'left' }}>
                    {recentLogin}
                    </div>
                }
                title={
                    <div style={{ textAlign: 'left' }}>
                        {`최신 로그인 기록: ${recentLoginDetail}`}                 
                    </div>}
                chart={
                    <CChartLine
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                        labels: chartData.labels,  // 날짜 리스트
                        datasets: [
                            {
                                label: '로그인 횟수',
                                backgroundColor: 'transparent',
                                borderColor: 'rgba(255,255,255,.55)',
                                pointBackgroundColor: '#5856d6',
                                data: chartData.data,  // 로그인 횟수 데이터
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                border: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                    drawBorder: false,
                                },
                                ticks: {
                                    display: true,
                                },
                            },
                            y: {
                                min: 0,
                                display: true,
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    display: true,
                                },
                            },
                        },
                        elements: {
                            line: {
                                borderWidth: 1,
                                tension: 0.4,
                            },
                            point: {
                                radius: 4,
                                hitRadius: 10,
                                hoverRadius: 4,
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
                        <CTableHeaderCell scope="col">Login_History</CTableHeaderCell>
                        <CTableHeaderCell scope="col">IP</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {(Array.isArray(tableInfo) && tableInfo.length === 0) 
                    ? <CTableRow>
                        <CTableDataCell colSpan="6">로그인 정보가 없습니다</CTableDataCell>
                    </CTableRow> 
                    : tableInfo.map((info, index) => (  
                        <CTableRow key={index}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>
                            {new Date(info.history).toLocaleDateString('sv-SE') + ' ' + new Date(info.history).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/AM/, '오전').replace(/PM/, '오후')}
                            </CTableDataCell>
                            <CTableDataCell>{info.ip_address}</CTableDataCell>
                        </CTableRow>
                    ))} 
                </CTableBody>
            </CTable>
        </div>        
    );
}

export default LoginHistory;
