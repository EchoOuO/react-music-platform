import Displaywindow from "./Displaywindow";
import Musicplayer from "./Musicplayer";
export default function Displayblock(props) {
  return (
    <>
      <div className="row">
        {/* if props.music get data then print it out */}
        {props.music &&
          props.music.map((musicObj, idx) => {
            return (
              <div className="col-4" key={idx}>
                <div className="card">
                  <div className="card-body">
                    <img
                      src={musicObj.image}
                      className="img-fluid rounded-top"
                      alt=""
                    />
                    <h3 className="card-title">{musicObj.mname}</h3>
                    <p className="card-text">{musicObj.artist}</p>
                    <button
                      type="button"
                      mid={musicObj.mid}
                      mname={musicObj.mname}
                      artist={musicObj.artist}
                      album={musicObj.album}
                      address={musicObj.address}
                      image={musicObj.image}
                      onClick={props.addToPlayList}
                    >
                      Add to Playlist!
                    </button>
                    {/* <audio
                      src={`/data/music/${musicObj.address}.mp3`}
                      controls
                    ></audio> */}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
