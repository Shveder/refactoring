import axios from "axios";
import { useState, useEffect, useContext } from "react";
import './CommunityComponent.css'
import { AuthContext } from "../../providers/AuthProvider";
import CommentsList from "../CommentsList/CommentsList";


const CommunityComponent = () => {
    const [processes, setProcesses] = useState([]);
    const [selectedProcessId, setSelectedProcessId] = useState('');
    // eslint-disable-next-line
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const [comment, setComment] = useState("");
    const { user } = useContext(AuthContext)


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

    const handleProcessChange = (e) => {
        const processId = e.target.value;
        setSelectedProcessId(processId);
        const process = processes.find((p) => p.id === processId);
        setSelectedProcess(process);
        saveSelectedProcessId(processId);
    };

    function handleAddComment() {
        openModal();
    }
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    function modalView() {
        return <>
            <div className="modal">
                <div className="modal-content">
                    <h2 className="closeHeading">Введите ваш комментарий:</h2>
                    <textarea
                        type="text"
                        placeholder="Мнение"
                        className="modalInput"
                        value={comment}
                        maxLength={255}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <h3>{text}</h3>
                    <div><button className="closeButton" onClick={() => handleAnswer(comment)}>Ок</button>
                        <button className="closeButton" onClick={() => handleAnswer(false)}>Отмена</button></div>
                </div>
            </div>
        </>
    }

    function handleAnswer(expertView) {

        if (expertView === false) {
            closeModal();
            return;
        }
        if (expertView === "") {
            setText("Добавьте больше текста");
            return;
        }
        const data = {
            processId: selectedProcessId,
            userId: user.id,
            commentText: comment
        };
        axios.post("https://localhost:44367/User/AddComment", data)
            .then((response) => {
                console.log(response.data);
                closeModal();

            })
            .catch((error) => console.log(error.response.data.message));
    }

    return <>

        {isOpen && (
            modalView()
        )}

        <div className={isOpen ? 'page-content blocked' : 'page-content'}>

            <div className="upHandlingBlock">
                <span className="addCommentBlock">
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
                </span >
                <span className="addCommentBlock"><button className="addViewButton" onClick={handleAddComment}>Добавить комментарий</button>fdsfs</span>
            </div>
            <CommentsList processId = {selectedProcessId}/>
        </div >
    </>
}

export default CommunityComponent;