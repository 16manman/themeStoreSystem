import request from 'utils/request'
import { API_FRONT } from 'utils/env'

export function getList(params){
	return request(API_FRONT+`usercenter/users/third_party_resources?${params}&pageSize=10`,{
		method: 'get',
		flag: 'new',
	})
}
/**
 * 绑定和解除绑定（只传账户id的时候解除绑定）
 */
export function bind(params){
	return request(API_FRONT+'usercenter/ecarx_user_third_resources/relationship',{
		method: 'post',
		flag: 'new',
		body: params,
	})
}
/**
 * 获取分机号列表
 */
export function getEXTNumList(){
	return request(API_FRONT+'usercenter/ecarx_third_party_resource/resource_type/extNum',{
		method: 'get',
		flag: 'new',
	})
}
/**
 * 获取坐席号列表
 */
export function getCallServicerList(uid){
	return request(API_FRONT+`usercenter/ecarx_third_party_resource/resource_type/callServicer?userId=${uid}`,{
		method: 'get',
		flag: 'new',
	})
}
/**
 * 根据系统应用编码查询角色列表
 */
export function getRoleList(){
	return request(API_FRONT+'usercenter/ecarxRoles/sysCode/x_call_center?roleCode=call_center_type_',{
		method: 'get',
		flag: 'new',
	})
}
/**
 * 查询用户绑定的资源
 */
export function getUserBindResources(uid){
	return request(API_FRONT+`usercenter/ecarx_user_resources/${uid}`,{
		method: 'get',
		flag: 'new',
	})
}