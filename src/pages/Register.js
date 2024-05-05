import Formcompo from "./components/Formcompo";
import PostService from "../services/PostService";
import "./components/Formcompo.css";
import { useState } from "react";

export default function Register() {
  const elements = [
    { name: "uname", type: "text", text: "Full Name", req: true },
    { name: "email", type: "email", text: "Email", req: true },
    { name: "pass", type: "password", text: "Password", req: true },
  ];

  const userType = [{ value: "Audience" }, { value: "Artist" }];

  const buttons = [{ type: "submit", text: "Register" }];

  const submitHandler = (e) => {
    e.preventDefault();
    const regData = new FormData(e.target);
    console.log(regData);
    PostService.reg(regData).then(
      (response) => {
        if (response.status === 200) {
          console.log(regData);
        }
      },
      (rej) => {
        console.log(rej);
      }
    );
  };

  const [regUserType, setRegUserType] = useState(null);
  function regUserTypeHandler (e) {
    // console.log(e.target.attributes.name.value)
    setRegUserType(e.target.attributes.name.value)
    
  }
  

  return (
    <>
      <div className="row justify-content-center align-items-center g-2 m-3">

        <div className="col-6 ">
          <h1 className="text-center">Sign Up</h1>

          <div className="btn-group reguser-btn-container"  role="group" aria-label="Basic radio toggle button group">
            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" />
            <label className="btn btn-outline-primary reguser-btn" htmlFor="btnradio1" onClick={regUserTypeHandler} name="Audience">Audiendce</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
            <label className="btn btn-outline-primary reguser-btn" htmlFor="btnradio2" onClick={regUserTypeHandler} name="Artist">Artist</label>
          </div>

          <Formcompo
            elements={elements}
            type={userType}
            buttons={buttons}
            submit={submitHandler}
          />
          
        </div>
      </div>
    </>
  );
}
