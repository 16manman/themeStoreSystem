import { PureComponent } from 'react';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import Intl from 'react-intl-universal';
const breadcrumbNameMap = {
  '/setting':{
    name: Intl.get('menu.skinManage')
  },
  '/setting/accountManage':{
    name: Intl.get('menu.addSkin'),
  },
}

export default  ({ children, location}) => {
    return (
      <PageHeaderLayout breadcrumbNameMap={breadcrumbNameMap}   ifHasHome={false} location={location}>
      {children}
      </PageHeaderLayout>
    )

}