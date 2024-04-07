import { AES, enc } from "crypto-js";
import { useEffect, useState } from "react";
import Playlistcompo from "./components/Playlistcompo";

export default function Userpage(props) {
  const [userName, setUserName] = useState(null); // state to hold user name
  const [musicData,setMusicData] = useState(null)

  useEffect(() => {
    try {
      //Get login user name from session storage 
      let decUser = sessionStorage.getItem("LoginUser");
      if (decUser) {
        decUser = JSON.parse(AES.decrypt(decUser,'groupc').toString(enc.Utf8));
        setUserName(decUser.uname);
      } else {
        console.log("LoginUser not found in sessionStorage");
      }

      // Get music data from local storage
      const localStorageData = localStorage.getItem(props.loginUser.uid);
      setMusicData(JSON.parse(localStorageData));
    } catch (error) {
      console.log(error);
    }
  }, [props.loginUser.uid]); // Listen for changes in props.loginUser.uid

  
  return(
      <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-6 ">
          <h1 className="text-center">{userName}'s Playlist</h1>
          <Playlistcompo musicData={musicData}/>          
        </div>
      </div>
    </>
  )
}
