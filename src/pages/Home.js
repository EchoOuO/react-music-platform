import { useEffect, useState } from "react";
import FileService from "../services/FileService";
import Footer from "./Footer";
import Musicdisplay from "./components/Musicdisplay";
import Artistdisplay from "./components/Artistdisplay";
import "./Home.css";
import "./Footer.css";
import Musicplayer from "./components/Musicplayer";

export default function Home(props) {
  return (
    <>
      <h1>Home</h1>
      <Musicdisplay music={props.music} addToPlayList={props.addToPlayList} />
      <Artistdisplay music={props.music} />
      <Musicplayer
        music={props.music}
        mid={props.mid}
        playlist={props.playlist}
      />
      <Footer />
    </>
  );
}
