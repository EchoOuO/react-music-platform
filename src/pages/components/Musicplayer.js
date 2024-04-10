import { useEffect, useRef, useState } from "react";
import "./css/Musicplayer.css";
export default function Musicplayer(props) {
  // console.log(props.playlist);
  // console.log(props.currentMid);
  // console.log(curremtMusicDuration);
  // console.log(props.playerStatus)

  const audioRef = useRef();

  // Music player conctrol
  const pause = () => {
    audioRef.current.pause()
    props.setPlayerStatus((prev)=>({...prev, play:false}))
  }

  const play = () => {
    audioRef.current.play()
    props.setPlayerStatus((prev)=>({...prev, play:true}))
  }

  const replay = () => {
    audioRef.current.currentTime = 0;
    play()
  }

  // 要先達成 可以按照playlist撥放歌曲，  才來做next / previous
  const next = () => {}

  // Save current play time to local storage
  const saveCurrentTime = () => {
    // console.log(playerStatus.curTime)
    const curTime = audioRef.current.currentTime

    localStorage.setItem((props.loginUser) ? `${props.loginUser.uid} curMusicTime` : "Guest curMusicTime", curTime)
  }
  // console.log(audioRef.current)
  // console.log(props.currentMid)
  

  // get current time from local storage and play from that moment
  // 這邊重複登入登出會抓不到使用者的音樂 (在)
  useEffect(() => {
    console.log(audioRef.current)
    if (audioRef.current) {
      console.log(123)
      let currentTime
      if(props.loginUser){
        currentTime = localStorage.getItem(`${props.loginUser.uid} curMusicTime`)
      }else if(!props.loginUser) {
        currentTime = localStorage.getItem("Guest curMusicTime")
      }
      audioRef.current.currentTime = currentTime
    }
  }, [props.loginUser]);

  // play music based on playerStatus
  useEffect(()=>{
    if (audioRef.current) {
      console.log(props.playerStatus.play)
      if (props.playerStatus.play) {
        audioRef.current.play()
        // console.log("play!")
      }else if(!props.playerStatus.play) {
        audioRef.current.pause()
        // console.log("pause!")
      }
    }
  },[props.playerStatus])

  return (
    // Show music player and play music only if mid is not null
    <>
      {props.currentMid ? (
        <div className="player-container">
          <div className="player-button-container">
             <button className="player-button" ><img className="player-icon" src="./icon/previous.png"></img></button>
            {props.playerStatus.play ? 
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
            // autoPlay
            onTimeUpdate={() => saveCurrentTime()}
          ></audio>
          {/* <p>{curremtMusicDuration}</p> */}
        </div>
      ) : null}
    </>
  );
}
