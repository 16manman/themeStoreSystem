/**
 * Created by liwei on 2018/1/25.
 */
import mockjs from 'mockjs';
const Random = mockjs.Random;

const ticketListData = mockjs.mock({
  'data': {
    count:100,
    'rows|100':[{
      'id|+1': 1,
      name: () => {
        return Random.cname();
      },
      phone: /1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}/,
      'statusCode|1-2': 1,
      'ticketCliId|1-5': 1,
      'levelCode|1-4': 1,
      ticketId: () => {
        return Random.string('lower',9);
      },
      title: () => {
        return Random.ctitle(12);
      },
      service:() => {
        return Random.zip();
      },
      createdAt: () => {
        return Random.datetime('yyyy-MM-dd HH:mm:ss');
      },
      updatedAt: () => {
        return Random.datetime('yyyy-MM-dd HH:mm:ss');
      },
    }]
  },
  status: {
    message: 'success'
  },
});


export function getTicketDetail(req, res, u) {

  let params = req.query;
  //let {pagesize,page} = params;
  let page = Number(params.page);
  let result = mockjs.mock({
    'data': {
      count:100,
      current:page,
      'rows|10':[{
        'id|+1': 1,
        name: () => {
          return Random.cname();
        },
        phone: /1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}/,
        'statusCode|1-2': 1,
        'ticketCliId|1-5': 1,
        'levelCode|1-4': 1,
        ticketId: () => {
          return Random.string('lower',9);
        },
        title: () => {
          return Random.ctitle(12);
        },
        service:() => {
          return Random.zip();
        },
        createdAt: () => {
          return Random.datetime('yyyy-MM-dd HH:mm:ss');
        },
        updatedAt: () => {
          return Random.datetime('yyyy-MM-dd HH:mm:ss');
        },
      }]
    },
    status: {
      message: 'success'
    },
  });
  //res.json(result);
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getTicketList(req, res, u) {

  let params = req.query;
  //let {pagesize,page} = params;
  let page = Number(params.page);
  let result = mockjs.mock({
    'data': {
      count:100,
      current:page,
      'rows|10':[{
        'id|+1': 1,
        name: () => {
          return Random.cname();
        },
        phone: /1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}/,
        'statusCode|1-2': 1,
        'ticketCliId|1-5': 1,
        'levelCode|1-4': 1,
        ticketId: () => {
          return Random.string('lower',9);
        },
        title: () => {
          return Random.ctitle(12);
        },
        service:() => {
          return Random.zip();
        },
        createdAt: () => {
          return Random.datetime('yyyy-MM-dd HH:mm:ss');
        },
        updatedAt: () => {
          return Random.datetime('yyyy-MM-dd HH:mm:ss');
        },
      }]
    },
    status: {
      message: 'success'
    },
  });
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

