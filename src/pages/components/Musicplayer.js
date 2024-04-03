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
    // Show music player only if playlist is not empty
    <>
      {props.mid ? (
        <div className="playercontainer">
          <audio
            ref={audioRef}
            className="player"
            src={`/data/music/${props.playlist.get(props.mid).address}.mp3`}
            controls
            autoPlay
          ></audio>
          <button>Prev</button>
          <button>Next</button>

          <p>{curremtMusicDuration}</p>
        </div>
      ) : null}
    </>
  );
}
