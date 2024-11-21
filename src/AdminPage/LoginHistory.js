import { useState, useEffect } from 'react';
import { CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import api from '../api/api';

function LoginHistory(props) {

    const userId = props.userId;

    const [tableInfo, setTableInfo] = useState([]); 

    const getLoginInfo = () => {
        // api.get(`/signUp/checkId2/${userId}`)
        api.get(`/adminpages/${userId}`)
            .then(res => {
                setTableInfo(res.data.results);
                console.log(res.data.results);
            }).catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        getLoginInfo();
    }, [userId]);

    return (
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
    )
}
export default LoginHistory;