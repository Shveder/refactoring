import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../providers/AuthProvider.jsx";
import { Link } from "react-router-dom";
import './UserMain.css';
import ProfileMenu from "../../ProfileMenu/ProfileMenu.jsx";
import NotificationList from "../../NotificationList/NotificationList.jsx";
import CompanyTable from "../../CompanyTable/CompanyTable.jsx";

function UserMain() {
    const { user, setUser } = useContext(AuthContext);
    const [typeOfIcon, setTypeOfIcon] = useState(false);
    const [typeOfNotifications, setTypeOfNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState("");
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get("https://localhost:44367/Company/GetAll")
            .then(response => {
                setCompanies(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    
    useEffect(() => {
        if (user == null)
            return;
        axios.get("https://localhost:44367/User/GetCountOfNotifications?userId=" + user?.id)
            .then(response => {
                if (response.data === 0) {
                    return;
                }
                setNotificationCount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        // eslint-disable-next-line
    }, [user?.id]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');

                if (!userId || !token) {
                    setError('Нет данных для получения пользователя. Авторизуйтесь снова.');
                    setLoading(false);
                    return;
                }

                // Запрос на получение данных пользователя по сохранённому userId
                const response = await axios.get(`https://localhost:44367/User/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.data) {
                    setUser(response.data.data); // Устанавливаем данные пользователя в контекст
                } else {
                    setError('Не удалось получить данные пользователя.');
                }
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
                setError('Ошибка при получении данных пользователя. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        if (!user) {
            fetchUserData(); // вызываем функцию загрузки данных, если user == null
        } else {
            setLoading(false); // останавливаем загрузку, если пользователь уже есть
        }
    }, [user, setUser]);

    if (loading) return <p>Загрузка данных пользователя...</p>;
    if (error) return <p className="error-message">{error}</p>;

    function handleProfileIcon() {
        setTypeOfIcon(!typeOfIcon);
    }

    function handleNotifications() {
        setTypeOfNotifications(!typeOfNotifications);
    }

    return (
        <>
            {typeOfIcon && <ProfileMenu />}
            {typeOfNotifications && <NotificationList updateNotificationCount={setNotificationCount} />}
            <header>
                <div className="logo">
                    <Link to="/userMain"><p>Process</p></Link>
                </div>
                <div className="rightBlock">
                    <div className="bellBlock">
                        <img
                            src="images/notification.png"
                            className="notificationBell"
                            alt="Иконка уведомления"
                            onClick={handleNotifications}
                        />
                    </div>
                    <span className="notifNumber">{notificationCount}</span>
                    <span>
                        <img
                            src="images/profileIcon.png"
                            alt="Иконка профиля"
                            className="profileIcon"
                            onClick={handleProfileIcon}
                        />
                    </span>
                </div>
            </header>
            <CompanyTable companies={companies} />
        </>
    );
}

export default UserMain;