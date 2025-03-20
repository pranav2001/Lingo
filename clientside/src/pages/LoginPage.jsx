import { useState,useContext } from "react"
import AuthContext from "../contexts/AuthContext";
import toast from "react-hot-toast";

import { Eye, EyeOff, Lock, Mail, MessageSquare } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

export default function LoginPage(){
    
    const [showPassword,setShowPassword]=useState(false);
    const [formData,setFormData]=useState({
        email:"",
        password:""
    })
    const navigate=useNavigate()
    const {userDispatch}=useContext(AuthContext)
    const validateFormClient=()=>{
        let isError=1; 
        const emailPattern=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!formData.email.trim()){
            isError=0
            toast.error("Email is required")        
        }
        if(!emailPattern.test(formData.email)){
            isError=0
            toast.error("Invalid email format")        
        }
        if(!formData.password.trim()){
            isError=0
            toast.error("Password is required")      
        }
        
        if(isError){
            return true
        }
        else{
            return false
        }
        
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const success=validateFormClient();
        if(success){
            try {
                const authResponse=await axiosInstance.post("/auth/login",formData)
                console.log("login response",authResponse);
                localStorage.setItem("Token",authResponse.data.accessToken)
                toast.success(authResponse.data.message)
                userDispatch({type:"authenticateUser",payload:authResponse.data.userData})

                navigate("/");
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message)
            }     
        }

    }

    return(
        <div className="h-screen pt-16">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                                <p className="text-base-content/60">Sign in to your account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type="email"
                                        className={`input input-bordered w-full pl-10`}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-base-content/40" />
                                ) : (
                                    <Eye className="h-5 w-5 text-base-content/40" />
                                )}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                            Sign in
                        </button>
                    </form>
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="link link-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}