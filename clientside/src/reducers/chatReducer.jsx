export const chatInitalState={
    messages:[],
    users:[],
    //onlineUsers:[],
    selectedUser:null,
    isUsersLoading:false
}

export const chatReducer=(state,action)=>{
    switch(action.type){
        case "setAllUsers":{
            console.log("Chat Reducer setAllUsers",action.payload)
            return {...state,users:action.payload,isUsersLoading:true}
        }
        case "setSelectedUser":{
            return {...state,selectedUser:action.payload}
        }
        case "setSelectedUserMsgs":{
            return {...state,messages:action.payload}
        }
        case "addMessage":{
            return {...state,messages:[...state.messages,action.payload]}
        }
        default:{
            return {...state}
        }
    }
    
}