import React from 'react'
import {useSelector} from "react-redux";
import {Navigate} from "react-router";
import Loader from '@/app/components/Loader';

const Protected = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);

    if (loading) {
        return <Loader message="Authenticating session..." />
    }
    //Agar loading bhi nhi hai aur user bhi nhi hai toh user ko Landing page par bhej do as user login hi nhi hai
    if (!user) {
        return <Navigate to="/" replace />
    }
    //agar loading nhi hai aur user hai toh user ko children render karo
    return children;
}

export default Protected