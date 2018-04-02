import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Icon, Divider } from 'antd/lib';
import { connect } from 'dva';
import DialPanel from './DialPanel.js'
import OnLine from './OnLine.js'
import InComing from './InComing.js'
import Dial from './Dial.js'
import { status, sceneCode } from 'common/swfCode'
import Intl from 'react-intl-universal'
 

@connect(state=>({
  fixedLayer: state.global.fixedLayer,
  phoneStateCode: state.global.phoneStateCode,
  incomingTel: state.global.incomingTel,
  global: state.global,
}))
export default class CallPanel  extends PureComponent {
  state = {
    calleePhone:'',
    consultPhone:'',//咨询号码
  }

  initThirdParty = ()=>{
    this.setState({
      consultPhone:'',//咨询号码
    })
  }

  headerRender = ()=>{
     const {  hidePanel, localTel,  } = this.props;
    return (
      <div className={styles.panelHeaderWrap}>
        <div className={styles.panelHeader}>
          <Icon
            className={styles.trigger}
            type={'menu-unfold'}
            onClick={hidePanel}
          />
        {/*本机号码：*/}
          <p className={styles.localTel}>{Intl.get('current.currentSeatNumber')}{Intl.get('base.colon')}{localTel}</p>
        </div>
        <Divider />
      </div>
    )
  }

  consultDial = ()=>{
    this.props.dispatch({
      type:'global/changeConsultState',
      payload:0,//拨号
    })
  }

  //拨打电话
  _callPhone = (calleePhone)=>{
    this.setState({ calleePhone })
    this.props.dispatch({
      type:'global/dial',
      payload: calleePhone ,
    })
  }

  //咨询拨打
  _callConsultPhone = (callPhone)=>{
    this.setState({
      consultPhone: callPhone,
    })
    this.props.dispatch({
      type:'global/changeConsultState',
      payload:1,//接通中
    })
    this.props.dispatch({
      type: 'global/consult',
      payload:{
        destType: 2,  
        dest:callPhone,
      }
    })
  }

  judgePanel = ()=>{
    const { show } = this.props;
    const { phoneStateCode, ifOnline, incomingTel,  phoneNumber} = this.props.global;
    const phoneStateText = status[phoneStateCode].key;
    //来电
    if( phoneStateText ==  'connecting' && incomingTel ){
      return <InComing phoneNumber={phoneNumber}  />
    }
    //外拨连接
    if( phoneStateText ==  'connecting' && !incomingTel ){
      return <OnLine phoneNumber={phoneNumber} isConnect={true} />
    }
    //外拨振铃
    if( phoneStateText ==  'calling' && !ifOnline ){
      return <OnLine phoneNumber={phoneNumber} isRing={true} />
    }
    //通话中
    if( ifOnline ){
      return <OnLine phoneNumber={phoneNumber} isOnline={true} consult={this.consultDial}/>
    }

    return <Dial call={this._callPhone} show={show}/>
    // return  <OnLine phoneNumber={'15957136209'} isOnline={true} consult={this.consultDial}/>
    // return  <OnLine type="thirdParty" phoneNumber={'15957136209'} isOnline={false} /> 
    // return  <OnLine phoneNumber={'15957136209'} isConnect={true} />
  }

  render() {
    const { consultState, ifOnline } = this.props.global;
    const { className, show, hidePanel, localTel,  fixedLayer,  } = this.props;
    const { consultPhone, } = this.state;
    const clsString = classNames(className, 'panelWrapCommon', {[styles.panelWrapAbsolute]: show && !fixedLayer}, {[styles.hidePanelWrap]: !show}, {[styles.fixedPanelWrap]: show &&  fixedLayer})
    //不在通话中，初始化
    if( !ifOnline ){
      this.initThirdParty();
    }

    return (
      <div className={clsString}>
      <div className={styles.panelScroll}>
        <div className={styles.panelBox}>
          { this.headerRender() }
          { this.judgePanel() }
          { ifOnline && 
            <div>
            <Divider style={{margin:'15px 0 10px'}}/>
            { consultState===0  && <Dial call={this._callConsultPhone} show={show}/> }
            { consultState===1 && <OnLine type="thirdParty" phoneNumber={consultPhone} isConnect={true} /> }
            { consultState>=2 &&  <OnLine type="thirdParty" phoneNumber={consultPhone} isOnline={true} /> }
            </div>
          }
        </div>
      </div>
      </div>
    );

  
  }
}

