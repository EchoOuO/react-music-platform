import { useState } from "react";
import "./css/Displaywindow.css"
import { useNavigate } from "react-router-dom";


export default function SearchModal(props) {
  console.log(props.selectedItem?.mid);

  const navigate = useNavigate();

  const toPlaylist = () => {
    if (props.loginUser) {
      navigate("/userpage");
    }
  };

  return (
    <>    
    
    
     {(props.selectedItem) ? 
      <div className="modal fade" id="modalId" tabIndex="-1" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true" data-bs-backdrop="false">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md"role="document"
        >
          <div className="modal-content">
            {(props.selectedItem.mid) ? 
              <>
              <div className="modal-body text-center">
                <button 
                  type="button"
                  className="btn btn-close window-close-btn"
                  data-bs-dismiss="modal"></button>
                <img className="window-img" src={props.selectedItem.image} alt=""/>
                <h3>{props.selectedItem.mname}</h3>
                <h5>Artist: {props.selectedItem.artist}</h5>
                <h5>Album:「{props.selectedItem.album}」</h5>
                <p>{props.selectedItem.description}</p>
              </div>
              <div className="modal-footer mx-auto window-footer-btn-container">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  mid={props.selectedItem.mid}
                  mname={props.selectedItem.mname}
                  artist={props.selectedItem.artist}
                  album={props.selectedItem.album}
                  address={props.selectedItem.address}
                  image={props.selectedItem.image}
                  onClick={props.playMusic}>Play music!</button>
          
                {/* {props.loginUser ? 
                  <>
                   <button 
                    className="btn btn-outline-primary" 
                    type="button"    
                    mid={props.selectedItem.mid}
                    mname={props.selectedItem.mname}
                    artist={props.selectedItem.artist}
                    album={props.selectedItem.album}
                    address={props.selectedItem.address}
                    image={props.selectedItem.image}
                    onClick={props.addToPlayList}>Add to Playlist!</button>

                    <img onClick={toPlaylist} className="window-playlist-img" data-bs-toggle="modal" data-bs-target="#modalId" src="./icon/playlist.png" />
                  </>
        
                : <p className="window-footer-text">Log in to get your own playlist!</p>} */}
              </div>
              </> : null}

            {(props.selectedItem.aid) ? 
              <>
              <div className="modal-body text-center">
                <button 
                  type="button"
                  className="btn btn-close window-close-btn"
                  data-bs-dismiss="modal"></button>
                <img className="window-img" src={props.selectedItem.image} alt=""/>
                <h3>Artist: {props.selectedItem.artist}</h3>
                <p>{props.selectedItem.description}</p>
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