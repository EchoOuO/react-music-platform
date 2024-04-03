import { useEffect, useRef, useState } from "react";
import "./css/Musicplayer.css";
export default function Musicplayer(props) {
  const audioRef = useRef(null);
  const [currentMusicIdx, setCurrentMusicIdx] = useState(null);
  const [curremtMusicDuration, setCurrentMusicDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      setCurrentMusicDuration(audioRef.current.duration);
      setCurrentMusicIdx(props.mid);
    }
  }, []);

  // console.log(props.playlist);
  // console.log(audioRef);
  // console.log(curremtMusicDuration);

  const playNext = () => {};
  const playPrev = () => {};
  return (
    // Show music player and play music only if mid is not null
    <>
      {props.currentMid ? (
        <div className="playercontainer">
          <button>Prev</button>
          <button>Next</button>
          <audio
            ref={audioRef}
            className="player"
            src={`/data/music/${
              props.currentPlay.get(props.currentMid).address
            }.mp3`}
            controls
            autoPlay
          ></audio>
          {/* <p>{curremtMusicDuration}</p> */}
        </div>
      ) : null}
    </>
  );
}
