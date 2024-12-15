import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import './UserProfile.css'
import HelpBlock from "../../helpBlock/HelpBlock";
import EditProfile from "../../EditProfile/EditProfile";
import axios from "axios";
import AddPhotoBlock from "../../AddPhotoBlock/AddPhotoBlock";
import AddCompanyBlock from "../../AddCompanyBlock/AddCompanyBlock";
import AddProcessBlock from "../../AddProcessBlock/AddProcessBlock";

function UserProfile() {
  // eslint-disable-next-line
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState('replenishBalance');
  const [loading, setLoading] = useState(true); // состояние для отслеживания загрузки
  const [error, setError] = useState(''); // состояние для ошибокs
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {  // Проверяем, что user и user.id существуют
          const response = await axios.get(`https://localhost:44367/Photo/GetPhoto/${user.id}?type=user`, {
            responseType: 'arraybuffer',  // Указываем, что ожидаем двоичные данные
          });

          if (response.status === 200) {
            const base64String = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );

            setPhotoUrl(`data:image/jpeg;base64,${base64String}`);
          } else {
            // Обработка ошибки
          }
        }
      } catch (error) {
        // Обработка ошибки
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [user && user.id]);

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

  function handleExit() {
    setUser(null);
    navigate('/authorization');
  }

  if (loading) return <p>Загрузка данных пользователя...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const handleButtonClick = (component) => {
    setSelectedComponent(component);
  }


  const renderComponent = () => {
    switch (selectedComponent) {
      case 'helpBlock':
        return <HelpBlock />;
      case 'editProfile':
        return <EditProfile />;
      case 'addPhoto':
        return <AddPhotoBlock type={"user"} />;
      case 'addCompany':
        return <AddCompanyBlock />;
      case 'addProcess':
        return <AddProcessBlock />;
      default:
        return <HelpBlock />;
    }
  }

  return <>

    <header>
      <div className="logo">
        <Link to="/userMain" title=" Перейти на главную страницу"><p>Process</p></Link>
      </div>
    </header>
    <div className="profileMenu">
      <div className="avatarRep">
        <svg width="100%" height="100%" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
          <clipPath id="circleClip">
            <circle cx="0.5" cy="0.5" r="0.5" />
          </clipPath>
          <image x="0" y="0" width="100%" height="100%" xlinkHref={photoUrl} clipPath="url(#circleClip)" alt="Иконка профиля" />
        </svg>
      </div>
      <button className="profileButt" title="Изменить фото" onClick={() => handleButtonClick('addPhoto')}><p className="textInMenu"><img src="/images/photo.png" className="menuIcon" alt="Иконка фото" />Изменить фото</p></button>
      <button className="profileButt" title="Добавить компанию" onClick={() => handleButtonClick('addCompany')}><p className="textInMenu" ><img src="/images/plus.png" className="menuIcon" alt="Иконка добавления" />Добавить компанию</p></button>
      <button className="profileButt" title="Добавить процесс" onClick={() => handleButtonClick('addProcess')}><p className="textInMenu" ><img src="/images/plus.png" className="menuIcon" alt="Иконка добавления" />Добавить процесс</p></button>
      <button className="profileButt" title="Редактировать ваш профиль" onClick={() => handleButtonClick('editProfile')}><p className="textInMenu" ><img src="/images/editIcon.png" className="menuIcon" alt="Иконка редактирования" />Редактировать профиль</p></button>
      <button className="profileButt" title="Получить помощь" onClick={() => handleButtonClick('helpBlock')}><p className="textInMenu"><img src="/images/helpIcon.png" className="menuIcon" alt="Иконка помощи" />Помощь и поддержка</p></button>
      <button className="profileButt" onClick={handleExit} title="Выйти из аккаунта"><p className="textInMenu"><img src="/images/exitIcon.png" className="menuIcon" alt="Иконка выхода" />Выйти</p></button>
    </div>
    {renderComponent(selectedComponent)}
  </>

}

export default UserProfile;