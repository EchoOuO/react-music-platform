import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import Links from "./pages/Links";
import Footer from "./pages/Footer";
import { useState } from "react";
import Musicdisplay from "./pages/components/Musicdisplay";
import Artistdisplay from "./pages/components/Artistdisplay";
import Displayblock from "./pages/components/Displayblock";
function App() {
  const [key, setKey] = useState(null);
  const authMenu = [
    { url: "/", text: "Home" },
    { url: "/userpage", text: "User Page" },
    { url: "/logout", text: "Log out" },
  ];
  const noAuthMenu = [{ url: "/login", text: "login" }];
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Links menu={key !== null ? authMenu : noAuthMenu} />}
        >
          <Route index element={<Home />} />
          <Route path="*" element={<Nopage />} />
          <Route path="musicdisplay" element={<Musicdisplay />} />
          <Route path="artistdisplay" element={<Artistdisplay />} />
          <Route path="displayblock" element={<Displayblock />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
