import axios from "axios";

export default axios.create({
  baseURL: "http://127.0.0.1/react-music-platform-server/index.php",
});

