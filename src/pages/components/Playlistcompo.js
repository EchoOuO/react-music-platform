// Playlistcompo.js
import { useState} from "react";
import Playlistmodal from "./Playlistmodal";
import PostService from "../../services/PostService";

export default function Playlistcompo(props) {
  // console.log(props.musicData);

  const [modal, setModal] = useState(null); 
  const [loginUser, setLoginUser] = useState(null);

  const modalHandler = (musicInfo) => {
    // console.log(musicInfo);
    setModal(musicInfo);
  };

  // const deleteHandler = (mid) => {
  //   const storedValue = JSON.parse(localStorage.getItem(props.uid));
  //   // console.log(storedValue);

  //   if (storedValue) {
  //     const index = storedValue.findIndex((idx) => idx[0] === mid.toString()); // Find the key corresponding to mid
  //     //findIndex() is Array instance method
  //     if (index !== -1) {
  //       storedValue.splice(index, 1); // Delete the element of the corresponding key
  //       localStorage.setItem(props.uid, JSON.stringify(storedValue)); // Store updated values in local storage
  //     }

  //     // モーダルを閉じ、削除されたデータをフィルタリングする
  //     const updatedMusicData = props.musicData.filter((musicObj) => musicObj[0] !== mid);
  //     props.onDelete(updatedMusicData); // Update musicData in Userpage component
  //   }
  //   setModal(null);
  // };


  const deleteHandler = (mid) => {
    if (loginUser) {
      // PostService를 사용하여 서버에 삭제 요청을 보냅니다.
      PostService.database("/DeletePlaylist", { uid: loginUser.uid, mid: mid })
        .then(response => {
          console.log(response.data); // 서버의 응답을 콘솔에 출력
          // 모달을 닫고, 음악 데이터를 업데이트합니다.
          const updatedMusicData = props.musicData.filter((musicObj) => musicObj[0] !== mid);
          props.onDelete(updatedMusicData); // 부모 컴포넌트에 데이터 업데이트를 알림
          setModal(null); // 모달 창을 닫습니다.
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error removing music from playlist.');
        });
    } else {
      alert("Please log in to modify the playlist.");
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
