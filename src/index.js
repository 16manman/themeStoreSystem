import '@babel/polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import onError from './error';
import 'utils/storageEvent';
import 'antd/dist/antd.css';
import './index.css';
import 'common/locales';
// import 'utils/debug';


// import { message } from 'antd/lib'
// message.config({
//   top: 400,
//   duration: 2,
// });

// import DVAredux from 'dva-core/saga'
// 1. Initialize

const app = dva({
	onError,
});


// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/global').default);
app.model(require('./models/socket').default);
app.model(require('./models/map').default);


// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

