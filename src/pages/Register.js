import Formcompo from "./components/Formcompo";
import PostService from "../services/PostService";
import "./Register.css";
import { useEffect, useState } from "react";

export default function Register(props) {
  const elements = [
    { name: "uname", type: "text", text: "Full Name", req: true },
    { name: "email", type: "email", text: "Email", req: true },
    { name: "pass", type: "password", text: "Password", req: true },
  ];
  const buttons = [{ type: "submit", text: "Register" }];

  const [userType, setUserType] = useState([{ value: "Audience" }, { value: "Artist" }]);
  const [typeSelected, setTypeSelected] = useState(null);
  const [userTypeFormData, setUserTypeFormData] = useState([]);

  function regUserTypeHandler (e) {
    // console.log(e.target.attributes.number.value)
    setTypeSelected(e.target.attributes.number.value);

    switch(e.target.innerText){
      case "Audience":
        setUserTypeFormData(["1","0","0"])
      break;
      
      case "Artist":
        setUserTypeFormData(["1","1","0"])
      break;

      case "Admin":
        setUserTypeFormData(["1","1","1"])
      break;
    }

    // console.log(regUserType)
  }

  useEffect(()=>{
    if(props.loginUserType === "Admin"){
      setUserType([{ value: "Audience" }, { value: "Artist" }, { value: "Admin" }])
    }else{
      setUserType([{ value: "Audience" }, { value: "Artist" }])
    }
  },[props.loginUser])

  const [profileSelected, setProfileSelected] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  function profileSelectHandler (e) {
    // console.log(e.target.attributes.src.value);
    setProfileSelected(e.target.attributes.number.value);
    setProfileImg(e.target.attributes.src.value)
    // console.log(profileImg)
  }

  const [regData, setRegData] = useState({
    uname: '',
    email: '',
    pass: '',
    image: '',
    user: '',
    artist: '',
    admin: '',
  })
  
  const changeHandler = (e) => {
    setRegData((prev)=>({...prev,  
      [e.target.attributes.name.value]: e.target.value,
    }))
    setRegData((prev)=>({...prev,  
      ["image"]: profileImg,
      ["user"]: userTypeFormData["0"],
      ["artist"]: userTypeFormData["1"],
      ["admin"]: userTypeFormData["2"],
    }))
    // console.log(regData)
  }

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userTypeFormData) {
      alert('please choose your user type!')
      return false
    }

    // why always get "invalid keys" from backend  - -????
    console.log(regData);
    PostService.reg((regData)).then(
      (response) => {
        console.log(response);
      },
      (rej) => {
        console.log(rej);
      }
    );
  };

  useEffect(()=>{
    setRegData((prev)=>({...prev,  
      ["image"]: profileImg,
      ["user"]: userTypeFormData["0"],
      ["artist"]: userTypeFormData["1"],
      ["admin"]: userTypeFormData["2"],
    }))
  },[userTypeFormData, profileImg])
  

  return (
    <>
      <div className="row justify-content-center align-items-center g-2 m-3">

        <div className="col-6 reg-container">
          <h1 className="text-center">Sign Up Here!</h1>
          <p className="text-center mb-0">and you are ...</p>
          <div className="reguser-btn-container">
            {userType.map((obj,idx)=>{
                return(
                  <button key={idx} className={typeSelected==idx+1 ? `btn btn-outline-primary reguser-btn reguser-btn-selected` : `btn btn-outline-primary reguser-btn`} number={idx+1} onClick={regUserTypeHandler}> {obj.value} </button>
                )
            })}
          </div>

          <div className="profile-container">
             <h5 className="profile-title">Choose Your First Profile!</h5>
             <div className="profile-img-container">
              <img onClick={profileSelectHandler} className={profileSelected=="1" ? `profile-img-selected` : `profile-img`} number="1" src="./img/user-profile (1).webp"/>
              <img onClick={profileSelectHandler} className={profileSelected=="2" ? `profile-img-selected` : `profile-img`} number="2" src="./img/user-profile (2).webp"/>
              <img onClick={profileSelectHandler} className={profileSelected=="3" ? `profile-img-selected` : `profile-img`} number="3" src="./img/user-profile (3).webp"/>
             </div>
          </div>
     
          <Formcompo
            elements={elements}
            type={userType}
            buttons={buttons}
            submit={submitHandler}
            onChange={changeHandler}
          />
          
        </div>
      </div>
    </>
  );
}
