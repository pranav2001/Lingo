import {Eye, EyeOff, Lock, Mail, MessageSquare,User} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState,useContext,useEffect } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../utils/axios"
import AuthContext from "../contexts/AuthContext"

//import AuthImagePattern from "../components/AuthImagePattern"
export default function SignUpPage(){
    const [formData,setFormData]=useState({
        fullName:"",
        email:"",
        password:""
    })
    const {userState,userDispatch,connectSocket,disconnectSocket}=useContext(AuthContext)
    const [showPassword,setShowPassword]=useState(false)
    const navigate=useNavigate()
    //const errors={}
    const validateFormClient=()=>{
        let isError=1; //no error
        const emailPattern=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!formData.fullName.trim()){
            isError=0
            toast.error("Full name is required")
            
        }
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
        if (formData.password.length < 8) {
            isError=0
            toast.error("Password must be at least 8 characters long")
        }
        // Check for lowercase letter
        if (!/[a-z]/.test(formData.password)) {
            isError=0
            toast.error("Password must contain at least one lowercase letter")
        }
    
        // Check for uppercase letter
        if (!/[A-Z]/.test(formData.password)) {
            isError=0
            toast.error("Password must contain at least one uppercase letter")
        
        }
    
        // Check for number
        if (!/\d/.test(formData.password)) {
            isError=0
            toast.error("Password must contain at least one number")

            
        }
    
        // Check for special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            isError=0
            toast.error("Password must contain at least one special character")
        }
        if(isError){
            return true
        }
        else{
            return false
        }
        
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const success=validateFormClient()
        //console.log("validateform returns",success)
        if(success){
            try {
                const authResponse = await axiosInstance.post("/auth/signup",formData);
                console.log(authResponse)
                localStorage.setItem("Token",authResponse.data.accessToken)
                toast.success(authResponse.data.message)
                //const {socket,onlineUsers}=connectSocket("http://localhost:5001")
                //userDispatch({type:"authenticateUser",payload:{userData:authResponse.data.user,socket,onlineUsers}})
                userDispatch({type:"authenticateUser",payload:authResponse.data.userData})


                // connectSocket("http://localhost:5001")
                // userDispatch({type:"authenticateUser",payload:authResponse.data.userData})
                navigate("/");
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message)
            }

        }
    }

    // useEffect(() => {
    //             if (userState.isLoggedIn) {
    //                 connectSocket("http://localhost:5001");
    //             }
    //             return () => {
    //                 disconnectSocket(); // Cleanup when the component unmounts
    //             };
    //         }, [userState.isLoggedIn]);

    return(
        <div className="min-h-screen pt-16">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">{/* So when the screen is small it is p-6 but when screen reaches 640px or more the padding increases by 12*/}
            <div className="w-full max-w-md space-y-8">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary"/>
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                        <p className="text-base-content/60">Get started with your free account</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Full Name</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="size-5 text-base-content/40"/>
                            </div>
                            <input type="text" className={`input input-bordered w-full pl-10`} value={formData.fullName} onChange={(e)=>setFormData({...formData,fullName:e.target.value})} />
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-base-content/40"/>
                            </div>
                            <input type="email" className={`input input-bordered w-full pl-10`} value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} />
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="size-5 text-base-content/40"/>
                            </div>
                            <input type={showPassword? "text":"password"} className={`input input-bordered w-full pl-10`} value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})} />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={()=>setShowPassword(!showPassword)}> 
                            {showPassword ? (<EyeOff className="size-5 text-base-content/40" />):(<Eye className="size-5 text-base-content/40"/>)}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Create Account
                    </button>
                </form>
                <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
            </div>
            </div>
            {/* <AuthImagePattern 
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."

            /> */}
        </div>
    )
}