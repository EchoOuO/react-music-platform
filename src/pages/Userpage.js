import { AES, enc } from "crypto-js";
import { useEffect, useState } from "react";
import Playlistcompo from "./components/Playlistcompo";

export default function Userpage(props) {
  const [userName, setUserName] = useState(null); // state to hold user name
  const [musicData,setMusicData] = useState([])

  console.log(props.loginUser);

  const uid = props.loginUser ? props.loginUser.uid : null; // if user logged in or not

  useEffect(() => {
      //Get login user name from session storage 
      let decUser = sessionStorage.getItem("LoginUser");
      if (decUser) {
        decUser = JSON.parse(AES.decrypt(decUser,'groupc').toString(enc.Utf8));
        setUserName(decUser.uname);}

      const localStorageData = localStorage.getItem(uid);
        setMusicData(JSON.parse(localStorageData));
  }, [uid]); 

      // Get music data from local storage

      console.log(musicData);

  
  return(
      <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-6 ">
          <h1 className="text-center">{userName}'s Playlist</h1>
          <Playlistcompo musicData={musicData} uid={uid}/>    
        </div>
      </div>
    </>
  )
}
