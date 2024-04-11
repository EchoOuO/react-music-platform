import React, { useState, useEffect } from "react";
import FileService from "../../services/FileService";
import Displaywindow from "./Displaywindow";

export default function SearchList(props) {
  const [searchMusic, setSearchMusic] = useState([]);
  const [searchArtist, setSearchArtist] = useState([]);

  useEffect(() => {
    if (props.searchWord.length >= 2) {
      // import "music" data
      FileService.read("music").then(
        (response) => {
          const filteredMusic = response.data.filter(item =>
            item.mname.toLowerCase().includes(props.searchWord.toLowerCase())
          );
          setSearchMusic(filteredMusic);
        },
        (rej) => {
          console.log(rej);
        }
      );
    
      // import "artist" data
      FileService.read("artist").then(
        (response) => {
          const filteredArtist = response.data.filter(item =>
            item.artist.toLowerCase().includes(props.searchWord.toLowerCase())
          );
          setSearchArtist(filteredArtist);
        },
        (rej) => {
          console.log(rej);
        }
      );
    } else {
      setSearchMusic([]);
      setSearchArtist([]);
    }
  }, [props.searchWord]);
  

  return props.searchWord.length >= 2 ? (
    <div className="search-results">
      <div className="search-results-music">
        <h4 className="text-center">Music</h4>
        <div className="button-group">
          {searchMusic.map((music, index) => (
            <button type="button" className="btn btn-outline-primary btn-sm m-2" data-bs-toggle="modal" data-bs-target="#modalId" key={index}>{music.mname}</button>
          ))}
        </div>
      </div>
      <div className="search-results-artist mt-4">
        <h4 className="text-center">Artists</h4>
        <div className="button-group">
          {searchArtist.map((artist, index) => (
            <button type="button" className="btn btn-outline-primary btn-sm m-2" data-bs-toggle="modal" data-bs-target="#modalId" key={index} >{artist.artist}</button>
          ))}
          {selectedItem && (
        <Displaywindow />
        )}
        </div>
      </div>
    </div>
  ) : null;
}