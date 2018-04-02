import request from '../utils/request';
import { API_FRONT, } from 'utils/env'

export function login({ identifyingCode, password, username, identityId }) {
  return request(API_FRONT+'auth/login', {
    method: 'POST',
    body:{ identifyingCode, password, username, identityId },
    auth:'no',
    flag:'new',
  });
}
//获取验证码
export function getCode(){
	return request(API_FRONT+'auth/identifying_code',{
		method:'get',
		auth:'no',
		flag:'new',
	})
}
//获取用户ID
export function getUserId(){
	return request(API_FRONT+'usercenter/ecarx_user_info',{
		method:'get',
		flag:'new',
	})
}

/*
* token失效， 重新刷新token
* 帐号被挤， 刷新token是失败的，跳转登录页重新登录
*/
export function refreshToken({ accessToken, refreshToken }={}){
	return request(API_FRONT+'auth/refresh', {
		method:'POST',
		body: {       
			accessToken: window.localStorage.getItem("accessToken") || accessToken,
		    refreshToken: window.localStorage.getItem("refreshToken") || refreshToken, 
		},
		flag: 'new',
	}).then(data=>{
		console.log("refreshTokenrefreshToken", data.data)
		if( data.data && data.data.code === "success" ){
			window.localStorage.setItem('accessToken', data.data.data.accessToken);
  			window.localStorage.setItem('refreshToken', data.data.data.refreshToken);
  			return data;
		}
		
		return Promise.reject(data);
	})
}