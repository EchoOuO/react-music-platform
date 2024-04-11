import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AES, enc } from "crypto-js";
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import Links from "./pages/Links";
import { useEffect, useState, useRef } from "react";
import FileService from "./services/FileService";
import Allmusic from "./pages/Allmusic";
import Allartist from "./pages/Allartist";
import Musicplayer from "./pages/components/Musicplayer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Userpage from "./pages/Userpage";
import Playlistcompo from "./pages/components/Playlistcompo";
import MusicPlayerClass from "./classes/MusicPlayerClass";
import Adminpage from "./pages/Adminpage";
import Uploadmusic from "./pages/Uploadmusic";
import Artistpage from "./pages/Artistpage";

function App() {
  // Log in & display links in nav bar
  const [key, setKey] = useState(null);
  const [users, setUsers] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const [uploadedMusic, setUploadedMusic] = useState([]);

  const loginKey = (newKey) => {
    //loginKey = null = not logged in
    setKey(newKey);
  };

  const authMenu = [
    { url: "/", text: "Home" },
    { url: "/allmusic", text: "All Music" },
    { url: "/allartist", text: "All Artist" },
    { url: "/userpage", text: "User Page" },
    { url: "/upload", text: "Upload Music" },
    { url: "/artist", text: "Artist Page" },
    { url: "/admin", text: "Admin Page" },
    { url: "/logout", text: "Log out" },
  ];

  const noAuthMenu = [
    { url: "/", text: "Home" },
    { url: "/allmusic", text: "All Music" },
    { url: "/allartist", text: "All Artist" },
    { url: "/login", text: "Login" },
    { url: "/reg", text: "Register" },
  ];

  useEffect(() => {
    // Check if there's a logged in user in session storage
    const storedUser = sessionStorage.getItem("LoginUser");
    if (storedUser) {
      const decryptedUser = AES.decrypt(storedUser, 'groupc').toString(enc.Utf8);
      setLoginUser(JSON.parse(decryptedUser));
      setKey(JSON.parse(decryptedUser).email); // Assuming email can uniquely identify a user
    }
    
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

  const Auth = (userObj) => {
    //userObj = Information entered by users
    for (let user of users) {
      if (user.email === userObj.email && user.password === userObj.password) {
        const cipherUser = AES.encrypt(
          JSON.stringify(user),
          "groupc"
        ).toString(); //AESkey = groupc
        sessionStorage.setItem("LoginUser", cipherUser); //Save to session storage as jsondata
        // console.log(user)
        setLoginUser(user);
        loginKey(user.email);
        setPlayerStatus({play:false})
        return true; // Returns true if login succeeds
      }
    }
    return false; // Returns false if login fails
  };

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
          if (!randomNumber.includes(tmpNumber)) {
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
  const [window, setWindow] = useState([]);
  const [artistMusicData, setartistMusicData] = useState([]);
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
      setWindow(tmpdata);
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
      setWindow(tmpdata);
      // console.log(window)
    }
  };

  // show artist's music in display window
  useEffect(() => {
    if (window.artist) {
      const tmpArtistMusicData = music.find((obj) => {
        return obj.artist === window.artist;
      });
      // console.log(tmpArtistMusicData)
      setartistMusicData(tmpArtistMusicData);
      // console.log(artistMusicData)
    }
  }, [window.artist]);

  // Current playing music management & Play music function
  const [currentPlay, setCurrentPlay] = useState(new Map());
  const [currentMid, setCurrentMid] = useState(null);
  const [playerStatus, setPlayerStatus] = useState({play:false, end:false})
  
  // console.log(playerStatus)
  
  const playMusic = (e) => {
    // console.log('play!!')
    const tmpmid = e.target.attributes.mid.value;
    const tmpdata = music.find((obj) => {
      // console.log(obj.mid);
      return obj.mid == tmpmid;
    });
    const tmpplaylist = new Map();
    tmpplaylist.set(tmpmid, tmpdata); 

    // if(tmpplaylist.values == currentPlay.values) {
    //   alert('Playing now!')
    // }else {
      // console.log(tmpplaylist)
      setCurrentPlay(tmpplaylist);
      setCurrentMid(tmpmid);
      setPlayerStatus({play:true})

      // console.log(playlist);

      // save music data in local storage
      localStorage.setItem((loginUser) ? `${loginUser.uid} curMusic` : "Guest curMusic", JSON.stringify(Object.fromEntries(tmpplaylist)))
      localStorage.setItem((loginUser) ? `${loginUser.uid} curMusicID` : "Guest curMusicID", tmpmid)
      // remove current play time
      // localStorage.removeItem("Guest curMusicTime")

      // change playstatus to control music player
    
  };

  // retrieve current play music from local storage
  useEffect(() => {
    // for guests
    if (!loginUser) {
      if (
        localStorage.getItem("Guest curMusic") &&
        localStorage.getItem("Guest curMusicID")
      ) {
        const tmpdata = localStorage.getItem("Guest curMusic");
        const tmpmid = localStorage.getItem("Guest curMusicID");
        // console.log(tmpmid)
        const tmpplaylist = new Map(Object.entries(JSON.parse(tmpdata)));
        // console.log(tmpplaylist)
        setCurrentPlay(tmpplaylist);
        setCurrentMid(tmpmid);
        // console.log(currentPlay);
        // console.log(currentMid);
      }else {
        setCurrentPlay(new Map());
        setCurrentMid(null);
        setPlayerStatus({play:false, end:false})
      }
    }  
    // for login users
    if (loginUser) {
      if (
        localStorage.getItem(`${loginUser.uid} curMusic`) &&
        localStorage.getItem(`${loginUser.uid} curMusicID`)
      ) {
        const tmpdata = localStorage.getItem(`${loginUser.uid} curMusic`);
        const tmpmid = localStorage.getItem(`${loginUser.uid} curMusicID`);
        const tmpplaylist = new Map(Object.entries(JSON.parse(tmpdata)));
        // console.log(tmpplaylist)
        setCurrentPlay(tmpplaylist);
        setCurrentMid(tmpmid);
      }else {
        setCurrentPlay(new Map());
        setCurrentMid(null);
        setPlayerStatus({play:false, end:false})
      }
    }
  },[loginUser])

  // Add to playlist
  const [playlist, setPlaylist] = useState(new Map());
  const [mid, setMid] = useState(null);

  const addToPlayList = (e) => {
    // get data from button's arrtributes
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
    // console.log(playlist)

    if (loginUser) {
      // Save playlist in local storage with key = login user id
      const tmpArray = [];
      for (let data of tmpplaylist) {
        tmpArray.push(data);
      }
      localStorage.setItem(loginUser.uid, JSON.stringify(tmpArray));
      setMid(tmpmid);
    } else {
      alert("Please log in!");
    }
    // console.log(playlist);
  };


  const logout = () => {
    sessionStorage.removeItem("LoginUser"); // Remove user from session storage on logout
    setLoginUser(null);
    loginKey(null);
    setPlayerStatus({play:false, end:false})
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
                currentPlay={currentPlay}
                currentMid={currentMid}
                playMusic={playMusic}
                playlist={playlist}
                mid={mid}
                addToPlayList={addToPlayList}
                artistMusicData={artistMusicData}
                setUploadedMusic={setUploadedMusic}
                uploadedMusic={uploadedMusic}
                loginUser={loginUser}
              />
            }
          />
          <Route
            path="allmusic"
            element={
              <Allmusic
                music={music}
                addToPlayList={addToPlayList}
                playMusic={playMusic}
                window={window}
                currentPlay={currentPlay}
                currentMid={currentMid}
                musicdisplay={musicdisplay}
                displayInfo={displayInfo}
                artistMusicData={artistMusicData}
              />
            }
          />
          <Route
            path="allartist"
            element={
              <Allartist
                artist={artist}
                music={music}
                window={window}
                currentPlay={currentPlay}
                currentMid={currentMid}
                playMusic={playMusic}
                artistdisplay={artistdisplay}
                displayInfo={displayInfo}
                artistMusicData={artistMusicData}
              />
            }
          />
          
          <Route
            path="/upload"
            element={<Uploadmusic setUploadedMusic={setUploadedMusic} />}
          />
          <Route path="/admin" element={<Adminpage />} />
          <Route
            path="/artist"
            element={
              <Artistpage
                uploadedMusic={uploadedMusic}
                setUploadedMusic={setUploadedMusic}
              />
            }
          />
          <Route path="allmusic" element={<Allmusic music={music} />}></Route>
          <Route path="allartist" element={<Allartist music={music} />}></Route>
          <Route path="userpage" element={<Userpage loginUser={loginUser} playMusic={playMusic}>
              <Playlistcompo loginUser={loginUser}/></Userpage>} />
          <Route path="reg" element={<Register />}></Route>
          <Route
            path="login"
            element={<Login auth={Auth} loginKey={loginKey} />}
          ></Route>
          <Route path="logout" element={<Logout logout={logout} />}></Route>
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>

      {/* music player won't be stoped even user being navigated to another browser */}
      <Musicplayer
        music={music}
        mid={mid}
        playlist={playlist}
        currentPlay={currentPlay}
        currentMid={currentMid}
        loginUser={loginUser}
        playerStatus={playerStatus}
        setPlayerStatus={setPlayerStatus}
        artistMusicData={artistMusicData}
       />
    </BrowserRouter>
  );
}

export default App;
