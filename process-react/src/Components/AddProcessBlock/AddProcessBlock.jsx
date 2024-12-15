import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import './AddProcessBlock.css';
import { AuthContext } from "../../providers/AuthProvider";
import ProcessTable from "../ProcessTable/ProcessTable";

const AddProcessBlock = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [company, setCompany] = useState("");
    const [companies, setCompanies] = useState([]);
    const [text, setText] = useState("");

    // Загрузка списка компаний пользователя
    useEffect(() => {
        axios
            .get('https://localhost:44367/Company/GetCompaniesByUserId?userId=' + user.id)
            .then((response) => {
                setCompanies(response.data.data);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке компаний:", error);
                setText("Не удалось загрузить компании");
            });
    }, [user.id]);

    const handleUpload = async () => {
        if (!name || !status || !company) {
            setText("Заполните все поля");
            return;
        }

        try {
            const data = {
                processName: name,
                status: status,
                companyId: company,
            };

            await axios
                .post("https://localhost:44367/Process", data)
                .then((response) => {
                    setText(response.data.message || "Процесс успешно добавлен");
                    setName("");
                    setStatus("");
                    setCompany("");
                })
                .catch((error) => {
                    setText(error.response?.data?.message || "Ошибка при добавлении процесса");
                });
        } catch (error) {
            console.error("Ошибка:", error.message);
            setText("Ошибка при обработке запроса");
        }
    };

    return (
        <div className="addProcessBlock">
            <h1 className="processBlockHeading">Добавить процесс</h1>

            <input
                placeholder="Введите название"
                maxLength="30"
                className="addProcessInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Введите статус"
                maxLength="30"
                className="addProcessInput"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            />

            <select
                className="addProcessInput"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            >
                <option value="" disabled>Выберите компанию</option>
                {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            <button onClick={handleUpload} className="uploadProcessButton">
                Добавить
            </button>

            {text && <p className="statusMessage">{text}</p>}
            <ProcessTable />
        </div>
    );
};

export default AddProcessBlock;
