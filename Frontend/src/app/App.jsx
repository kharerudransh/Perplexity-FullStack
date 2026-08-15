  import React from 'react'
  import { RouterProvider } from 'react-router'
  import { appRouter } from "./App.routes.jsx"
  import { Toaster } from 'react-hot-toast'
  import { useEffect } from 'react'
  import { useAuth } from '../features/auth/hooks/useAuth.js'

  const App = () => {
    // whenever the app loads check if the user is logged in if logged in retreive its data
    // and store it in the redux store
    
    const auth=useAuth()
    useEffect(()=>{
      auth.handleGetMe()
    },[])
    
    return (
      <>
      <Toaster position="top-right" />
      <RouterProvider router={appRouter} />
      </>
    )
  }

  export default App