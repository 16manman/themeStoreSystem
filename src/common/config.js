
import Intl from 'react-intl-universal'
import { CALL_PHONE } from 'utils/env'

// const HOST = '10.20.16.158';
const AMAPKEY = 'a75703095c0d793e9ad937db87224d3d';
const callAlias = {
	"I-Call":'I-Call',
	"B-Call":'B-Call',
	"400":'400',
}
const MSISDN = "18496569453";//"14591663027" //"18667175212";//"14537794294" ;//

const ADMIN = "admin";
const TICKET_PRIORITY = {
  '1': Intl.get('ticket.low'),//低
  '2': Intl.get('ticket.ordinary'),//一般
  '3': Intl.get('ticket.urgent'),//'紧急'
  '4': Intl.get('ticket.veryUrgent'),//非常紧急
  [1]: Intl.get('ticket.low'),//低
  [2]: Intl.get('ticket.ordinary'),//一般
  [3]: Intl.get('ticket.urgent'),//'紧急'
  [4]: Intl.get('ticket.veryUrgent'),//非常紧急
};
const TICKET_STATUS = {
	'1': Intl.get('ticket.accepting'),//受理中
  '2': Intl.get('ticket.hasEnd'),//已完结
}
//呼叫转移服务
const TRANSFER_SERVER = [
  { value: 'B-CALL '+Intl.get('current.customerServiceGroup'), key: 1, tel: CALL_PHONE['B-Call'] }, 
  { value: 'I-CALL '+Intl.get('current.customerServiceGroup'), key: 2, tel: CALL_PHONE['I-Call']  },
  { value: '400 '+Intl.get('current.customerServiceGroup'), key: 3, tel: CALL_PHONE['400']  },
]

const CALL_TYPE = {
  1: {text: Intl.get('base.callIn'), key: 1},
  2: {text: Intl.get('base.callOut'), key: 2},
}
const GEELY_SERVER = '吉利维修'
export  { callAlias, AMAPKEY, MSISDN, ADMIN, TICKET_PRIORITY, TICKET_STATUS, TRANSFER_SERVER, GEELY_SERVER, CALL_TYPE }