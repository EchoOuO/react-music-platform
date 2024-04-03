export default function Formcompo(props) {
  return (
    <form>
      {props.elements.map((element, idx) => {
        return (
          // input
          <div className="form-floating m-3" key={idx}>
            <input
              type={element.type}
              className="form-control"
              name={element.name}
              placeholder={element.text}
              required={element.req}
            />
            <label htmlFor={element.name}>{element.text}</label>
          </div>
        );
      })}

      {/* user type */}
          <select class="form-select m-3">
            <option selected>User Type</option>
            {props.type.map((type, idx) => {
              return (
                <option>{type.value}</option>
              );
            })}
          </select>

      {/* button */}
      {props.buttons.map((btnElement, idx) => {
        return (
          <button
            type={btnElement.type}
            className="btn btn-outline-primary"
            key={idx}
          >
            {btnElement.text}
          </button>
        );
      })}
    </form>
  );
}
