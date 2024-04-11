import Displayblock from "./components/Displayblock";
import Displaywindow from "./components/Displaywindow";
import "./Allmusic.css";
export default function Allmusic(props) {
  // console.log(props.loginUser)
  return (
    <>
      <div className="header">
        <div className="header-text-contianer">
          <h1>Explore Our Amazing Music</h1>
        </div>
        <div className="header-img-contianer">
          <img className="header-music-img" src="./img/header-img-3.jpg" />
        </div>
      </div>

      <Displayblock
        music={props.music}
        addToPlayList={props.addToPlayList}
        playMusic={props.playMusic}
        musicdisplay={props.music}
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
