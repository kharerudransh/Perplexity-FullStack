import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true
});

export async function register({name,dateOfBirth,userName,email,password}){
    const response=await api.post("/api/auth/register",{name,dateOfBirth,username:userName,email,password});
    return response.data;
}

export async function login({email,password}){
    const response=await api.post("/api/auth/login",{email,password});
    return response.data;
}

export async function getMe(){
    const response=await api.get("/api/auth/getMe");
    return response.data;
}

export async function resendVerificationEmail({email,password}){
    const response=await api.post("/api/auth/resend-verification-email",{email,password});
    return response.data;
}

export async function logout(){
    const response=await api.get("/api/auth/logout");
    return response.data;
}

