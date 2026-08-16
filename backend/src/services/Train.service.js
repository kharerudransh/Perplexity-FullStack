import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getLiveTrainStatus(trainNumber) {
    const response = await axios.get(
        `https://railradar.in/api/v1/trains/${trainNumber}/live`,
        {
            headers: {
                Authorization: `Bearer ${process.env.RAILRADAR_API_KEY}`,
            },
        }
    );

    return response.data.data; // actual live status object
}