import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectToDb from "./src/config/database.js";

connectToDb()


app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})