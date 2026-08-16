import{useDispatch,useSelector} from "react-redux";
import { setUser,setLoading,setError } from "../auth.slice.js";
import { register,login,getMe,resendVerificationEmail,logout } from "../service/auth.api.js";

export function useAuth(){
    const dispatch=useDispatch();
    
    async function handleRegister({name,dateOfBirth,userName,email,password}){
        dispatch(setLoading(true));
        try{
            const data=await register({name,dateOfBirth,userName,email,password})
        }
        catch(err){
            dispatch(setError(err.response? err.response.data: err.message))
            throw err
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({email,password}){
        dispatch(setLoading(true));
        try{
            const data=await login({email,password})
            dispatch(setUser({ user: data.user }))   // ✅
        }
        catch(err){
            dispatch(setError(err.response? err.response.data: err.message))
            throw err
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe(){
        dispatch(setLoading(true));
        try{
            const data=await getMe();
            dispatch(setUser({ user: data.user }))   // ✅
        }
        catch(err){
            dispatch(setError(err.response? err.response.data: err.message));
        }
        finally{
            dispatch(setLoading(false));
        }
    }
    async function handleLogout(){
        dispatch(setLoading(true));
        try{
            const data=await logout();
            dispatch(setUser({ user: null }));
        }
        catch(err){
            dispatch(setError(err.response? err.response.data: err.message));
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    async function handleResendVerificationEmail({email,password}){
        dispatch(setLoading(true));
        try{
            const data=await resendVerificationEmail({email,password});
            return data;
        }
        catch(err){
            dispatch(setError(err.response? err.response.data: err.message));
            throw err;
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    return{
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleResendVerificationEmail,
    }

}