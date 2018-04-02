import { getCode, login, getUserId } from 'services/login.js'
import { openNotification, alertMsg } from 'utils/utils'
import { routerRedux } from 'dva/router';

const validateRule = (code, message)=>{
	if(code==='success' || !code){
		return true;
	}
	return false;
}
export default {

  namespace: 'login',

  state: {

  	identityCode:'',
  	identityId:''
  },

  subscriptions: {

  },

  effects: {
  	*getVarifyCode({ payload }, { call, put }){
  		const { data, code, message } = yield call(getCode)
  		const ifOk = validateRule(code, message)
  		if(ifOk){
  			yield put({
	  			type: 'storeVarifyCode',
	  			payload: data.data,
	  		})
  		}
  	},
  	*login({ payload }, { call, put, select }){
  		const identityId = yield select(state=>state.login.identityId)
      try{
        const { data, code, message } = yield call(login, {...payload, identityId}) || {}
        const ifOk = validateRule(code, message);
        console.log("login payload", payload)
        if( ifOk ){
          const { accessToken, refreshToken, extNum, serviceNo, servicePassword, callTypeList,userRole } = data.data;
          //yield put({ type:'getUserId', payload: accessToken })
          window.localStorage.setItem('accessToken', accessToken, true);
          window.localStorage.setItem('refreshToken', refreshToken, true);
          window.localStorage.setItem('username', payload.username, true);
          window.localStorage.setItem('extNum', extNum, true);
          window.localStorage.setItem('serviceNo', serviceNo, true);
          window.localStorage.setItem('servicePassword', servicePassword, true);
          window.localStorage.setItem('userRole', userRole, true);
          if( callTypeList && callTypeList[0] ){
            window.localStorage.setItem('callType', callTypeList[0], true);
          }
          const userInfo = yield call(getUserId, payload ) || {};
          if (userInfo.data && userInfo.data.code=='success'){
            window.localStorage.setItem('userId', userInfo.data.data.userId, true);
            window.localStorage.setItem('realName', userInfo.data.data.realName, true);
          }
          yield put({ type:'socket/reconnectSocket' })
          // yield put({ type:'user/reGetUserInfo'})
          yield put(routerRedux.replace('/'))

        }
      }catch (err){
        console.log('login err', err)
        yield put({ type:'getVarifyCode' })
      }
  	},
    *logoutWork(_, { put }){
      yield put({ type: 'global/telSignOut', });
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("username");
      window.localStorage.removeItem('extNum');
      window.localStorage.removeItem('serviceNo');
      window.localStorage.removeItem('servicePassword');
      window.localStorage.removeItem('callType');
      window.localStorage.removeItem('userId');
      window.localStorage.removeItem('userRole');
      window.localStorage.removeItem('realName');
      yield put({ type:'current/clearState' })
      yield put({ type: 'global/clearState' })
      yield put({ type: 'map/clearState' })
      yield put({ type: 'socket/disconnectSocket' })
    },
  	*logout(_, { put }){
      // yield put({ type:'logoutWork' })
  		yield put(routerRedux.replace('/user/login'));

  	},
  },

  reducers: {
  	storeVarifyCode( state, { payload } ){
  		return {
  			...state,
  			...payload,
  		}
  	}
  },

};
