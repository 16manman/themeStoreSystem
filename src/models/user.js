
export default {

  namespace: 'user',

  state: {
    defaultAvater: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  	currentUser: {
      username: window.localStorage.getItem("username"),
      accessToken: window.localStorage.getItem("accessToken"),
      refreshToken: window.localStorage.getItem("refreshToken"),
      extNum: window.localStorage.getItem("extNum"),//分机号
      serviceNo: window.localStorage.getItem("serviceNo"),//软电话帐号
      servicePassword: window.localStorage.getItem("servicePassword"), //软电话密码
      callType: window.localStorage.getItem("callType"), //软电话密码
      userId: window.localStorage.getItem('userId'),
      userRole: window.localStorage.getItem('userRole'),
      realName: window.localStorage.getItem('realName')
    },
  	notifyCount:0,
  },

  subscriptions: {
    subLocalStorage({dispatch}){
      window.addEventListener("setItemEvent", function (e) {
        dispatch({
          type: 'storageChange',
          payload: {
            key: e.changedKey,
            value: e.newValue,
          }
        })
     
      });
    },
  },

  effects: {

  },

  reducers: {
    storageChange(state, { payload }){

      if( payload.key in state.currentUser ){
        return {
          ...state, 
          currentUser: { ...state.currentUser, [payload.key]: payload.value, }
        }
      }
      return state;
      
    }
  },

};
