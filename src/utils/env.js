
let ENV, CALL_PHONE={};
const API_FRONT = 'http://api.xchanger.cn/';
let API_OSS = 'http://oss.beta.xchanger.cn/';
let API_TICKET = API_FRONT+'api/';
let API_XCALL = API_FRONT+'api/'; 
let HOST = '10.20.16.152';

if( process.env.NODE_ENV === 'development' || (!window.config && !window.config.x_env_type) ){
	ENV = 'testing';
	CALL_PHONE = {
		'I-Call': '02131773872',
		'B-Call': '02131773871',
		'400': '02131773870',
	}

} else {
	const x_env_type = window.config.x_env_type;
	CALL_PHONE = {
		'I-Call': window.config['I-Call'],
		'B-Call': window.config['B-Call'],
		'400': window.config['400'],
	}

	switch (x_env_type) {
		case 'beta':
			ENV = 'testing';
		break;
		case 'prod':
			ENV = 'production';
			HOST = '10.20.16.158';
			// API_XCALL = "http://xcall.xchanger.cn/api/";
			API_OSS = 'http://oss.prod.xchanger.cn/'
		break;
		case 'stage':
			ENV = 'staging';
		break;
		default:
			ENV = 'testing';
			
	}
}

export { ENV, API_TICKET, API_XCALL, API_OSS, API_FRONT, CALL_PHONE, HOST }
