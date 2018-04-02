import { PureComponent } from 'react';
import classNames from 'classnames';
import GridDesc from  'components/GridDesc';
import styles from './index.less'
import { Card, } from 'antd/lib';
import { formatTel,  _dateFormat } from 'utils/utils';
import { callAlias }  from 'common/config';
import Intl from 'react-intl-universal';

export default class CarAndOwnerInfo extends PureComponent{
	state = {
	}

	joinStr(arr=[], space="+"){
		const notnull = arr.some(item=>item);
		if( notnull ){
			return arr.join(space);
		}
		return ''
	}
	carServerRender = ()=>{
		const { carServer=[] } = this.props;
		if( carServer && carServer.length ){
			const server = carServer.map((item, index)=>{
				return ( 
					item.effectTime && item.expireTime ? 
					<p key={index} >{item.code}： {_dateFormat(item.effectTime, 'YYYY-MM-DD')+' - '+_dateFormat(item.expireTime, 'YYYY-MM-DD')}</p> :
					<p key={index} >{item.code}</p> 
				)
			})
			return server;
		}
	}

	render() {
		//certType
		const { loading=false, ownerInfo={}, carInfo={}, type} = this.props;
		const noData = Intl.get('base.noData');
		const iCallOwner = [
			{ key: Intl.get('carInfo.mobile'), value: formatTel(ownerInfo.mobile) || noData},
			{ key: Intl.get('carInfo.userId'), value: ownerInfo.id || noData},
			{ key: Intl.get('carInfo.userName'), value: ownerInfo.name || noData},
			{ key: Intl.get('carInfo.certNo'), value: ownerInfo.certNo || noData},
		]
		const bCallOwner = [
			...iCallOwner,
			{ key: Intl.get('carInfo.linkManName'), value: (ownerInfo.linkManName ? ownerInfo.linkManName+'/'+ownerInfo.linkManMobile : ownerInfo.linkManMobile) || noData},
		]
		const iCallCar = [
			{ key: Intl.get('carInfo.carLicense'), value: carInfo.licensePlateNumber && <span className={styles.licenseNum}>{carInfo.licensePlateNumber}</span> || '--'},
			{ key: Intl.get('carInfo.carSeries'), value: this.joinStr([carInfo.modelName,carInfo.seriesName, ]) || '--' },
			{ key: Intl.get('carInfo.color'), value: carInfo.colorName || '--'},
			{ key: Intl.get('carInfo.vin'), value: carInfo.vin || '--'},
			{ key: Intl.get('carInfo.purchaseDate'), value: carInfo.soldDate || '--'},
			{ key: Intl.get('carInfo.platForm'), value: carInfo.netPlatform || '--'},
			{ key: Intl.get('carInfo.carServer'), value: this.carServerRender() || '--'},
		]
		const bCallCar = [
			...iCallCar,
			{ key: Intl.get('carInfo.recentMt'), value: carInfo.latestDateMt || '--'},
			{ key: Intl.get('carInfo.latestMileageMt'), value: carInfo.latestMileageMt || '--'},
		]
		const owner = type===callAlias["I-Call"] ? iCallOwner : bCallOwner ;
		const car = type===callAlias["I-Call"] ? iCallCar : bCallCar;

		return (
			<Card loading={loading} bordered={false} bodyStyle={{padding:0}}> 
				<GridDesc title={Intl.get('carInfo.ownerInfo')}>
				{
					owner.map((item, index)=>(
						<GridDesc.Row term={item.key} key={index}>{item.value}</GridDesc.Row>
					))
				}
			    </GridDesc>
				<GridDesc title={Intl.get('carInfo.carInfo')}>
				{
					car.map((item, index)=>(
						<GridDesc.Row term={item.key} key={index}>{item.value}</GridDesc.Row>
					))
				}
			    </GridDesc>
		    </Card>
		)
	}
}
