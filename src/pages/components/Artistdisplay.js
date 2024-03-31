import { useEffect } from "react";
import FileService from "../../services/FileService";
import Displayblock from "./Displayblock";
export default function Artistdisplay(props) {
  useEffect(() => {
    const artist = FileService.read("music").then(
      (response) => {
        // console.log(response);
      },
      (rej) => {
        // console.log(rej);
      }
    );
  }, []);
  return (
    <>
      <h1>Artistdisplay</h1>
      <Displayblock />
    </>
  );
}
