const intiState = {
  POIs:null,
  poiTotalCount:0,
  centerCpoint:[],
  selectMarkIdx:null,
  ifShowAroundSearch: false,
  aroundPlace:{},
  currentCity: null,
  currentWeather: null,
}
export default {

  namespace: 'map',

  state: {
    ...intiState,
  },

  subscriptions: {

  },

  effects: {
  	*changeState({ payload }, { put }){
      yield put({ type:'stateChange', payload })
    }
  },

  reducers: {
    clearAllMapDatas( state ){
      return {
        ...state,
        POIs:[],
        poiTotalCount:0,
      }
    },
  	getSearchPOIs(state, { payload=[] }){
      return {
        ...state, 
        POIs: payload,
      }
    },
    poiTotal(state, { payload }){
      return {
        ...state, 
        poiTotalCount: payload,
      }
    },
    //周边搜搜的中点
    setCenterCpoint(state, { payload }){
      return {
        ...state, 
        centerCpoint: payload,
      }
    },
    hlMarkIdx(state, { payload }){
      return {
        ...state,
        selectMarkIdx: payload,
      }
    },
    aroundSearchToggel(state, { payload }){
      return {
        ...state, 
        ifShowAroundSearch: payload.bool,
        aroundPlace: payload.data || {},
      }
    },
    stateChange(state, { payload }){
      return { ...state, ...payload }
    },
    clearState(state, { payload }){
      return { ...state, ...intiState }
    },

  },

};
