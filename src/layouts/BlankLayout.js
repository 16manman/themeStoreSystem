import React from 'react';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd/lib';
import GlobalFooter from '../components/GlobalFooter';
import styles from './BlankLayout.less';
import { getRoutes } from '../utils/utils';
import Intl from 'react-intl-universal';

/*const links = [{
  key: 'help',
  title: '帮助',
  href: '',
}, {
  key: 'privacy',
  title: '隐私',
  href: '',
}, {
  key: 'terms',
  title: '条款',
  href: '',
}];*/

const copyright = <div>Copyright <Icon type="copyright" /> 2018 ECARX</div>;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = Intl.get('base.callCenter');
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${Intl.get('base.callCenter')}`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>{Intl.get('base.callCenter')}</span>
              </Link>
            </div>
          </div>
          {
            getRoutes(match.path, routerData).map(item => {
                return (
                  <Route
                    key={item.path}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              }
            )
          }
          <GlobalFooter className={styles.footer} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
