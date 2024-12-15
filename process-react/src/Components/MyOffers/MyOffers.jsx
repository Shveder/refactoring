import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";
import "./MyOffers.css"; // Подключаем файл стилей

const MyOffers = () => {
    const [offers, setOffers] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getOffers();
        // eslint-disable-next-line
    }, [user?.id]);

    function getOffers() {
        if (user == null) return;

        // Получаем все предложения
        axios.get("https://localhost:7085/User/GetOffersByUser?userId=" + user?.id)
            .then(response => {
                setOffers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        // eslint-disable-next-line
    }

    function onDeleteOffer(offer) {
        axios.delete("https://localhost:7085/User/DeleteOffer?offerId=" + offer.id)
        .then(response => {
            console.log(response.data);
            getOffers();
        })
        .catch(error => {
            console.log(error);
        });
        
    }

    if (offers.length === 0)
        return <>
            <h2>Вы еще ничего не добавили</h2>
        </>
    return (<>


        <table className="table-styleMarket">
            <thead>
                <tr>
                    <th className="textCell">Название компании</th>
                    <th className="textCell">Продавец</th>
                    <th className="textCell">Цена за акцию</th>
                    <th className="textCell">Количество акций</th>
                    <th className="textCell">Удалить оффер</th>
                </tr>
            </thead>
            <tbody>
                {offers.map((offer, index) => (
                    <tr className="tableRow" key={index}>
                        <td className="textCell">{offer.business.name}</td>
                        <td className="textCell">{offer.user.login}</td>
                        <td className="textCell">{offer.priceForShare}</td>
                        <td className="textCell">{offer.numberOfShares}</td>
                        <td>
                            <button className='moreButton' onClick={() => onDeleteOffer(offer)}>Удалить</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
    );
}

export default MyOffers;
