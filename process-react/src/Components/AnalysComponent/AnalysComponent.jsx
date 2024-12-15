import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AnalysComponent.css";

const AnalysComponent = () => {
    const [processes, setProcesses] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState("");
    const [indicators, setIndicators] = useState([]);
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        // Загрузка процессов
        axios.get("https://localhost:44367/Process/GetAll")
            .then(response => {
                setProcesses(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedProcess(response.data.data[0].id);
                }
            })
            .catch(error => console.error("Ошибка при загрузке процессов", error));
    }, []);

    useEffect(() => {
        if (selectedProcess) {
            // Загрузка показателей для выбранного процесса
            axios.get(`https://localhost:44367/User/GetIndicatorsOfProcess?processId=${selectedProcess}`)
                .then(response => {
                    setIndicators(response.data.data);
                })
                .catch(error => console.error("Ошибка при загрузке показателей", error));
        }
    }, [selectedProcess]);

    useEffect(() => {
        if (indicators.length > 0) {
            // Загрузка данных для каждого показателя и вычисление аналитики
            const fetchAnalytics = async () => {
                const analyticsData = await Promise.all(
                    indicators.map(async (indicator) => {
                        try {
                            const response = await axios.get(`https://localhost:44367/User/GetRecordsByIndicatorId?indicatorId=${indicator.id}`);
                            const records = response.data.data;

                            // Вычисление аналитики
                            const values = records.map(record => record.value);
                            const average = values.reduce((sum, val) => sum + val, 0) / values.length || 0;
                            const min = Math.min(...values);
                            const max = Math.max(...values);

                            return {
                                indicatorName: indicator.name,
                                measurement: indicator.measurement,
                                count: values.length,
                                average,
                                min,
                                max,
                            };
                        } catch (error) {
                            console.error(`Ошибка при загрузке данных для показателя ${indicator.name}`, error);
                            return null;
                        }
                    })
                );

                setAnalytics(analyticsData.filter(Boolean)); // Фильтруем ошибки
            };

            fetchAnalytics();
        }
    }, [indicators]);

    return (
        <div className="analys-container">
            <h2>Аналитические данные</h2>

            {/* Селектор выбора процесса */}
            <div className="selectorAnalys">
                <select
                    className="custom-select"
                    value={selectedProcess}
                    onChange={(e) => setSelectedProcess(e.target.value)}
                >
                    {processes.map((process) => (
                        <option key={process.id} value={process.id}>
                            {process.processName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Таблица аналитических данных */}
            <div className="analytics-table">
                <table>
                    <thead>
                        <tr>
                            <th>Показатель</th>
                            <th>Единица измерения</th>
                            <th>Количество записей</th>
                            <th>Среднее значение</th>
                            <th>Минимум</th>
                            <th>Максимум</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics.length > 0 ? (
                            analytics.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.indicatorName}</td>
                                    <td>{data.measurement}</td>
                                    <td>{data.count}</td>
                                    <td>{data.average.toFixed(2)}</td>
                                    <td>{data.min}</td>
                                    <td>{data.max}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Нет данных для отображения</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalysComponent;
