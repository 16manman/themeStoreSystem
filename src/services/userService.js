/**
 * Created by liwei on 2018/2/1.
 */
import request from '../utils/request';
import { API_FRONT } from 'utils/env'

// 获取角色列表
export function getRoleList(){
  return request(API_FRONT+'usercenter/ecarxRoles/sysCode/x_call_center',{
    method:'get',
    flag: 'new',
  })
}

// 通过角色获取用户列表
export function getUserForRole(resourceId){
  return request(API_FRONT+'usercenter/ecarx_users/role/'+resourceId,{
    method:'get',
    flag: 'new',
  })
}
