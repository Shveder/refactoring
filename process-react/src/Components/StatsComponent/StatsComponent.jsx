import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import './StatsComponent.css';

// Функция для форматирования дат
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("ru-RU", options);
};

const StatsComponent = () => {
    const [processes, setProcesses] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState("");
    const [selectedIndicator, setSelectedIndicator] = useState("");
    const [records, setRecords] = useState([]);
    const [chartType, setChartType] = useState("line");

    useEffect(() => {
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
            axios.get(`https://localhost:44367/User/GetIndicatorsOfProcess?processId=${selectedProcess}`)
                .then(response => {
                    setIndicators(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedIndicator(response.data.data[0].id);
                    }
                })
                .catch(error => console.error("Ошибка при загрузке показателей", error));
        }
    }, [selectedProcess]);

    useEffect(() => {
        if (selectedIndicator) {
            axios.get(`https://localhost:44367/User/GetRecordsByIndicatorId?indicatorId=${selectedIndicator}`)
                .then(response => {
                    const formattedData = response.data.data.map(record => ({
                        time: formatDate(record.time),
                        value: record.value,
                        measurement: record.indicator.measurement,
                        label: `${record.indicator.measurement}: ${record.value}`
                    }));
                    setRecords(formattedData);

                })
                .catch(error => console.error("Ошибка при загрузке данных", error));
        }
    }, [selectedIndicator]);

    const handleProcessChange = (e) => setSelectedProcess(e.target.value);
    const handleIndicatorChange = (e) => setSelectedIndicator(e.target.value);
    const handleChartTypeChange = (e) => setChartType(e.target.value);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p><strong>Дата:</strong> {payload[0].payload.time}</p>
                    <p><strong>Показатель:</strong> {payload[0].payload.label}</p>
                </div>
            );
        }
        return null;
    };



    return (
        <div className="stats-container">
            <h2>Выбор процесса и показателя</h2>

            {/* Селекторы */}
            <div className="selectorsStats">
                <select className="custom-select" value={selectedProcess} onChange={handleProcessChange}>
                    {processes.map((process) => (
                        <option key={process.id} value={process.id}>
                            {process.processName}
                        </option>
                    ))}
                </select>

                <select className="custom-select" value={selectedIndicator} onChange={handleIndicatorChange}>
                    {indicators.map((indicator) => (
                        <option key={indicator.id} value={indicator.id}>
                            {indicator.name}
                        </option>
                    ))}
                </select>

                <select className="custom-select" value={chartType} onChange={handleChartTypeChange}>
                    <option value="line">Линейный график</option>
                    <option value="bar">Столбчатая диаграмма</option>
                </select>
            </div>

            {/* График */}
            <div className="chartsContainer">
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === "line" ? (
                        <LineChart
                            data={records}
                            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                            <CartesianGrid stroke="#555" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#FFA500"
                            />
                        </LineChart>
                    ) : (
                        <BarChart
                            data={records}
                            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                            <CartesianGrid stroke="#555" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="value"
                                fill="#FFA500"
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default StatsComponent;
