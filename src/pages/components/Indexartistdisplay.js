import Musicdisplayblock from "./Musicdisplayblock";
export default function Indexartistdisplay(props) {
  return (
    <>
      <h1>Artistdisplay</h1>
      <Musicdisplayblock music={props.music} />
    </>
  );
}
