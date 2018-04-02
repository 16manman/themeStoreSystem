import * as ticketService from '../services/ticketService'
import * as carInfoServer from '../services/carInfo'
import * as poiPush from '../services/poiPush'
import * as commonService from '../services/commonService'
import Intl from 'react-intl-universal';
import { GeoTrans, alertMsg, isArray } from '../utils/utils'
// import {queryTicketType,createTicket} from '../../services/ticketService'

const initState = {
    ifShowFaultInfo:false,
    unDoTicket:{},
    historyTicket:{},
    carAndOwnerInfo:{},//车辆用户信息
    ownerInfo:{},//用户信息
    ownCars:[],//名下车辆
    fetchingCarInfo:false,//查询车辆信息
    fetchingCarGeo:false,//查询车辆经纬度
    carServer: null,
    fiveCodeInfo:{},//车辆五码信息
    carGeo: null,//[120.206147,30.211424]
    carAddr:'',
    handleTicket: false,//当前工单是否正在填写
    distributeServer:null,//派发服务站信息
    ticketInfo:{},//工单信息
    showOwnerCarsModal: false, //是否显示选择名下车辆的modal
    isHasUnDo:false,
    carDirection:0,//车辆方向
}
export default {

  namespace: 'current',

  state: {
   ...initState,
  },

  subscriptions: {

  },

  effects: {
    *loadUnDoTicket({payload:value}, { put, select,call }) {
      yield put({ type: 'actionSuccess', payload: {unDoTicket:{}} });
      const response = yield call(ticketService.queryLoadHistoryTicketList,value.params, value.phone) || {};
      if (response.data&&response.data.status.message=='success'){
        yield put({ type: 'actionSuccess', payload: {unDoTicket:response.data.data} });
      }
    },
    *loadHistoryTicket({payload:value}, { put, select,call }) {
      yield put({ type: 'actionSuccess', payload: {historyTicket: {}} });
      const response = yield call(ticketService.queryLoadHistoryTicketList,value.params,value.phone) || {};
      if (response.data&&response.data.status.message=='success'){
        yield put({ type: 'actionSuccess', payload: {historyTicket:response.data.data} });
      }
    },
    *searchCar({ payload }, { put, call }){
      yield put({ type:'storeCarAndOwnerInfo', payload: {}  })
      yield put({ type: 'actionSuccess', payload: { fetchingCarInfo: true, carServer:null, } })
      let { msisdn, vin, telOrVin } = payload || {};
      const data = yield call(carInfoServer.searchCarInfo, { msisdn, vin, telOrVin }) || {};

      if( !data || data==="nodata" || !data.cars || !data.cars.length ){
        alertMsg('error',Intl.get('log.failToSearchCarInfo'))
        yield put({ type: 'actionSuccess', payload: { fetchingCarInfo: false} })
        return Promise.reject('err')
      }

      const { carServer, carInfo, cars } = data;
      if( cars.length === 1 ){
        const { tboxInfo={}, ihuInfo={} } = carInfo;
        msisdn = msisdn || tboxInfo.msisdn;
        vin = vin || carInfo.vin;
        carInfo.fiveCodeInfo = { msisdn, ihuId:ihuInfo.ihuId, tboxId:tboxInfo.tboxId, vin, carId:carInfo.id};

        yield put({ type: 'actionSuccess', payload: { carServer, fetchingCarInfo: false } })

        yield put({ type:'storeCarAndOwnerInfo', payload: carInfo  })

        yield put({ type: "sessionBind", payload: { msisdn, vin } })//sessionid 和msidn,vin绑定

        yield put({ type:'getCarGeo', payload: { key:'vin', value: vin} });//获取车辆经纬度
      }else{

        yield put({ type:'actionSuccess', payload:{ ownCars: cars, showOwnerCarsModal: cars.length > 1, fetchingCarInfo: false } })
      }

      return Promise.resolve(data);
    },
    *handleSearchCarResult({ payload }, { put, call }){
      const carinfo = payload;
      const vin = carinfo.fiveCodeInfo.vin;
      const msisdn = carinfo.fiveCodeInfo.msisdn;
      console.log("coming handleSearchCarResult")
      yield put({ type: "sessionBind", payload: { msisdn, vin } })//sessionid 和msidn,vin绑定
      yield put({ type:'storeCarAndOwnerInfo', payload: carinfo  })
      if( vin ){
        yield put({ type:'getCarGeo', payload: { key:'vin', value: vin} });//获取车辆经纬度
        yield put({ type: 'getCarServer', payload: { key:'vin', value: vin} })
      }
    },

    *getCarGeo({ payload }, { put, call }) {

      yield put({ type: 'actionSuccess', payload: { carGeo: [], carAddr: '', fetchingCarGeo: true } })
      const data = yield call(carInfoServer.getCarGeo, payload);

      if( data && data.data && data.data.data){
        const info = data.data.data || {} ;
        try{
          const { addr, position } = yield call(GeoTrans, info.position) || {};
          yield put({ type: 'actionSuccess', payload: { carGeo: position, carAddr: addr, fetchingCarGeo: false, carDirection: info.direction || 0 } })
          return Promise.resolve({ carGeo: position, carAddr: addr, });
        }catch (err){
          console.error("经纬度报错", err);
          alertMsg('error', err)
        }
      }else{
          alertMsg('error', Intl.get('log.failToSearchCarAddr'))
          console.log("getCarGeo, data", data)
      }
      yield put({ type: 'actionSuccess', payload: { fetchingCarGeo: false } })
      return Promise.reject(Intl.get('log.failToSearchCarAddr'));//'刷新车辆位置失败'
    
    },
    *getCarServer({ payload }, { put, call }){
      yield put({ type: 'actionSuccess', payload: { carServer: null } })
      const res = yield call(carInfoServer.searchCarServer, payload);
      if( res && res.data && res.data.data ){
        const { data } = res.data;
        yield put({ type: 'actionSuccess', payload: { carServer: data } })
        console.log('getCarServer', data);
      }
    },
    *pushPOI({ payload }, { put, call, select }){
      const vin = yield select(state=>state.current.carAndOwnerInfo.vin);
      if( !vin ){
        return alertMsg('error', Intl.get('log.failToSearchCarinfo'))//'未查询到相关车辆信息'
      }
      const params = { ...payload, key:'vin', value: vin  }
      console.log('params', params)
      const { data:res } = yield call(poiPush.poiPush, params)
      const { data, success } = res || {};
      if( data && success ){
        alertMsg('success', data.info || Intl.get('log.POIPushSuccess'))//'发送到车辆成功！'
        return Promise.resolve('发送到车辆成功！')
      }
      alertMsg('error', Intl.get('log.POIPushFail'))//'发送到车辆失败！'
      return Promise.reject(Intl.get('log.POIPushFail'))//'发送到车辆失败！'
      console.log('pushPOI', res)
      // poiPush.poiPush
    },
    *createTicket({ payload }, { put, call, select }){
      payload = payload || {};
      let sessionId = yield select(state=>state.global.sessionId);
      let phone = yield select(state=>state.global.incomingPhone);
      let currentUserId = yield select(state=>state.user.currentUser.userId);
      console.log('currentUserId',currentUserId)
      const initialValue = {
        phone, //拨入手机号（有）
        updatedUserId: currentUserId,// 修改人id（有）
        client: '1',// 客户端类型（有）
        originCode: '1',// 工单是怎么创建的（有）
        createdUserId: currentUserId,//工单创建人（有）
      }
      let pldFields = payload.fields || {};
      const fields = { ...pldFields, sessionId };
      const ticketInfo = { ...payload, ...initialValue, fields };
      console.log('ticketInfo',ticketInfo);
      const { data={} } = yield call(ticketService.createTicket, ticketInfo) || {};
      if( data.status && data.status.message && data.status.message==='success' ){
        yield put({ type:'actionSuccess', payload:{ ticketInfo: data.data } });
        yield put({ type: "sessionBind", payload: { ticketid: data.data.ticketId } })//工单和sessionId绑定
        //yield put()
        console.log('工单创建成功', data);
      }else{
        yield put({ type:'actionSuccess', payload:{ ticketInfo: {} } });
        console.log('工单创建失败',data);
      }
      return data;
    },
    *sessionBind({ payload }, { put, call, select }){
      const sessionId = yield select(state=>state.global.sessionId);
      const incomingPhone = yield select(state=>state.global.incomingPhone);
      console.log(" sessionBind payload ", {...payload, dtsid: sessionId, phone: incomingPhone})
      // const { data } = yield call(commonService.sessionIdBind, {...payload, dtsid: sessionId, phone: incomingPhone});
      commonService.sessionIdBind({...payload, dtsid: sessionId, phone: incomingPhone}).then(({data})=>{
        console.log("sessionBind data", data);
      })
    },
    *isHasUnDo({ payload }, { put, call, select }){
      const response = yield call(ticketService.queryLoadHistoryTicketList,{pagesize:999, page:0, statusCode:'1'}, payload ) || {};
      if (response.data&&response.data.status.message=='success'&&response.data.data.rows.length>0){
        yield put({ type: 'actionSuccess', payload: {unDoTicket:response.data.data,isHasUnDo:true} });
      }
    }
  },

  reducers: {
    clearState(state){
      return initState
    },
    storeCurrentState(state, { payload }){
      return { ...state, handleTicket: payload };
    },
    ifFetchingCarInfo(state, { payload }){
      return { ...state, fetchingCarInfo: payload };
    },
    toggelShowFaultInfo(state) {
      return {
        ...state, ifShowFaultInfo: !state.ifShowFaultInfo,
      }
    },
  	ifShowFaultInfo(state, { payload }){
      return {
        ...state, ifShowFaultInfo: payload,
      }
    },
    actionSuccess(state, action){
      return {...state, ...action.payload};
    },
    storeCarAndOwnerInfo(state, { payload }){
      return { ...state, carAndOwnerInfo: payload, ownerInfo: payload.ownerInfo||{} ,fiveCodeInfo:payload.fiveCodeInfo||{}}
    },
    aftSubTicket(state, { payload }){
      return {
        ...state,
        ticketInfo: {},
      }
    }
  }

};
