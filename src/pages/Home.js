import { useEffect, useState } from "react";
import Footer from "./Footer";
import Indexmusicdisplay from "./components/Indexmusicdisplay";
import Indexartistdisplay from "./components/Indexartistdisplay";
import "./Home.css";
import "./Footer.css";
import Musicplayer from "./components/Musicplayer";
import { useNavigate } from "react-router-dom";

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

  // Add to playlist
  const [playlist, setPlaylist] = useState(new Map());
  const [mid, setMid] = useState(null);

  const addToPlayList = (e) => {
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = props.music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });

    const tmpplaylist = new Map(playlist);
    tmpplaylist.set(tmpmid, tmpdata);
    setPlaylist(tmpplaylist);
    setMid(tmpmid);

    // console.log(playlist);
  };

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
      />
      <button onClick={toAllMusic}>More Music</button>

      <Indexartistdisplay
        music={props.music}
        artistdisplay={props.artistdisplay}
      />
      <button onClick={toAllArtist}>More Artists</button>

      <Musicplayer
        music={props.music}
        mid={mid}
        playlist={playlist}
        currentPlay={currentPlay}
        currentMid={currentMid}
      />
      <Footer />
    </>
  );
}
