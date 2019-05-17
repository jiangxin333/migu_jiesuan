<template>
	<div class="navTop" :style="bodyH">
		<van-nav-bar :title="isPassword ? '登录' : '注册/重置密码'" left-arrow @click-left="onClickLeft" fixed style="background: transparent; color:#FFFFFF" />
		<img src="https://qiniustore.zmr016.com/quzhuan/imgs/bac1.png" alt="" style="width: 100%;" />
		<div class="loginBox box1" :style="loginBoxStyle">
			<p :style="logoP"><img :src="'http://quzhuan.oss-cn-beijing.aliyuncs.com/img/logo/' + logo_pre + '_logo.png'" alt="" :style="logoStyle" /></p>
			<p :style="inputP" v-if="passwordShow">
				<span class="inputLabel label-tel" :style="inputLabelStyle" @click="init_Input_tel(0)">请输入手机号</span>
				<van-cell-group :style="inputStyle" :border="false">
					<van-field
						v-model="phone"
						type="number"
						@blur="checkPhone(phone)"
						:value="phone"
						clearable
						:border="true"
						@focus="init_Input_tel(1)"
						style="padding-left: 0;"
						ref="tel"
					></van-field>
				</van-cell-group>
			</p>
			<p :style="wechatP" v-if="isWechat">{{wechatTxt}}</p>
			<p :style="btnP"><input type="button" v-if="passwordShow" value="下一步" class="inputBtn" :style="inputBtnStyle" @click="checkTel" /></p>
			<p :style="btnP"><input type="button" v-if="wechatShow" value="微信登录" class="inputBtn" :style="inputBtnStyle" @click="toLogin(1)" /></p>
		</div>
		<div class="loginBox box2" :style="loginBoxStyle">
			<p :style="logoP"><img :src="'http://quzhuan.oss-cn-beijing.aliyuncs.com/img/logo/' + logo_pre + '_logo.png'" alt="" :style="logoStyle" /></p>
			<p :style="inputP">
				<span class="inputLabel label-tel" :style="inputLabelStyle">手机号</span>
				<van-cell-group :style="inputStyle" :border="false">
					<van-field v-model="phone" type="number" :value="phone" clearable :border="true" readonly style="padding-left: 0;" ref="tel"></van-field>
				</van-cell-group>
			</p>
			<p :style="inputP" v-if="!ispwdLogin">
				<span class="inputLabel label-pass" :style="inputLabelStyle" @click="init_Input_pass(0)">请输入新密码</span>
				<van-cell-group :style="inputStyle" :border="false">
					<van-field
						v-model="new_pass"
						:type="type_new"
						:right-icon="icon_new"
						:error="new_pass_confirm != '' && new_pass == '' && new_pass.length >= 6"
						:error-message="errMsg"
						@click-right-icon="showIco2"
						@keyup="checkConfirm(new_pass, new_pass_confirm)"
						clearable
						@focus="init_Input_pass(1)"
						style="padding-left: 0;"
						ref="pass"
					></van-field>
				</van-cell-group>
			</p>
			<p :style="inputP" v-if="!ispwdLogin">
				<span class="inputLabel label-pass-confirm" :style="inputLabelStyle" @click="init_Input_pass_confirm(0)">请再次输入新密码</span>
				<van-cell-group :style="inputStyle" :border="false">
					<van-field
						v-model="new_pass_confirm"
						:type="type_new_confirm"
						:right-icon="icon_new_confirm"
						@click-right-icon="showIco3"
						:error="new_pass_confirm == '' && new_pass != '' && new_pass_confirm.length >= 6"
						:error-message="errMsg_confirm"
						@keyup="checkConfirm(new_pass, new_pass_confirm)"
						@focus="init_Input_pass_confirm(1)"
						style="padding-left: 0;"
						ref="pass_confirm"
					></van-field>
				</van-cell-group>
			</p>
			<p :style="inputP" v-if="ispwdLogin">
				<span class="inputLabel label-password" :style="inputLabelStyle" @click="init_Input_password(0)">请输入密码</span>
				<van-cell-group :style="inputStyle" :border="false">
					<van-field
						v-model="password"
						:type="type_password"
						:right-icon="icon_password"
						@click-right-icon="showIco4"
						clearable
						@focus="init_Input_password(1)"
						style="padding-left: 0;"
						ref="password"
					></van-field>
				</van-cell-group>
			</p>
			<p :style="btnP">
				<input type="button" :value="ispwdLogin ? '登录' : '绑定密码并登录'" class="inputBtn" :style="inputBtnStyle" @click="ispwdLogin ? toLogin(2) : toLogin(0)" />
			</p>
		</div>
		<div class="loginBox box3" :style="loginBoxStyle"></div>
		<div class="loginBox box4" :style="loginBoxStyle"></div>
		<!-- <div id="inputBox">
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
					:border="false"
					:readonly="isCheckPhone"
				>
					<van-button slot="button" size="small" type="primary" :disabled="canClick" @click="getSms(phone)" v-if="!ispwdLogin && isCheckPhone">{{ smsTxt }}</van-button> 
				</van-field>

				<van-cell-group v-if="isCheckPhone">
					<van-field
						v-model="new_pass"
						:type="type_new"
						:right-icon="icon_new"
						
						:error="new_pass_confirm != '' && new_pass == '' && new_pass.length >= 6"
						:error-message="errMsg"
						@click-right-icon="showIco2"
						v-if="!ispwdLogin"
						@keyup="checkConfirm(new_pass, new_pass_confirm)"
						required
						center
						clearable
						:left-icon="lockIco"
						placeholder="请输入新密码"
						
						:border="false"
					/>
					<van-field
						v-model="new_pass_confirm"
						:type="type_new_confirm"
						:right-icon="icon_new_confirm"
						@click-right-icon="showIco3"
						:error="new_pass_confirm == '' && new_pass != '' && new_pass_confirm.length >= 6"
						:error-message="errMsg_confirm"
						v-if="!ispwdLogin"
						@keyup="checkConfirm(new_pass, new_pass_confirm)"
					/>
					<van-field v-model="password" :left-icon="lockIco" type="password" placeholder="请输入密码" center clearable :border="false" required v-if="ispwdLogin" />
				</van-cell-group>
			</van-cell-group>
		</div>
		<div class="inputBtn" v-if="!isCheckPhone"><van-button size="large" type="primary" square block @click="checkTel">下一步</van-button></div>
		<div class="inputBtn" v-if="isCheckPhone">
			<van-button size="large" type="primary" square block @click="ispwdLogin ? toLogin(2) : toLogin(0)">{{ ispwdLogin ? '登录' : '绑定密码并登录' }}</van-button>
		</div>
		<div class="inputBtn"><van-button size="large" type="default" square block @click="toLogin(1)">微信登录</van-button></div> 
		<div class="inputBtn" v-if="isTest">
			<van-button slot="button" size="small" type="primary" 　v-clipboard:copy="code" 　　v-clipboard:success="onCopy" 　　v-clipboard:error="onError">
				点击复制code:{{ code }}
			</van-button>
		</div>-->
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
			isTest: false, //微信code调试，正式服请设置false隐藏
			code: '',
			isClick: true,
			ispwdLogin: false,
			isCheckPhone: false,
			isShow_old: false,
			isShow_new: false,
			isShow_new_confirm: false,
			isSHow_password: false,
			isChangeed: false,
			isWechat: false,
			wechatTxt:'',
			passwordShow: true,
			wechatShow: true,
			tel: '',
			old_pass: '',
			new_pass: '',
			new_pass_confirm: '',
			pass_title: '',
			pass_btn: '',
			checked: false,
			errMsg: '',
			errMsg_confirm: '',
			canLogin: false,
			bodyH: {
				height: window.innerHeight + 'px',
				background: '#000000',
				'padding-top': '0'
			},
			logoStyle: {
				width: (window.innerWidth * 120) / 750 + 'px'
			},
			inputStyle: {
				width: (window.innerWidth * 550) / 750 + 'px',
				'border-bottom': '1px solid #f1f1f1',
				margin: '0 auto',
				padding: '0',
				'font-size': '18px',
				color: '#333333'
			},
			inputBtnStyle: {
				width: (window.innerWidth * 550) / 750 + 'px',
				height: (window.innerHeight * 80) / 1334 + 'px'
			},
			inputLabelStyle: {
				'font-size': '18px',
				top: '12px'
			},
			loginBoxStyle: {
				width: (window.innerWidth * 702) / 750 + 'px',
				height: (window.innerHeight * 1014) / 1334 + 'px'
			},
			logoP: {
				'margin-top': (window.innerHeight * 80) / 1334 + 'px',
				'margin-bottom': (window.innerHeight * 100) / 1334 + 'px'
			},
			inputP: {
				'margin-bottom': (window.innerHeight * 48) / 1334 + 'px'
			},
			btnP: {
				'margin-top': (window.innerHeight * 120) / 1334 + 'px'
			},
			wechatP:{
				'margin-bottom': (window.innerHeight * 48) / 1334 + 'px',
				'padding-left':window.innerWidth*(702-450)/2/1334+'px',
				'padding-right':window.innerWidth*(702-450)/2/1334+'px',
			}
		};
	},
	computed: {
		//明文显示密码控制器
		type_old() {
			return this.isShow_old ? 'text' : 'password';
		},
		type_new() {
			return this.isShow_new ? 'text' : 'password';
		},
		type_new_confirm() {
			return this.isShow_new_confirm ? 'text' : 'password';
		},
		type_password() {
			return this.isSHow_password ? 'text' : 'password';
		},
		icon_old() {
			return this.isShow_old ? 'eye' : 'eye-o';
		},
		icon_new() {
			return this.isShow_new ? 'eye' : 'eye-o';
		},
		icon_new_confirm() {
			return this.isShow_new_confirm ? 'eye' : 'eye-o';
		},
		icon_password() {
			return this.isSHow_password ? 'eye' : 'eye-o';
		},
		logo_pre() {
			return common.getVal('loginData').platform_pre;
		}
	},
	methods: {
		checkPhone: function(phoneNum) {
			if (!/^1[34578]\d{9}$/.test(phoneNum) && this.phone != '') {
				this.$toast('手机号码有误，请重填');
				this.phone = '';
				this.canClick = true;
				return false;
			} else if (this.phone == '' || (!/^1[34578]\d{9}$/.test(phoneNum) && !this.isPassword)) {
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
			if (that.isClick) {
				that.isClick = false;
				common.toAjax(
					common.host + '/common/alidayuSendSms',
					{
						tel: this.phone
					},
					function(res) {
						that.isClick = true;
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
					// if (that.phone != '' && that.sms != '') {
					// 	common.toAjax(
					// 		common.host + '/users/telLogins',
					// 		{
					// 			tel: this.phone,
					// 			codeTel: this.sms,
					// 			from: 'app'
					// 		},
					// 		function(res) {
					// 			if (res.err_code == 0) {
					// 				window.localStorage.isLogin = true;
					// 				var msg = res.err_msg;
					// 				that.clearInfo();
					// 				common.toAjax(common.host + '/users/userData', {}, function(res) {
					// 					if (res.err_code != 800) {
					// 						if (res.err_code == 0) {
					// 							common.setVal('userInfo', res.data);
					// 							common.setVal('passwd_id', res.data.passwd_id);
					// 							that.userInfo = common.getVal('userInfo');
					// 							that.isLogin = true;
					// 							that.$toast(msg);
					// 							setTimeout(function() {
					// 								clearTimeout(that.time);
					// 								common.countDown(that, that.phone, 0, 0);
					// 								that.$router.go(-1);
					// 							}, 2000);
					// 						} else {
					// 							that.$toast(res.err_msg);
					// 						}
					// 					} else {
					// 						that.isLogin = false;
					// 					}
					// 				});
					// 			} else {
					// 				window.localStorage.isLogin = false;
					// 				that.$toast(res.err_msg);
					// 				that.clearInfo();
					// 			}
					// 		}
					// 	);
					// } else {
					// 	this.$toast('请输入手机号和短信验证码进行登录');
					// }
					if (that.phone != '' && that.new_pass != '' && that.new_pass_confirm != '' && that.new_pass == that.new_pass_confirm && that.canLogin) {
						common.toAjax(
							common.host + '/users/pwdLogin',
							{
								tel: that.phone,
								password: that.new_pass,
								confirm_password: that.new_pass_confirm
							},
							function(res) {
								if (res.err_code == 0) {
									window.localStorage.isLogin = true;
									var msg = res.err_msg;
									that.clearInfo();
									common.toAjax(common.host + '/users/userData', {}, function(res) {
										if (res.err_code != 800) {
											if (res.err_code == 0) {
												common.setVal('userInfo', res.data);
												common.setVal('passwd_id', res.data.passwd_id);
												that.userInfo = common.getVal('userInfo');
												that.isLogin = true;
												that.$toast(msg);
												setTimeout(function() {
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
					}
					break;
				case 1:
					common.login(that);
					break;
				case 2:
					//密码登录
					if (that.phone != '' && that.password != '') {
						common.toAjax(
							common.host + '/users/pwdLogin',
							{
								tel: that.phone,
								password: that.password,
								from: 'app'
							},
							function(res) {
								if (res.err_code == 0) {
									window.localStorage.isLogin = true;
									var msg = res.err_msg;
									that.clearInfo();
									common.toAjax(common.host + '/users/userData', {}, function(res) {
										if (res.err_code != 800) {
											if (res.err_code == 0) {
												common.setVal('userInfo', res.data);
												common.setVal('passwd_id', res.data.passwd_id);
												that.userInfo = common.getVal('userInfo');
												that.isLogin = true;
												that.$toast(msg);
												setTimeout(function() {
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
						this.$toast('请输入手机号和密码进行登录');
					}
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
			this.password = '';
		},
		initInfo() {
			this.phone = '';
			this.sms = '';
			this.password = '';
		},
		onCopy() {
			this.$toast('复制code：' + this.code + ' 成功');
		},
		onError() {
			this.$toast('复制失败');
		},
		checkTel() {
			var that = this;
			if (that.phone != '') {
				common.toAjax(
					common.host + '/users/pwdLogin',
					{
						tel: that.phone
					},
					function(res) {
						
						if (res.err_code == 1001) {
							that.change();
							that.ispwdLogin = false;
						} else if (res.err_code == 1002) {
							that.wechatTxt=res.err_msg;
							that.isWechat=true;
							that.passwordShow=false;
							that.wechatShow=true;
						} else {
							that.change();
							that.ispwdLogin = true;
						}
					}
				);
			} else {
				that.$toast('请输入手机号进行登录操作');
			}
		},
		//明文显示密码控制器showIco1，showIco2，showIco3
		showIco1() {
			this.isShow_old = !this.isShow_old;
		},
		showIco2() {
			this.isShow_new = !this.isShow_new;
		},
		showIco3() {
			this.isShow_new_confirm = !this.isShow_new_confirm;
		},
		showIco4() {
			this.isSHow_password = !this.isSHow_password;
		},
		checkConfirm(new_pass, new_pass_confirm) {
			console.log(new_pass.length, new_pass_confirm.length);
			if (new_pass != '') {
				if (new_pass.length < 6) {
					this.errMsg = '密码至少6位';
					this.canLogin = false;
				} else {
					this.errMsg = '';
				}
			}
			if (new_pass_confirm != '') {
				if (new_pass_confirm.length < 6) {
					this.errMsg_confirm = '密码至少6位';
					this.canLogin = false;
				} else {
					this.errMsg_confirm = '';
				}
			}
			if (new_pass != new_pass_confirm && new_pass != '' && new_pass_confirm != '') {
				this.errMsg = '两次密码输入不一致';
				this.errMsg_confirm = '两次密码输入不一致';
				this.canLogin = false;
			}
			if (new_pass != '' && new_pass_confirm != '' && new_pass == new_pass_confirm && new_pass.length >= 6 && new_pass_confirm.length >= 6) {
				this.errMsg = '';
				this.errMsg_confirm = '';
				this.canLogin = true;
			}
		},
		change() {
			this.isChangeed = true;
			$('.box1').fadeOut();
			$('.box2')
				.removeClass('box2')
				.addClass('box2tobox1')
				.addClass('box1');
			$('.box3')
				.removeClass('box3')
				.addClass('box3tobox2')
				.addClass('box2');
			$('.box4')
				.removeClass('box4')
				.addClass('box4tobox2')
				.addClass('box3');
		},
		init_Input_tel(status) {
			var that = this;
			if (status == 0) {
				that.$refs.tel.focus();
				$('.label-tel').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-tel').addClass('gray');
						that.$refs.tel.focus();
					}
				);
			} else {
				$('.label-tel').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-tel').addClass('gray');
					}
				);
			}
		},
		init_Input_pass(status) {
			var that = this;
			if (status == 0) {
				that.$refs.pass.focus();
				$('.label-pass').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-pass').addClass('gray');
						that.$refs.pass.focus();
					}
				);
			} else {
				$('.label-pass').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-pass').addClass('gray');
					}
				);
			}
		},
		init_Input_pass_confirm(status) {
			var that = this;
			if (status == 0) {
				that.$refs.pass_confirm.focus();
				$('.label-pass-confirm').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-pass-confirm').addClass('gray');
						that.$refs.pass_confirm.focus();
					}
				);
			} else {
				$('.label-pass-confirm').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-pass-confirm').addClass('gray');
					}
				);
			}
		},
		init_Input_password(status) {
			var that = this;
			if (status == 0) {
				that.$refs.password.focus();
				$('.label-password').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-password').addClass('gray');
						that.$refs.password.focus();
					}
				);
			} else {
				$('.label-password').animate(
					{
						top: '-20%',
						'font-size': '14px'
					},
					function() {
						$('.label-password').addClass('gray');
					}
				);
			}
		},
		init_box() {
			if (this.isChangeed) {
				$('.loginBox')
					.eq(0)
					.show();
				$('.loginBox')
					.eq(1)
					.removeClass('box2tobox1')
					.removeClass('box1')
					.addClass('box2');
				$('.loginBox')
					.eq(2)
					.removeClass('box3tobox2')
					.removeClass('box2')
					.addClass('box3');
				$('.loginBox')
					.eq(3)
					.removeClass('box4tobox3')
					.removeClass('box3')
					.addClass('box4');
			}
			this.phone = '';
			this.new_pass = '';
			this.new_pass_confirm = '';
			this.password = '';
		}
	},
	activated() {
		this.checkRoute();
		this.init_box();
		this.isCheckPhone = false;
		this.ispwdLogin = false;
		var that = this;
		$('.label-tel,.label-pass,.label-pass-confirm,.label-password').css(this.inputLabelStyle);
		if (common.getVal('loginData')) {
			switch (common.getVal('loginData').en_login_type) {
				case 1:
					that.passwordShow = false;
					that.wechatShow = true;
					break;
				case 2:
					that.passwordShow = true;
					that.wechatShow = false;
					break;
				default:
					that.passwordShow = true;
					that.wechatShow = true;
					break;
			}
		}
	}
};
</script>

<style scoped>
.gray {
	color: #999999 !important;
}
.van-nav-bar .van-icon {
	color: #ffffff !important;
	font-size: 0.631579rem;
}
.van-nav-bar__title {
	color: #ffffff !important;
}
#inputBox {
	margin: 2% auto 0;
}
.inputBtn {
	border-radius: 40px;
	font-size: 16px;
	border: none;
	color: #ffffff;
	/* 橙色主题*/
	background: -webkit-linear-gradient(#fe8542, #ec5c43); /* Safari 5.1 - 6.0 */
	background: -o-linear-gradient(#fe8542, #ec5c43); /* Opera 11.1 - 12.0 */
	background: -moz-linear-gradient(#fe8542, #ec5c43); /* Firefox 3.6 - 15 */
	background: linear-gradient(#fe8542, #ec5c43); /* 标准的语法 */
	box-shadow: 1px 1px 10px #ff4500;
	/* 绿色主题*/
	/* background: -webkit-linear-gradient(#7acc7e, #3fba45); /* Safari 5.1 - 6.0 */
	/* background: -o-linear-gradient(#7acc7e, #3fba45); /* Opera 11.1 - 12.0 */
	/* background: -moz-linear-gradient(#7acc7e, #3fba45); /* Firefox 3.6 - 15 */
	/* background: linear-gradient(#7acc7e, #3fba45); /* 标准的语法 */
	/* box-shadow: 1px 1px 10px #3eb944; */
}
.inputLabel {
	position: absolute;
	top: 0;
	left: 10%;
	z-index: 999;
	color: #999999;
}
.van-button {
	height: 40px;
	line-height: 40px;
}
p {
	text-align: center;
	position: relative;
}
.loginBox {
	background: #ffffff;
	border-radius: 10px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, -50%, 0);
}
.loginBox.box1 {
	top: 50%;
	transform: translate3d(-50%, -50%, 0) scale(1);
	z-index: 10;
	opacity: 1;
}
.loginBox.box2 {
	top: 52%;
	transform: translate3d(-50%, -50%, 0) scalex(0.9);
	z-index: 5;
	opacity: 0.7;
}
.loginBox.box3 {
	top: 54%;
	transform: translate3d(-50%, -50%, 0) scalex(0.8);
	z-index: 0;
	opacity: 0.4;
}
.loginBox.box4 {
	top: 56%;
	transform: translate3d(-50%, -50%, 0) scalex(0.7);
	z-index: 0;
	opacity: 0;
}
.box2tobox1 {
	animation: tobox1 0.7s ease-in-out;
}
.box3tobox2 {
	animation: tobox2 0.7s ease-in-out;
}
.box4tobox3 {
	animation: tobox3 0.7s ease-in-out;
}
@keyframes tobox1 {
	from {
		top: 52%;
		transform: translate3d(-50%, -50%, 0) scalex(0.9);
		z-index: 5;
		opacity: 0.7;
	}
	to {
		top: 50%;
		transform: translate3d(-50%, -50%, 0) scale(1);
		z-index: 10;
		opacity: 1;
	}
}
@keyframes tobox2 {
	from {
		top: 54%;
		transform: translate3d(-50%, -50%, 0) scalex(0.8);
		z-index: 0;
		opacity: 0.4;
	}
	to {
		top: 52%;
		transform: translate3d(-50%, -50%, 0) scalex(0.9);
		z-index: 5;
		opacity: 0.7;
	}
}
@keyframes tobox3 {
	from {
		top: 56%;
		transform: translate3d(-50%, -50%, 0) scalex(0.7);
		z-index: 0;
		opacity: 0;
	}
	to {
		top: 54%;
		transform: translate3d(-50%, -50%, 0) scalex(0.8);
		z-index: 0;
		opacity: 0.4;
	}
}
</style>
