import {get, post} from '../utils/http'

export const loginAPI = (data:{username:string, password:string})=>{
    return post('/user/login', data)
}

export const registerAPI = (data:{username:string, password:string})=>{
    return post('/user/register', data)
}

export const getUserInfoAPI = (userId:string)=>{
    return get('/user/userInfo', {userId})
}