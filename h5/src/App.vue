<template>
	<div id="app">
		<!-- 缓存所有的页面 -->
		<keep-alive><router-view v-if="isRouterAlive"></router-view></keep-alive>
		<van-tabbar v-model="actived" :fixed="true" active-color="#F23D1f" v-if="isMain">
			<van-tabbar-item info to="/article" :replace="true">
				<span>赚钱</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon1_1 : icon1" />
			</van-tabbar-item>
			<van-tabbar-item info to="/task" :replace="true" style="position: relative;">
				<span>任务</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon4_1 : icon4" />
				<p class="icontxt" v-if="actived == 0 || actived == 2">领现金</p>
			</van-tabbar-item>
			<van-tabbar-item icon="search" to="/mentor" :replace="true">
				<span>师徒</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon2_1 : icon2" />
			</van-tabbar-item>
			<van-tabbar-item icon="setting-o" to="/my" :replace="true">
				<span>我的</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icon3_1 : icon3" />
			</van-tabbar-item>
		</van-tabbar>
		<div id="baidu_tj" style="display: none;"></div>
	</div>
</template>

<script>
import common from './assets/js/common.js';
export default {
	name: 'App',
	provide() {
		return {
			money: this.money,
			mentors: this.mentors,
			my: this.my,
			task: this.task,
			checkRoute: this.checkRoute
		};
	},
	data() {
		return {
			actived: 0,
			icon1: require('./assets/img/new_ico/1.1.png'),
			icon2: require('./assets/img/new_ico/2.1.png'),
			icon3: require('./assets/img/new_ico/3.1.png'),
			icon4: require('./assets/img/new_ico/4.1.png'),
			icon1_1: require('./assets/img/new_ico/1.2.png'),
			icon2_1: require('./assets/img/new_ico/2.2.png'),
			icon3_1: require('./assets/img/new_ico/3.2.png'),
			icon4_1: require('./assets/img/new_ico/4.2.png'),
			activeIco: require('./assets/img/guagua/refresh.png'),
			isRouterAlive: true,
			isMain: true,
			currentVersion: ''
		};
	},
	methods: {
		checkRoute() {
			var that = this;
			this.$dialog.close();
			this.$toast.clear();
			console.log('checkRoute', this.$route.path);
			if (this.$route.path == '/article' || this.$route.path == '/mentor' || this.$route.path == '/my' || this.$route.path == '/task' || this.$route.path == '/') {
				this.isMain = true;
				console.log('checkRoute', this.isMain);
			} else {
				this.isMain = false;
			}
			// if (this.$route.name != 'article' && this.$route.name!='money_article' ) {
			//     console.log('is_login')
			//     common.toAjax(
			//         common.host + '/users/is_login',
			//         {},
			//         function (res) {
			//             if (res.err_code == 800) {
			//                 console.log('route:',that.$route.name)
			//                 if(that.$route.name=='my'||that.$route.name=='mentor'){
			//                     console.log('my login')
			//                     window.localStorage.removeItem('isLogin');
			//                     that.isLogin=false;
			//                     //  return;
			//                 }
			//                 else{
			//                     that.$toast(res.err_msg)
			//                     common.goLink('/login', that)
			//                 }

			//             }
			//         }
			//     )
			// }
		},
		money: function() {
			this.actived = 0;
		},
		mentors: function() {
			this.actived = 2;
		},
		my: function() {
			this.actived = 3;
		},
		task: function() {
			this.actived = 1;
		}
	},
	watch: {
		$route: 'checkRoute'
	},
	created() {
		var that = this;
		common.toAjax(common.host + '/users/is_login', {}, function(res) {
			common.setVal('tips', res.data.tool_tip);

			if (res.err_code == 800) {
				window.localStorage.isLogin = false;
			} else {
				window.localStorage.isLogin = true;
			}
		});
		common.toAjax(common.host + '/api/app/commoninfo', {}, function(res) {
			common.setVal('loginData', res.data);
			document.getElementsByTagName('title')[0].innerText = res.data.platform_name;
			$('#baidu_tj').html(common.getVal('loginData').h5_baidu);
		});
	}
};
</script>

<style>
.van-tabbar-item__icon img {
	height: 24px !important;
}
#download {
	width: 100%;
	position: fixed;
	top: 0;
	text-align: center;
	z-index: 999999999;
}
.icontxt {
	position: absolute;
	width: 40px;
	top: -14px;
    left: 65px;
	background-color: #fd6a57;
	color: #fff;
	padding: 5px;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
	z-index: 10;
}
</style>
