import { Outlet, Link } from "react-router-dom";
export default function Links(props) {
  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="collapse navbar-collapse" id="collapsibleNavId">
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
        </div>
      </nav>
      <Outlet className="container-fluid"></Outlet>
    </>
  );
}
