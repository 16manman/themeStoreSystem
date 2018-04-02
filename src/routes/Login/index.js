import React from 'react';
import { Input, Icon, Form, Checkbox, Button, Row, Col } from 'antd/lib';
import styles from './index.less';
import { connect } from 'dva';
import Intl from 'react-intl-universal';
const FormItem = Form.Item;


@connect(state=>({
	login: state.login,
}))
@Form.create()
export default class Login extends React.PureComponent {

	componentWillMount(){
		this.props.dispatch({ type:'login/logoutWork' })
		this.props.dispatch({ type: 'login/getVarifyCode', })
	}
	reGetVarifyCode = (e)=>{
		e.preventDefault();
		this.props.dispatch({
			type: 'login/getVarifyCode',
		})
	}
	login = (e)=>{
		e.preventDefault();
		this.props.form.validateFields((err, values)=>{
			if(err) return;
			this.props.dispatch({
				type: 'login/login',
				payload:{
					username: values.username.trim(),
					password: values.password.trim(),
					identifyingCode: values.identifyingCode.trim(),
				}
			})
		})
		
	}
	render(){
		const { identityCode } = this.props.login;
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.login} className={styles.loginForm} hideRequiredMark>
			<FormItem>
				{getFieldDecorator('username', {
	            rules: [{ required: true, message: Intl.get('login.inputName') }],
	          })(
	            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={Intl.get('login.name')} />
	          )}
	        </FormItem>
			<FormItem>
	          {getFieldDecorator('password', {
	            rules: [{ required: true, message: Intl.get('login.inputPwd') }],
	          })(
	            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder={Intl.get('login.pwd')} autoComplete="off"/>
	          )}
	        </FormItem>	
	        <FormItem className='varifyCodeWrap'>	
	           	<Row gutter={8}>
	                <Col span={12}>
	                  {getFieldDecorator('identifyingCode', {
					    rules: [{ required: true, message: Intl.get('login.inputVerify') }],            
			          })(
	                    <Input placeholder={Intl.get('login.verifyCode')}autoComplete="off"/>
	                  )}
	                </Col>
	                <Col span={12}>
	                  <div className={styles.varifyCodeImgWrap}>
			          	<span className={styles.varifyCode}>{ identityCode || Intl.get('login.getFailed')}</span>
			          	<a onClick={this.reGetVarifyCode}><Icon type="reload" style={{padding:'0 10px'}}/></a>
			          </div>
	                </Col>
	            </Row>
	        </FormItem>
	       {/* <FormItem>
	          {getFieldDecorator('remember', {
	            valuePropName: 'checked',
	            initialValue: true,
	          })(
	            <Checkbox>Remember me</Checkbox>
	          )}
	          <a className="login-form-forgot" href="">Forgot password</a>
	        </FormItem>*/}
	        <Button type="primary" htmlType="submit" className={styles.loginBtn} >
	            {Intl.get('login.login')}
	         </Button>
			</Form>
		)
	}
}
