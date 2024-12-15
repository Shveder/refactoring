import React from "react";
import './EditProcess.css'
import { useState, useEffect } from "react";
import axios from "axios";

const EditProcess = (props) => {
    const processId = props.id;
    const [file, setFile] = useState(null);
    const [indicatorName, setIndicatorName] = useState(null);
    const [indicatorMeasure, setIndicatorMeasure] = useState(null);
    const [indicatorSignificance, setIndicatorSignificance] = useState(null);
    const [addIndText, setAddIndText] = useState("");
    const [indicators, setIndicators] = useState([]);
    const [value, setValue] = useState("");
    const [time, setTime] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        axios
            .get('https://localhost:44367/User/GetIndicatorsOfProcess?processId=' + processId)
            .then((response) => setIndicators(response.data.data))
            .catch((error) => console.log(error.response.data.message));
    }, [processId]);

    function handleDeleteIndicator(indicatorId) {
        axios
            .delete("https://localhost:44367/User/DeleteIndicator/" + indicatorId)
            .then((response) => {
                console.log(response.data.data);
                // Refresh the user list after successful deletion
                axios
                    .get('https://localhost:44367/User/GetIndicatorsOfProcess?processId=' + processId)
                    .then((response) => {
                        setIndicators(response.data.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`https://localhost:44367/Photo/HandleFileUpload/${processId}?type=process`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error.message);
        }
    }

    const handleAddIndicator = () => {
        if (indicatorName === "" || indicatorMeasure === "" || indicatorSignificance === "") {
            setAddIndText("Заполните все поля");
            return;
        }
        try {
            const data = {
                name: indicatorName,
                measurement: indicatorMeasure,
                significance: indicatorSignificance,
                processId: processId
            }
            axios
                .post("https://localhost:44367/User/AddIndicator", data)
                .then((response) => {
                    setAddIndText(response.data.message)
                })
                .catch((error) => {
                    setAddIndText(error.response.data.message)
                });

        } catch (error) {
            console.error('Error uploading file:', error.message);
        }
    }

    const handleAddRecord = async (selectedIndicatorId) => {
        if (!value || !time) {
            alert("Пожалуйста, заполните все поля");
            return;
        }
    
        const recordData = {
            value: parseFloat(value), 
            time: new Date(time).toISOString(),
            indicatorId: selectedIndicatorId, 
        };
    
        try {
            const response = await axios.post(
                "https://localhost:44367/User/AddRecord",
                recordData, );
    
            if (response.status === 200) {
                alert("Запись успешно добавлена");
                // Очистка полей после добавления
                setValue("");
                setTime("");

            } else {
                alert(`Ошибка: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при добавлении записи:", error);
            alert("Произошла ошибка при добавлении записи");
        }
    };
    
    return <>
        <div className="editProcessBlock">
            <span className="processPhotoBlock">

                <h4 className="InfoTextEditProcessBlock">Изменить фото:</h4>

                <div className="addProcessPhotoBlock">
                    <input type="file" accept=".jpg" onChange={handleFileChange} className="inputProcessPhoto" />
                    <button onClick={handleUpload} className="uploadProcessPhotoButton">Upload</button>
                </div>

            </span>
            <span className="addIndicatorBlock">
                <h4 className="InfoTextEditProcessBlock">Добавить показатель:</h4>
                <input placeholder="Введите название" maxLength="30"
                    className="addIndicatorInput"
                    value={indicatorName}
                    onChange={(e) => setIndicatorName(e.target.value)}
                />
                <input
                    placeholder="Введите измерение в Р.П." maxLength="30"
                    className="addIndicatorInput"
                    value={indicatorMeasure}
                    onChange={(e) => setIndicatorMeasure(e.target.value)}
                />
                <input
                    placeholder="Введите важность показателя" maxLength="30"
                    className="addIndicatorInput"
                    value={indicatorSignificance}
                    onChange={(e) => setIndicatorSignificance(e.target.value)}
                />
                <button onClick={handleAddIndicator} className="addIndicatorButton">Добавить</button>
                {addIndText}
            </span>
        </div>
        <div className="indicatorsBlock">
            <h1 className="InfoTextEditIndicatorBlock">Показатели процесса:</h1>
            <table className="indicator-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Важность</th>
                        <th>Измерение</th>
                        <th>Добавить запись</th>
                        <th>Удалить</th>
                    </tr>
                </thead>
                <tbody>
                    {indicators.map((indicator) => (
                        <React.Fragment key={indicator.id}>
                            <tr>
                                <td>{indicator.name}</td>
                                <td>{indicator.significance}</td>
                                <td>{indicator.measurement}</td>
                                <td className="addRecordTd">
                                    <input
                                        placeholder="Введите показание"
                                        maxLength="15"
                                        onKeyPress={(e) => {
                                            const keyCode = e.which || e.keyCode;
                                            const isValidInput = /^\+?[0-9\s\-()]*$/.test(String.fromCharCode(keyCode));
                                            if (!isValidInput) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="addIndicatorInput"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        placeholder="Введите дату" maxLength="30"
                                        className="addIndicatorInput"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                    <button onClick={() => handleAddRecord(indicator.id)} className="addIndicatorButton">Добавить</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteIndicator(indicator.id)}>
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}

export default EditProcess;