import { useState } from "react";
import "./Formcompo.css";
export default function Formcompo(props) {

  return (
    <>    
    <form action={props.action} method={props.method} onSubmit={props.submit} className="d-flex flex-column align-items-center">
      {props.elements.map((element, idx) => {
        return (
          // input
          <div className="form-floating m-3 w-75" key={idx}>
            <input ref={element.name === "password" ? props.passInput : null} type={element.type} className="form-control" name={element.name} placeholder={element.text} required={element.req} onChange={props.onChange} />
            <label htmlFor={element.name}>{element.text}</label>
          </div>
        );
      })}

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

