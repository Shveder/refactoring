import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./InfoComponent.css";
import { AuthContext } from "../../providers/AuthProvider";

const InfoComponent = () => {
    const [processes, setProcesses] = useState([]);
    const [selectedProcessId, setSelectedProcessId] = useState('');
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [button, setButton] = useState();
    const { user } = useContext(AuthContext);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // Сохранение выбранного процесса в localStorage
    const saveSelectedProcessId = (processId) => {
        localStorage.setItem("selectedProcessId", processId);
    };

    useEffect(() => {
        // Загрузка сохраненного процесса из localStorage
        const savedProcessId = localStorage.getItem("selectedProcessId");
        if (savedProcessId) {
            setSelectedProcessId(savedProcessId);
        }
    }, []);

    // Загрузка процессов с сервера
    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await axios.get("https://localhost:44367/Process/GetAll");
                setProcesses(response.data.data);

                // Если сохраненного процесса нет, выбираем первый
                if (response.data.data.length > 0 && !selectedProcessId) {
                    const firstProcess = response.data.data[0];
                    setSelectedProcessId(firstProcess.id);
                    setSelectedProcess(firstProcess);
                    saveSelectedProcessId(firstProcess.id);
                }
            } catch (error) {
                console.error("Ошибка при загрузке процессов:", error);
            }
        };

        fetchProcesses();
    }, [selectedProcessId]);

    // Обновление кнопки подписки
    useEffect(() => {
        if (!selectedProcessId || !user) return;

        axios
            .get(`https://localhost:44367/Subscription/GetIsSubscribed?userId=${user.id}&businessId=${selectedProcessId}`)
            .then((response) => {
                if (response.data === true) {
                    setButton("Отписаться");
                } else {
                    setButton("Подписаться");
                }
            })
            .catch((error) => {
                console.error("Ошибка при проверке подписки:", error);
            });
    }, [selectedProcessId, user]);

    // Загрузка фото выбранного процесса
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedProcessId) {
                    const response = await axios.get(
                        `https://localhost:44367/Photo/GetPhoto/${selectedProcessId}?type=process`,
                        { responseType: "arraybuffer" }
                    );

                    if (response.status === 200) {
                        const base64String = btoa(
                            new Uint8Array(response.data).reduce(
                                (data, byte) => data + String.fromCharCode(byte),
                                ""
                            )
                        );
                        setPhotoUrl(`data:image/jpeg;base64,${base64String}`);
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке фото:", error);
            }
        };

        fetchData();
    }, [selectedProcessId]);

    // Обработка смены процесса
    const handleProcessChange = (e) => {
        const processId = e.target.value;
        setSelectedProcessId(processId);
        const process = processes.find((p) => p.id === processId);
        setSelectedProcess(process);
        saveSelectedProcessId(processId);
    };

    // Обработка подписки/отписки
    const handleSubscribe = () => {
        const userId = user.id;
        const data = {
            userId: userId,
            processId: selectedProcessId
        }

        if (button === "Подписаться") {
            axios
                .post("https://localhost:44367/Subscription/AddSubscription", data)
                .then(() => {
                    openModal();
                    setButton("Отписаться");
                })
                .catch((error) => {
                    console.error("Ошибка при подписке:", error);
                });
        } else {
            axios.delete("https://localhost:44367/Subscription/DeleteSubscription", {
                headers: { "Content-Type": "application/json" },
                data
            })
                .then(() => {
                    setButton("Подписаться");
                })
                .catch((error) => {
                    console.error("Ошибка при отписке:", error);
                });
        }
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="closeHeading">Вы успешно подписались</h2>
                        <div>
                            <img src="/images/bell.gif" alt="GIF" />
                        </div>
                        <p className="closeText">При изменении цены вам придет уведомление.</p>
                        <button onClick={closeModal} className="closeButton">
                            Закрыть окно
                        </button>
                    </div>
                </div>
            )}

            <div className={isOpen ? "page-content blocked" : "page-content"}>
                <div className="infoComponentContainer">
                    <select
                        className="processSelector"
                        value={selectedProcessId}
                        onChange={handleProcessChange}
                    >
                        {processes.map((process) => (
                            <option key={process.id} value={process.id}>
                                {process.processName}
                            </option>
                        ))}
                    </select>

                    <div className="blockOfCompanyInfo">
                        <span className="processPhotoBlockInfo">
                            <img src={photoUrl} alt="Фото процесса" className="processPhoto" />
                        </span>

                        <span className="processInfoBlock">
                            <h1 className="processName">Название - {selectedProcess?.processName}</h1>
                            <p className="processStatus">Статус - {selectedProcess?.status}</p>
                            <br />
                            <h1 className="processName">Компания - {selectedProcess?.company.name}</h1>
                            <p className="processStatus">Телефон - {selectedProcess?.company.phone}</p>
                            <p className="processStatus">Email - {selectedProcess?.company.email}</p>
                            <div className="divButt">
                                <button className="subButton" onClick={handleSubscribe}>
                                    {button}
                                </button>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InfoComponent;
