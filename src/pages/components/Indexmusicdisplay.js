import Displayblock from "./Displayblock";
import "./css/Indexmusicdisplay.css"
export default function Indexmusicdisplay(props) {
  // console.log(props.music);
  // console.log(props.musicdisplay);
  return (
    <>
      <h2>Music display</h2>
      <Displayblock
        music={props.music}
        addToPlayList={props.addToPlayList}
        playMusic={props.playMusic}
        musicdisplay={props.musicdisplay}
        displayInfo={props.displayInfo}
      />
    </>
  );
}
