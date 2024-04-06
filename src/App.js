import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AES, enc } from "crypto-js";

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
import Logout from "./pages/Logout";
import Userpage from "./pages/Userpage";

function App() {
  // Log in & display links in nav bar
  const [key, setKey] = useState(null);
  const [users, setUsers] = useState(null);
  const [loginUser, setLoginUser] = useState(null);

  const loginKey = (newKey) =>{     //loginKey = null = not logged in
    setKey(newKey);
  }

  const authMenu = [
    { url: "/", text: "Home" },
    { url: "/userpage", text: "User Page" },
    { url: "/logout", text: "Log out" },
  ];

  const noAuthMenu = [
    { url: "/", text: "Home" },
    { url: "/login", text: "Login" },
    { url: "/reg", text: "Register" },
  ];

  useEffect(() => {
    //import user json data
    FileService.read("user").then(
      (response) => {
        setUsers(response.data);
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []); 

  const Auth = (userObj) => {   //userObj = Information entered by users
    for (let user of users) {
      if (user.email === userObj.email && user.password === userObj.password) {
        const cipherUser = AES.encrypt(JSON.stringify(user),'groupc').toString(); //AESkey = groupc
        sessionStorage.setItem("LoginUser", cipherUser); //Save to session storage as jsondata
        setLoginUser(user);
        loginKey(user.email);
        return true; // Returns true if login succeeds
      }
    }
    return false; // Returns false if login fails
  };
  

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

  const logout = ()=>{
    setLoginUser(null);
    loginKey(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Links menu={(key !== null )? authMenu : noAuthMenu} />}>
          <Route index element={<Home music={music} addToPlayList={addToPlayList} playlist={playlist} mid={mid}  musicdisplay={musicdisplay}/>}/>
          <Route path="allmusic" element={<Allmusic music={music} />}></Route>
          <Route path="allartist" element={<Allartist music={music} />}></Route>
          <Route path="userpage" element={<Userpage/>}></Route>
          <Route path="reg" element={<Register />}></Route>
          <Route path="login" element={<Login auth={Auth} loginKey={loginKey}/>}></Route>
          <Route path="logout" element={<Logout logout={logout}/>}></Route>
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
