import Displayblock from "./components/Musicdisplayblock";
export default function Allmusic(props) {
  return (
    <>
      <h1>All music page</h1>
      <Displayblock musicdisplay={props.music} />
    </>
  );
}
