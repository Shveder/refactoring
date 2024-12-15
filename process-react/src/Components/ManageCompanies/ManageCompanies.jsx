import React, { useEffect, useState } from "react";
import "./ManageCompanies.css"
import axios from "axios";

const ManageCompanies = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios
            .get("https://localhost:44367/Admin/GetAllCompanies")
            .then((response) => setCompanies(response.data))
            .catch((error) => console.log(error.response.data.message));
    }, []);

    function handleDeleteCompany(companyId) {
        axios
            .delete("https://localhost:44367/Company/" + companyId)
            .then((response) => {
                console.log(response.data);
                // Refresh the user list after successful deletion
                axios
                    .get("https://localhost:44367/Admin/GetAllCompanies")
                    .then((response) => {
                        setCompanies(response.data);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    }
    return <div className="companyBlockAdmin">
        <h1 className="manHeading">Управление компаниями</h1>
        <table className="company-table-admin">
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
}

export default ManageCompanies;