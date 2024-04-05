export default function Displaywindow(props) {

  return (
    <>
      {/* <!-- Modal --> */}
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
              <img src={props.window.image} alt=""/>
              <h4>{props.window.mname}</h4>
              <h6>{props.window.artist}  「{props.window.album}」</h6>
            </div>
            <div className="modal-footer mx-auto">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button> */}
              <button type="button" className="btn btn-outline-primary">Play Music</button>
              <button type="button" className="btn btn-outline-primary">
                Add to Playlist
              </button>
         
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
