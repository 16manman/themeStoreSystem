import { MSISDN, callAlias }  from 'common/config';
import { HOST }  from 'utils/env';

import { status, operateCode } from 'common/swfCode';
import { message } from 'antd/lib';
import Intl from 'react-intl-universal';

console.log("HOST", HOST)
const initState = {
  collapsed: false,
  notices: [],
  fixedLayer:false,
  phoneNumber:'',//通话中的电话号码
  incomingPhone:'',//来电的通话号码
  // telegram:{},//来电信息
  seatStatusChanging: false,//是否状态变化中
  phoneStateCode: -1 ,//通话状态
  phoneSubStateCode: -1 ,//通话子状态
  incomingTel: false,//是否有来电
  ifOnline: false, //是否通话中
  ifHoldOn:false, //是否暂停成功
  consultState:-1,//咨询状态 -1：未咨询 0：咨询拨号 1：咨询接通中 2：咨询通话中 3:咨询三方通话中
  sessionId:null,
  callout:false,//是否外拨
}

export default {
  namespace: 'global',

  state: {
    ...initState,
    ifWindowLoaded:false,
  },

  effects: {
    //判断是否通话中
    *ifOnlineEffects(_,{ select, put }){
      const incomingTel =  yield select(state => state.global.incomingTel);
      if(incomingTel){
        // yield put({ type: 'onlineEffect', payload: true, })
        yield put({ type: 'actionSuccess', payload: { ifOnline: true } })
        yield put({ type:'current/storeCurrentState',  payload: true})//（接通电话，就要处理工单）改变状态，显示工单
        // yield put({ type: 'current/createTicket'})//请求接口，创建工单
      }
    },
    //设置话后
    *wrapupMode(){
      console.log('话后');
      yield window.CTIClient.WrapupMode(1)
    },
    //取消咨询
    *cancelConsult(){
      console.log('取消咨询');
      yield window.CTIClient.ConsultCancel()
    },
    //咨询
    *consult({ payload }){
      console.log('咨询',payload);
      yield window.CTIClient.Consult(payload.destType, payload.dest)
    },
    //三方
    *consultBridge(){
      console.log("三方")
      yield window.CTIClient.ConsultBridge();
    },
    //转移
    *transfer({ payload }, { put }){
      console.log("转接", payload);
      yield window.CTIClient.Transfer(2, payload);
    },
    //主动改变状态
    *initiativeChangeState({ payload }, { put }){
      console.log("改变状态",payload)
      window.CTIClient.ChangeState(payload);
      yield put({ type: 'actionSuccess', payload: { seatStatusChanging: true }, })
    },
    //取消暂停
    *unholdOn(){
      console.log("取消暂停")
      yield window.CTIClient.UnHold();
    },
    //保持、暂停
    *holdOn(){
      console.log("暂停")
      yield window.CTIClient.Hold();
    },
    //拨打电话
    *dial({ payload }, { put, select}){
      const phoneStateCode = yield select(state=>state.global.phoneStateCode);
      const ifOnline = yield select(state=>state.global.ifOnline);
      console.log("拨打电话 ifOnline", ifOnline , payload)
      if( ifOnline ){
        return message.warn(Intl.get('log.notAllowedDail'))
      }
      if( status[phoneStateCode].key==='offline' ){
         return message.warn(Intl.get('log.signInSWF'))
      }
      if( !payload ){
        return message.warn(Intl.get('log.failToDial'))
      }
      yield put({ type:'actionSuccess', payload:{ phoneNumber: payload, callout:true } })
      yield window.CTIClient.Dial(2, payload);
    },
    //挂机
    *hangUp(_, { put }){
      window.CTIClient.Hangup();
      // yield put({ type: 'hangupInit', })
    },
    //登录
    *signIn({}, { put, select }){
      if( !window.CTIClient || !window.CTIClient.Init ) return;
      const { extNum, serviceNo, servicePassword  } = yield select(state=>state.user.currentUser);
      // console.log('window.CTIClient.Init',window.CTIClient, window.CTIClient.Init)

      window.CTIClient.Init(HOST, serviceNo, servicePassword, extNum);
      window.CTIClient.Login();
      yield put({ type: 'actionSuccess', payload: { seatStatusChanging: true }, })
    },
    //登出
    *telSignOut({}, { put }){
      console.log("登出")
      if( window.CTIClient && window.CTIClient.Logout )
      yield window.CTIClient.Logout();
    },
    //判断是否为呼入接通电话
    *judgeIfHasConnected(_, { put, select }){
      const handleTicket = yield select(state=>state.current.handleTicket);
      const callout = yield select(state=>state.global.callout);
      console.log("是否外拨：", callout ? "是" : '否')
      if( !callout && !handleTicket ){ //没有接通来电，（漏接）自动除去话后模式
        yield put({ type: 'initiativeChangeState', payload:0, })
      }
    },
    //取消话后模式
    *cancelCallEnd(_, { put, select }){
      yield put({ type: 'hangupInit' })
      //提交工单后自动置闲
      yield put({ type: 'initiativeChangeState', payload:0, });
    },
  },

  reducers: {
    //咨询状态 -1：未咨询 0：咨询拨号 1：咨询接通中 2：咨询中 3:三方通话中
    changeConsultState(state, { payload }){
      return {
        ...state, consultState:payload,
      }
    },
    //挂机后初始化
    hangupInit(state){
      return {
        ...state,
        ifHoldOn: false,//取消暂停状态
        incomingTel: false, //取消来电状态
        ifOnline: false,//取消通话中状态
        consultState: -1,//取消咨询状态
        callout: false,//外拨标识取消
      }
    },
    //改变状态
    changeState(state, { payload }){
      return {
        ...state,
        phoneStateCode: payload.state,
        phoneSubStateCode: payload.subState,
      }
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    clearState(state){
      return {...state, ...initState};
    },
    actionSuccess(state, { payload }){
      return { ...state,  ...payload };
    },
  },

  subscriptions: {
    //判断网页是否加载完成
    windowLoaded({dispatch}) {
      window.onload=()=>{
        dispatch({ type:'actionSuccess', payload:{ ifWindowLoaded: true } })
        window.onbeforeunload = function(){ return ()=>"刷新以后将强制登出坐席！"; }
      }
      window.onunload = function(){
        window.CTIClient && window.CTIClient.Logout ? window.CTIClient.Logout() : '';
      }
    },
    //判断用户登录
    ifLogin({ history }) {
      history.listen(({ pathname, search }) => {
        const accessToken = window.localStorage.getItem("accessToken");
        const username = window.localStorage.getItem("username");
        const userId = window.localStorage.getItem('userId');
         window.localStorage.accessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbWFuIiwidWlkIjoiYW1hbiIsImNsaWVudElkIjoiYnJvd3NlciIsImlzcyI6IjExMTIyMiIsImV4cCI6MTUyMzI2MDk2NSwiaWF0IjoxNTIyNjU2MTY1fQ.0CcaKZQs5ImguEqfDyoNR_bRfamJcOPOmVBPTvvqnYI';
         window.localStorage.username='aman';
         window.localStorage.userId='8006';
        // if( !( accessToken && username && userId ) && pathname!=='/user/login' ){
        //   history.replace('/user/login')
        // }
      });
    },
    scroll({dispatch}){
      document.body.onscroll=()=>{
        const scrollTop = document.body.scrollTop;
        dispatch({ type:'actionSuccess', payload:{ fixedLayer: scrollTop>=65 } })
      }
    }
  },
};
