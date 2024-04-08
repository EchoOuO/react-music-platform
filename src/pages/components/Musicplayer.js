import { useEffect, useRef, useState } from "react";
import "./css/Musicplayer.css";
export default function Musicplayer(props) {
  // console.log(props.playlist);
  // console.log(audioRef);
  // console.log(curremtMusicDuration);

  const audioRef = useRef();
  const [playerStatus, setPlayerStatus] = useState({play:true, pause:false, curTime:null, end:false})

  // Music player conctrol
  const pause = () => {
    audioRef.current.pause()
    setPlayerStatus((prev)=>({...prev, pause: true, play:false}))
  }

  // 怎麼讓playmusic button按下去後，就自動trigger play function???
  const play = () => {
    audioRef.current.play()
    setPlayerStatus((prev)=>({...prev, pause: false, play:true}))
  }

  const replay = () => {
    audioRef.current.currentTime = 0;
    play()
  }

  // 要先達成 可以按照playlist撥放歌曲，才來做next / previous
  const next = () => {}

  // Save current play time to local storage
  const saveCurrentTime = () => {
    // console.log(audioRef.current.pause)
    // console.log(playerStatus.curTime)
    setPlayerStatus((prev)=>({...prev, curTime: audioRef.current.currentTime}))
    localStorage.setItem((props.loginUser) ? `${props.loginUser.uid} curMusicTime` : "Guest curMusicTime", playerStatus.curTime)
  }
  // console.log(audioRef.current)
  // console.log(!playerStatus.pause)
  // console.log(props.currentMid)
  if (audioRef.current) {
    if(props.currentMid && !playerStatus.pause) {
      setTimeout(() => {
        saveCurrentTime()
      }, 500);
    }
  }

  // get current time from local sturage and play from that moment
  useEffect(() => {
    if (audioRef.current) {
      const currentTime = localStorage.getItem("Guest curMusicTime")
      audioRef.current.currentTime = currentTime
    }
  }, [props.currentMid]);

  return (
    // Show music player and play music only if mid is not null
    <>
      {props.currentMid ? (
        <div className="player-container">
          <div className="player-button-container">
             <button className="player-button" ><img className="player-icon" src="./icon/previous.png"></img></button>
            {playerStatus.play ? 
              <button className="player-button" onClick={pause}><img className="player-icon" src="./icon/pause.png"></img></button>
              : <button className="player-button" onClick={play}><img className="player-icon" src="./icon/play.png"></img></button>
              }
              <button className="player-button" ><img className="player-icon" src="./icon/next.png"></img></button>
              <button className="player-button" onClick={replay}><img className="player-icon" src="./icon/replay.png"></img></button>
          </div>
         
          <audio
            ref={audioRef}
            className="player"
            src={`/data/music/${
              props.currentPlay.get(props.currentMid).address}.mp3`}
            controls
            autoPlay
          ></audio>
          {/* <p>{curremtMusicDuration}</p> */}
        </div>
      ) : null}
    </>
  );
}
