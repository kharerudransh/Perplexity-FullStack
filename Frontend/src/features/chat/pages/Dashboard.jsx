import React from 'react'
import { useSelector } from "react-redux"
import Loader from '@/app/components/Loader';
import { useChat } from '../hooks/useChat';
import {useEffect} from 'react'
const Dashboard = () => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const chat=useChat()
    useEffect(()=>{
        chat.initializeSocketConnection()
    },[])

    if (loading || !user) {
        return <Loader message="Loading dashboard..." />
    }

    return <div>{user.name}</div>
}

export default Dashboard