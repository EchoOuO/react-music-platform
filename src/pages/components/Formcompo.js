import { useState } from "react";
import "./Formcompo.css";
export default function Formcompo(props) {

  const [profileSelected, setProfileSelected] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  function profileSelectHandler (e) {
    // console.log(e.target.attributes.number.value);
    setProfileSelected(e.target.attributes.number.value);
    setProfileImg(e.target.attributes.src.value)
    // console.log(profileImg)
  }



  const FormData = {

  }

  return (
    <>    
    <form action="http://127.0.0.1/react-music-platform-server/index.php/reg" method="post" onSubmit={props.submit} className="d-flex flex-column align-items-center">
      {/* user type (for register) */}
      {/* {props.type ? ( //check if type exist      
      <select onChange={regUserTypeHandler} className="form-select m-3">
        {props.type.map((type, idx) => {
          return (
            <option key={idx} value={type.value}>{type.value}</option>
          );
        })}
      </select>
      ) : null} */}

      {props.elements.map((element, idx) => {
        return (
          // input
          <div className="form-floating m-3 w-75" key={idx}>
            <input ref={element.name === "password" ? props.passInput : null} type={element.type} className="form-control" name={element.name} placeholder={element.text} required={element.req} onChange={props.onChange} />
            <label htmlFor={element.name}>{element.text}</label>
          </div>
        );
      })}


      <h5>Choose Your First Profile!</h5>
      <div className="profile-container">
          <img onClick={profileSelectHandler} className={profileSelected=="1" ? `profile-img-selected` : `profile-img`} number="1" src="./img/user-profile (1).webp"/>
          <img onClick={profileSelectHandler} className={profileSelected=="2" ? `profile-img-selected` : `profile-img`} number="2" src="./img/user-profile (2).webp"/>
          <img onClick={profileSelectHandler} className={profileSelected=="3" ? `profile-img-selected` : `profile-img`} number="3" src="./img/user-profile (3).webp"/>
      </div>

      {/* button */}
      {props.buttons.map((btnElement, idx) => {
      const btnClassName = (btnElement.text === "Show Password" || btnElement.text === "Hide Password") ? 'btn btn-outline-dark mt-3' : 'btn btn-outline-primary w-25 mt-3 btn-lg';

        return (
          <button type={btnElement.type} className={btnClassName} key={idx} onClick={props.showPass} > {btnElement.text} </button>
        );
      })}

    </form>
    </>
  );
}

