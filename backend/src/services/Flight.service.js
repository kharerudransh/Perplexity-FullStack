import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getLiveFlightStatus(flightCode) {
    const response = await axios.get(
        `http://api.aviationstack.com/v1/flights`,
        {
            params: {
                access_key: process.env.AVIATIONSTACK_API_KEY,
                flight_iata: flightCode,
            },
        }
    );

    return response.data.data[0]; // pehla matching flight
}