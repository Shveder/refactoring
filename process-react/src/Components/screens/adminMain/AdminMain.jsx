import React, { useState } from "react";
import AdminProfileMenu from "../../AdminProfileMenu/AdminProfileMenu";
import './AdminMain.css'
import ManageUsers from "../../ManageUsers/ManageUsers";
import ManageCompanies from "../../ManageCompanies/ManageCompanies";
import ManageProcesses from "../../ManageProcesses/ManageProcesses";

function AdminMain() {
    const [typeOfIcon, setTypeOfIcon] = useState(false);
    const [activeComponent, setActiveComponent] = useState(null);

    function handleProfileIcon() {
        setTypeOfIcon(!typeOfIcon);
    }

    function handleUsersClick() {
        setActiveComponent(<ManageUsers />);
    }
    function handleCompaniesClick() {
        setActiveComponent(<ManageCompanies />);
    }
    function handleProcessesClick() {
        setActiveComponent(<ManageProcesses />);
    }

    return (
        <>
            {typeOfIcon && <AdminProfileMenu />}

            <header className="headerAdmin">
                <div className="logoAdmin"></div>
                <div className="rightBlockAdmin">
                    <span>
                        <img
                            src="images/profileIcon.png"
                            alt="Иконка профиля"
                            className="profileIconAdmin"
                            onClick={handleProfileIcon}
                        />
                    </span>
                </div>
            </header>

            <div className="buttonsBlockAdmin">
                <button onClick={handleUsersClick} className="userButton">Пользователи</button>
                <button onClick={handleCompaniesClick} className="userButton">Компании</button>
                <button onClick={handleProcessesClick} className="userButton">Процессы</button>
            </div>

            {/* Отображение активного компонента */}
            {activeComponent}
        </>
    );
}

export default AdminMain;