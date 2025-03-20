export const authInitialState={
    user:null,
    isLoggedIn:false,
    socket:null,
    onlineUsers:[]
}

export const authReducer=(state,action)=>{
    switch(action.type){
        case "authenticateUser":{
            console.log("Inside auth reducer",action.payload)
            return {...state,user:action.payload,isLoggedIn:true}
        }
        case "setSocket":{
            return {...state,socket:action.payload}
        }
        case "setOnlineUser":{
            return {...state,socket:action.payload.socket,onlineUsers:action.payload.userIds}
        }
        // case "setSocketAndOnlineUser":{
        //     console.log("Inside setSocketAndOnlineUser reducer",action.payload)
        //     return {...state,socket:action.payload.socket,onlineUsers:action.payload.onlineUsers}
        // }
        case "profilePicUpload":{
            return {...state,user:{...state.user,profilePic:action.payload}}
        }
        case "logout":{
            return {user:null,isLoggedIn:false,socket:null}
        }
        default:{
            return {...state}
        }
    }
    
}