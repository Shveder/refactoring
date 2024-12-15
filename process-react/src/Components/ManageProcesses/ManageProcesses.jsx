import React, { useEffect, useState } from "react";
import "./ManageProcesses.css"
import axios from "axios";

const ManageProcesses = () => {
    const [processes, setProcesses] = useState([]);


    useEffect(() => {
        axios
            .get("https://localhost:44367/Process/GetAll")
            .then((response) => setProcesses(response.data.data))
            .catch((error) => console.log(error.response.data.message));
    }, []);

    function handleDeleteProcess(processId) {
        axios.delete("https://localhost:44367/Process/" + processId)
            .then((response) => {
                console.log(response.data);
                // Refresh the user list after successful deletion
                axios
                    .get("https://localhost:44367/Process/GetAll")
                    .then((response) => {
                        setProcesses(response.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }
    return <div className="processBlockAdmin">
        <h1 className="manHeading">Управление процессами</h1>
        <table className="process-table-admin">
            <thead>
                <tr>
                    <th>Имя</th>
                    <th>Статус</th>
                    <th>Приватность</th>
                    <th>Компания</th>
                    <th>Удалить</th>
                </tr>
            </thead>
            <tbody>
                {processes.map((process) => (
                    <React.Fragment key={process.id}>
                        <tr>
                            <td>{process.processName}</td>
                            <td>{process.status}</td>
                            <td>{process.privicy ? "Да" : "Нет"}</td>
                            <td>{process.companyId}</td>
                            <td>
                                <button onClick={() => handleDeleteProcess(process.id)}>
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </div>
}

export default ManageProcesses;