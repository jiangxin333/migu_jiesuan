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
	if (to.path == '/task' || to.path == '/mentor' || to.path == '/my') {
		alert('path' + to.path)
		if (window.localStorage.isLogin == 'false' || window.localStorage.isLogin == undefined) {
			alert('not login')
			Toast.loading({
				duration: 0, // 持续展示 toast
				forbidClick: true, // 禁用背景点击
				loadingType: 'spinner',
				message: '登录中...'
			});
			if (typeof api == "undefined") {
				alert('api not ready')
				Toast.clear();
				alert('登录失败，请重试');
			} else {
				alert('api ready')
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
					//当页面没有传入this对象的时候，直接请求
					alert('api login')
					alert(JSON.stringify(ret))
					if (ret.value != undefined) {
						$.ajax({
							url: common.host + '/appwechatlogin',
							data: {
								code: ret.value.code,
								from: 'app'
							},
							type: "POST",
							timeout: 10000, //超时时间设置，单位毫秒
							xhrFields: {
								withCredentials: true
							},
							success: function(res) {
								alert('log ajax success')
								alert(JSON.stringify(res))
								if (res.err_code == 2001) {
									Toast.clear();
									alert(res.err_msg)
									var regUrl = '/userlogin/bindtel?data=' + res.data.data + '&img=' + res.data.img;
									window.localStorage.backUrl = location.protocol + '//' + location.host + "/apparticle#/my";
									// document.write(regUrl)
									location.href = regUrl;
								} else {
									if (res.err_code == 0) {
										//微信直接登录使用这段
										$.ajax({
											url: common.host + '/users/userData',
											data: {},
											type: "POST",
											timeout: 10000, //超时时间设置，单位毫秒
											xhrFields: {
												withCredentials: true
											},
											success: function(res1) {
												alert('userdata ajax',JSON.stringify(res1))
												if (res1.err_code != 800) {
													if (res1.err_code == 0) {
														common.setVal('userInfo', res1.data);
														common.setVal('en_rank', res1.data.en_rank)
														window.localStorage.isLogin = true;
														if (to.path == '/mentor') {
															alert('to mentor not login',to.path);
															Toast.clear();
															Toast.loading({
																duration: 0, // 持续展示 toast
																forbidClick: true, // 禁用背景点击
																loadingType: 'spinner',
																message: '加载中...'
															});
															$.ajax({
																url: common.host + '/user_st/st_img',
																data: {
																	type:'mentor'
																},
																type: "POST",
																timeout: 10000, //超时时间设置，单位毫秒
																xhrFields: {
																	withCredentials: true
																},
																success: function(res2) {
																	alert('not login st_img ajax success')
																	alert(JSON.stringify(res2))
																	if (res2.err_code == 0) {
																		store.commit('SETIMG', res2.data.qrcode_img);
																		store.commit('SETIMG_TIMELINE', res2.data.timeline_qrcode_img);
																		store.commit('SETLINK', res2.data.qrcode_link);
																		store.commit('SETLINK_TIMELINE', res2.data.timeline_qrcode_link);
																		store.commit('SETDATA', res2.data);
																		next();
																		// this.show = true;
																	} else {
																		Toast.clear();
																		alert(res.err_msg);
																	}
																},
																error: function(error) {
																	Toast.clear();
																	alert('加载失败，请重试')
																	window.localStorage.isLogin = false;
																},
															});
														} else {
															alert('not mentor not login',to.path)
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
											},
											error: function(error) {
												Toast.clear();
												alert('登录失败，请重试')
												window.localStorage.isLogin = false;
											}
										})
									} else {
										Toast.clear();
										alert(res.err_msg)
										window.localStorage.isLogin = false;
										// that.clearInfo();//使用login页登录的时候请放开这段注释
									}
								}

							},
							error: function(error) {
								Toast.clear();
								alert('登录失败，请重试')
								window.localStorage.isLogin = false;
							}
						});
					} else {
						alert(err);
					}

				});
				api.sendEvent({
					name: 'wxLogin',
					extra: {}
				});
			}

		} else {
			alert('logined')
			if (to.path == '/mentor') {
				alert('to mentor loged',to.path)
				if (store.state.data != '') {
					alert('store ready')
					next();
				} else {
					alert('store not ready')
					Toast.loading({
						duration: 0, // 持续展示 toast
						forbidClick: true, // 禁用背景点击
						loadingType: 'spinner',
						message: '加载中...'
					});
					$.ajax({
						url: common.host + '/user_st/st_img',
						data: {
							type:'mentor'
						},
						type: "POST",
						timeout: 10000, //超时时间设置，单位毫秒
						xhrFields: {
							withCredentials: true
						},
						success: function(res) {
							alert('loged st_img ajax success')
							alert(JSON.stringify(res))
							if (res.err_code == 0) {
								store.commit('SETIMG', res.data.qrcode_img);
								store.commit('SETIMG_TIMELINE', res.data.timeline_qrcode_img);
								store.commit('SETLINK', res.data.qrcode_link);
								store.commit('SETLINK_TIMELINE', res.data.timeline_qrcode_link);
								store.commit('SETDATA', res.data);
								next();
								// this.show = true;
							} else {
								Toast.clear();
								alert(res.err_msg);
							}
						},
						error: function(error) {
							Toast.clear();
							alert('加载失败，请重试')
							window.localStorage.isLogin = false;
						},
					});
				}
			} else {
				alert('not to mentor',to.path)
				next();
			}
		}
	} else {
		alert('other path',to.path)
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
