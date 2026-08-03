import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    dateOfBirth: {
    type: Date,
    required: true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:6,
    },
    verified:{type:Boolean,default:false},
    
},{
    timestamps:true
}
)
userSchema.pre('save',async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("User", userSchema);
export default userModel;