import Displayblock from "./Displayblock";
export default function Indexmusicdisplay(props) {
  // console.log(props.music);
  // console.log(props.musicdisplay);
  return (
    <>
      <h1>Musicdisplay</h1>
      <Displayblock
        music={props.music}
        addToPlayList={props.addToPlayList}
        playMusic={props.playMusic}
        musicdisplay={props.musicdisplay}
      />
    </>
  );
}
