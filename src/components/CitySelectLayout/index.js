import classNames from 'classnames';
import styles from './index.less'

export default ({ city, className, weather })=>{
	const clsString = classNames(className, styles.wrap)
	return (
		<div className={clsString}>
			<span style={{fontSize:10,paddingRight:10}}>{weather}</span> {city}
		</div>
	)
}