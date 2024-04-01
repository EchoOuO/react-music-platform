import { useEffect, useState } from "react";
import FileService from "../../services/FileService";
import Displayblock from "./Displayblock";
export default function Musicdisplay(props) {
  return (
    <>
      <h1>Musicdisplay</h1>
      <Displayblock music={props.music} addToPlayList={props.addToPlayList} />
    </>
  );
}
