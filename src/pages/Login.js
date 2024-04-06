import { useState } from "react";
import Formcompo from "./components/Formcompo";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });



  const elements = [
    { name: "email", type: "email", text: "Email", req: true },
    { name: "password", type: "password", text: "Password", req: true },
  ];

  const buttons = [{ type: "submit", text: "Login" }];

  const changeHandler = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(user);
    props.auth(user);
    navigate("/userpage");
  };


  return (
    <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-6 ">
          <h1 className="text-center">Login</h1>
          <Formcompo elements={elements} buttons={buttons} onChange={changeHandler} submit={submitHandler}/>
        </div>
      </div>
    </>
  );
}
