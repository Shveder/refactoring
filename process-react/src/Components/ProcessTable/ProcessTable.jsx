import React, { useContext, useState, useEffect } from "react";
import './ProcessTable.css'
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";
import EditProcess from "../EditProcess/EditProcess";

const ProcessTable = () => {
    const [processes, setProcesses] = useState([]);
    const [selectedProcessId, setSelectedProcessId] = useState(null);
    const [icons, setIcons] = useState({});
    const { user } = useContext(AuthContext);

    useEffect(() => {
        axios
            .get("https://localhost:44367/User/GetUserProcesses?userId=" + user.id)
            .then((response) => {
                setProcesses(response.data.data);
                initializeIcons(response.data.data);
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }, [user.id]);

    function initializeIcons(processList) {
        const iconsData = {};
        processList.forEach((process) => {
            iconsData[process.id] = "/images/down.png";
        });
        setIcons(iconsData);
    }

    function handleIcon(processId) {
        if (selectedProcessId === processId) {
            setIcons((prevIcons) => ({
                ...prevIcons,
                [processId]: "/images/down.png",
            }));
            setSelectedProcessId(null);
        } else {
            const updatedIcons = Object.keys(icons).reduce((acc, iconId) => {
                return {
                    ...acc,
                    [iconId]: "/images/down.png",
                };
            }, {});
            setIcons({
                ...updatedIcons,
                [processId]: "/images/up.png",
            });
            setSelectedProcessId(processId);
        }
    }

    function handleDeleteProcess(processId) {
        axios
            .delete("https://localhost:44367/Process/" + processId)
            .then((response) => {
                console.log(response.data.data);
                // Refresh the user list after successful deletion
                axios
                    .get("https://localhost:44367/User/GetUserProcesses?userId=" + user.id)
                    .then((response) => {
                        setProcesses(response.data.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }

    return <div className="processTableBlock">
        <h1 className="manHeadingProcess">Управление процессами</h1>

        <table className="process-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Статус</th>
                    <th>Компания</th>
                    <th>Приватность</th>
                    <th>Удалить</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {processes.map((process) => (
                    <React.Fragment key={process.id}>
                        <tr>
                            <td>{process.processName}</td>
                            <td>{process.status}</td>
                            <td>{process.company.name}</td>
                            <td>{process.privicy ? "Да" : "Нет"}</td>
                            <td>
                                <button onClick={() => handleDeleteProcess(process.id)}>
                                    Удалить
                                </button>
                            </td>
                            <td>
                                <img
                                    src={icons[process.id]}
                                    alt="Иконка вниз"
                                    className="downIcon"
                                    onClick={() => handleIcon(process.id)}
                                />
                            </td>
                        </tr>
                        {selectedProcessId === process.id && (
                            <tr>
                                <td colSpan="6">
                                    <EditProcess id={process.id} />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}


            </tbody>


        </table>
    </div>
}

export default ProcessTable;