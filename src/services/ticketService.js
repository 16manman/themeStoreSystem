/**
 * Created by liwei on 2018/1/16.
 */
import request from '../utils/request';
import { API_TICKET } from 'utils/env';
// 工单列表
export function queryTicketList(values,userId) {
  return request(API_TICKET+'ticket/all', {
    method: 'GET',
    params: values,
  });
}

// 我提交的工单列表
export function queryMySubmitTicketList(values,userId) {
  return request(API_TICKET+'ticket/'+userId+'/all', {
    method: 'GET',
    params: values,
  });
}
// 经过我的工单列表
export function queryPassMeTicketList(values,userId) {
  return request(API_TICKET+'ticket/all/After/'+userId, {
    method: 'GET',
    params: values,
  });
}
// 当前通话的历史工单列表
export function queryLoadHistoryTicketList(values,phone) {
  console.log('queryLoadHistoryTicketList', values,phone )
  return request(API_TICKET+phone+'/ticket/all', {
    method: 'GET',
    params: values,
  });
}
// 工单详情
export function queryTicketDetail(values) {
  return request(API_TICKET+'ticket/details', {
    method: 'GET',
    params: values,
  });
}

// 创建工单
export function createTicket(values) {
  return request(API_TICKET+'ticket/add', {
    method: 'POST',
    body:values
  });
}

// 修改工单(转交,完结)
export function updateTicket(values) {
  return request(API_TICKET+'ticket/update', {
    method: 'POST',
    body:values
  });
}

// 工单类型
export function queryTicketType(values) {
  return request(API_TICKET+'ticketcli/list', {
    method: 'GET',
    params: values,
  });
}

// 工单操作日志列表
export function queryTicketLogs(values) {
  return request(API_TICKET+'change/all', {
    method: 'GET',
    params: values,
  });
}
