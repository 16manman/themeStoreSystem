import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon, message } from 'antd/lib';
import DialPanel from './DialPanel.js'
import Intl from 'react-intl-universal'



export default class Dial extends PureComponent {
  state = {
    tel:''
  }

  _handelInput = (val)=>{
    this.setState({
      tel:val
    })
  }

  callPhone = ()=>{
    if(this.state.tel && this.state.tel.length>=3){
      this.props.call(this.state.tel);
    }else{
      message.warning(Intl.get('log.pleaseEnterCorrectPhone'))//'请填写正确的电话号码！'
    }
  }

  render() {

    return (
      <div className={styles.contentWrap}>
        <DialPanel onChange={this._handelInput}  onPressEnter={this.callPhone} show={this.props.show}/>
        <div className={styles.callBtn} onClick={this.callPhone}><i className="iconfont icon-ico_boda" style={{fontSize:20}}></i></div>
      </div>
    )
  }
}

