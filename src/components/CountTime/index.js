import { PureComponent } from 'react';
import { parseCallTime } from 'utils/utils';


export default  class CallTime extends PureComponent {
  state = {
  	calltime:0,
  }
  componentDidMount(){
      this.countDownInterval = window.setInterval(()=>{
        this.setState({calltime:  this.state.calltime+1});
      },1000)
  }

  componentWillUnmount(){
    window.clearInterval(this.countDownInterval);
  }

  render(){
  	return parseCallTime(this.state.calltime).split(":").join(" : ");
  }

}