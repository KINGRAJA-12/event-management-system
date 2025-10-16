import {create} from "zustand"
import {toast} from "react-hot-toast"
import { axiosInstance } from "../config/axiosInstance"
export const useAuth=create((set,get)=>({
    isLoginModelVis:false,
    isRegisterModelVis:false,
    isLogin:false,
    isRegister:false,
    user:null,
    isLogout:false,
    isGetme:false,
    loginModelVis:()=>{
        set({isRegisterModelVis:false})
        set({isLoginModelVis:true})
    },
    registerModelVis:()=>{
        set({isLoginModelVis:false})
        set({isRegisterModelVis:true})
    },
    closeModels:()=>{
        set({isLoginModelVis:false})
        set({isRegisterModelVis:false})
    },
    login:async(email,password)=>{
        try{
            set({isLogin:true})
            if(!email || !password)throw new Error("credential missing")
            let res=await axiosInstance.post("/auth/login",{email,password})
             localStorage.setItem("accessToken",res?.data?.accessToken)
             localStorage.setItem("refreshToken",res?.data?.refreshToken)
             await get().getme();
             get().closeModels()
             toast.success("login succussfull")
        }catch(err){
        toast.error("failed to login, verify credential")
        console.log(err?.response?.data?.message||err?.response?.data?.errors||err?.message||"login error")
        }finally{
            set({isLogin:false})
        }
    },
    register:async(name,email,password)=>{
        try{
            set({isRegister:true})
            if(!name || !email || !password)throw new Error("required data is missing");
            let res=await axiosInstance.post("/auth/register",{name,email,password});
            toast.success("register succssfully")
            get().loginModelVis();
        }catch(err){
            toast.error("failed to register! check credential");
            console.log(err?.response?.data?.message||err?.response?.data?.errors||err?.message||"register error");
        }finally{
            set({isRegister:false})
        }
    },
    logout:async()=>{
        try{
            set({isLogout:true})
            let res=await axiosInstance.post("/auth/logout",{refresh:localStorage.getItem("refreshToken")})
            localStorage.clear();
            set({user:null})
            toast.success("logout succsefully")
        }catch(err){
            toast.error(err?.response?.data?.message||err?.response?.data?.errors||err?.message||"logout error");
            console.log(err?.response?.data?.message||err?.response?.data?.errors||err?.message||"logout error")
        }finally{
            set({isLogout:false})
        }
    },
    getme:async()=>{
        try{
            if(!localStorage.getItem("accessToken") && !localStorage.getItem("refreshToken")){
                set({user:null})
                return
            }
            set({isGetme:true})
            let res=await axiosInstance.get("/auth/get-me");
            set({user:res?.data});
            
        }catch(err){
            set({user:null})
            console.log(err?.response?.data?.message||err?.response?.data?.errors||err?.message||"getme error")
        }finally{
            set({isGetme:false})
        }
    }
}))