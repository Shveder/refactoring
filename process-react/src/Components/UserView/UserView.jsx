import React, { useEffect, useState } from "react";
import './UserView.css';
import axios from "axios";

function UserView(props) {
    const id = props.id;
    const [recentPasswords, setRecentPasswords] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);
    
    useEffect(() => {
        axios.get("https://localhost:44367/Admin/GetUserRecentPasswords?id=" + id)
            .then(response => setRecentPasswords(response.data))
            .catch(error => console.log(error.response.data.message));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        axios.get("https://localhost:44367/Admin/GetUserLoginHistory?id=" + id)
            .then(response => setLoginHistory(response.data))
            .catch(error => console.log(error.response.data.message));
        // eslint-disable-next-line
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleDateString('ru-RU', options);
    }

    return (
        <div className="viewBlock">
            <span className="passwordsBlock">
                <h4 className="InfoTextUserView">Предыдущие пароли:</h4>
                {Array.isArray(recentPasswords) && recentPasswords.length > 0 ? (
                    recentPasswords.map((recentPassword) => (
                        <p className="InfoTextUserView" key={recentPassword.password}>{recentPassword.password}</p>
                    ))
                ) : (
                    <p className="InfoTextUserView">Пароли отсутствуют</p>
                )}
            </span>
            <span className="loginHistory">
                <h4 className="InfoTextUserView">История входов:</h4>
                {Array.isArray(loginHistory) && loginHistory.length > 0 ? (
                    loginHistory.map((history) => (
                        <div key={history.id}>
                            <p className="InfoTextUserView">
                                Дата: {formatDate(history.dateCreated)}
                                <br />
                                IP-адрес: {history.ip}
                            </p>
                            <br />
                        </div>
                    ))
                ) : (
                    <p>История отсутствует</p>
                )}
            </span>
        </div>
    );
}

export default UserView;