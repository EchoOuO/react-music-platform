import { AES, enc } from "crypto-js";
import { useEffect, useState } from "react";
import Displaywindow from "./components/Displaywindow"

export default function Userpage(props) {
  const [userName, setUserName] = useState(null); // state to hold user name

  useEffect(() => {
    try {
      let decUser = sessionStorage.getItem("LoginUser");
      if (decUser) {
        decUser = JSON.parse(AES.decrypt(decUser,'groupc').toString(enc.Utf8));
        setUserName(decUser.uname);
      } else {
        console.log("LoginUser not found in sessionStorage");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(props);
  
  return(
      <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-6 ">
          <h1 className="text-center">{userName}'s Playlist</h1>
          <Displaywindow/>
        </div>
      </div>
    </>
  )
}
