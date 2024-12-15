import React, { useState } from "react";
import "./CompanyTable.css";
import { useNavigate } from "react-router-dom";

const CompanyTable = ({ companies }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const handleViewCompany = (company) => {
    navigate("/processView", { state: { company } });
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchText.toLowerCase()) ||
    company.phone.toLowerCase().includes(searchText.toLowerCase()) ||
    company.email.toString().includes(searchText)
  );

  const isSearchTextNotEmpty = searchText.trim() !== '';
  const isSearchResultsEmpty = filteredCompanies.length === 0;

  return (
    <div className="mainBlock">
      <h1 className='companyHeading'>Доступные компании</h1>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Поиск"
          className="searchInput"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {isSearchTextNotEmpty && (
          <img
            src='images/close.png'
            className="deleteText"
            alt="Иконка крестика"
            onClick={() => setSearchText("")}
          />
        )}
      </div>
      {isSearchResultsEmpty ? (
        <p className="noResultsText">По вашему запросу ничего не найдено</p>
      ) : (
        <table className="table-style">
          <thead>
            <tr>
              <th className="textCell">Компания</th>
              <th className="textCell">Телефон</th>
              <th className="textCell">Email</th>
              <th className="textCell">Подробнее</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="tableRow">
                <td className="textCell">
                  <button
                    onClick={() => handleViewCompany(company.company)}
                    style={{ textDecoration: 'none', backgroundColor: '#fff', border: 'none', cursor: 'pointer', padding: '0' }}
                  >
                    <p className="companyLink" title="Перейти в профиль" style={{ textDecoration: 'none', margin: '0', color: "red", fontSize: "20px" }}>
                      {company.name}
                    </p>
                  </button>
                </td>
                <td className="textCell">{company.phone}</td>
                <td className="textCell">{company.email}</td>
                <td>
                  <button onClick={() => handleViewCompany(company)} className='moreButton'>Подробнее</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default CompanyTable;
