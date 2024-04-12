import { useRef, useState, useEffect } from "react";
import Formcompo from "./components/Formcompo";
import { useNavigate } from "react-router-dom";
import FileService from "../services/FileService";

export default function Login(props) {
  const passInput = useRef();
  const showPassBtn = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttons, setButtons] = useState([
    { type: "submit", text: "Login" },
    { type: "button", text: "Show Password" }
  ]);

  useEffect(() => {
    let storedUsers = localStorage.getItem("users");

    if (!storedUsers) {
      FileService.read("user").then(
        (response) => {
          if (Array.isArray(response.data)) {
            const loadedUsers = response.data.map((user) => ({
              id: user.uid,
              name: user.uname,
              email: user.email,
              password: user.password,
            }));
            localStorage.setItem("users", JSON.stringify(loadedUsers));
          } else {
            console.error("Error: response data is not an array");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  const elements = [
    { name: "email", type: "email", text: "Email", req: true },
    { name: "password", type: "password", text: "Password", req: true },
  ];

  const changeHandler = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(user);
    props.auth(user);
    navigate("/");
  };

  const showPassHandler = () => {
    passInput.current.type = (passInput.current.type === "password") ? "text" : "password";
    
    const btnText = (passInput.current.type === "password") ? "Show Password" : "Hide Password";
    
    setButtons(prevButtons => {
      const newButtons = [...prevButtons];
      newButtons[1].text = btnText;
      return newButtons;
    });
  };

  return (
    <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-6 ">
          <h1 className="text-center">Login</h1>
          <Formcompo elements={elements} buttons={buttons} onChange={changeHandler} submit={submitHandler} showPass={showPassHandler} passInput={passInput} showPassBtn={showPassBtn}/>
        </div>
      </div>
    </>
  );
}
