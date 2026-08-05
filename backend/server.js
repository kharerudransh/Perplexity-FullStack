import dotenv from "dotenv";
dotenv.config();
import {testAi} from "./src/services/ai.service.js"

import app from "./src/app.js";
import connectToDb from "./src/config/database.js";

connectToDb()
testAi();

app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})