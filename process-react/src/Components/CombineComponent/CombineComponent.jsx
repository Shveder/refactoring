import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "./CombineComponent.css";

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("ru-RU", options);
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p><strong>Дата:</strong> {payload[0].payload.time}</p>
                {payload.map((item, index) => (
                    <p key={index}>
                        <strong>{item.payload[`measurement${index + 1}`]}:</strong> {item.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CombineComponent = () => {
    const [processes, setProcesses] = useState([]);
    const [indicators1, setIndicators1] = useState([]);
    const [indicators2, setIndicators2] = useState([]);
    const [selectedProcess1, setSelectedProcess1] = useState("");
    const [selectedIndicator1, setSelectedIndicator1] = useState("");
    const [selectedProcess2, setSelectedProcess2] = useState("");
    const [selectedIndicator2, setSelectedIndicator2] = useState("");
    const [records1, setRecords1] = useState([]);
    const [records2, setRecords2] = useState([]);
    const [chartType1, setChartType1] = useState("line");
    const [chartType2, setChartType2] = useState("line");

    useEffect(() => {
        axios.get("https://localhost:44367/Process/GetAll")
            .then(response => {
                setProcesses(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedProcess1(response.data.data[0].id);
                    setSelectedProcess2(response.data.data[0].id);
                }
            })
            .catch(error => console.error("Ошибка при загрузке процессов", error));
    }, []);

    useEffect(() => {
        if (selectedProcess1) {
            axios.get(`https://localhost:44367/User/GetIndicatorsOfProcess?processId=${selectedProcess1}`)
                .then(response => {
                    setIndicators1(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedIndicator1(response.data.data[0].id);
                    }
                })
                .catch(error => console.error("Ошибка при загрузке показателей 1", error));
        }
    }, [selectedProcess1]);

    useEffect(() => {
        if (selectedProcess2) {
            axios.get(`https://localhost:44367/User/GetIndicatorsOfProcess?processId=${selectedProcess2}`)
                .then(response => {
                    setIndicators2(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedIndicator2(response.data.data[0].id);
                    }
                })
                .catch(error => console.error("Ошибка при загрузке показателей 2", error));
        }
    }, [selectedProcess2]);

    useEffect(() => {
        if (selectedIndicator1) {
            axios.get(`https://localhost:44367/User/GetRecordsByIndicatorId?indicatorId=${selectedIndicator1}`)
                .then(response => {
                    const formattedData = response.data.data.map(record => ({
                        time: formatDate(record.time),
                        value1: record.value,
                        measurement1: record.indicator.measurement,
                    }));
                    setRecords1(formattedData);
                })
                .catch(error => console.error("Ошибка при загрузке данных 1", error));
        }
    }, [selectedIndicator1]);

    useEffect(() => {
        if (selectedIndicator2) {
            axios.get(`https://localhost:44367/User/GetRecordsByIndicatorId?indicatorId=${selectedIndicator2}`)
                .then(response => {
                    const formattedData = response.data.data.map(record => ({
                        time: formatDate(record.time),
                        value2: record.value,
                        measurement2: record.indicator.measurement,
                    }));
                    setRecords2(formattedData);
                })
                .catch(error => console.error("Ошибка при загрузке данных 2", error));
        }
    }, [selectedIndicator2]);

    const combinedRecords = records1.map((rec1) => {
        const matchingRecord = records2.find((rec2) => rec2.time === rec1.time);
        return {
            ...rec1,
            ...matchingRecord,
        };
    });

    return (
        <div className="combine-container">
            
            <div className="selectors">
                <div className="selectorsBlock">
                    <select className="custom-select" value={selectedProcess1} onChange={(e) => setSelectedProcess1(e.target.value)}>
                        {processes.map((process) => (
                            <option key={process.id} value={process.id}>
                                {process.processName}
                            </option>
                        ))}
                    </select>

                    <select className="custom-select" value={selectedIndicator1} onChange={(e) => setSelectedIndicator1(e.target.value)}>
                        {indicators1.map((indicator) => (
                            <option key={indicator.id} value={indicator.id}>
                                {indicator.name}
                            </option>
                        ))}
                    </select>
                    <select className="custom-select" value={chartType1} onChange={(e) => setChartType1(e.target.value)}>
                        <option value="line">Линии</option>
                        <option value="bar">Столбцы</option>
                    </select>
                </div>
                <h2 className="combineHeader">График с двумя наборами данных</h2>
                <div className="selectorsBlock">
                    <select className="custom-select" value={selectedProcess2} onChange={(e) => setSelectedProcess2(e.target.value)}>
                        {processes.map((process) => (
                            <option key={process.id} value={process.id}>
                                {process.processName}
                            </option>
                        ))}
                    </select>
                    <select className="custom-select" value={selectedIndicator2} onChange={(e) => setSelectedIndicator2(e.target.value)}>
                        {indicators2.map((indicator) => (
                            <option key={indicator.id} value={indicator.id}>
                                {indicator.name}
                            </option>
                        ))}
                    </select>
                    <select className="custom-select" value={chartType2} onChange={(e) => setChartType2(e.target.value)}>
                        <option value="line">Линии</option>
                        <option value="bar">Столбцы</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="90%" height={400}>
                <ComposedChart data={combinedRecords} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="#555" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    {chartType1 === "line" ? (
                        <Line type="monotone" dataKey="value1" stroke="#FFA500" name="Данные 1" />
                    ) : (
                        <Bar dataKey="value1" fill="#FFA500" name="Данные 1" />
                    )}
                    {chartType2 === "line" ? (
                        <Line type="monotone" dataKey="value2" stroke="#008000" name="Данные 2" />
                    ) : (
                        <Bar dataKey="value2" fill="#008000" name="Данные 2" />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CombineComponent;
