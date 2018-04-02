import moment from 'moment';
import { notification, message } from 'antd/lib';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}
/*
export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}
*/
/*function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {//
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}*/

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath => routePath.indexOf(path) === 0 && routePath !== path);
  // routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  // renderArr.push(routes[0]);
  for (let i = 0; i < routes.length; i += 1) {
/*    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);//要push
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);//判断
    if (isAdd) {
      renderArr.push(routes[i]);
    }*/
    renderArr.push({...routerData[routes[i]], path:routes[i] });
  }
  const renderRoutes = renderArr.map((item) => {
   /* const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);*/
    return {
      // ...routerData[`${path}${item}`],
      // key: `${path}${item}`,
      // path: `${path}${item}`,
      ...item,
      exact: item.exact===false ? false : true,
    };
  });
  return renderRoutes;
}



export function formatTel(value="") {
  if(value.length===11){
    return value.substring(0,3)+' '+value.substring(3,7)+' '+value.substring(7)
  }
  return value;
}

export function parseCallTime(count){
  let hours = Math.floor(count/(60*60));
  let minutes = Math.floor((count - hours*60*60)/60);
  let seconds = count - hours*60*60 - minutes*60;
  hours = hours < 10 ? "0"+hours : hours;
  minutes = minutes < 10 ? "0"+minutes : minutes;
  seconds = seconds < 10 ? "0"+seconds : seconds;
  return `${hours}:${minutes}:${seconds}`;
}

export function openNotification (type="error", title, content){
  notification[type]({
    message: title,
    description: content,
  });
};

export function alertMsg(type="error", content, duration){
  message[type]( content, duration );
};

export function _isNotNull(val){

  if (val == null || val == undefined) {
    return false;
  }
  if (typeof val == "string" && (val == "" || val.trim() == "")) {
    return false;
  }
  if (typeof val == "object" && val.length <= 0) {
    return false;
  }
  if(typeof val == "object") {
    return Object.keys(val).length != 0;
  }
  return true;
};

export function _dateFormat(dataStr,format){

  //YYYY-MM-DD HH:mm
  format = format||'YYYY-MM-DD HH:mm:ss';
  if(dataStr){
    return moment(new Date(dataStr)).format(format);
  }
  return moment().format(format);
  
};


export function validateRule({code, message, success}){
  if(success || code==='success' || !code){
    return true;
  }
  if(code==='failure'){
    message && alertMsg('error',message)
  }else{
    openNotification('error','服务器异常'+code, message )
  }
  return false;
}

var geocoder ;
if( window.AMap && window.AMap.Geocoder ){
  geocoder = new window.AMap.Geocoder({
      extensions: "base",
      // lang:''
  }); 
}
//TODO:: 经纬度转化格式判断（不同格式不同方法）

export function GeoTrans( position={}, callback ){
  // let position = {
  //   latitude: 30213615,
  //   longitude: 120201397,
  // }
  return new Promise((resolve, reject)=>{
    if( geocoder ){
      if( !(position.longitude && position.latitude) ){
        return reject('未获取经纬度');
      }
      const lnglatXY = position.longitude%1===0 ? [ position.longitude/3600000, position.latitude/3600000 ] : [ position.longitude, position.latitude ]
      console.log("经纬度：", position, lnglatXY )
      geocoder.getAddress(lnglatXY, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
              // const addressComponent = result.addressComponent;
              // const formattedAddress = addressComponent.province+' '+addressComponent.city+' '+addressComponent.district+' '+addressComponent.township+' '+addressComponent.
              if( callback )
              callback(result.regeocode.formattedAddress)
              resolve({ addr: result.regeocode.formattedAddress, position:lnglatXY });
          }else{
            console.log("经纬度解析错误", status, result)
            reject('经纬度解析错误')
          }
      }); 
    }else{
      reject('未获取经纬度')
    }
  })
}

export function isArray(o){
  return Object.prototype.toString.call(o)=='[object Array]';
}

export function parseUrlSearch(search){
  search = search.replace('?', '');
  let querys = {};
  const searchItemArr = search.split('&');
  searchItemArr.map(item=>{
    let searchQuery = item.split('=');
    querys[searchQuery[0]] = searchQuery[1]; 
  })
  return querys;
}

