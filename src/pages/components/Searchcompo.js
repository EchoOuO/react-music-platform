import { useState, useEffect } from "react";
import { AES } from "crypto-js";
import FileService from "../../services/FileService";

export default function SearchList(props) {
  const [searchMusic, setSearchMusic] = useState([]);
  const [searchArtist, setSearchArtist] = useState([]);

  useEffect(() => {
    // import "music" data
    FileService.read("music").then(
      (response) => {
        const filteredMusic = [];
        for (const item of response.data) {
          if (item.mname.toLowerCase().includes(props.searchWord.toLowerCase())) {
            filteredMusic.push(item);
          }
        }
        setSearchMusic(filteredMusic);
      },
      (rej) => {
        console.log(rej);
      }
    );
  
    // import "artist" data
    FileService.read("artist").then(
      (response) => {
        const filteredArtist = [];
        for (const item of response.data) {
          if (item.artist.toLowerCase().includes(props.searchWord.toLowerCase())) {
            filteredArtist.push(item);
          }
        }
        setSearchArtist(filteredArtist);
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, [props.searchWord]);

  useEffect(() => {
    console.log(searchMusic);
    console.log(searchArtist);
  }, [searchMusic,searchArtist]);


  return(
    <></>
  )
}