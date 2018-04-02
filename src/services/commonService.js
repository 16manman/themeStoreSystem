/**
 * Created by liwei on 2018/1/31.
 */

import request from '../utils/request';
import { API_OSS, API_XCALL } from 'utils/env'

// 获取oss文件临时url
export function getSignUrl(values) {
  return request(API_OSS+'getSignUrl', {
    method: 'GET',
    params: values
  });
}

// 获取工单录音临时url
export function getRecordUrl(values) {
  return request(API_XCALL+'car/recordPath', {
    method: 'GET',
    params: values
  });
}

//sessionId 和 各种id 绑定
export function sessionIdBind({ msisdn, vin, ticketid, dtsid, phone }){
	return request(API_XCALL+'car/createOrUpdateSession',{
		method:'POST',
		body:{ msisdn, vin, ticketid, dtsid, phone },
	  flag:'new',
	})
}
//通过dtsid 查找信息
export function searchByDtsid( dtsid ){
  return request(API_XCALL+'car/session?dtsid='+dtsid, {
    method: 'GET',
  })
}
