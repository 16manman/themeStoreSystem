import Intl from 'react-intl-universal';

const menuData = [{
  name: Intl.get('menu.skinManage'),//'皮肤管理',
  icon: 'setting',
  path: 'setting',
  authority: 'admin',
  children: [
    {
      name: Intl.get('menu.addSkin'),
      path: 'accountManage',
    },{
      name: Intl.get('menu.skinList'),
      path: 'accountManage',
    },{
      name: Intl.get('menu.categoryManage'),
      path: 'categoryManage',
    },{
      name: Intl.get('menu.providerManage'),
      path: 'providerManage',
    },
  ]
},{
  name: Intl.get('menu.operationManage'),//'运营管理',
  icon: 'setting',
  path: 'operationManage',
  authority: 'admin',
  children: [
    {
      name: Intl.get('menu.bannerManage'),
      path: 'bannerManage'
    },{
      name: Intl.get('menu.columnManage'),
      path: 'categoryManage',
    },
  ]
},

]
function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
