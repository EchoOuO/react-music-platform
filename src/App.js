import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import Links from "./pages/Links";
import { useEffect, useState } from "react";
import FileService from "./services/FileService";
import Musicpage from "./pages/Allmusic";
import Allmusic from "./pages/Allmusic";
import Allartist from "./pages/Allartist";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  // Log in & display links in nav bar
  const [key, setKey] = useState(null);

  const authMenu = [
    { url: "/", text: "Home" },
    { url: "/userpage", text: "User Page" },
    { url: "/logout", text: "Log out" },
  ];
  const noAuthMenu = [
    { url: "/login", text: "Login" },
    { url: "/reg", text: "Register" },
  ];

  // import "music.json" data
  const [music, setMusic] = useState([]);
  const [musicdisplay, setMusicdisplay] = useState([]);
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
  }, []);

  // Playlist management
  const [playlist, setPlaylist] = useState(new Map());
  const [mid, setMid] = useState(null);

  const addToPlayList = (e) => {
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });

    const tmpplaylist = new Map(playlist);
    tmpplaylist.set(tmpmid, tmpdata);
    setPlaylist(tmpplaylist);
    setMid(tmpmid);

    // console.log(playlist);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Links menu={(key !== null )? authMenu : noAuthMenu} />}
        >
          <Route
            index
            element={
              <Home
                music={music}
                addToPlayList={addToPlayList}
                playlist={playlist}
                mid={mid}
                musicdisplay={musicdisplay}
              />
            }
          />
          <Route path="allmusic" element={<Allmusic music={music} />}></Route>
          <Route path="allartist" element={<Allartist music={music} />}></Route>
          <Route path="reg" element={<Register />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
