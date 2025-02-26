//import { useContext } from "react";
//import AuthContext from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({children}){
    //const {userState}= useContext(AuthContext);
    if(localStorage.getItem("Token")){
        return children
    }
    else{
        return <Navigate to="/login" replace/>
    }
}