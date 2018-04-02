import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd/lib';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from 'components/GlobalHeader';
import GlobalFooter from 'components/GlobalFooter';
import SiderMenu from 'components/SiderMenu';
import NotFound from 'routes/Exception/404';
import { getRoutes } from 'utils/utils';
import CallPanel from 'components/CallPanel';
import { status } from 'common/swfCode';
import { getMenuData } from '../common/menu';
import styles from './BasicLayout.less'
import { callAlias } from 'common/config'
//bcall
import FaultInfo from 'routes/Current/FaultInfo';
import Intl from 'react-intl-universal';

const { Content } = Layout;
// const { AuthorizedRoute } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile,
    ifShowCallPanel: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    const callCenterText = Intl.get('base.callCenter')
    let title = callCenterText;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${callCenterText}`;
    }
    return title;
  }
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  _hideCallPanel = ()=>{
    this.setState({
      ifShowCallPanel: false,
    })
  }
  _togglePanel = ()=>{
    if(status[this.props.phoneStateCode].key === "offline"){
      return;
    }
    this.setState({
      ifShowCallPanel: !this.state.ifShowCallPanel,
    })
  }
  _logout = ()=>{
    this.props.dispatch({
      type:'login/logout'
    })
  }
  hideFaultInfo = ()=>{
    this.props.dispatch({
      type: 'current/ifShowFaultInfo',
      payload: false,
    })
  }
  render() {
    const { ifShowCallPanel, } = this.state;
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location, localTel, phoneStateCode, defaultAvater, ifWindowLoaded, history
    } = this.props;
    const { extNum, serviceNo, servicePassword, callType } = currentUser;//分机号，帐号，密码
    const { ifShowFaultInfo } = this.props.current;


    if( status[phoneStateCode].key === "offline" ){
      this._hideCallPanel()
    }
    const ifShowTelBar =  extNum && extNum!=='null' && serviceNo && serviceNo!='null' && servicePassword && servicePassword!=='null' && ifWindowLoaded;
    const layout = (
      <Layout>
        <SiderMenu
          authorized={window.localStorage.getItem('userRole')}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <GlobalHeader
            // logo={logo}
            phoneStateCode={phoneStateCode}
            history={history}
            callType={callType}
            ifShowTelBar={ifShowTelBar}
            ifShowCallPanel={ifShowCallPanel}
            currentUser={currentUser}
            defaultAvater={defaultAvater}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            isMobile={this.state.isMobile}
            onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            togglePanel={this._togglePanel}
            logout={this._logout}
          />
          <Content className={styles.basicLayer}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item => (
                    <Route
                        exact={item.exact}
                        key={item.path}
                        path={item.path}
                        component={item.component}
                      />
                    ))
                }
                {
                  redirectData.map(item => <Redirect key={item.from} exact from={item.from} to={item.to} /> )
                }
                <Redirect exact from="/" to="/current/call" />
               <Route component={NotFound} />
              </Switch>
            </div>
          </Content>
          <CallPanel show={ifShowCallPanel} hidePanel={this._hideCallPanel} localTel={localTel}/> 
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading, current }) => ({
  currentUser: user.currentUser,
  defaultAvater: user.defaultAvater,
  localTel: user.currentUser.extNum,
  ifWindowLoaded: global.ifWindowLoaded,
  collapsed: global.collapsed,
  phoneStateCode: global.phoneStateCode,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  current,

}))(BasicLayout);
