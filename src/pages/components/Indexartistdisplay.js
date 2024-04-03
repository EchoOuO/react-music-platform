import Displayblock from "./Displayblock";

export default function Indexartistdisplay(props) {
  return (
    <>
      <h1>Artistdisplay</h1>
      <Displayblock artist={props.artist} artistdisplay={props.artistdisplay} />
    </>
  );
}
