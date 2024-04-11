import Displayblock from "./components/Displayblock";
import Displaywindow from "./components/Displaywindow";
import "./Allartist.css";
export default function Allartist(props) {
  return (
    <>
      <div className="header">
        <div className="header-text-contianer">
          <h1>Talented Artists are Waiting for You</h1>
        </div>
        <div className="header-img-contianer">
          <img className="header-artist-img" src="./img/header-img-4.jpg" />
        </div>
      </div>
      <Displayblock 
        artist={props.artist} 
        artistdisplay={props.artist} 
        displayInfo={props.displayInfo} 
      />
      <Displaywindow 
        music={props.music}
        window={props.window} 
        playMusic={props.playMusic} 
        loginUser={props.loginUser}
        addToPlayList={props.addToPlayList}
        artistMusicData={props.artistMusicData} />
      {/* <Musicplayer
        music={props.music}
        mid={props.mid}
        playlist={props.playlist}
        currentPlay={props.currentPlay}
        currentMid={props.currentMid}
      /> */}
    </>
  );
}
