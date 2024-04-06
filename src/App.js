import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import Links from "./pages/Links";
import { useEffect, useState } from "react";
import FileService from "./services/FileService";
import Allmusic from "./pages/Allmusic";
import Allartist from "./pages/Allartist";
import Musicplayer from "./pages/components/Musicplayer";
function App() {
  // Log in & display links in nav bar
  const [key, setKey] = useState(null);
  const authMenu = [
    { url: "/", text: "Home" },
    { url: "/userpage", text: "User Page" },
    { url: "/logout", text: "Log out" },
  ];
  const noAuthMenu = [{ url: "/login", text: "login" }];

  // import "music.json" data
  const [music, setMusic] = useState([]);
  const [musicdisplay, setMusicdisplay] = useState([]);
  const [artist, setArtist] = useState([]);
  const [artistdisplay, setArtistdisplay] = useState([]);
  useEffect(() => {
    FileService.read("music").then(
      (response) => {
        // console.log(response.data);
        setMusic(response.data);
        // console.log(music)

        // create 6 random and different numbers
        let randomNumber = [];
        let randomMusic = [];

        while (randomNumber.length < 6) {
          const tmpNumber = Math.floor(Math.random() * 49.99);
          if (!randomNumber.includes(randomNumber)) {
            randomNumber.push(tmpNumber);
          }
        }
        // console.log(randomNumber);
        for (let idx of randomNumber) {
          // console.log(idx);
          randomMusic.push(response.data[idx]);
        }
        // console.log(randomMusic)
        setMusicdisplay(randomMusic);
      },
      (rej) => {
        console.log(rej);
      }
    );

    // import "artist" data
    FileService.read("artist").then(
      (response) => {
        // console.log(response.data);
        setArtist(response.data);

        // create 6 random and different numbers
        let randomNumber = [];
        let randomArtist = [];

        while (randomNumber.length < 6) {
          const tmpNumber = Math.floor(Math.random() * 49.99);
          if (!randomNumber.includes(tmpNumber)) {
            randomNumber.push(tmpNumber);
          }
        }
        // console.log(randomNumber);
        for (let idx of randomNumber) {
          // console.log(idx);
          randomArtist.push(response.data[idx]);
        }
        setArtistdisplay(randomArtist);
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []);

  // get data from button attributes for music/artist dispaly window 
  const [window, setWindow] = useState([])
  const [artistMusicData, setartistMusicData] = useState([])
  const displayInfo = (e) => {
    // display music
    if (e.target.attributes.mid) {
      const tmpmid = e.target.attributes.mid.value;
      // console.log(typeof tmpmid)
      const tmpdata = music.find((obj) => {
        // console.log(typeof obj.mid);
        return obj.mid === Number(tmpmid);
      });
      // console.log(tmpdata)
      setWindow(tmpdata)
      // console.log(window)
    }
    // display artist
    else if (e.target.attributes.aid) {
      const tmpaid = e.target.attributes.aid.value;
      // console.log(typeof tmpmid)
      const tmpdata = artist.find((obj) => {
        // console.log(typeof obj.mid);
        return obj.aid === Number(tmpaid);
      });
      // console.log(tmpdata)
      setWindow(tmpdata)
      // console.log(window)
    }
  };
  // show artist's music in display window
  useEffect(()=>{
    if(window.artist) {
      const tmpArtistMusicData = music.find((obj) => {return obj.artist === window.artist})
      // console.log(tmpArtistMusicData)
      setartistMusicData(tmpArtistMusicData)
      // console.log(artistMusicData)
    }
  },[window.artist])

  // ---- 如何讓player即使轉換頁面也仍存在?? ----
  // Current playing music management & Play music function
  const [currentPlay, setCurrentPlay] = useState(new Map());
  const [currentMid, setCurrentMid] = useState(null);
  const playMusic = (e) => {
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });

    const tmpplaylist = new Map();
    tmpplaylist.set(tmpmid, tmpdata);
    setCurrentPlay(tmpplaylist);
    setCurrentMid(tmpmid);

    // console.log(playlist);
  };

  // Add to playlist 
  const [playlist, setPlaylist] = useState(new Map());
  const [mid, setMid] = useState(null);

  const addToPlayList = (e) => {
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });
    // console.log(tmpmid);
    // console.log(tmpdata);
    const tmpplaylist = new Map(playlist);
    tmpplaylist.set(tmpmid, tmpdata);
    setPlaylist(tmpplaylist);
    setMid(tmpmid);
    console.log(playlist);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Links menu={key !== null ? authMenu : noAuthMenu} />}
        >
          <Route
            index
            element={<Home
              music={music}
              musicdisplay={musicdisplay}
              artist={artist}
              artistdisplay={artistdisplay}
              displayInfo={displayInfo}
              window={window}
              currentPlay={currentPlay}
              currentMid={currentMid}
              playMusic={playMusic}
              playlist={playlist}
              mid={mid}
              addToPlayList={addToPlayList}
              artistMusicData={artistMusicData}
              />}/>
          <Route 
            path="allmusic" 
            element={<Allmusic      
              music={music}
              addToPlayList={addToPlayList}
              playMusic={playMusic}
              window={window}
              currentPlay={currentPlay}
              currentMid={currentMid}
              musicdisplay={musicdisplay}
              displayInfo={displayInfo}
              artistMusicData={artistMusicData} />}/>
          <Route
            path="allartist"
            element={<Allartist 
              artist={artist}     
              music={music}
              window={window}
              currentPlay={currentPlay}
              currentMid={currentMid}
              playMusic={playMusic}
              artistdisplay={artistdisplay}
              displayInfo={displayInfo}
              artistMusicData={artistMusicData} />}/>
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
