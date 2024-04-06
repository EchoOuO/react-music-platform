import Displayblock from "./components/Displayblock";
import Displaywindow from "./components/Displaywindow";
import Musicplayer from "./components/Musicplayer";
export default function Allartist(props) {
  return (
    <>
      <h1>All artist page</h1>
      <Displayblock 
        artist={props.artist} 
        artistdisplay={props.artist} 
        displayInfo={props.displayInfo} 
      />
      <Displaywindow 
        music={props.music}
        window={props.window} 
        playMusic={props.playMusic} 
        addToPlayList={props.addToPlayList}
        artistMusicData={props.artistMusicData} />
      <Musicplayer
        music={props.music}
        mid={props.mid}
        playlist={props.playlist}
        currentPlay={props.currentPlay}
        currentMid={props.currentMid}
      />
    </>
  );
}
