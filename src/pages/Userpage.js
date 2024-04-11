// Userpage.js
import { AES, enc } from "crypto-js";
import { useEffect, useState } from "react";
import Playlistcompo from "./components/Playlistcompo";
import { Link } from 'react-router-dom'; 
import "./Userpage.css"
export default function Userpage(props) {
  const [userName, setUserName] = useState(null); // state to hold user name
  const [musicData, setMusicData] = useState(props.musicData);

  // console.log(props.loginUser);

  const uid = props.loginUser ? props.loginUser.uid : null; // if user logged in or not

  useEffect(() => {
    //Get login user name from session storage 
    let decUser = sessionStorage.getItem("LoginUser");
    if (decUser) {
      decUser = JSON.parse(AES.decrypt(decUser,'groupc').toString(enc.Utf8));
      setUserName(decUser.uname);
    }

    const localStorageData = localStorage.getItem(uid);
    setMusicData(JSON.parse(localStorageData));
  }, [uid]); 

  const updateMusicData = (updatedMusicData) => {
    setMusicData(updatedMusicData);
    localStorage.setItem(uid, JSON.stringify(updatedMusicData));
  };
  
  return (
    <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-10">
          <h1 className="text-center">{userName}'s Playlist</h1>
          <button className="btn btn-outline-primary playlist-btn" onClick={props.playplaylist}>Play this playlist</button>
          {musicData && musicData.length > 0 ? ( 
            <Playlistcompo musicData={musicData} uid={uid} playMusic={props.playMusic} onDelete={updateMusicData} />
          ) : (
            <>
              <h5 className="text-center mt-5">You haven't added music in the playlist.</h5>
              <h5 className="text-center"><Link to="/">Let's find music!</Link></h5> 
            </>
          )}
        </div>
      </div>
    </>
  );
}
