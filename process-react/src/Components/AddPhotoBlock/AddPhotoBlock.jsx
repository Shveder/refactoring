import { useContext, useState } from "react";
import "./AddPhotoBlock.css";
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";

const AddPhotoBlock = (props) => {
    const type = props.type;
    const { user, setUser } = useContext(AuthContext);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            if (!userId || !token) {
                console.log('Нет данных для получения пользователя. Авторизуйтесь снова.');
                return;
            }

            // Запрос на получение данных пользователя по сохранённому userId
            const response = await axios.get(`https://localhost:44367/User/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.data) {
                setUser(response.data.data); // Устанавливаем данные пользователя в контекст
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            fetchUserData();
            const userId = user.id;

            const response = await axios.post(`https://localhost:44367/Photo/HandleFileUpload/${userId}?type=${type}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error.message);
        }
    }

    return (
        <div className="addPhotoBlock">
            <h1 className="photoHeading">Изменить фото</h1>
            <input type="file" accept=".jpg" onChange={handleFileChange} className="inputPhoto" />
            <button onClick={handleUpload} className="uploadButton">Upload</button>
        </div>
    );
}

export default AddPhotoBlock;