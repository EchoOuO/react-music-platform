import { Outlet, Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import SearchList from "./components/Searchcompo";
import "./Link.css";
import { AES, enc } from "crypto-js";

export default function Links(props) {
  const [searchWord, setSearchWord] = useState("");
  const inputRef = useRef();


  const changeHandler = (e) => {
    e.preventDefault();
    setSearchWord(e.target.value);
  };

  const searchClear = (e) => {
    inputRef.current.value = "";
    setSearchWord("");
  }

  let curLoginUser
  const storedUser = sessionStorage.getItem("LoginUser");
  if (storedUser) {
    const decryptedUser = AES.decrypt(storedUser, 'groupc').toString(enc.Utf8);
    // console.log(JSON.parse(decryptedUser))
    curLoginUser = JSON.parse(decryptedUser)
    // console.log(curLoginUser)

    if (curLoginUser.user) {
      props.setLoginUserType("Audience");
    }
    if(curLoginUser.artist) {
      props.setLoginUserType("Artist");
    }
    if(curLoginUser.admin) {
      props.setLoginUserType("Admin");
    }
  } 

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark nav-bar">
        <img className="nav-logo" src="./icon/logo.jpg"/>
        <div className="collapse navbar-collapse nav-bar-container " id="collapsibleNavId">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            {props.menu && props.menu.map((menuObj, idx) => {
              return (
                <li className="nav-item" key={idx}>
                  <Link className="nav-link" to={menuObj.url}>
                    {menuObj.text}
                  </Link>
                </li>
              );
            })}
          </ul>

          {curLoginUser ?
            <ul className="nav-user-container">
              <li className="nav-item dropdown nav-user-container-li">
                <a className="nav-link dropdown-toggle nav-user-name" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">{props.loginUserType} - {curLoginUser.uname}</a>
                <img src={curLoginUser.image} className="nav-user-profile"/>
                <ul className="dropdown-menu">
                  {props.dropMenu && props.dropMenu.map((obj,idx) => {
                    return (
                      <li key={idx}><Link className="dropdown-item" to={obj.url}>{obj.text}</Link></li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          : null}
          

          <form className="d-flex my-2 my-lg-0 nav-search-bar">
            <input className="form-control searchbar" type="text" placeholder="Search music or artist" onChange={changeHandler} ref={inputRef}/>
            {(searchWord) ? <button type="button" className="btn btn-close search-clear-btn" onClick={searchClear}></button>
            : null}
          </form>
        </div>
        <SearchList searchWord={searchWord} displayInfo={props.displayInfo} playMusic={props.playMusic} music={props.music} artist={props.artist} />
      </nav>
      <Outlet className="container-fluid"></Outlet>
    </>
  );
}




