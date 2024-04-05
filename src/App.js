import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import Links from "./pages/Links";
import { useEffect, useState } from "react";
import FileService from "./services/FileService";
import Allmusic from "./pages/Allmusic";
import Allartist from "./pages/Allartist";
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
          if (!randomNumber.includes(randomNumber)) {
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

  // dispaly window 
  const [window, setWindow] = useState([])
  const displayInfo = (e) => {
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });
    setWindow(tmpdata)
    // console.log(window)
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
            element={
              <Home
                music={music}
                musicdisplay={musicdisplay}
                artist={artist}
                artistdisplay={artistdisplay}
                displayInfo={displayInfo}
                window={window}
              />
            }
          />
          <Route path="allmusic" element={<Allmusic music={music} />}></Route>
          <Route
            path="allartist"
            element={<Allartist artist={artist} />}
          ></Route>
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
