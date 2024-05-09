import React from "react";
import { useNavigate } from 'react-router-dom'; 
import { useEffect } from "react";
import PostService from "../services/PostService";

function ArtistPage(props) {
  const nevigate = useNavigate();

  // check session timeout from php
  useEffect(()=>{
    PostService.database("/artistpage",{ sid: props.sessionid }).then(
      (response) => {
        console.log(response.data);
      },
      (reg) => {
        nevigate("../login")
        props.logout();
        alert("Session Timeout! Please log in again.");
        console.log(reg);
      }
    )
  },[])

  const handleDelete = (indexToDelete) => {
    props.setUploadedMusic(
      props.uploadedMusic.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <div>
      <h1>Artist Page</h1>
      {props.uploadedMusic.length > 0 ? (
        props.uploadedMusic.map((music, index) => (
          <div className="card mb-3" key={index}>
            <div className="card-body">
              <h5 className="card-title">{music.musicName}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{music.artist}</h6>
              <p className="card-text">{music.description}</p>
              <audio controls src={music.musicFile}>
                Your browser does not support the audio element.
              </audio>
              <button
                className="btn btn-danger mt-3"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No music uploaded yet.</p>
      )}
    </div>
  );
}

export default ArtistPage;
