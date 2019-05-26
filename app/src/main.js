import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js'
import 'lib-flexible/flexible.js';
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
	Actionsheet).use(Picker).use(Collapse).use(CollapseItem).use(Lazyload).use(Swipe).use(SwipeItem);
Vue.config.productionTip = false
const toast = '';
const errorHandler = (error, vm) => {
	console.log('捕获到异常：')
	console.log(error)
	var msg = error.toString();
	console.log('正在进行错误日志记录...')
	var err_data = {
		msg: msg,
		ua: window.navigator.userAgent
	};
	common.toAjax(common.host + '/htmlerr', err_data, function(res) {
		console.log('错误日志记录完毕', res);
	});

}
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this);
Vue.prototype.Toast = toast;
router.beforeEach((to, from, next) => {
	if (to.path == '/task' || to.path == '/mentor'||to.path=='/my') {
		if (window.localStorage.isLogin == 'false'||window.localStorage.isLogin==undefined) {
			Toast.loading({
				duration: 0, // 持续展示 toast
				forbidClick: true, // 禁用背景点击
				loadingType: 'spinner',
				message: '登录中...'
			});
			api.addEventListener({
				name: 'wxLogind'
			}, function(ret, err) {
				//测试code请放开这段代码，注释掉ajax请求
				// alert(ret.value.code)
				// that.code = ret.value.code;
				// that.$toast(ret.value.code)
				// that.isTest = true;
				// return;
				//正式使用请注释掉上面代码，放开ajax请求
				common.toAjax(common.host + '/appwechatlogin', {
					code: ret.value.code,
					from: 'app'
				}, function(res) {
					if (res.err_code == 2001) {
						Toast.clear();
						alert(res.err_msg)
						var regUrl = '/userlogin/bindtel?data=' + res.data.data + '&img=' + res.data.img;
						window.localStorage.backUrl = location.protocol+'//' + location.host + "/apparticle#/my";
						// document.write(regUrl)
						location.href = regUrl;
					} else {
						if (res.err_code == 0) {
							//微信直接登录使用这段
							common.toAjax(common.host + '/users/userData', {}, function(res1) {
								
								if (res1.err_code != 800) {
									if (res1.err_code == 0) {
										common.setVal('userInfo', res1.data);
										common.setVal('en_rank', res1.data.en_rank)
										window.localStorage.isLogin = true;
										if(to.path == '/mentor'){
											Toast.clear();
											Toast.loading({
												duration: 0, // 持续展示 toast
												forbidClick: true, // 禁用背景点击
												loadingType: 'spinner',
												message: '加载中...'
											});
											common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
												if (res.err_code == 0) {
													store.commit('SETIMG', res.data.qrcode_img);
													store.commit('SETIMG_TIMELINE', res.data.timeline_qrcode_img);
													next();
													// this.show = true;
												} else {
													Toast.clear();
													alert(res.info);
												}
											});
										}else{
											next();
										}
									} else {
										Toast.clear();
										alert(res1.err_msg)
									}
								} else {
									Toast.clear();
									alert(res1.err_msg)
									window.localStorage.isLogin = false;
								}
							});
						} else {
							Toast.clear();
							alert(res.err_msg)
							window.localStorage.isLogin = false;
							// that.clearInfo();//使用login页登录的时候请放开这段注释
						}
					}
			
				})
			});
			api.sendEvent({
				name: 'wxLogin',
				extra: {}
			});
		} else {
			if(to.path == '/mentor'){
				if(store.state.qrcode_img!=''&&store.state.timeline_qrcode_img!=''){
					next();
				}else{
					Toast.loading({
						duration: 0, // 持续展示 toast
						forbidClick: true, // 禁用背景点击
						loadingType: 'spinner',
						message: '加载中...'
					});
					common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
						if (res.err_code == 0) {
							store.commit('SETIMG', res.data.qrcode_img);
							store.commit('SETIMG_TIMELINE', res.data.timeline_qrcode_img);
							next();
							// this.show = true;
						} else {
							Toast.clear();
							alert(res.info);
						}
					});
				}
			}else{
				next();
			}
		}
	} else {
		next()
	}
})
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
