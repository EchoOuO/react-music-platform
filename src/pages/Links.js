import { Outlet, Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import SearchList from "./components/Searchcompo";
import "./Link.css";

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




