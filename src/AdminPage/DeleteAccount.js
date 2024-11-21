import api from '../api/api';

function DeleteAccount(props) {

    // const userId = props.userId;

    // const deleteData = { userId };
    // api.post('/deleteAccount', deleteData)
    //     .then(res => {
    //         if (res.data.success) {
    //             alert("회원 탈퇴가 완료되었습니다.");
    //             props.onLogout();
    //         } else {
    //             alert(res.data.message);
    //         }
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         alert("회원 탈퇴를 실패했습니다.");
    //     });

    return (
        <div>
            {props.userId}
        </div>
    )
}
export default DeleteAccount;