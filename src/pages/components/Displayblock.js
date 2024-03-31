import Displaywindow from "./Displaywindow";
export default function Displayblock(props) {
  return (
    <>
      <div className="row">
        {props.music.map((musicObj, idx) => {
          return (
            <div className="col-4" key={idx}>
              <div className="card">
                <div className="card-body">
                  <img
                    src={`/${musicObj.filename}`}
                    className="img-fluid rounded-top"
                    alt=""
                  />

                  <h3 className="card-title">{musicObj.mname}</h3>
                  <p className="card-text">{musicObj.artist}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
