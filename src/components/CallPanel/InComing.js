import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon } from 'antd/lib';
import DialPanel from './DialPanel.js'
import PhoneInfo from './PhoneInfo.js'


export default class Calling  extends PureComponent {
  state = {
  }

  render() {
    const { phoneNumber, phoneAddr } = this.props;
    return (
      <div className={styles.linkingWrap}>
       <PhoneInfo phoneNumber={phoneNumber} phoneAddr={phoneAddr}/>
       <div className={styles.defaultAvatar}>
        <i className="iconfont icon-ico_morentouxiang" style={{fontSize:40, color:'#D9D9D9'}}></i>
       </div>
       <div className={styles.linkingBtn}><Icon type="phone" /></div>
      </div>
    )
  }
}

