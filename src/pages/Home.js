import { useEffect, useState } from "react";
import Footer from "./Footer";
import Indexmusicdisplay from "./components/Indexmusicdisplay";
import Indexartistdisplay from "./components/Indexartistdisplay";
import "./Home.css";
import "./Footer.css";
import Musicplayer from "./components/Musicplayer";
import { useNavigate } from "react-router-dom";
import Displaywindow from "./components/Displaywindow";

export default function Home(props) {
  const navigate = useNavigate();

  function toAllMusic() {
    navigate("/allmusic");

    // move to top of page
    window.scrollTo(0, 0);
  }

  function toAllArtist() {
    navigate("/allartist");

    // move to top of page
    window.scrollTo(0, 0);
  }

  // ---- 搬到App.js ----
  // Add to playlist 
  const [playlist, setPlaylist] = useState(new Map());
  const [mid, setMid] = useState(null);

  const addToPlayList = (e) => {
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = props.music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });
    // console.log(tmpmid);
    // console.log(tmpdata);
    const tmpplaylist = new Map(playlist);
    tmpplaylist.set(tmpmid, tmpdata);
    setPlaylist(tmpplaylist);
    setMid(tmpmid);
    console.log(playlist);
  };

  // ---- 搬到App.js，如何讓player即使轉換頁面也仍存在?? ----
  // Current playing music management & Play music function
  const [currentPlay, setCurrentPlay] = useState(new Map());
  const [currentMid, setCurrentMid] = useState(null);
  const playMusic = (e) => {
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = props.music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });

    const tmpplaylist = new Map();
    tmpplaylist.set(tmpmid, tmpdata);
    setCurrentPlay(tmpplaylist);
    setCurrentMid(tmpmid);

    // console.log(playlist);
  };

  

  return (
    <>
      <h1>Home</h1>
      <Indexmusicdisplay
        music={props.music}
        addToPlayList={addToPlayList}
        playMusic={playMusic}
        musicdisplay={props.musicdisplay}
        displayInfo={props.displayInfo}
      />
      <button
        className="btn btn-primary btn-lg morebutton"
        onClick={toAllMusic}
      >
        Explore All Music
      </button>

      <Indexartistdisplay
        music={props.music}
        artistdisplay={props.artistdisplay}
      />
      <button
        className="btn btn-primary btn-lg morebutton"
        onClick={toAllArtist}
      >
        Explore All Artists
      </button>

      <Musicplayer
        music={props.music}
        mid={mid}
        playlist={playlist}
        currentPlay={currentPlay}
        currentMid={currentMid}
      />

      <Displaywindow window={props.window} playMusic={playMusic} addToPlayList={addToPlayList} />
      <Footer />
    </>
  );
}
