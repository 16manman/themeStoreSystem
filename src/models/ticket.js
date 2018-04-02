/**
 * Created by liwei on 2018/1/16.
 */
import * as ticketService from '../services/ticketService'
import {getRecordUrl} from '../services/commonService'
import { searchCarInfo } from '../services/carInfo'
import { message } from 'antd';
import Intl from 'react-intl-universal'

export default {

  namespace: 'ticket',

  state: {
    ticketData:{},
    mySubmitTicket:{},
    unDoTicket:{},
    passMeTicket:{},
    roadRescueTicket:{},
    unJudgeTicket:{},
    allTicket:{},
    ticketDetail:{},
    TicketLogs:[],
    carInfo:{carServer:[]},
    recordInfo:{}
  },

  subscriptions: {

  },

  effects: {
    *loadMySubmitTicket({payload:value}, { put, select,call }) {

      console.log('loadMySubmitTicket',value)
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(ticketService.queryMySubmitTicketList,value,currentUser.userId) || {};
      if (response.data&&response.data.status.message=='success'){
        response.data.data.page=value.page;
        response.data.data.pagesize=value.pagesize;
        yield put({ type: 'actionSuccess', payload: {mySubmitTicket:response.data.data} });
      }
    },
    *loadUnDoTicket({payload:value}, { put, select,call }) {
      console.log('loadMySubmitTicket',value)
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(ticketService.queryTicketList,value,currentUser.userId) || {};
      if (response.data&&response.data.status.message=='success'){
        response.data.data.page=value.page;
        response.data.data.pagesize=value.pagesize;
        yield put({ type: 'actionSuccess', payload: {unDoTicket:response.data.data} });
      }
    },
    *loadPassMeTicket({payload:value}, { put, select,call }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(ticketService.queryPassMeTicketList,value,currentUser.userId) || {};
      if (response.data&&response.data.status.message=='success'){
        response.data.data.page=value.page;
        response.data.data.pagesize=value.pagesize;
        yield put({ type: 'actionSuccess', payload: {passMeTicket:response.data.data} });
      }
    },
    *loadRoadRescueTicket({payload:value}, { put, select,call }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(ticketService.queryTicketList,value,currentUser.userId) || {};
      if (response.data&&response.data.status.message=='success'){
        response.data.data.page=value.page;
        response.data.data.pagesize=value.pagesize;
        yield put({ type: 'actionSuccess', payload: {roadRescueTicket:response.data.data} });
      }
    },
    *loadUnJudgeTicket({payload:value}, { put, select,call }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(ticketService.queryTicketList,value,currentUser.userId) || {};
      if (response.data&&response.data.status.message=='success'){
        response.data.data.page=value.page;
        response.data.data.pagesize=value.pagesize;
        yield put({ type: 'actionSuccess', payload: {unJudgeTicket:response.data.data} });
      }
    },
    *loadAllTicket({payload:value}, { put, select,call }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(ticketService.queryTicketList,value,currentUser.userId) || {};
      if (response.data&&response.data.status.message=='success'){
        response.data.data.page=value.page;
        response.data.data.pagesize=value.pagesize;
        yield put({ type: 'actionSuccess', payload: {allTicket:response.data.data} });
      }
    },
    *queryTicketDetail({payload:value}, { put, select,call }) {
      const response = yield call(ticketService.queryTicketDetail,value) || {};
      if (response && response.data&&response.data.status.message=='success'){
        yield put({ type: 'actionSuccess', payload: {ticketDetail:response.data.data} });
        if (response.data.data.car&&response.data.data.car.msisdn&&response.data.data.car.vin){
          try{
            let { carServer, carInfo } = yield call(searchCarInfo, { msisdn: response.data.data.car.msisdn }) || {};
            carInfo.carServer = carServer;
            yield put({ type: 'actionSuccess', payload: {carInfo:carInfo} });
          }catch (err){
            message.error(Intl.get('log.wrongCarParams'));//'车辆信息参数错误 !'
            console.error("queryTicketDetail 查询车辆详情 err", err)
          }
        }else {
          message.error(Intl.get('log.wrongCarParams'));//'车辆信息参数错误 !'
        }

        if (response.data.data.fields.sessionId){
          const recordInfo = yield call(getRecordUrl,{session_id:response.data.data.fields.sessionId}) || '';
          if (recordInfo.data.status!='404'){
            yield put({ type: 'actionSuccess', payload: {recordInfo:recordInfo.data.data} });
          }
        }

      }
    },
    *queryTicketLogs({payload:value}, { put, select,call }) {
      const response = yield call(ticketService.queryTicketLogs,value) || {};
      if (response.data&&response.data.status.message=='success'){
        yield put({ type: 'actionSuccess', payload: {TicketLogs:response.data.data.rows} });
      }
    },
    *clearTicketInfo({payload:value}, { put, select,call }) {
      yield put({ type: 'actionSuccess', payload: {ticketDetail:{},TicketLogs:[],carInfo:{carServer:[]},recordInfo:{}} });
    },
  },

  reducers: {
    actionSuccess(state, action){
      return {...state, ...action.payload};
    }
  },

};
