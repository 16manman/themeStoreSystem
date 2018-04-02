import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon, Input } from 'antd/lib';

export default class CallPanel  extends PureComponent {
  state = {
    tel:'',
    panelList:[1,2,3,4,5,6,7,8,9,'*',0,'#'],
  }

  emitEmpty = ()=>{
    this.inputRef.focus();
    this.setState({ tel: '' });
    this.props.onChange('')
  }

  onInputChange = (e)=>{
    let value = e.target.value;
    this.setState({
      tel: value,
    })
    this.props.onChange(value)
  }

  clickNum = (item)=>{
    this.setState({
      tel:`${this.state.tel}${item}`
    })
    this.props.onChange(`${this.state.tel}${item}`)
  }

  dialRender = ()=>{
    let dialList = [];

    this.state.panelList.map((item, index)=>{
      dialList.push(<li key={index} onClick={()=>this.clickNum(item)}>{item}</li>)
    })
    return dialList;
  }

  componentWillUpdate = (nextProps, nextState)=>{
     if(nextProps.show ) this.inputRef.focus();
  }



  render() {
        {/*<Icon type="close-circle" className={styles.clear} onClick={this.emitEmpty} />*/}
    const { tel } = this.state;
    const { show } = this.props;
    const suffix = tel ?  <i className="iconfont icon-ico_qingchu clearIcon" onClick={this.emitEmpty}></i>  : null;

    return (
      <div className='dialpanel' style={this.props.style}>
        <Input suffix={suffix} value={tel}  ref={node => this.inputRef = node} onChange={this.onInputChange} className="input"  onPressEnter={this.props.onPressEnter}/>
        <ul className={styles.dialWrap}>
          {this.dialRender()}
        </ul>
      </div>
    )
  }
}

