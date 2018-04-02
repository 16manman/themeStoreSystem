import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider,} from 'antd/lib';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import styles from './index.less';
// import TelBar from 'components/TelBar';
import { callAlias } from 'common/config'
import { status } from 'common/swfCode';
import Intl from 'react-intl-universal'

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();

  }
  _enterSVT=()=>{
    this.props.history.push('/current/400SVT');
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser = {}, collapsed, isMobile, onMenuClick, onNoticeClear, onNoticeVisibleChange, fetchingNotices, ifShowCallPanel, defaultAvater, ifShowTelBar, callType, phoneStateCode
    } = this.props;
    const canLogout = status[phoneStateCode].key === "free" || status[phoneStateCode].key === "offline";//只在空闲或未签入的状态才能退出登录
   
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/*退出登录*/}
        <Menu.Item key="logout" disabled={!canLogout} onClick={this.props.logout}><Icon type="logout" />{Intl.get('base.signout')}</Menu.Item>
      </Menu>
    );
    // const noticeData = this.getNoticeData();
    return (
      <Header className={styles.header}>
        {isMobile && (
          [
            (
              <Link to="/" className={styles.logo} key="logo">
                X-Call
              </Link>
            ),
            <Divider type="vertical" key="line" />,
          ]
        )}
        <div className={styles.left}>
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
          {callType===callAlias["400"] &&  <div className={styles.enterSVT} onClick={this._enterSVT}>{Intl.get('current.EnterSVT')}</div>}{/*进入SVT*/}
        </div>
       
        <div className={styles.right}>
          { 
            //ifShowTelBar && <TelBar togglePanel={this.props.togglePanel} ifShowCallPanel={ifShowCallPanel}/>
          }
          {/*<NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
          </NoticeIcon>*/}
          {currentUser.username ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar || defaultAvater} />
                <span className={styles.name}>{currentUser.username}</span>
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />}
        </div>
      </Header>
    );
  }
}
