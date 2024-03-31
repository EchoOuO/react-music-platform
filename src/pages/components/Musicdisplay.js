import { useEffect, useState } from "react";
import FileService from "../../services/FileService";
import Displayblock from "./Displayblock";
export default function Musicdisplay(props) {
  const [music, setMusic] = useState([]);
  useEffect(() => {
    FileService.read("music").then(
      (response) => {
        // console.log(response);
        setMusic(response.data);
        // console.log(music);
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []);

  const [playlist, setPlaylist] = useState({});

  return (
    <>
      <h1>Musicdisplay</h1>
      <Displayblock music={music} />
    </>
  );
}
