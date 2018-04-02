import mockjs from 'mockjs';
import {getTicketList} from './mock/ticket'

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const mockData = {

  'GET /api/ticket/all': getTicketList



  // 支持值为 Object 和 Array

};

export default mockData
