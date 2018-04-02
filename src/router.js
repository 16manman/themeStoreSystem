import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd/lib';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import BlankLayout from './layouts/BlankLayout';
// import { IntlProvider } from 'react-intl';
// import locales from 'common/locales';

import styles from './index.css';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  window.routerHistory = history;
  const routerData = getRouterData(app);

  const BasicLayout = routerData['/'].component;
  return (

  	<LocaleProvider locale={zhCN}>
    
	    <Router history={history}>
       
	      <Switch>
            <Route path="/user" render={props => <BlankLayout {...props} routerData={routerData} />} />
	          <Route path="/" render={props => <BasicLayout {...props} />} />
	      </Switch>
       
	    </Router>

    </LocaleProvider>

    
  );
}

export default RouterConfig;
