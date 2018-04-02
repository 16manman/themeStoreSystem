import React, { PureComponent } from 'react';
import { DatePicker, Tooltip } from 'antd/lib';
import styles from './index.less'
import Intl from 'react-intl-universal'

export default class RangeDatePicker extends PureComponent{
	state={
		startValue: null,
	    endValue: null,
	    endOpen: false,
	}
	componentWillReceiveProps(nextProps){
		const { value=[] } = nextProps;
		this.setState({
			startValue: value[0],
			endValue: value[1],
		})
	}
	disabledStartDate = (startValue) => {
	    const endValue = this.state.endValue;
	    if (!startValue || !endValue) {
	      return false;
	    }
	    return startValue.valueOf() > endValue.valueOf();
	}
	disabledEndDate = (endValue) => {
	    const startValue = this.state.startValue;
	    if (!endValue || !startValue) {
	      return false;
	    }
	    return endValue.valueOf() <= startValue.valueOf();
	}

	onChange = (field, value) => {
	    this.setState({
	      [field]: value,
	    });
	}
	onStartChange = (value) => {
	    this.onChange('startValue', value);
	    const { endValue } = this.state;
	    this.props.onChange([value, endValue]);
	}

	onEndChange = (value) => {
	    this.onChange('endValue', value);
	    const { startValue } = this.state;
	    this.props.onChange([startValue, value]);
	}

	handleStartOpenChange = (open) => {
	    if (!open) {
	      this.setState({ endOpen: true });
	    }
	}

	handleEndOpenChange = (open) => {
	    this.setState({ endOpen: open });
	}

	render() {
		const { startValue, endValue, endOpen } = this.state;
	    return (
	      <div className={styles.wrap}>
	        <DatePicker
	          disabledDate={this.disabledStartDate}
	          showTime
	          format="YYYY-MM-DD HH:mm:ss"
	          value={startValue}
	          placeholder={Intl.get('base.startTime')}//"起始时间"
	          onChange={this.onStartChange}
	          onOpenChange={this.handleStartOpenChange}
	        />
	        <span style={{padding:'0 5px'}}>-</span>
	        <DatePicker
	          disabledDate={this.disabledEndDate}
	          showTime
	          format="YYYY-MM-DD HH:mm:ss"
	          value={endValue}
	          placeholder={Intl.get('base.endTime')}//"结束时间"
	          onChange={this.onEndChange}
	          open={endOpen}
	          onOpenChange={this.handleEndOpenChange}
	        />
	      </div>
	    );
	}
}