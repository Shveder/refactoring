import React, { useState, useEffect } from "react";
import "./NotificationList.css";
import axios from "axios";

function NotificationList({ updateNotificationCount }) {
  const [notificationList, setNotificationList] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("ru-RU", options);
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    
    axios
      .get("https://localhost:44367/User/GetNotifications?userId=" + userId)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setNotificationList(response.data.data);
        } else {
          console.log("Invalid notification list data:", response.data.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const handleDeleteNotification = (id) => {
    axios
      .delete("https://localhost:44367/User/DeleteNotification?id=" + id)
      .then((response) => {
        console.log(response.data.data);
        // Обновление списка уведомлений после успешного удаления
        const updatedNotificationList = notificationList.filter(
          (notification) => notification.id !== id
        );
        setNotificationList(updatedNotificationList);
        // Обновление числа уведомлений в компоненте UserMain
        if (updatedNotificationList.length === 0) {
          updateNotificationCount("");
          return;
        }
        updateNotificationCount(updatedNotificationList.length);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <>
      <div className="notificationBlock">
        {notificationList.length === 0 ? (
          <p>У вас нет уведомлений</p>
        ) : (
          <>
            {notificationList.map((notification) => (
              <div key={notification.id} className="notification">
                <span className="notBody">
                  <div className="notText">{notification.message}</div>
                  <img
                    src="/images/close.png"
                    className="closeButt"
                    alt="Кнопка удаления"
                    onClick={() => handleDeleteNotification(notification.id)}
                  />
                </span>
                <div className="date">{formatDate(notification.dateCreated)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default NotificationList;