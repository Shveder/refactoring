import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import './AdminProfileMenu.css'

function AdminProfileMenu()
{
    const navigate =useNavigate();
    // eslint-disable-next-line
    const {user, setUser} = useContext(AuthContext);

    function handleExit()
    {
        setUser(null);
        navigate('/authorization');
    }

    return <div className="iconMenuAdmin">
        <div><button className="linkProfileButtonAdmin" onClick={handleExit}>
            <img src="/images/exitIcon.png" className="exitIconAdmin" alt="Иконка выхода"/><p className="butTextAdmin">Выйти</p></button></div>
        </div>
}
export default AdminProfileMenu;