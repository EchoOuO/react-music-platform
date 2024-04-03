import Displayblock from "./components/Musicdisplayblock";
export default function Allartist(props) {
  return (
    <>
      <h1>All artist page</h1>
      <Displayblock musicdisplay={props.music} />
    </>
  );
}
