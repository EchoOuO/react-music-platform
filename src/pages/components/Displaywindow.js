import "./css/Displaywindow.css"

export default function Displaywindow(props) {
  // console.log(props.window)
  return (
    <>
    {(props.window) ? 
      <div
        className="modal fade"
        id="modalId"
        tabindex="-1"
        role="dialog"
        aria-labelledby="modalTitleId"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md"
          role="document"
        >
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title" id="modalTitleId">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> */}
            <div className="modal-body text-center">
              <button 
                type="button"
                className="btn btn-close window-close-btn"
                data-bs-dismiss="modal"></button>
              <img src={props.window.image} alt=""/>
              <h3>{props.window.mname}</h3>
              <h5>Artist: {props.window.artist}</h5>
              <h5>Album:「{props.window.album}」</h5>
              <p>{props.window.description}</p>
            </div>
            <div className="modal-footer mx-auto">
        

              <button
                className="btn btn-outline-primary"
                type="button"
                mid={props.window.mid}
                mname={props.window.mname}
                artist={props.window.artist}
                album={props.window.album}
                address={props.window.address}
                image={props.window.image}
                onClick={props.playMusic}>Play music!</button>

              <button 
                className="btn btn-outline-primary" 
                type="button"    
                mid={props.window.mid}
                mname={props.window.mname}
                artist={props.window.artist}
                album={props.window.album}
                address={props.window.address}
                image={props.window.image}
                onClick={props.addToPlayList}>Add to Playlist!</button>
      
            </div>
          </div>
        </div>
      </div> : null}
    </>
  );
}
