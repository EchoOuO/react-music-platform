import { useState } from "react";
import Playlistmodal from "./Playlistmodal";

export default function Playlistcompo(props) {
  const [modal, setModal] = useState(null); 

  const modalHandler = (musicInfo) => {
    console.log(musicInfo);
    setModal(musicInfo);
  };

  return (
    <>
      <div className="row">
        {props.musicData && props.musicData.map((musicObj, idx) => {
          return (
            <div className="col-4" key={idx}>
              <div className="card h-100 border-light text-center">
                <div className="card-body">
                  <img src={musicObj[1].image} alt={musicObj[1].mname} className="img-fluid rounded-to music-img" />
                  <h5 className="card-title">{musicObj[1].mname}</h5>
                  <p className="card-text">{musicObj[1].artist}</p>
                  <div className="d-grid gap-2 col-6 mx-auto">
                   <Playlistmodal modalHandler={modalHandler} musicInfo={musicObj[1]} modal={modal} idx={idx}/> 
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
