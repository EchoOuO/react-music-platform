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

  

  return (
    <>
      <h1>Home</h1>
      <Indexmusicdisplay
        music={props.music}
        addToPlayList={props.addToPlayList}
        playMusic={props.playMusic}
        musicdisplay={props.musicdisplay}
        displayInfo={props.displayInfo}
        window={props.window} 
        artistMusicData={props.artistMusicData}
      />
      <button
        className="btn btn-primary btn-lg morebutton"
        onClick={toAllMusic}
      >
        Explore All Music
      </button>

      <Indexartistdisplay
        music={props.music}
        window={props.window}
        playMusic={props.playMusic} 
        artistdisplay={props.artistdisplay}
        displayInfo={props.displayInfo}
        artistMusicData={props.artistMusicData}
      />
      <button
        className="btn btn-primary btn-lg morebutton"
        onClick={toAllArtist}
      >
        Explore All Artists
      </button>

      <Musicplayer
        music={props.music}
        mid={props.mid}
        playlist={props.playlist}
        currentPlay={props.currentPlay}
        currentMid={props.currentMid}
      />

      <Displaywindow 
        music={props.music}
        window={props.window} 
        playMusic={props.playMusic} 
        addToPlayList={props.addToPlayList}
        artistMusicData={props.artistMusicData} />
      <Footer />
    </>
  );
}
