import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../providers/AuthProvider";
import { useContext } from "react";
import './AddCompanyBlock.css'


const AddCompanyBlock = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [text, setText] = useState("");

    const handleUpload = async () => {
        if (name === "" || phone === "" || email === "") {
            setText("Заполните все поля");
            return;
        }

        try {
            const data = {
                name: name,
                phone: phone,
                email: email,
                userId: user.id
            }
            axios
                .post("https://localhost:44367/Company", data)
                .then((response) => {
                    setText(response.data.message)
                })
                .catch((error) => {
                    setText(error.response.data.message)
                });

        } catch (error) {
            console.error('Error uploading file:', error.message);
        }
    }
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios
            .get('https://localhost:44367/Company/GetCompaniesByUserId?userId=' + user.id)
            .then((response) => setCompanies(response.data.data))
            .catch((error) => console.log(error.response.data.message));
    }, [user.id]);

    function handleDeleteCompany(companyId) {
        axios
            .delete("https://localhost:44367/Company/" + companyId)
            .then((response) => {
                console.log(response.data.data);
                // Refresh the user list after successful deletion
                axios
                    .get('https://localhost:44367/Company/GetCompaniesByUserId?userId=' + user.id)
                    .then((response) => {
                        setCompanies(response.data.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }
    
    return (<>
        <div className="addCompanyBlock">
            <h1 className="companyBlockHeading">Добавить компанию</h1>

            <input placeholder="Введите название" maxLength="30"
                className="addCompanyInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="tel"
                placeholder="Введите телефон"
                maxLength="15"
                onKeyPress={(e) => {
                    const keyCode = e.which || e.keyCode;
                    const isValidInput = /^\+?[0-9\s\-()]*$/.test(String.fromCharCode(keyCode));
                    if (!isValidInput) {
                        e.preventDefault();
                    }
                }}
                title="Введите корректный номер телефона (например, +375 (23) 456-78-90)"
                className="addCompanyInput"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input placeholder="Введите email" maxLength="30"
                className="addCompanyInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleUpload} className="uploadCompanyButton">Upload</button>
            {text}

            <div className="companyBlock">
                <h1 className="companyBlockHeading">Управление компаниями</h1>
                <table className="company-table">
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Телефон</th>
                            <th>Email</th>
                            <th>Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <React.Fragment key={company.id}>
                                <tr>
                                    <td>{company.name}</td>
                                    <td>{company.phone}</td>
                                    <td>{company.email}</td>
                                    <td>
                                        <button onClick={() => handleDeleteCompany(company.id)}>
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>)
}

export default AddCompanyBlock;