import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Authorization.css";
import axios from "axios";
import { AuthContext } from "../../../providers/AuthProvider";
import { jwtDecode } from "jwt-decode";

const Authorization = () => {
   const [login1, setLogin1] = useState("");
   const [password1, setPassword1] = useState("");
   const [password, setPassword] = useState("");
   const [passwordRepeat, setPasswordRepeat] = useState("");
   const [login, setLogin] = useState("");
   const [isFlipped, setIsFlipped] = useState(false);
   const navigate = useNavigate();
   const { setUser } = useContext(AuthContext);
   const [sideMessages, setSideMessages] = useState([]);

   const addSideMessage = (message, type) => {
      const id = Date.now();
      setSideMessages((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
         setSideMessages((prev) => prev.filter((notif) => notif.id !== id));
      }, 5000);
   };

   const handleAuth = (event) => {
      if (login1 === "" || password1 === "") {
         addSideMessage("Заполните поля", "error");
         return;
      }
      event.preventDefault();
      axios
         .post("https://localhost:44367/Authorization/Login", { login: login1, password: password1 })
         .then((response) => {
            if (response.status === 200) {
               const token = response.data;
               const decoded = jwtDecode(token);

               setUser({
                  id: decoded.id,
                  login: decoded.login,
                  role: decoded.role,
               });

               localStorage.setItem("token", token);

               if (decoded.role === "admin") {
                  localStorage.setItem("adminId", decoded.id);
                  navigate("/adminMain");
               } else if (decoded.role === "user") {
                  localStorage.setItem("userId", decoded.id);
                  navigate("/userMain");
               }
            }
         })
         .catch((error) => {
            addSideMessage(error.response.data.message, "error");
         });
   };

   const handleCreateNew = (event) => {
      if (login === password) {
         addSideMessage("Логин должен отличаться от пароля", "error");
         return;
      }
      event.preventDefault();

      axios
         .post("https://localhost:44367/Authorization/Register", {
            login,
            password,
            passwordRepeat,
         })
         .then((response) => {
            if (response.status === 200) {
               addSideMessage(response.data, "success");
            }
         })
         .catch((error) => {
            addSideMessage(error.response.data.message, "error");
         });
   };

   return (
      <div className="wrapper">
         <div className="card-container">
            <label className="switch">
               <input
                  className="toggle"
                  type="checkbox"
                  checked={isFlipped}
                  onChange={() => setIsFlipped(!isFlipped)}
               />
               <span className="slider"></span>
               <span className="card-side"></span>
            </label>
            <div className={`flip-card__inner ${isFlipped ? "flipped" : ""}`}>
               <div className="flip-card__front">
                  <div className="title">Log in</div>
                  <div className="flip-card__form">
                     <input
                        type="login"
                        placeholder="Login"
                        maxLength={30}
                        className="flip-card__input"
                        onChange={(event) => setLogin1(event.target.value)}
                     />
                     <input
                        type="password"
                        placeholder="Password"
                        maxLength={30}
                        className="flip-card__input"
                        onChange={(event) => setPassword1(event.target.value)}
                     />
                     <button className="flip-card__btn" onClick={handleAuth}>
                        Let`s go!
                     </button>
                  </div>
               </div>
               <div className="flip-card__back">
                  <div className="title">Sign up</div>
                  <div className="flip-card__form">
                     <input
                        type="text"
                        placeholder="Name"
                        maxLength={30}
                        className="flip-card__input"
                        onChange={(event) => setLogin(event.target.value)}
                     />
                     <input
                        type="password"
                        placeholder="Password"
                        maxLength={30}
                        className="flip-card__input"
                        onChange={(event) => setPassword(event.target.value)}
                     />
                     <input
                        type="password"
                        placeholder="Password Repeat"
                        maxLength={30}
                        className="flip-card__input"
                        onChange={(event) => setPasswordRepeat(event.target.value)}
                     />
                     <button className="flip-card__btn" onClick={handleCreateNew}>
                        Confirm!
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div className="sideMessage-container">
            {sideMessages.map(({ id, message, type }) => (
               <div key={id} className={`sideMessage ${type}`}>
                  {message}
               </div>
            ))}
         </div>
      </div>
   );
};

export default Authorization;