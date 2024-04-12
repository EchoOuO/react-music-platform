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
import Footer from "./pages/Footer";


function App() {
  // Log in & display links in nav bar
  const [key, setKey] = useState(null);
  const [users, setUsers] = useState(null);
  const [userType, setUserType] = useState(null)
  const [loginUser, setLoginUser] = useState(null);
  const [uploadedMusic, setUploadedMusic] = useState([]);

  const loginKey = (newKey) => {
    //loginKey = null = not logged in
    setKey(newKey);
  };

  const userMenu = [
    { url: "/", text: "Home" },
    { url: "/allmusic", text: "All Music" },
    { url: "/allartist", text: "All Artist" },
    { url: "/userpage", text: "User Page" },
    { url: "/logout", text: "Log out" },
  ];

  const artistMenu = [
    { url: "/", text: "Home" },
    { url: "/allmusic", text: "All Music" },
    { url: "/allartist", text: "All Artist" },
    { url: "/userpage", text: "User Page" },
    { url: "/artist", text: "Artist Page" },
    { url: "/upload", text: "Upload Music" },
    { url: "/logout", text: "Log out" },
  ];

  const adminMenu = [
    { url: "/", text: "Home" },
    { url: "/allmusic", text: "All Music" },
    { url: "/allartist", text: "All Artist" },
    { url: "/admin", text: "Admin Page" },
    { url: "/logout", text: "Log out" },
  ];

  const noAuthMenu = [
    { url: "/", text: "Home" },
    { url: "/allmusic", text: "All Music" },
    { url: "/allartist", text: "All Artist" },
    { url: "/login", text: "Login" },
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
        localStorage.setItem("users",JSON.stringify(response.data))
        // console.log(response.data)
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []);

  useEffect(()=>{
    // initial nav bar links
    if (userType) {
      setUserType("")
    } else {
      setUserType(noAuthMenu)
    } 
  },[])

  const Auth = (userObj) => {
    //userObj = Information entered by users
    const usersFromLocalStorage = JSON.parse(
      localStorage.getItem("users") || "[]"
    );
    const user = usersFromLocalStorage.find(
      (user) =>
        user.email === userObj.email && user.password === userObj.password
    );

    if (user) {
      const cipherUser = AES.encrypt(JSON.stringify(user), "groupc").toString(); //AESkey = groupc
      sessionStorage.setItem("LoginUser", cipherUser); //Save to session storage as jsondata
      setLoginUser(user);
      loginKey(user.email);
      setPlayerStatus({ play: false });
      if (user.user) {
        setUserType(userMenu)
        // console.log("user!")
      }
      if(user.artist) {
        setUserType(artistMenu)
        // console.log("artist!")
      }
      if(user.admin) {
        setUserType(adminMenu)
        // console.log("admin!")
      }
      return true; // Returns true if login succeeds
    } else {
      // Invalid email or password
      alert("Invalid email or password");
      return false; // Returns false if login fails
    }
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
        setPlayerStatus({play:false})
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
        console.log(tmpplaylist)
        console.log(data)
        tmpArray.push(data);
      }
      localStorage.setItem(loginUser.uid, JSON.stringify(tmpArray));
      setMid(tmpmid);
    } else {
      alert("Please log in!");
    }
    // console.log(playlist);
  };

  // play music based on user's playlist
  const [curPlaylist, setCurPlaylist] = useState({})
  const [curPlaylistIdx, setCurPlaylistIdx] = useState(0)
  const playplaylist = () => {
    if (loginUser) {
      let tmpdata = localStorage.getItem(loginUser.uid)
      let tmpplaylist = new Map(JSON.parse(tmpdata));
      let tmpplaylistkey = tmpplaylist.keys()
      // console.log(tmpplaylist)
      // console.log(tmpplaylistkey)
      let tmpArray = []
      for (let idx of tmpplaylistkey){
        // console.log(idx)
        tmpArray.push(idx)
      }
      // console.log(tmpArray)
      let tmpplaymid
      tmpplaymid = tmpArray[curPlaylistIdx]
      if (tmpplaylist) {
        setCurrentPlay(tmpplaylist)
        setCurrentMid(tmpplaymid)
        setPlayerStatus({play:true})
      }
    }
  }


  

  const logout = () => {
    sessionStorage.removeItem("LoginUser"); // Remove user from session storage on logout
    setLoginUser(null);
    loginKey(null);
    setPlayerStatus({play:false, end:false})
    setUserType(noAuthMenu)
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Links menu={userType} displayInfo={displayInfo} playMusic={playMusic}
          />}
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
                CurPlaylist={curPlaylist}
                setCurPlaylist={setCurPlaylist}
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
                loginUser={loginUser}
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
          <Route path="userpage" element={<Userpage loginUser={loginUser} playMusic={playMusic} playplaylist={playplaylist}>
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
      <Footer />

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
        curPlaylist={curPlaylist}
        setCurPlaylist={setCurPlaylist}
        curPlaylistIdx={curPlaylistIdx}
        setCurPlaylistIdx={setCurPlaylistIdx}
        setCurrentPlay={setCurrentPlay}
        setCurrentMid={setCurrentMid}
        playplaylist={playplaylist}
       />
    </BrowserRouter>
  );
}

export default App;
