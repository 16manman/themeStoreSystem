import { Row, Col } from 'antd/lib';
import classNames from 'classnames';
import styles from './index.less';

export default ({ className, children, term }) => {

  const colSpan = { xs: 24, sm: 24, md: 10, lg: 10 };
  const clsString = classNames(styles.row, className);
  return (
    <Row className={clsString}>
      <Col {...colSpan} >{term}：</Col>
      <Col> {children} </Col>
    </Row>
  );
};
