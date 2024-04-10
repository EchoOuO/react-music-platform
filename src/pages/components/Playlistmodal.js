export default function Playlistmodal(props) {
  const modalId = `${props.idx}`; 

  return (
    <>
      <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target={`#${modalId}`} onClick={() => props.modalHandler(props.musicInfo)}>Detail</button>

      <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">          
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${modalId}Label`}>Music title: {props.musicInfo.mname}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <img src={props.musicInfo.image} alt={props.musicInfo.mname} className="img-fluid rounded-to music-img" />              
              <p className="card-text">{props.musicInfo.artist}</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary"
                mid={props.musicInfo.mid}
                mname={props.musicInfo.mname}
                artist={props.musicInfo.artist}
                album={props.musicInfo.album}
                address={props.musicInfo.address}
                image={props.musicInfo.image}
                onClick={props.playMusic}>Play</button>
              <button type="button" className="btn btn-danger" onClick={props.delete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}