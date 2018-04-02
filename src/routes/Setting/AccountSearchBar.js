/**
 * Created by fenghaoman on 2018/2/7.
 */
import React, { PureComponent } from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd/lib';
import Intl from 'react-intl-universal'


const FormItem = Form.Item;
const Option = Select.Option;
@Form.create()

export default class SearchBars extends PureComponent{
  /**
   * 重置
   */
  _clear = () =>{
    this.props.form.resetFields()
  };
  /**
   * 搜索
   */
  _search = () =>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          jobNo: values.jobNo||'',
          realName: values.realName||'',
          callTypeId: values.callTypeId||'',
          mobile: values.mobile||''
        }
        this.props.onSearch(params)
      }
    });
  };

  render() {
    const labelLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const { getFieldDecorator } = this.props.form;
    const roleList = this.props.roleList||[];
    const pleaseEnterText = Intl.get('base.pleaseEnter');
    return (
      <div style={{padding:20}}>
        <Form>
          <Row type="flex" justify="start" align="middle" gutter={16}>
            <Col span={8} >
              <FormItem {...labelLayout} label={Intl.get('setting.jobNo')}  style={{display:'flex', alignItems: 'center'}}>
                {getFieldDecorator('jobNo',{})(<Input placeholder={pleaseEnterText}/>)}
              </FormItem>
            </Col>
            <Col span={8} >
              <FormItem {...labelLayout} label={Intl.get('setting.name')}  style={{display:'flex', alignItems: 'center'}}>
                {getFieldDecorator('realName',{})(<Input placeholder={pleaseEnterText}/>)}
              </FormItem>
            </Col>
            <Col span={8} >
              <FormItem {...labelLayout} label={Intl.get('setting.roleInfo')} style={{display:'flex', alignItems: 'center'}}>
                {getFieldDecorator('callTypeId',{})
                (<Select placeholder={Intl.get('base.pleaseSelect')}>
                  {
                    roleList.map( (item, index)=>{
                      return(<Option key={index} value={item.id} >{item.roleName}</Option>)
                    })
                  }
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start" align="middle" gutter={16}>
            <Col span={8} >
              <FormItem {...labelLayout} label={Intl.get('base.mobile')} style={{display:'flex', alignItems: 'center'}}>
                {getFieldDecorator('mobile',{})(<Input placeholder={pleaseEnterText}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span={24} style={{display: 'flex',justifyContent: 'flex-end'}}>
              <Button  style={{width:90}} onClick={this._clear}>{Intl.get('base.reset')}</Button>
              <Button type="primary" style={{width:90,marginLeft:15}}  onClick={this._search}>{Intl.get('base.searchFor')}</Button>
            </Col>
          </Row>
        </Form>

      </div>
    )
  }
}
