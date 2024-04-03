import Formcompo from "./components/Formcompo";

export default function Register() {
  const elements = [
    { name: "fname", type: "text", text: "First Name", req: true },
    { name: "lname", type: "text", text: "Last Name", req: true },
    { name: "email", type: "email", text: "Email", req: true },
    { name: "pass", type: "password", text: "Password", req: true },
  ];

  const userType = [
    {value: "user"},
    {value: "staff"},
    {value: "admin"},
  ]

  const buttons = [{ type: "submit", text: "Register" }];


  return (
    <>
      <div className="row justify-content-center align-items-center g-2 m-3">
        <div className="col-6 ">
          <h1 className="text-center">Sign Up</h1>
          <Formcompo elements={elements} type={userType} buttons={buttons}/>
        </div>
      </div>
    </>
  );
}
