import request from '../utils/request';
import { API_FRONT } from 'utils/env'
import { md5 } from '../utils/md5'
import { message } from 'antd/lib';


function createBody({ value, key,  lat, lon, title  }){
	return {
  	  'srcType': 'onCall',
	  'serviceType': '10000',
	  'pushByType': key,
	  'targetType': 'ihu',
	  'pushByValue':  value,
	  'message': {
	    'lat': lat,
	    'lon': lon,
	  },
	  'title': title
	}
}

// function sign(body){
// 	const stringifyBody = JSON.stringify(body).replace(' ', '')+'oncalPIKL';
// 	console.log('stringifyBody',stringifyBody)
// 	const byteByMd5 =  md5(stringifyBody)
// 	console.log('byteByMd5',byteByMd5)
// 	const encodedBase64 = base64.encode(byteByMd5.toUpperCase());
// 	console.log('encodedBase64', encodedBase64)
// 	// const byteByUTF8 = utf8.encode(encodedBase64)
// 	console.log('byteByUTF8',encodedBase64)
// 	return encodedBase64;
// }
// sign(createBody({ key:'vin', value:'L6T7944Z9HN472024' }))

export function poiPush({ key, value, lat, lon, title }){
	if( window.config && window.config.x_env_type === 'prod' ){
		return message.warn("POI下发功能待开发");
	}
	// console.log('service poiPush', { key, value, lat, lon, title })
	// const bodyInfo = createBody({ key, value, lat, lon, title });
	// return request(API_FRONT+'device-platform/ecarx_alipush_message',{
	// 	method: 'put',
	// 	headers: {
	// 		'Authorization':sign(bodyInfo),//加密后的md5
	// 		'X-APP-ID':'onCall'
	// 	},
	// 	body: bodyInfo,
	// 	flag:'new',
	// 	auth:'no',
	// })
	//
	//http://10.43.101.17:8007/admin-device/ecarx_alipush_message
	return request(API_FRONT+'admin-device/ecarx_alipush_message', {
		method:'put',
		flag:'new',
		body: {
		  'srcType': 'onCall',
		  'serviceType': '10000',
		  'pushByType': key,
		  'targetType': 'ihu',
		  'pushByValue':  value,
		  'message': {
		    'lat': lat,
		    'lon': lon,
		  },
		  'title': title
		},
	})
}
