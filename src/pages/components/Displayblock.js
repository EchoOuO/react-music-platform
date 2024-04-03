import Displaywindow from "./Displaywindow";
import Musicplayer from "./Musicplayer";
export default function Displayblock(props) {
  return (
    <>
      <div className="row">
        {/* display music */}
        {props.musicdisplay &&
          props.musicdisplay.map((musicObj, idx) => {
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
                      onClick={props.playMusic}
                    >
                      Play music!
                    </button>
                    <br></br>
                    <br></br>
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
                  </div>
                </div>
              </div>
            );
          })}

        {/* display artist */}
        {props.artistdisplay &&
          props.artistdisplay.map((artistObj, idx) => {
            return (
              <div className="col-4" key={idx}>
                <div className="card">
                  <div className="card-body">
                    <img
                      src={artistObj.image}
                      className="img-fluid rounded-top"
                      alt=""
                    />
                    <h3 className="card-title">{artistObj.artist}</h3>
                    <button
                      type="button"
                      mid={artistObj.aid}
                      artist={artistObj.artist}
                      image={artistObj.image}
                      // onClick={props.addToPlayList}
                    >
                      More Detail
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
