import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import Links from "./pages/Links";
import { useEffect, useState } from "react";
import FileService from "./services/FileService";
function App() {
  const [key, setKey] = useState(null);
  const authMenu = [
    { url: "/", text: "Home" },
    { url: "/userpage", text: "User Page" },
    { url: "/logout", text: "Log out" },
  ];
  const noAuthMenu = [{ url: "/login", text: "login" }];

  const [music, setMusic] = useState([]);
  useEffect(() => {
    FileService.read("music").then(
      (response) => {
        console.log(response.data);
        setMusic(response.data);
        console.log(music);
      },
      (rej) => {
        console.log(rej);
      }
    );
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Links menu={key !== null ? authMenu : noAuthMenu} />}
        >
          <Route index element={<Home music={music} />} />
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
