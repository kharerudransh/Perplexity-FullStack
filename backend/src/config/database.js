import mongoose from "mongoose";

async function connectToDb(){
    await mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MongoDb connected")
}).catch((error)=>{
    console.log(error);
})
}

export default connectToDb;