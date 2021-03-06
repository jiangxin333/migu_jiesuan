import 'lib-flexible/flexible.js';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js'
import 'vant/lib/index.css';
import './assets/css/index.css';
import './assets/js/jquery-1.11.1.min.js';
import common from './assets/js/common.js'
import {
	List,
	Tab,
	Tabs,
	Tabbar,
	TabbarItem,
	Row,
	Col,
	NavBar,
	Icon,
	Toast,
	NoticeBar,
	Cell,
	CellGroup,
	Button,
	Switch,
	Field,
	Popup,
	Panel,
	SwitchCell,
	Loading,
	PullRefresh,
	Dialog,
	Uploader,
	RadioGroup,
	Radio,
	Actionsheet,
	Picker,
	Collapse,
	CollapseItem,
	Search,
	Tag,
	Notify,
	Lazyload,
	Swipe,
	SwipeItem
} from 'vant';
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'


Vue.use(VueClipboard)
Vue.use(VueResource).use(PullRefresh).use(Loading).use(SwitchCell).use(Panel).use(Popup).use(Field).use(Switch).use(
	Button).use(Cell).use(CellGroup).use(NoticeBar).use(Toast).use(Icon).use(NavBar).use(Row).use(Col).use(Tabbar).use(
	TabbarItem).use(Tab).use(Tabs).use(List).use(common).use(Dialog).use(Uploader).use(RadioGroup).use(Radio).use(
	Actionsheet).use(Picker).use(Collapse).use(CollapseItem).use(Search).use(Tag).use(Notify).use(Lazyload).use(Swipe).use(SwipeItem);
Vue.config.productionTip = false
const toast = '';
const errorHandler = (error, vm) => {
	console.log('捕获到异常：')
	console.log(error)
	var msg=error.toString();
	console.log('正在进行错误日志记录...')
	var err_data = {
		msg: msg,
		ua: window.navigator.userAgent
	};
	common.toAjax(common.host + '/htmlerr', err_data, function(res) {
		console.log('错误日志记录完毕',res);
	});
	
}
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this);
Vue.prototype.Toast = toast;
Vue.prototype.appName='';
new Vue({
	render: h => h(App),
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
}).$mount('#app')
