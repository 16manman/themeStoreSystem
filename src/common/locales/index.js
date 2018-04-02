import Intl from 'react-intl-universal';
import login from './login'
import base from './base'
import log from './log'
import ticket from './ticket'
import current from './current'
import setting from './setting'
import ticketManagement from './ticketManagement'
import carInfo from './carInfo'
import swf from './swf'
import menu from './menu'
import callHst from './callHst'
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const locales = {
  "en-us": {
  	'base': base['en-us'],
  	'login': login['en-us'],
    'log': log['en-us'],
    'ticket': ticket['en-us'],
    'current': current['en-us'],
    'setting': setting['en-us'],
    'ticketManage': ticketManagement['en-us'],
    'carInfo': carInfo['en-us'],
    'menu': menu['en-us'],
    'swf': swf['en-us'],
    'callHst': callHst['en-us'],
  },
  "zh-cn": {
  	'base': base['zh-cn'],
  	'login': login['zh-cn'],
    'log': log['zh-cn'],
    'ticket': ticket['zh-cn'],
    'current': current['zh-cn'],
    'setting': setting['zh-cn'],
    'ticketManage': ticketManagement['zh-cn'],
    'carInfo': carInfo['zh-cn'],
    'menu': menu['zh-cn'],
    'swf': swf['zh-cn'],
    'callHst': callHst['zh-cn'],
  },
};

Intl.init({
  currentLocale: 'zh-cn', // TODO: determine locale here
  locales,
})
