import { Row, Col } from 'antd/lib';
import classNames from 'classnames';
import styles from './index.less';

export default ({ className, children, title }) => {

  const clsString = classNames(styles.callerInfo, className);
  return (
    <div className={clsString}>
        <div className={styles.title}>
          <span>{title}</span>
        </div>
        <div className={styles.desc}>
          {children}
        </div>
    </div>
  );
};
