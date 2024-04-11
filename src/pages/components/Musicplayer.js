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
  const next = () => {
    if (props.curPlaylistIdx < props.currentPlay.size -1) {
      props.setCurPlaylistIdx(props.curPlaylistIdx + 1)
      console.log(props.curPlaylistIdx)
      props.setPlayerStatus({play:false})
      // console.log(props.playerStatus)
    } else {
      props.setCurPlaylistIdx(0)
    }
  }

  const prev = () => {
    if (props.curPlaylistIdx > 0) {
      props.setCurPlaylistIdx(props.curPlaylistIdx - 1)
      console.log(props.curPlaylistIdx)
      props.setPlayerStatus({play:false})
    } else {
      props.setCurPlaylistIdx(props.currentPlay.size -1)
      props.setPlayerStatus({play:false})
    }
  }

  // if music reamining time = 0 , then change status

  const end = () => {
    if (audioRef.current) {
      const remaintime = audioRef.current.duration - audioRef.current.currentTime
      if (remaintime == 0) {
        if(props.currentPlay.size < 2) {
          props.setPlayerStatus((prev)=>({...prev, play:false}))
        }else{
          next()
        }
      }
    }
  }

  // Save current play time to local storage
  const saveCurrentTime = () => {
    // console.log(playerStatus.curTime)
    const curTime = audioRef.current.currentTime

    localStorage.setItem((props.loginUser) ? `${props.loginUser.uid} curMusicTime` : "Guest curMusicTime", curTime)
  }
  // console.log(audioRef.current)
  // console.log(props.currentMid)
  

  // get current time from local storage and play from that moment
  useEffect(() => {
    // console.log(audioRef.current)
    if (audioRef.current) {
      let playlist
      let currentTime
      let tmpdata
      if(props.loginUser){
        currentTime = localStorage.getItem(`${props.loginUser.uid} curMusicTime`)
        tmpdata = localStorage.getItem(props.loginUser.uid)
        // console.log(JSON.parse(tmpdata))
        playlist = JSON.parse(tmpdata)
        // console.log(playlist)
      }else if(!props.loginUser) {
        currentTime = localStorage.getItem("Guest curMusicTime")
        console.log(currentTime)
      }
      audioRef.current.currentTime = currentTime
    }
  }, [props.loginUser]);
  
  // get user's playlist (key = uid) from local storage
  useEffect(() => {
    if (props.loginUser) {
      let tmpdata = localStorage.getItem(props.loginUser.uid)
      let tmpplaylist = new Map(JSON.parse(tmpdata));
      let tmpplaylistkey = tmpplaylist.keys()
      // console.log(tmpplaylist)
      // console.log(tmpplaylistkey)
      let tmpArray = []
      for (let idx of tmpplaylistkey){
        // console.log(idx)
        tmpArray.push(idx)
      }
      // console.log(tmpArray)
      let tmpplaymid
      tmpplaymid = tmpArray[props.curPlaylistIdx]
      if (tmpplaylist) {
        props.setCurrentPlay(tmpplaylist)
        props.setCurrentMid(tmpplaymid)
      }
    }
    // console.log(props.currentPlay)
    // console.log(props.currentMid)
    // console.log(curPlaylist)
  },[props.loginUser, props.playlist, props.curPlaylistIdx])

  // 還有問題
  // useEffect(()=>{
  //   let tmpData = new Map()
  //   console.log(props.curPlaylist)
  //   tmpData.set(props.curPlaylist[props.curPlaylistIdx][1].mid,props.curPlaylist[props.curPlaylistIdx][1])
  //   console.log(tmpData)
  //   if (props.curPlaylist != {}) {
  //     props.setCurrentPlay(tmpData)
  //     props.setCurrentMid(props.curPlaylist[props.curPlaylistIdx][1].mid)
  //   }
  // },[props.curPlaylist])


  // play music based on playerStatus
  useEffect(()=>{
    if (audioRef.current) {
      // console.log(props.playerStatus.play)
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
             <button className="player-button" onClick={prev} disabled={props.currentPlay.size < 2}><img className="player-icon" src="./icon/previous.png"></img></button>
            {props.playerStatus.play ? 
              <button className="player-button" onClick={pause}><img className="player-icon" src="./icon/pause.png"></img></button>
              : <button className="player-button" onClick={play}><img className="player-icon" src="./icon/play.png"></img></button>
              }
              <button className="player-button" onClick={next} disabled={props.currentPlay.size < 2} ><img className="player-icon" src="./icon/next.png"></img></button>
              <button className="player-button" onClick={replay}><img className="player-icon" src="./icon/replay.png"></img></button>
          </div>
          
          <audio
            ref={audioRef}
            className="player"
            src={`/data/music/${
              props.currentPlay.get(props.currentMid).address}.mp3`}
            controls
            // autoPlay
            controlsList="nodownload ratechange noplaybackrate"
            onTimeUpdate={() => {saveCurrentTime(); end()}}
          ></audio>

          <div className="player-info-container">
            <img className="player-music-img" src={props.currentPlay.get(props.currentMid).image} alt=""/>
            <div className="player-text-container">
              <div className="player-text-small-container">
                <p className="player-text player-text-music">{props.currentPlay.get(props.currentMid).mname}</p>
                
                {props.playerStatus.play ?
                  <img className="player-icon-playing" src="./img/musicplaying.gif" />
                : null}
              </div>
              <p className="player-text player-text-artist">{props.currentPlay.get(props.currentMid).artist}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
