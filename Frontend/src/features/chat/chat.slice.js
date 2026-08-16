import { createSlice } from "@reduxjs/toolkit";

const chatSlice=createSlice({
    name:'chat',
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null,
    },
    reducers:{
        setChats:(state,action)=>{
            state.chats=action.payload;
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId=action.payload;
        },
        setIsLoading:(state,action)=>{
            state.isLoading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
    }
})

export const {setChats,setCurrentChatId,setIsLoading,setError}=chatSlice.actions

export default chatSlice.reducer

// chat:{
//     "dockerAndAws":{
//         _id:"dockerAndAws",
//         title:"Docker and AWS",
//         messages:[
//             {
//                 role:"user",
//                 content:"Hello",
//                 timestamp:"2022-01-01T00:00:00.000Z",
//             },
//             {
//                 role:"ai",
//                 content:"Hi",
//                 timestamp:"2022-01-01T00:00:00.000Z",
//             }
//         ],
//     }
// }