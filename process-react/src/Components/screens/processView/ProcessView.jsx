import { useState, useEffect, useContext } from "react";
import ProfileMenu from "../../ProfileMenu/ProfileMenu.jsx";
import NotificationList from "../../NotificationList/NotificationList.jsx";
import { Link } from "react-router-dom";
import './ProcessView.css';
import InfoComponent from "../../InfoComponent/InfoComponent.jsx";
import StatsComponent from "../../StatsComponent/StatsComponent.jsx";
import CommunityComponent from "../../CommunityComponent/CommunityComponent.jsx";
import AnalysComponent from "../../AnalysComponent/AnalysComponent.jsx";
import axios from "axios";
import { AuthContext } from "../../../providers/AuthProvider.jsx";
import CombineComponent from "../../CombineComponent/CombineComponent.jsx";

const ProcessView = () => {
    const [typeOfIcon, setTypeOfIcon] = useState(false);
    const [typeOfNotifications, setTypeOfNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState("");
    const [activeComponent, setActiveComponent] = useState("info"); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState('');
    const {user, setUser} = useContext(AuthContext);

    const renderComponent = () => {
        switch (activeComponent) {
            case "info":
                return <InfoComponent />;
            case "stats":
                return <StatsComponent />;
            case "community":
                return <CommunityComponent />;
            case "analys":
                return <AnalysComponent />;
            case "combine":
                return <CombineComponent />
            default:
                return <InfoComponent />;
        }
    };

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
            <header className="profileViewHeader">
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

            <div className="profileViewWorkspace">
                <span className="processViewNavigation">
                    <div
                        className={`navigateIconBlock ${activeComponent === "info" ? "active" : ""}`}
                        onClick={() => setActiveComponent("info")}
                    >
                        <img src="/images/info.png" className="navigateIcon" alt="Иконка информации" />
                    </div>
                    <div
                        className={`navigateIconBlock ${activeComponent === "stats" ? "active" : ""}`}
                        onClick={() => setActiveComponent("stats")}
                    >
                        <img src="/images/stats.png" className="navigateIcon" alt="Иконка статистики" />
                    </div>
                    <div
                        className={`navigateIconBlock ${activeComponent === "community" ? "active" : ""}`}
                        onClick={() => setActiveComponent("community")}
                    >
                        <img src="/images/community.png" className="navigateIcon" alt="Иконка комментариев" />
                    </div>
                    <div
                        className={`navigateIconBlock ${activeComponent === "analys" ? "active" : ""}`}
                        onClick={() => setActiveComponent("analys")}
                    >
                        <img src="/images/analys.png" className="navigateIconAnalys" alt="Иконка анализа" />
                    </div>
                    <div
                        className={`navigateIconBlock ${activeComponent === "combine" ? "active" : ""}`}
                        onClick={() => setActiveComponent("combine")}
                    >
                        <img src="/images/combineGraphs.png" className="navigateIconAnalys" alt="Иконка совмещения" />
                    </div>
                </span>
                <span className="processViewComponentBlock">
                    {renderComponent()}
                </span>
            </div>
        </>
    );
};

export default ProcessView;
