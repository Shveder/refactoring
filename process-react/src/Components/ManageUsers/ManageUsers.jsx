import React, { useEffect, useState } from "react";
import "./ManageUsers.css";
import axios from "axios";
import UserView from "../UserView/UserView";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [icons, setIcons] = useState({});

    useEffect(() => {
        axios
            .get("https://localhost:44367/Admin/GetAllUsers")
            .then((response) => {
                setUsers(response.data);
                initializeIcons(response.data);
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }, []);

    function initializeIcons(userList) {
        const iconsData = {};
        userList.forEach((user) => {
            iconsData[user.id] = "/images/down.png";
        });
        setIcons(iconsData);
    }
    
    function handleIcon(userId) {
        if (selectedUserId === userId) {
            setIcons((prevIcons) => ({
                ...prevIcons,
                [userId]: "/images/down.png",
            }));
            setSelectedUserId(null);
        } else {
            const updatedIcons = Object.keys(icons).reduce((acc, iconId) => {
                return {
                    ...acc,
                    [iconId]: "/images/down.png",
                };
            }, {});

            setIcons({
                ...updatedIcons,
                [userId]: "/images/up.png",
            });
            setSelectedUserId(userId);
        }
    }
    function handleDeleteUser(userId, role) {
        if (role === 2) {
            console.log("Вы не можете удалять администраторов");
            return;
        }
        axios
            .delete("https://localhost:44367/Admin/DeleteUser?id=" + userId)
            .then((response) => {
                console.log(response.data);
                // Refresh the user list after successful deletion
                axios
                    .get("https://localhost:44367/Admin/GetAllUsers")
                    .then((response) => {
                        setUsers(response.data);
                        initializeIcons(response.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }

    function handleRoleChange(userId, newRole, role) {
        if (role === "admin") {
            console.log("Вы не можете изменять администраторов");
            return;
        }
        const requestData = {
            id: userId,
            role: newRole,
        };
        axios
            .put("https://localhost:44367/Admin/ChangeRole", requestData)
            .then((response) => {
                console.log(response.data);
                // Refresh the user list after successful role update
                axios
                    .get("https://localhost:44367/Admin/GetAllUsers")
                    .then((response) => {
                        setUsers(response.data.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }

    function handleStatusBlockChange(userId, isBlocked, role) {
        if (role === 2) {
            console.log("Вы не можете изменять администраторов");
            return;
        }
        const requestData = {
            id: userId,
            status: isBlocked
          };
        axios
            .put("https://localhost:44367/Admin/SetUserBlockStatus", requestData)
            .then((response) => {
                console.log(response.data);
                // Refresh the user list after successful status update
                axios
                    .get("https://localhost:44367/Admin/GetAllUsers")
                    .then((response) => {
                        setUsers(response.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }

    return (
        <div className="userBlock">
            <h1 className="manHeading">Управление пользователями</h1>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Роль</th>
                        <th>Статус блокировки</th>
                        <th>Удалить</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <React.Fragment key={user.id}>
                            <tr>
                                <td>{user.login}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            handleRoleChange(user.id, e.target.value, user.role)
                                        }
                                    >
                                        <option value="user">Пользователь</option>
                                        <option value="admin">Администратор</option>
                                    
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={user.isBlocked}
                                        onChange={(e) =>
                                            handleStatusBlockChange(
                                                user.id,
                                                JSON.parse(e.target.value),
                                                user.role
                                            )
                                        }
                                    >
                                        <option value={false}>Активен</option>
                                        <option value={true}>Заблокирован</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.id, user.role)}>
                                        Удалить
                                    </button>
                                </td>
                                <td>
                                    <img
                                        src={icons[user.id]}
                                        alt="Иконка вниз"
                                        className="downIcon"
                                        onClick={() => handleIcon(user.id)}
                                    />
                                </td>
                            </tr>
                            {selectedUserId === user.id && (
                                <tr>
                                    <td colSpan="6">
                                        <UserView id={user.id} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsers;