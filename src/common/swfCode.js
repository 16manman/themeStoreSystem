import Intl from 'react-intl-universal'
const operateCode = {
	1: Intl.get('swf.operateSuccess'),//'操作成功',
	7: Intl.get('swf.enterpriseNotExist'),//'企业不存在',
	8: Intl.get('swf.needReLogin'),//'坐席需要重新登录',
	9: Intl.get('swf.wrongParams'),//'参数有误',
	11: Intl.get('swf.seatNotExist'),//'坐席不存在',
	12: Intl.get('swf.hasSignIn'),//'坐席已登录',
	13: Intl.get('swf.wrongPwd'),//'密码错误',
	14: Intl.get('swf.cantSignOnline'),//'坐席通话不能登录',
	15: Intl.get('swf.signInFail'),//'登录失败',
	16: Intl.get('swf.extHasOccupied'),//'分机已被占用',
	21: Intl.get('swf.signOutFail'),//'登出失败',
	31: Intl.get('swf.transfFail'),//'转移失败',
	32: Intl.get('swf.seatNotExist'),//'坐席不存在',
	33: Intl.get('swf.seatOnbusy'),//'坐席忙',
	41: Intl.get('swf.consultFail'),//'咨询失败',
	42: Intl.get('swf.consultSeatNotExist'),//'咨询坐席不存在',
	43: Intl.get('swf.consultOnbusy'),//'咨询坐席忙',
	51: Intl.get('swf.failToCancelConsult'),//'咨询取消失败',
	61: Intl.get('swf.failToTransfConsult'),//'咨询转移失败',
	71:	Intl.get('swf.failToConsultThree'),//'咨询三方失败',
	81:	Intl.get('swf.failToListen'),//'监听失败',
	82:	Intl.get('swf.listenSeatNotExist'),//'监听坐席不存在',
	83:	Intl.get('swf.listenSeatNotOnline'),//'监听坐席坐席未在通话中',
	91:	Intl.get('swf.failToIntercept'),//'拦截失败',
	101: Intl.get('swf.failToBreakIn'),//'强插失败',
	111: Intl.get('swf.failToBreakDown'),//'强拆失败',
	121: Intl.get('swf.failToHangout'),//'挂机失败',
	151: Intl.get('swf.faliToChangeState'),//'状态改变失败',
	161: Intl.get('swf.failToForceSignout'),//'强制签出失败',
	171: Intl.get('swf.faliToForceChangeState'),//'强制改变状态失败',
	181: Intl.get('swf.failToCallOut'),//'呼叫失败',
	182: Intl.get('swf.wrongPhoneNumber'),//'呼叫号码格式错误',
	191: Intl.get('swf.failToStop'),//'暂停失败',
	201: Intl.get('swf.failToCancelStop'),//'取消保持失败',
	211: Intl.get('swf.failToChangeCallend'),//'改变话后模式失败',
	221: Intl.get('swf.failToSetData'),//'设置随路数据失败',
	341: Intl.get('swf.failTochangeExt'),//'改变绑定分机失败',
	347: Intl.get('swf.extHasBinded'),//'分机已绑定',
	361: Intl.get('swf.failToChangeAdminMode'),//'改变管理员模式失败',
	362: Intl.get('swf.failToMeeting'),//'会议失败',
}

const sceneCode = {
	16: Intl.get('swf.consultSeats'),//'咨询坐席',
	17: Intl.get('swf.consultInside'),//'咨询内线',
	18: Intl.get('swf.consultOutside'),//'咨询外线',
	19: Intl.get('swf.transSeats'),//'转移坐席',
	20: Intl.get('swf.transInside'),//'转移内线',
	21: Intl.get('swf.transOutside'),//'转移外线',
	22: Intl.get('swf.dialSeats'),//'外拨坐席',
	23: Intl.get('swf.dialInside'),//'外拨内线',
	24: Intl.get('swf.dialOutside'),//'外拨外线',
	25: Intl.get('swf.cancelStop'),//'取消保持',
	26: Intl.get('swf.cancelConsult'),//'咨询取消',
	27: Intl.get('swf.transConsult'),//'咨询转移',
	28: Intl.get('swf.cancelConsultFail'),//'咨询失败取消',
	29:	Intl.get('swf.consultSeats'),//'咨询坐席',
	30:	Intl.get('swf.intercept'),//'拦截',
	31:	Intl.get('swf.bridging'),//'桥接',
	32:	Intl.get('swf.cancelConsultSeats'),//'咨询坐席取消',
	33:	Intl.get('swf.cancelConsultSeatsFail'),//'咨询坐席失败取消',
	34:	Intl.get('swf.bridging'),//'桥接',
	35:	Intl.get('swf.breakIn'),//'强插',
	36:	Intl.get('swf.consultThird'),//'咨询三方',
	37:	Intl.get('swf.consultThirdSeat'),//'咨询坐席三方',
	38:	Intl.get('swf.bridgingSeat'),//'桥接坐席',

}

const status = {
	1: { text: Intl.get('swf.free'), key: 'free' },//'空闲'
	2: { text: Intl.get('swf.onbusy'), key: 'onbusy' },//'忙'
	3: { text: Intl.get('swf.connecting'), key: 'connecting' },//'连接'
	4: { text: Intl.get('swf.callend'), key: 'callend' },//'话后'
	5: { text: Intl.get('swf.calling'), key: 'calling' },//'通话'
	[-1]: { text: Intl.get('swf.offline'), key: 'offline' },//'未登录'
}



const seatStatus = {
	free: {state: 1, subState: 0},
	onbusy: {state: 2, subState: 1},
	offline: {state:  -1, subState: -1},
	onrelease: {state:  2, subState: 2},
	connecting: {state: 3, subState: -1},
	callend: {state: 4, subState: -1},
	calling: {state: 5, subState: -1},
}


export {  status, sceneCode,  operateCode, seatStatus }
