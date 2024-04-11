import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import SearchList from "./components/Searchcompo";
import "./Link.css";

export default function Links(props) {
  const [searchWord, setSearchWord] = useState("");

  const changeHandler = (e) => {
    e.preventDefault();
    setSearchWord(e.target.value);
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark nav-bar">
        <div className="collapse navbar-collapse nav-bar-container " id="collapsibleNavId">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            {props.menu.map((menuObj, idx) => {
              return (
                <li className="nav-item" key={idx}>
                  <Link className="nav-link" to={menuObj.url}>
                    {menuObj.text}
                  </Link>
                </li>
              );
            })}
          </ul>
          <form className="d-flex my-2 my-lg-0">
            <input className="form-control me-sm-2" type="text" placeholder="Search music or artist" onChange={changeHandler}/>
          </form>
        </div>
        <SearchList searchWord={searchWord} displayInfo={props.displayInfo} />
      </nav>
      <Outlet className="container-fluid"></Outlet>
    </>
  );
}




