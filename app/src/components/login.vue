<template>
	<div class="navTop">
		<van-nav-bar
			:title="isPassword ? '登录' : '注册/重置密码'"
			left-arrow
			@click-left="onClickLeft"
			fixed
		/>
		<div id="inputBox">
			<van-cell-group>
				<van-field
					v-model="phone"
					:left-icon="phoneIco"
					type="number"
					@blur="checkPhone(phone)"
					:value="phone"
					placeholder="请输入你的手机号"
					center
					clearable
					required
				>
					<van-button
						slot="button"
						size="small"
						type="primary"
						:disabled="canClick"
						@click="getSms(phone)"
					>
						{{ smsTxt }}
					</van-button>
				</van-field>

				<van-cell-group>
					<van-field
						v-model="sms"
						:left-icon="lockIco"
						type="number"
						placeholder="请输入短信中的验证码"
						required
					/>
				</van-cell-group>
			</van-cell-group>
		</div>
		<div class="inputBtn">
			<van-button size="large" type="primary" square block @click="toLogin(0)">
				手机验证码登录
			</van-button>
		</div>
		<div class="inputBtn">
			<van-button size="large" type="default" square block @click="toLogin(1)">
				微信登录
			</van-button>
		</div>
		<div class="inputBtn" v-if="isTest">
			<van-button
				slot="button"
				size="small"
				type="primary"
				　v-clipboard:copy="code"
				　　v-clipboard:success="onCopy"
				　　v-clipboard:error="onError"
			>
				点击复制code:{{code}}
			</van-button>
		</div>
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'login',
	data() {
		return {
			phone: '',
			sms: '',
			password: '',
			password2: '',
			phoneIco: 'https://quzhuan.oss-cn-beijing.aliyuncs.com/img/phone.png',
			lockIco: 'https://quzhuan.oss-cn-beijing.aliyuncs.com/img/lock.png',
			canClick: true,
			smsTxt: '获取验证码',
			isPassword: true,
			sjyzm: common.host + '/common/mews',
			yzm: '',
			passConfirm: false,
			errMessage: '',
			isReset: false,
			time: '',
			isTest:false,//微信code调试，正式服请设置false隐藏
			code:'',
			isClick:true,
		};
	},
	methods: {
		checkPhone: function(phoneNum) {
			if (!/^1[34578]\d{9}$/.test(phoneNum) && this.phone != '') {
				this.$toast('手机号码有误，请重填');
				this.phone = '';
				this.canClick = true;
				return false;
			} else if (
				this.phone == '' ||
				(!/^1[34578]\d{9}$/.test(phoneNum) && !this.isPassword)
			) {
				this.$toast('手机号码有误，请重填');
				this.phone = '';
				this.canClick = true;
				return false;
			} else {
				this.canClick = false;
				return true;
			}
		},
		getSms: function(phone) {
			if (this.phone == '') {
				this.$toast('请输入手机号来获取短信验证码');
				return;
			}
			var phoneNumber = phone;
			var that = this;
			if(that.isClick){
				that.isClick=false;
				common.toAjax(
					common.host + '/common/alidayuSendSms',
					{
						tel: this.phone
					},
					function(res) {
						that.isClick=true;
						if (res.err_code == 0) {
							common.countDown(that, phoneNumber, 0, 60);
							that.$toast(res.err_msg);
						} else {
							that.$toast(res.err_msg);
						}
					}
				);
			}
			
		},
		toLogin: function(type) {
			var that = this;
			switch (type) {
				case 0:
					if (that.phone != '' && that.sms != '') {
						common.toAjax(
							common.host + '/users/telLogins',
							{
								tel: this.phone,
								codeTel: this.sms,
								from:'app'
							},
							function(res) {
								if (res.err_code == 0) {
									window.localStorage.isLogin = true;
									var msg = res.err_msg;
									that.clearInfo();
									common.toAjax(common.host + '/users/userData', {}, function(
										res
									) {
										if (res.err_code != 800) {
											if (res.err_code == 0) {
												common.setVal('userInfo', res.data);
												common.setVal('passwd_id', res.data.passwd_id);
												that.userInfo = common.getVal('userInfo');
												that.isLogin = true;
												that.$toast(msg);
												setTimeout(function() {
													clearTimeout(that.time);
													common.countDown(that, that.phone, 0, 0);
													that.$router.go(-1);
												}, 2000);
											} else {
												that.$toast(res.err_msg);
											}
										} else {
											that.isLogin = false;
										}
									});
								} else {
									window.localStorage.isLogin = false;
									that.$toast(res.err_msg);
									that.clearInfo();
								}
							}
						);
					} else {
						this.$toast('请输入手机号和短信验证码进行登录');
					}
					break;
				case 1:
					common.login(that);
					break;
				default:
					break;
			}
		},
		onClickLeft() {
			this.initInfo();
			this.$router.go(-1);
		},
		clearInfo() {
			this.sms = '';
		},
		initInfo() {
			this.phone = '';
			this.sms = '';
		},
		onCopy(){
			this.$toast('复制code：'+this.code+' 成功')
		},
		onError(){
			this.$toast('复制失败')
		}
	},
	activated() {
		this.checkRoute();
	}
};
</script>

<style scoped>
#inputBox {
	margin: 2% auto 0;
}
.inputBtn {
	position: relative;
	width: 90%;
	margin: 5% auto;
}
.van-button {
	height: 40px;
	line-height: 40px;
}
</style>
