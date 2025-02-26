import { useContext, useState } from "react"
import AuthContext from "../contexts/AuthContext"
import { Camera, Mail, User } from "lucide-react"
import axiosInstance from "../utils/axios"
import toast from "react-hot-toast"

export default function ProfilePage(){
    const {userState,userDispatch}=useContext(AuthContext)
    console.log(userState)
    const [profilePic, setProfilePic] = useState(userState.user?.profilePic?.url || "/avatar.png");

    const handleImageUpload=async(e)=>{
        console.log(e.target.files)
        const file=e.target.files[0]
        if(!file){
            return
        }
        const formData=new FormData();
        formData.append("profilePic",file)
        try {
            const response=await axiosInstance.patch("/auth/update-profile",formData,{headers:{Authorization:localStorage.getItem("Token")}})
            console.log(response)
            setProfilePic(response.data.updatedUser.profilePic.url)
            userDispatch({type:"profilePicUpload",payload:response.data.profilePic})
        } catch (error){
            console.log(error)
            toast.error(error.response.data.message);
        }
    }
    return (
      <div className="h-screen pt-16">
        <div className="max-w-2xl mx-auto p-4 py-8">
            <div className="bg-base-300 rounded-xl p-6 space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold ">Profile</h1>
                    <p className="mt-2">Your profile information</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="size-32 rounded-full object-cover border-4 "
                        />
                        <label htmlFor="avatar-upload" className=" absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                            <Camera className="w-5 h-5 text-base-200" />
                            <input type="file" id="avatar-upload" name="profilePic" className="hidden" onChange={handleImageUpload}/>
                        </label>
                    </div >
                    <p className="text-sm text-zinc-400">
                        Click the camera icon to update your photo
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                                Full Name
                            </div>
                        <p className="px-4 py-2.5 bg-base-200 rounded-lg">{userState.user?.fullName}</p>
                        </div>
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                                Email Address
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 rounded-lg">{userState.user?.email}</p>
                    </div>
                </div>
                <div className="mt-6 bg-base-300 rounded-xl p-6">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between py-2">
                            <span>Member Since</span>
                            <span>{userState.user?.createdAt?.split("T")[0]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
}