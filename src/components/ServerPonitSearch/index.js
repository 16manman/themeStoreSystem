import { PureComponent } from 'react';
import { Dropdown, Pagination, Spin, Select } from 'antd/lib';
import styles from './index.less'
import classNames from 'classnames'
// import { connect } from 'dva'
import debounce from 'lodash-decorators/debounce';//函数去抖
import { GEELY_SERVER } from 'common/config'
import Intl from 'react-intl-universal';

const Option = Select.Option;

export default class ServerPonitSearch extends PureComponent{
	constructor(props) {
	    super(props);
	    this.lastFetchId = 0;
	}
	state = {
	    data: [],
	    value: this.props.value,
	    fetching: false,
	}
	componentWillUpdate(nextProps, nextState){
      if(!this.placeSearch){
      	this.instanceSearch();
      }
    }
    componentWillReceiveProps(nextProps) {
	    // Should be a controlled component.
      if ('value' in nextProps) {
        const value = nextProps.value;
        this.setState({value});
      }
    }

	instanceSearch = ()=>{
    	//周边搜索，显示大圆圈
        window.AMap.service(["AMap.PlaceSearch"], ()=>{
            this.placeSearch = new window.AMap.PlaceSearch({ //构造地点查询类
            	pageSize: 30,
			    pageIndex: 1,
			    extensions:'all',
			    showCover: false,
			    autoFitView:true,
			    type: GEELY_SERVER
            });
 
        });
    }
	@debounce(800)
	searchServerPonits = (kw)=>{
    	if( !this.placeSearch ) return ;
    	this.setState({ fetching: true })
    	this.placeSearch.search(kw, (status, {info, poiList={} })=> {
    		console.log("搜索吉利服务站", info, status, poiList)
    		this.setState({ fetching: false })
    		let pois=[], counts = 0;
    		if(info==="OK" && status==="complete"){
    			pois = poiList.pois || [];
    			counts = poiList.count || 0;
    		}
    		this.setState({ data: pois })
    	})
    }
    handleChange = (index) => {
    	const value = this.state.data[index];
    	if('onChange' in this.props ){
    	 	this.props.onChange(value);
    	}
	    this.setState({
	      value,
	      data: [],
	      fetching: false,
	    });
	}

	render() {

		const { fetching, data, value } = this.state;
	    return (
	      <Select
	        value={value.name && value.id ? `${value.name}-${value.id}` : value}
	        showSearch
	        placeholder={Intl.get('ticket.distributeSpName')}//'要派发的服务站名称'
	        notFoundContent={fetching ? <Spin size="small" /> : null}
	        filterOption={false}
	        onSearch={this.searchServerPonits}
	        onChange={this.handleChange}
	        style={{ width: '100%' }}
	      >
	        {data.map((d,index) => <Option title={`${d.name}-${d.id}`} key={index}>{`${d.name}-${d.id}`}</Option>)}
	      </Select>
	    );

	}
}