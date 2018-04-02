import request from '../utils/request';
import { API_FRONT, API_XCALL } from 'utils/env'
// const API_CAR = 'http://xcall.beta.xchanger.cn/api/car/';

const commonTarget =  'model,color,config,volume,owner,tbox,ihu'
export function searchCarByMsisdn(msisdn){
	return request(API_XCALL+`car/?msisdn=${msisdn}`,{
		method:'get',
		flag:'new',
	})
}
export function searchCarByVinTel(value){
	return request(API_XCALL+`car?targetId=${value}`,{
		method:'get',
		flag:'new',
	})
}

//获取车辆服务信息 targetId为 vin或ihuId或temId或mobile
export function searchCarServer({ key, value }){
	if( window.config && window.config.x_env_type === 'prod' ){
		return;
	}
	return request(API_FRONT+`admin-device/sub-tservice/${value}?target=${key}`,{
		method:'get',
		flag:'new',
	})
}

//根据VIN,TEMId,ihuId,mobile查询车辆状态
export function getCarGeo({value, key="vin"}){
	return request(API_XCALL+`car/geo?${key}=${value}`, {
		method: 'get',
		flag: 'new',
	})
}
//TODO: 搜索车辆信息统一用这个接口 
export function searchCarByTSP({ vin, msisdn, mobile }){
	console.log('window.config  searchCarByTSP====', window.config)
	if( window.config && window.config.x_env_type === 'prod' ){
		return;
	}
	if( vin || msisdn || mobile ){
		return request(API_FRONT+`admin-device/ecarx_cars?target=${commonTarget}`, {
			method: 'POST',
			body: {
				"modelId":"all",
	  			"belongEnv":"all",
				"vin":vin,
			    "msisdn":msisdn,
			    "mobile":mobile,
			}
		})
	}
	return Promise.reject("no params")
	console.warn("searchCarByTSP, no params")
}



/*
* @func 根据 msisdn/tel/vin 查询车辆信息
* @params msisdn 根据msisdn查询
* @params tel 根据tel查询
* @params vin 根据vin查询
* @return {Array} carServer 车辆订购服务
* @return {Object} carInfo 车辆车主信息
* @return {Array} cars 查询到的车辆列表（根据tel查询可能存在多辆车）
*/
export async function searchCarInfo({ msisdn, vin, telOrVin }){
	let carServer=[], carInfo={};
	let carInfoRes = msisdn ? await searchCarByMsisdn(msisdn) : await searchCarByVinTel( telOrVin || vin );


	if( carInfoRes && carInfoRes.data && carInfoRes.data.data ){
		if( carInfoRes.data.data.length===0 ) return  Promise.resolve('nodata');
		//只有一辆车
		if( carInfoRes.data.data.length===1 ){
			carInfo = carInfoRes.data.data[0]
			let car_vin = carInfo.vin;
			if( car_vin ){
				try{
					let carServerRes = await searchCarServer({ key:'vin', value: car_vin });
					if( carServerRes && carServerRes.data && carServerRes.data.success ){
						carServer = carServerRes.data.data;
					}else{
						console.log("搜索T服务失败", carServerRes )
					}
				}catch(err){
					console.log("搜索T服务失败 err", err )
				}
			}else{
				console.log('未获取到vin码，不能查询T服务')
			}
		}
		console.log('查询车辆信息：',{carServer, carInfo, cars: carInfoRes.data.data})
		return { carServer, carInfo, cars: carInfoRes.data.data }
	}else{
		console.log("search car By telOrVin error", carInfoRes )
		return Promise.reject(carInfoRes);
	}

}
// searchCarInfo({ msisdn: "18667175212" })