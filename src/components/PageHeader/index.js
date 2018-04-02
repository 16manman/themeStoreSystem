import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd/lib';
import classNames from 'classnames';
import styles from './index.less';
import Intl from 'react-intl-universal'



function getBreadcrumb(breadcrumbNameMap, url) {
  if (breadcrumbNameMap[url]) {
    return breadcrumbNameMap[url];
  }
  const urlWithoutSplash = url.replace(/\/$/, '');
  if (breadcrumbNameMap[urlWithoutSplash]) {
    return breadcrumbNameMap[urlWithoutSplash];
  }
  let breadcrumb = {};
  Object.keys(breadcrumbNameMap).forEach((item) => {
    const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
    const itemRegExp = new RegExp(itemRegExpStr);
    if (itemRegExp.test(url)) {
      breadcrumb = breadcrumbNameMap[item];
    }
  });
  return breadcrumb;
}

export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      location: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  };
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return (last || !route.component)
      ? <span>{route.breadcrumbName}</span>
      : createElement(linkElement, {
        href: paths.join('/') || '/',
        to: paths.join('/') || '/',
      }, route.breadcrumbName);
  }

  render() {
    const { routes, params, location, breadcrumbNameMap } = this.getBreadcrumbProps();
    const { className, linkElement = 'a', ifHasHome } = this.props;

    const clsString = classNames(styles.pageHeader, className);

    let breadcrumb;
    if (location && location.pathname) {
      const pathSnippets = location.pathname.split('/').filter(i => i);

      const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
        const isLinkable = (index !== pathSnippets.length - 1) && currentBreadcrumb.component && currentBreadcrumb.isLinkable!==false;
        return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
          <Breadcrumb.Item key={url}>
            {createElement(
              isLinkable ? linkElement : 'span',
              { [linkElement === 'a' ? 'href' : 'to']: url },
              currentBreadcrumb.name,
            )}
          </Breadcrumb.Item>
        ) : null;
      });
      console.log('extraBreadcrumbItems',extraBreadcrumbItems)
      const breadcrumbItems = ifHasHome ? [(
        <Breadcrumb.Item key="home">
          {createElement(linkElement, {
            [linkElement === 'a' ? 'href' : 'to']: '/',
          }, Intl.get('base.homePage'))}
        </Breadcrumb.Item>
      )].concat(extraBreadcrumbItems) : extraBreadcrumbItems ;
      breadcrumb = (
        <Breadcrumb className={styles.breadcrumb}>
          {breadcrumbItems}
        </Breadcrumb>
      );
    } else {
      breadcrumb = null;
    }


    return (
      <div className={clsString}>
        {breadcrumb}
      </div>
    );
  }
}
