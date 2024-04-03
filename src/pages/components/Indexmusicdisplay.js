import Musicdisplayblock from "./Musicdisplayblock";
export default function Indexmusicdisplay(props) {
  // console.log(props.music);
  // console.log(props.musicdisplay);
  return (
    <>
      <h1>Musicdisplay</h1>
      <Musicdisplayblock
        music={props.music}
        addToPlayList={props.addToPlayList}
        musicdisplay={props.musicdisplay}
      />
    </>
  );
}
