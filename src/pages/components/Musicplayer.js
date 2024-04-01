import { useEffect } from "react";
import "./css/Musicplayer.css";
export default function Musicplayer(props) {
  // Handle the case where track data is not available
  const musicid = props.mid;
  if (!musicid) {
    return null;
  }

  return (
    <>
      <div className="playercontainer">
        <audio
          className="player"
          src={`/data/music/${props.playlist.get(musicid).address}.mp3`}
          controls
        ></audio>
      </div>
    </>
  );
}
