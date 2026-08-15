import  Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});
redis.on('connect', () => {
    console.log("redis is connected to server")
})
redis.on("error", (err) => {
    console.log("redis is not connected to server", err)
})
export default redis;
