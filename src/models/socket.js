import io from 'socket.io-client';
const api = 'http://10.43.101.26:7002/' //'http://socket.xchanger.cn/' //

let socket;
function connectScoket(extrProperty){
   const userId = window.localStorage.getItem("userId");
    if( !userId ) return;
    // socket = io.connect('http://socket.xchanger.cn/?token='+userId);
    if( extrProperty ){
      socket = io.connect(api, {
        query: { 
          token: userId, 
          property:JSON.stringify(extrProperty)
        }
      });
     }else{
      socket = io.connect(api, {
        query: {  token: userId,  }
      });
     }
   
    socket.on('connect_timeout', (timeout) => {
      console.error("socket连接超时")
    });
    socket.on('connect_timeout', (timeout) => {
      console.error("socket连接超时")
    });
    socket.on('connect_error', (error) => {
      console.error("socket连接失败")
    });
}

export default {

  namespace: 'socket',

  state: {
    carinfo:{},//由于socket发送多条相同的信息，carinfo用来比较与发送的信息是否相同， 相同则不处理

  },

  subscriptions: {
    //监听socket推送信息
    socketRes({ dispatch, history }){
      // history.listen(({pathname, search})=>{
      //   if( pathname !=='/user/login' ){
      //     !socket && connectScoket();
      //     socket.on('connect', () => {
      //       console.log("连接成功")
      //       socket.on('res',(data) => {
      //         const userId = window.localStorage.getItem("userId");
      //         console.log('socket res', data);
      //         const { content, receiver, sendType, sendTime } = data || {};
      //         if( !content || receiver!==userId || sendType!=="single" ) return;
             
      //         const carInfo = (typeof content === 'string' ?  JSON.parse(content) : content) || {};
      //         const ihuInfo = carInfo.ihuInfo || {};
      //         const tboxInfo = carInfo.tboxInfo || {};
      //         carInfo.fiveCodeInfo = { msisdn:tboxInfo.msisdn, ihuId:ihuInfo.ihuId,tboxId:tboxInfo.tboxId,vin:carInfo.vin, carId:carInfo.id, deviceId: tboxInfo.deviceId};
      //         console.log("carInfo", carInfo)
      //         dispatch({ type: 'judgeCurrentCallState', payload: carInfo });
      //       });
      //     });
      //   }
      // })
    },
  },

  effects: {
    *judgeCurrentCallState({ payload }, { call, put, select }){
      console.log("coming judgeCurrentCallState")
      const { incomingTel, phoneNumber } = yield select(state=>state.global)
      const { carinfo } = yield select(state=>state.socket)
      if( !incomingTel || JSON.stringify(carinfo)=== JSON.stringify(payload)) return;
      //如果当前拨入msisdn和 socket返回的msisdn不一致，则主动接口调取
      yield put({ type:'changeState', payload: { carinfo: payload  } })
      if( phoneNumber.toString() === payload.fiveCodeInfo.msisdn.toString() ){
        console.log("socket 返回信息一致")
        yield put({ type: 'current/handleSearchCarResult', payload });
      }else{
        console.log("socket 返回信息不一致")
        // yield put({ type:'current/searchCarByMsisdn', payload: phoneNumber, });
        yield put({ type:'current/searchCar', payload:{ msisdn: phoneNumber } })
      }
    },
    //重新登陆时，重连
  	*reconnectSocket(_, call, put){
      const userId = window.localStorage.getItem("userId");
      if( !userId || !socket ) return;

      socket = io.connect(api, {
        query: { token: userId, }
      });
    },
    //退出登陆时，断开连接
    *disconnectSocket(){
      if( socket && socket.close ){
        console.log(" socket.close ")
        socket.close()
      }
    },
    //来电时， 带上msisdn一起重连
    *connectByMsisdn({ payload }, { call, put }){
      console.log("coming connectByMsisdn", payload)

      if( !payload ) return;
      console.log("coming connectByMsisdn====", payload)
      const userId = window.localStorage.getItem("userId");

      socket = io.connect(api, {
        query: { 
          token: userId, 
          property:JSON.stringify({
            'msisdn': payload,
          })
        }
      });
    },
    *hangoutHandle({ payload }, { call, put }){
      yield put({ type:'changeState', payload:{ carinfo: {} } })
      yield put({ type:'disconnectSocket'})
    },
  },

  reducers: {
  	changeState(state, { payload }){
      return { ...state, ...payload }
    }
  },

};
