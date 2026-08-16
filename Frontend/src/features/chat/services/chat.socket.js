import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
    const socket = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        autoConnect: false,
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
}
