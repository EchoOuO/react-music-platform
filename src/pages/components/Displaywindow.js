import { useState } from "react";
import "./css/Displaywindow.css"
import { useNavigate } from "react-router-dom";
export default function Displaywindow(props) {
  // console.log(props.loginUser)
  // console.log(props.music)
  // console.log(props.artistMusicData)

  const navigate = useNavigate()

  const toPlaylist = () => {
    if (props.loginUser) {
      navigate("/userpage")
    }
  }
  
  return (
    <>
    {(props.window) ? 
      <div className="modal fade"
        id="modalId"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalTitleId"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md"
          role="document"
        >
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title" id="modalTitleId">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}

            {(props.window.mid) ? 
              <>
              <div className="modal-body text-center">
                <button 
                  type="button"
                  className="btn btn-close window-close-btn"
                  data-bs-dismiss="modal"></button>
                <img className="window-img" src={props.window.image} alt=""/>
                <h3>{props.window.mname}</h3>
                <h5>Artist: {props.window.artist}</h5>
                <h5>Album:「{props.window.album}」</h5>
                <p>{props.window.description}</p>
              </div>
              <div className="modal-footer mx-auto window-footer-btn-container">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  mid={props.window.mid}
                  mname={props.window.mname}
                  artist={props.window.artist}
                  album={props.window.album}
                  address={props.window.address}
                  image={props.window.image}
                  onClick={props.playMusic}>Play music!</button>
          
                {props.loginUser ? 
                  <>
                   <button 
                    className="btn btn-outline-primary" 
                    type="button"    
                    mid={props.window.mid}
                    mname={props.window.mname}
                    artist={props.window.artist}
                    album={props.window.album}
                    address={props.window.address}
                    image={props.window.image}
                    onClick={props.addToPlayList}>Add to Playlist!</button>

                    <img onClick={toPlaylist} className="window-playlist-img" data-bs-toggle="modal" data-bs-target="#modalId" src="./icon/playlist.png" />
                  </>
        
                : <p className="window-footer-text">Log in to get your own playlist!</p>}
              </div>
              </> : null}

            {(props.window.aid) ? 
              <>
              <div className="modal-body text-center">
                <button 
                  type="button"
                  className="btn btn-close window-close-btn"
                  data-bs-dismiss="modal"></button>
                <img className="window-img" src={props.window.image} alt=""/>
                <h3>Artist: {props.window.artist}</h3>
                <p>{props.window.description}</p>
              </div>

              {(props.artistMusicData) ? 
                <div className="modal-footer mx-auto">
                  <img className="artist-music-img" src={props.artistMusicData.image} alt=""/>
                  <p>「{props.artistMusicData.album}」</p>
                  <p>{props.artistMusicData.mname}</p>
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    mid={props.artistMusicData.mid}
                    mname={props.artistMusicData.mname}
                    artist={props.artistMusicData.artist}
                    album={props.artistMusicData.album}
                    address={props.artistMusicData.address}
                    image={props.artistMusicData.image}
                    onClick={props.playMusic}>Play music!</button>
                </div> : null}
         
            </> : null}
          </div>
        </div>
      </div> : null}
    </>
  );
}
