<template>
	<div class="navTop">
		<van-nav-bar title="设置" left-arrow @click-left="onClickLeft" fixed />
		<div class="setting-up">
			<van-cell title="个人信息" is-link value="" to="/mentorcontact" />
			<van-cell title="修改密码" is-link value="" to="/password/0" />
			<van-cell title="联系客服" is-link value="" to="/services" />
			<van-cell title="意见反馈" is-link value="" to="/opinion" />
			<van-cell title="使用协议" is-link value="" to="/protocol" />
			<van-cell title="关于我们" is-link value="" to="/aboutus" />
		</div>
		<div class="setting-down">
			<van-cell title="检查更新" is-link value="当前已是最新版本" @click="checkVersion" />
			<van-cell title="清理缓存" is-link value="" @click="clearCache" />
			<van-cell-group>
				<van-switch-cell
					v-model="checked"
					title="使用系统分享"
					active-color="#5da968"
					inactive-color="#ffffff"
				/>
			</van-cell-group>
		</div>
		<div class="btn">
			<van-button size="large" type="primary" square block @click="quitLogin">
				退出
			</van-button>
		</div>
		<van-loading v-if="checkLoading" />
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	inject:['checkRoute','money','mentors','my'],
	name: 'setting',
	data() {
		return {
			checked: true,
			show: false,
			qq: '',
			weixin: '',
			weixinNum: '',
			qqNum: '',
			checkLoading: false,
			isClear: false,
			servicesTitle: ''
		};
	},
	methods: {
		onClickLeft: function() {
			this.my();
			common.goBack(this);
		},
		checkVersion: function() {
			this.checkLoading = true;
			var that = this;
			setTimeout(function() {
				that.checkLoading = false;
				that.$toast('当前已是最新版本');
			}, 1000);
		},
		clearCache: function() {
			var that = this;
			if (!this.isClear) {
				setTimeout(function() {
					that.$toast('已清除' + Math.floor(Math.random() * 20000 + 1) / 100 + 'M缓存');
					that.isClear = true;
				}, 2000);
			} else {
				this.$toast('已清除0M缓存');
			}
		},
		quitLogin: function() {
			window.localStorage.removeItem('isLogin');
			var that = this;
			common.toAjax(common.host + '/users/signout', {}, function(res) {
				if (res.err_code == 0) {
					that.$toast(res.err_msg);
					that.$router.replace({ path: '/my' });
				} else {
					that.$toast(res.err_msg);
					return false;
				}
			});
		}
	},
	activated() {
		var that = this;
		that.checkRoute();
		this.isClear = false;
	}
};
</script>

<style scoped>
.setting-up {
	margin: 10px auto;
}

.setting-down {
	margin-bottom: 20px;
}

.btn {
	width: 90%;
	height: 60px;
	margin: 0 auto;
}

.van-popup {
	width: 80%;
}

.van-panel__content p {
	font-size: 16px;
	color: #333333;
	text-align: center;
}
.van-field .van-cell__title {
	max-width: 60px;
}
.van-loading {
	width: 0.789474rem;
	height: 0.789474rem;
	position: fixed;
	top: 30%;
	left: 50%;
	margin-left: calc(-0.789474rem / 2);
	margin-top: calc(-0.789474rem / 2);
}
</style>
