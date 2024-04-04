import Formcompo from "./components/Formcompo";

export default function Login() {
  const elements = [
    { name: "email", type: "email", text: "Email", req: true },
    { name: "pass", type: "password", text: "Password", req: true },
  ];

  const buttons = [{ type: "submit", text: "Login" }];

  return (
    <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-6 ">
          <h1 className="text-center">Login</h1>
          <Formcompo elements={elements} buttons={buttons} />
        </div>
      </div>
    </>
  );
}
