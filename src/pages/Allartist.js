import Displayblock from "./components/Displayblock";
export default function Allartist(props) {
  return (
    <>
      <h1>All artist page</h1>
      <Displayblock artistdisplay={props.artist} />
    </>
  );
}
