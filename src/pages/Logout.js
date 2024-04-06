import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout (props){
    const navigate = useNavigate();
    useEffect(()=>{
        sessionStorage.removeItem("LoginUser");
        props.logout();
        navigate("/login");
    },[]);
}