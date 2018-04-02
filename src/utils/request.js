import fetch from 'dva/fetch';
import { openNotification, alertMsg, validateRule } from './utils'
import { refreshToken } from 'services/login';
import { ENV, API_FRONT } from './env';
import Intl from 'react-intl-universal';


//接口返回，转化json格式
function parseJSON(response) {
  return response.json();
}

/*
* 判断接口是否报错
*/
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return Promise.reject(response);
}

/*
* 判断业务逻辑
*/
function logicalJudge(response){
  if( !response.code ){
    return response;
  }
  if( response.code==='success'||response.code=='200' ){
    return response;
  }else{
    if( response.code === 1402 ){//前置机返回token 失效
      // alert("response.code"+response.code)
      return refreshToken().catch(err=>{
        return window.routerHistory && window.routerHistory.replace('/user/login');
      })
      // 
    }
    if( response.message==='查询结果为空' ){//不提示了，都没说明啥查询
      return response;
    }
    return Promise.reject(response);
  }
}

/*
* 判断错误的业务逻辑
*/
function errLogicalJudge(response){
  if( response && response.error && response.error.code=="5202" ){//接口返回token 失效
    return refreshToken().catch(err=>{
        return window.routerHistory && window.routerHistory.replace('/user/login');
    })
    // return window.routerHistory && window.routerHistory.replace('/user/login');
  }
  return response;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {

  // get请求拼接参数
  if (options.params&&(options.method=='get'||options.method=='GET')) {//get请求将params拼接到url中
    let paramsArray = [];
    //拼接参数
    Object.keys(options.params).forEach(key => paramsArray.push(key + '=' + options.params[key]));
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }

  // 设置headers
  const defaultOptions = {
    // credentials: 'include',
  };

  //如果 auth==='no', 则不需要token
  if ( options.auth!=='no' ) {
     options.headers = options.headers || {};
     options.headers['Authorization'] = window.localStorage.getItem("accessToken");
  }

  const newOptions = { ...defaultOptions, ...options };
    if (url.includes(API_FRONT) ) {
      newOptions.headers = {
        'Accept': 'application/json;responseformat=3',
        'Content-Type': 'application/json',
        'X-ENV-TYPE': ENV,
        ...newOptions.headers,
      };

    if (newOptions.upFiles) {  
      newOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      newOptions.body = newOptions.body;
    } else {
      newOptions.body = JSON.stringify(newOptions.body);
    }
  } else {
    if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
      newOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };

      newOptions.body = JSON.stringify(newOptions.body);
    }
  }


  return fetch(url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(logicalJudge)
    .then(errLogicalJudge)
    .then(data => ({ data }))
    .catch(err => {
      if( err.status === 401 ){//token 没传或格式错误
        return refreshToken().catch(err=>{
          window.routerHistory && window.routerHistory.replace('/user/login');
          return Promise.reject(err);
        })
      }
      console.log('err',err)
      if( err.message ){
        // openNotification('error', '接口异常', <div><p>url:{url}</p><p>描述：{err.message}</p></div> )
        alertMsg('error',err.message)
      }else{
        console.log('err====',err)
        openNotification('error', Intl.get('log.serverErr')+err.status, <div><p>{Intl.get('log.desc')}{err.url}</p></div> )
      }

      return Promise.reject(err);
     });
}
