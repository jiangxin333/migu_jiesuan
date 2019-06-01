<template>
	<div class="account navTop">
		<van-nav-bar title="绑定提现账号" left-arrow @click-left="onClickLeft" fixed />
		<!-- 用户名称 -->
		<div class="userInfo">
			<div class="content">
				<div class="userImge">
					<van-row>
						<van-col span="6"><span style="line-height: 50px; font-size: 14px;color: #333;">用户头像 :</span></van-col>
						<van-col span="16"><img class="imgInfo" :src="img" alt=""></van-col>
					</van-row>
				</div>
				<div>
					<van-cell-group>
						<van-field style="color: #333;" v-model="name" readonly clearable label="用户名 :" />
						<van-field style="color: #333;" v-model="phone" type="number" clearable :value="phone" label="手机号码 :" placeholder="请输入手机号" @blur="checkPhone(phone)" />
						<van-field style="color: #333;" v-model="sms" center clearable label="短信验证码 :" placeholder="请输入短信验证码">
							<van-button v-if="isSend" slot="button" round size="small" type="info" style="background-color: #F5401D; border-color: #F5401D;"
							 @click="getSms(phone)">发送验证码</van-button>
							<van-button v-else slot="button" :disabled="true" round size="small" type="info" style="background-color: #F5401D; border-color: #F5401D;"
							>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{msg}}&nbsp;s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</van-button>
						</van-field>
						<van-field style="color: #333;" v-model="nameBox" clearable label="真实姓名 :" placeholder="请输入真实姓名" />
					</van-cell-group>
				</div>
			</div>
		</div>
		<!-- <div>
			<van-field v-model="name" disabled clearable label="用户名" placeholder="请输入用户名"/>
		</div> -->
		<!-- 温馨提示 -->
		<div class="hint">
			<p class="hintInfo">温馨提示 :</p>
			<p class="hintTxt">1、请确保微信已实名认证，未实名认证的微信号将会转账失败，您的钱会退回账户</p>
			<p class="hintTxt">2、我们承诺不会向任何人透露您的个人信息</p>
			<router-link class="hintTxt" style="color: #f5401d" to="/account_course" tag="p">3、点击查看实名教程>> </router-link>
			<router-link class="hintTxt" style="color: #f5401d" to="/services" tag="p">4、若无法收到短信，请联系官方客服>> </router-link>
		</div>
		<div class="boxBtn">
			<van-button class="cashBtn" round size="lang" type="danger" @click="submitContact">安全保存</van-button>
		</div>
	</div>
</template>

<script>
	import common from '../assets/js/common.js';
	import md5 from 'js-md5';
	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'account',
		data() {
			return {
				qq: '',
				weixin: '',
				img: '', //用户头像
				name: '', //用户名
				tel: '', //电话
				phone: '', //手机号
				sms: '', //验证码
				nameBox: '', //真实姓名
				isClick: true,
				isSend: true,//是否已经发送，为false开始倒计时
				msg: 90//倒计时时间
			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			checkPhone: function(phoneNum) {
				if (!/^1[345789]\d{9}$/.test(phoneNum) && this.phone != '') {
					this.$toast('手机号码有误，请重填');
					this.phone = '';
					return false;
				} else if (
					this.phone == '' ||
					(!/^1[345789]\d{9}$/.test(phoneNum) && !this.isPassword)
				) {
					this.$toast('手机号码有误，请重填');
					this.phone = '';
					return false;
				} else {
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
				var date = (new Date()).getTime();
				if (that.isClick) {
					that.isClick = false;
					common.toAjax(
						common.host + '/api/app/sendsmscode', {
							tel: this.phone,
							nonce_str:  date,
							sign: md5(that.phone + "jfds789432jdfseru" + date ).toLowerCase()
						},
						function(res) {
							that.isClick = true;
							if (res.err_code == 0) {
								that.$toast(res.err_msg);
								that.isSend = false;
								clearInterval(timer);
								var tthat = that;
								var timer = setInterval(function() {
									tthat.msg -=1;
									if (tthat.msg < 0) {
										tthat.isSend = true;
										tthat.msg = 90;
										clearInterval(timer);
									}
								},1000)
							} else {
								that.$toast(res.err_msg);
							}
						}
					);
				}

			},
			submitContact() {
				var that = this;
				if (that.phone !='' && that.nameBox !='' && that.sms != '') {
					common.toAjax(
						common.host + '/users/newcontact', {
							tel: that.phone,
							name: that.name,
							truename: that.nameBox,
							code: that.sms,
							type: "truename"
						},
						function(res) {
							if (res.err_code != 800) {
								if (res.err_code == 0) {
									that.$toast(res.err_msg);
									setTimeout(function() {
										that.$router.replace('/cash_withdrawal');
									}, 1000)
								} else {
									that.$toast(res.err_msg)
								}
							} else {
								that.$toast(res.err_msg)
								setTimeout(function() {
									common.goLink('/login', that)
								}, 1000)
							}
						}
					)
				} else {
					that.$toast("请完善信息")
				}
			},
		},
		activated() {
			var that = this;
			that.checkRoute();
			common.toAjax(
				common.host + '/users/usercontact', {
					user_id: common.getVal('userInfo').id
				},
				function(res) {
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							that.qq = res.data.qq;
							console.log(that.qq);
							that.weixin = res.data.weixin;
							console.log(that.weixin);
							that.name = res.data.name;
							console.log(that.name);
							that.tel = res.data.tel;
							console.log(that.tel);
							that.img = res.data.img;
							console.log(that.img);
						} else {
							that.$toast(res.err_msg)
						}
					} else {
						that.$toast(res.err_msg)
						setTimeout(function() {
							common.goLink('/login', that)
						}, 1000)
					}
				}
			)
		},
	}
</script>

<style scoped>
	.userInfo {
		margin-top: 10px;
		background-color: #fff;
	}

	.content {
		width: 100%;
	}

	.userImge {
		width: 92%;
		margin: 0 4%;
		height: 50px;
	}

	.imgInfo {
		width: 40px;
		border-radius: 50%;
		margin-top: 2%;
	}

	.hint {
		width: 92%;
		margin: 0 3%;
		margin-top: 20%;
		color: #999999;
	}

	.hintInfo {
		font-size: 16px;
		padding-bottom: 10px;
	}

	.hintTxt {
		font-size: 14px;
		padding-bottom: 5px;
	}

	.boxBtn {
		position: fixed;
		bottom: 0px;
		left: 0;
		width: 100%;
		background-color: #fff;
	}

	.cashBtn {
		width: 94%;
		margin: 5px 3%;
		background-color: #F5401D;
	}

	.van-cell {
		color: #999999;
		font-size: 14px;
	}

</style>
