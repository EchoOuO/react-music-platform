// Playlistcompo.js
import { useState} from "react";
import Playlistmodal from "./Playlistmodal";
import PostService from "../../services/PostService";
// import { prefix } from "react-bootstrap/lib/utils/bootstrapUtils";
export default function Playlistcompo(props) {
  // console.log(props.musicData);

  const [modal, setModal] = useState(null); 
  const [loginUser, setLoginUser] = useState(null);

  const modalHandler = (musicInfo) => {
    // console.log(musicInfo);
    setModal(musicInfo);
  };

  const deleteHandler = (mid) => {
    if(loginUser){
      PostService.database("/DeletePlaylist",{uid:loginUser.uid,mid:mid})
    .then(response=>{
      const updatedMusicData = props.musicData.filter((musicObj) => musicObj[0] !== mid);
        props.onDelete(updatedMusicData); // 부모 컴포넌트에 데이터 업데이트를 알림
        setModal(null);
    })
    .catch(error=>{
      console.error('Error:',error);
      alert('Cannot remove music');
    });
    }else{
      alert("please login first");
    }
  };
  return (
    <>
      <div className="row">
        {props.musicData && props.musicData.map((musicObj, idx) => {
          return (
            <div className="col" key={idx}>
              <div className="card h-100 border-light text-center">
                <div className="card-body">
                  <img src={musicObj[1].image} alt={musicObj[1].mname} className="img-fluid rounded-to music-img" />
                  <h5 className="card-title">{musicObj[1].mname}</h5>
                  <p className="card-text">{musicObj[1].artist}</p>
                  <div className="d-grid gap-2 col-6 mx-auto">
                    <Playlistmodal modalHandler={modalHandler} musicInfo={musicObj[1]} modal={modal} idx={idx} delete={() => deleteHandler(musicObj[0])} playMusic={props.playMusic}/> 
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
