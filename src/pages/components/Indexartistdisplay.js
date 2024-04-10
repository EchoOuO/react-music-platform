import Displayblock from "./Displayblock";
import "./css/Indexartistdisplay.css"

export default function Indexartistdisplay(props) {
  return (
    <>
      <h2>Artistdisplay</h2>
      <Displayblock artist={props.artist} artistdisplay={props.artistdisplay} displayInfo={props.displayInfo} />
    </>
  );
}
