// import React, { PureComponent } from 'react';
import styles from './index.less';
import {formatTel} from 'utils/utils'

export default ({ phoneNumber , phoneAddr="浙江 杭州", }) => {
    return (
      <div>
        <p className={styles.phoneNumber}>{formatTel(phoneNumber)}</p>
        <p className={styles.phoneAddr}>{phoneAddr}</p>
      </div>
    )
}

