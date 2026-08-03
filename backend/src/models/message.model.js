import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    //har message kisi chat ko belong karta hai
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true,
    },
    content:{
        type:String,
        required:true,
        trim:true,
    },
    role:{
        type:String,
        enum:['user','ai'],
        required:true,
    }
},{timestamps:true}
)
const messageModel = mongoose.model("Message", messageSchema);
export default messageModel
