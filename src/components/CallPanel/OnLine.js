import React, { PureComponent } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { Icon, Modal, message, Radio } from 'antd/lib';
import DialPanel from './DialPanel.js'
import PhoneInfo from './PhoneInfo.js'
import { connect } from 'dva'
import CallTime from 'components/CountTime'
import { status } from 'common/swfCode'
import { TRANSFER_SERVER } from 'common/config'
import Intl from 'react-intl-universal'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// let countDownInterval;
@connect((state)=>({
  global: state.global
}))
export default class OnLine  extends PureComponent {
  state = {
    ifShowPanel:false,
    dailValue:'',
    ifShowTransfModal: false,
    hangUp: false,//挂机
  }

  _handelInput = (val)=>{
    this.setState({
      dailValue: val,
    })
  }

  cancelTransf = ()=>{
    this.setState({
      ifShowTransfModal: false
    })
  }

  transf = ()=>{
    if(this.state.transfer){
      this.setState({
        ifShowTransfModal: false
      });
      this.props.dispatch({
        type: 'global/transfer',
        payload: this.state.transfer,
      })
    }else{
      //'请选择通话转接对象！'
      message.warning(Intl.get('log.callTransferRequired'))
    }
  }

  choiseTransfer = (e)=>{
    this.setState({ transfer: e.target.value })
  }

  transfModal = ()=>{
    const modalStyle ={
      'height': '160px',
      'alignItems': 'center',
      'display': 'flex',
      'padding': '0',
    }
    return (
      <Modal
        title={Intl.get('current.callTransfer')}//"通话转接"
        visible={this.state.ifShowTransfModal}
        onOk={this.transf}
        onCancel={this.cancelTransf}
        bodyStyle={modalStyle}
      >
        <RadioGroup onChange={this.choiseTransfer} className="transfModal">
          {
            TRANSFER_SERVER.map((item,index)=>(
              <RadioButton size="large" key={index} value={item.tel}>{item.value}</RadioButton>
            ))
          }
        </RadioGroup>
      </Modal>
    )
  }
  componentDidMount = ()=>{

  }
  //转接
  showTransfModal = ()=>{
    if(!this.props.isOnline || this.props.ifHoldOn || this.props.global.consultState===2){
      return ;
    }
    this.setState({
      ifShowTransfModal: true
    })
  }
  //咨询
  consult = ()=>{
    const { ifOnline } = this.props.global;
    if( ifOnline ){
       this.props.consult()
    }
  }
  //三方
  threeSideCall = ()=>{
    const { ifOnline } = this.props.global;
    if( ifOnline ){
      this.props.dispatch({
        type: 'global/consultBridge'
      })
    }
   
  }
  //挂机/取消三方通话
  _hangup = ()=>{
    if( this.props.type==="thirdParty" ){
      this.props.dispatch({
        type: 'global/cancelConsult'
      })
    }else{
      this.setState({ hangUp: true })
      this.props.dispatch({
        type: 'global/hangUp'
      })
    }
    
  }
  //暂停
  holdOn = ()=>{
    const { ifHoldOn } = this.props.global;
    if(!this.props.isOnline){
      return ;
    }
    console.log( ifHoldOn ? '取消暂停' : '暂停' )
    ifHoldOn ? this.props.dispatch({
      type: 'global/unholdOn'
    }) :  this.props.dispatch({
      type: 'global/holdOn'
    })
  }

  callProgress = ()=>{
    const { isConnect, isRing } = this.props;
    const { hangUp } = this.state;
    if( hangUp ){//挂机
      return;
    }
    if( isConnect ){
      return Intl.get('current.connecting')+'...';//接通中
    }
    if( isRing ){
      return Intl.get('current.ringing')+'...';//对方已振铃
    }
  }
  toggleShowDialPanel = ()=>{
    this.setState({
      ifShowPanel:!this.state.ifShowPanel
    })
  }

  render() {
    const { phoneNumber, phoneAddr, isConnect, isRing, isOnline, type } = this.props;
    const { ifHoldOn, consultState } = this.props.global;
   
    const { ifShowPanel } = this.state;

    //保持
    const disabledHoldOn = isConnect || isRing || consultState>0 
    const disabledHoldOnCls = classNames({[styles.disabled]: disabledHoldOn})
    //转移
    const disabledTransf =  isConnect || isRing || ifHoldOn || consultState>0  
    const disabledTransfCls = classNames({[styles.disabled]: disabledTransf })
    //咨询
    const disabledConsult = isConnect || isRing || ifHoldOn || consultState>0 
    const disabledConsultCls = classNames({[styles.disabled]: disabledConsult })
    //三方
    const disabledThirdParty = consultState!==2
    const disabledThirdPartyCls = classNames({[styles.disabled]: disabledThirdParty })

    const isThirdParty = type==="thirdParty";
   
    
    const info = (
      <div className={styles.callingInfo} style={{ display: ifShowPanel ? 'none' : 'block' }}>
        {/*三方拨出*/}
        { isThirdParty && <span className={styles.thirdPartyTag}>{Intl.get('current.ThreePartiesCallOut')}</span>} 
        {/*号码信息*/}
        <PhoneInfo phoneNumber={phoneNumber} phoneAddr={phoneAddr} />
        {/*通话计时 / 接通中...*/}
        <p className={styles.phoneTime}> { isOnline ? <CallTime/> : <span className={styles.callStateText}>{ this.callProgress()}</span>}</p>

        {/*录音中*/}
        {isOnline && 
          <p className={styles.recording}>
            {/*正在录音*/}
            {Intl.get('current.callRecording')}...
            {/*（已暂停）*/}
            { ifHoldOn && <span className={styles.callingDesc}>{Intl.get('current.hasStopped')}</span> }
          </p>
        }

        <ul className={styles.callingControl} style={{"visibility":isThirdParty ? "hidden" : "visible"}}>
          <li className={disabledHoldOnCls} onClick={disabledHoldOn ? null : this.holdOn} >
          {/*暂停*/}
            <i className={classNames(styles.icon, 'iconfont', 'icon-ico_zanting')} ></i><span>{Intl.get('base.stop')}</span>
          </li> 
          <li className={disabledTransfCls} onClick={disabledTransf ? null : this.showTransfModal} >
            {/*转接*/}
            <i  className={classNames(styles.icon, 'iconfont', 'icon-ico_zhuanjie')} ></i><span>{Intl.get('current.transfer')}</span>
          </li> 
          <li className={disabledConsultCls} onClick={disabledConsult ? null : this.consult}>
            {/*咨询*/}
            <i  className={classNames(styles.icon, 'iconfont', 'icon-zixun')} ></i><span>{Intl.get('current.consulting')}</span>
          </li> 
          <li className={disabledThirdPartyCls} onClick={disabledThirdParty ? null : this.threeSideCall}>
            {/*三方*/}
            <i  className={classNames(styles.icon, 'iconfont', 'icon-ico_sanfang')} ></i><span>{Intl.get('current.ThreeParties')}</span>
          </li> 
        </ul>
   
      </div>
    )

    return (
      <div className={styles.contentWrap}>
          <DialPanel style={{ display: ifShowPanel ? 'block' : 'none' ,}} onChange={this._handelInput} />  
          { info } 
          <p className={styles.toggleDial}><i className={classNames(styles.icon, 'iconfont', 'icon-ico_jianpan')} onClick={this.toggleShowDialPanel}></i></p>
          <div className={styles.onhookbtn} onClick={this._hangup}><i style={{fontSize:10, transform:'scale(0.9)'}} className="iconfont icon-ico_guadianhua"></i></div>
          { this.transfModal() }
      </div>
    )
  }
}
