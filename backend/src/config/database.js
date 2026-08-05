import mongoose from "mongoose";

async function connectToDb(){
    await mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("Database connected")
}).catch((error)=>{
    console.log(error);
})
}

export default connectToDb;