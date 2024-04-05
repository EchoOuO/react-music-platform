import Displaywindow from "./Displaywindow";
import Musicplayer from "./Musicplayer";
import "./css/Displayblock.css";
export default function Displayblock(props) {

  
  return (
    <>
      <div className="row">
        {/* display music based on comming props.musicdisplay data */}
        {props.musicdisplay &&
          props.musicdisplay.map((musicObj, idx) => {
            return (
              <div className="col-4" key={idx}>
                <div className="card h-100 border-light text-center">
                  <div className="card-body">
                    <img
                      src={musicObj.image}
                      className="img-fluid rounded-to music-img"
                      mid={musicObj.mid}
                      mname={musicObj.mname}
                      artist={musicObj.artist}
                      album={musicObj.album}
                      address={musicObj.address}
                      image={musicObj.image}
                      // onClick={props.playMusic}
                    />

                    <h5 className="card-title">{musicObj.mname}</h5>
                    <p className="card-text">{musicObj.artist}</p>
                    <div className="d-grid gap-2 col-6 mx-auto">
                      <button
                        className="btn btn-outline-primary"
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
                      <button
                        className="btn btn-outline-primary"
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

                      {/* <!-- Button trigger modal --> */}
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modalId"

                        mid={musicObj.mid}
                        mname={musicObj.mname}
                        artist={musicObj.artist}
                        album={musicObj.album}
                        address={musicObj.address}
                        image={musicObj.image}
                        onClick={props.displayInfo}
                      >
                        More Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* display artist */}
        {props.artistdisplay &&
          props.artistdisplay.map((artistObj, idx) => {
            return (
              <div className="col-2" key={idx}>
                <div className="card h-100 border-light text-center">
                  <div className="card-body">
                    <img
                      src={artistObj.image}
                      className="img-fluid rounded-top"
                      alt=""
                    />
                    <h5 className="card-title">{artistObj.artist}</h5>
                    <button
                      className="btn btn-outline-primary"
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
