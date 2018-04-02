import * as accountService from 'services/account'

export default {

  namespace: 'account',

  state: {
    list: [],
    pagination: {},
    totalPageCount: 0,
    EXTNumList: [],
    callServicerList: [],
    roleList: [],
    loading: false,
  },

  effects: {
  	*getList({payload: params}, {call, put}){
      yield put({ type: 'actionSuccess', payload: { loading: true } });
      const res = yield call( accountService.getList, params );
      if ( res.data && res.data.code==='success' ){
        yield put({ 
          type: 'actionSuccess', 
          payload: { 
            list: res.data.data,
            totalPageCount: Number(res.data.totalPageCount),
            pagination: {
              current:Number(res.data.pageIndex)+1,
              showQuickJumper: Number(res.data.totalPageCount)>1,
              total: Number(res.data.record),
              pageSize: Number(res.data.pageSize),
            },
            loading: false,
          } 
        });
      }
    },
    *reload(action, { put, select }) {
      const page = yield select(state=>state.account.pagination.current);
      yield put({ type: 'getList', payload: { pageIndex:page}});
    },
    *getEXTNumList( {}, {call, put} ){
      const res = yield call( accountService.getEXTNumList );
      if ( res.data && res.data.code==='success' ){
        yield put({ type: 'actionSuccess', payload: { EXTNumList: res.data.data } });
      }
    },
    *getCallServicerList( {payload: uid}, {call, put} ){
      yield put({ type: 'actionSuccess', payload: { loading: true } });
      const res = yield call( accountService.getCallServicerList, uid );
      if ( res.data && res.data.code==='success' ){
        yield put({ type: 'actionSuccess', payload: { callServicerList: res.data.data, loading: false } });
      }
    },
    *getRoleList( {}, {call, put} ){
      const res = yield call( accountService.getRoleList );
      if ( res.data && res.data.code==='success' ){
        yield put({ type: 'actionSuccess', payload: { roleList: res.data.data } });
      }
    },
    *bind({payload: params}, {call, put}){
      const res = yield call( accountService.bind, params );
      if ( res.data && res.data.code=='success' ){
        yield put({ type: 'reload'});
      }
    }
  },

  reducers: {
  	actionSuccess(state, action){
      return {...state, ...action.payload};
    }
  },

  subscriptions: {
    
  },

};
