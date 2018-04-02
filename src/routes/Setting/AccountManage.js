import { PureComponent } from 'react';
import WithBreadCrumb from './WithBreadCrumb';
import { Card, Table, Button } from 'antd/lib';
import { connect } from 'dva';
import Intl from 'react-intl-universal'

@connect(state=>({
	account: state.account
}))
export default class AccountManage extends PureComponent {
	 constructor(props) {
    super(props);
		this.state = {
			searchValue: {},
		}
  }
	componentDidMount(){
	}
	

	render() {
		
		return (
			<WithBreadCrumb location={this.props.location} >
				<Card bordered={false} style={{ width: '100%' }}>
	
				</Card>
			</WithBreadCrumb>
		)
	}	
}