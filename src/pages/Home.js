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

  return (
    <>
      <h1>Home</h1>
      <Indexmusicdisplay
        music={props.music}
        addToPlayList={props.addToPlayList}
        musicdisplay={props.musicdisplay}
      />
      <button onClick={toAllMusic}>More Music</button>
      <Indexartistdisplay music={props.music} />
      <button onClick={toAllArtist}>More Artists</button>
      <Musicplayer
        music={props.music}
        mid={props.mid}
        playlist={props.playlist}
      />
      <Footer />
    </>
  );
}
