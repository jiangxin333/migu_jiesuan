<template>
	<div class="navTop myTop" style="padding-top: 0;">
		<div id="cover">
			<img src="../assets/img/new_ico/top_bg.png" alt="" class="top_bg" />
			<div class="mask"></div>
			<van-row class="row_top" v-if="isLogin">
				<van-col span="8" style="height: 100%;">
					<p class="top_num" style="">{{ userInfo.today_money / 100 }}</p>
					<p class="top_text">
						今日收益
						<span>(元)</span>
					</p>
				</van-col>
				<van-col span="8" style="height: 100%;">
					<p class="top_user_img">
						<span class="imgBg"></span>
						<img :src="userInfo.img" alt="" @click="toincomeDetails" />
					</p>
					<p class="top_user_name">{{ userInfo.name }}</p>
					<p class="top_user_tel">转转号:{{ userInfo.tel }}</p>
				</van-col>
				<van-col span="8" style="height: 100%;">
					<p class="top_num" style="">{{ userInfo.balance / 100 }}</p>
					<p class="top_text">
						我的余额
						<span>(元)</span>
					</p>
				</van-col>
			</van-row>
			<div @click="toLogin" :style="styleObj" v-if="!isLogin">点击登录</div>
			<van-icon name="setting-o" id="setting-option" @click="onClickRight" />
		</div>
		<van-notice-bar :text="msg.title" left-icon="volume-o" color="#333333" background="#ffffff" :scrollable="false"
		 @click="toNotice(msgindex)" v-for="(msg, msgindex) in pubmsgs" :key="msgindex" />
		<div class="border-line border-line-bold"></div>
		<div id="btnGroup">
			<van-row>
				<van-col span="6">
					<div @click="toRoute('income_details')">
						<img src="../assets/img/new_ico/1.png" />
						<p class="baseFont">收入明细</p>
					</div>
				</van-col>
				<van-col span="6">
					<div @click="toRoute('cash_withdrawal')">
						<img src="../assets/img/new_ico/2.png" alt="" />
						<p class="baseFont">我要提现</p>
					</div>
				</van-col>
				<van-col span="6" v-if="en_rank == 1">
					<div @click="toRoute('rank')">
						<img src="../assets/img/new_ico/5.png" alt="" />
						<p class="baseFont">排行榜</p>
					</div>
				</van-col>
				<van-col span="6" v-if="en_prize == 1">
					<div @click="toRoute('luck_draw')">
						<img src="../assets/img/new_ico/3.png" alt="" />
						<p class="baseFont">幸运抽奖</p>
						<i class="van-col-dot" v-if="userInfo.prize_chance > 0"></i>
					</div>
				</van-col>
				<van-col span="6" v-if="en_sign == 1">
					<div @click="toRoute('sign')">
						<img src="../assets/img/new_ico/4.png" alt="" />
						<p class="baseFont">签到</p>
						<i class="van-col-dot" v-if="userInfo.today_signed == 0"></i>
					</div>
				</van-col>
				<van-col span="6">
					<div @click="toRoute('services')">
						<img src="../assets/img/new_ico/7.png" alt="" />
						<p class="baseFont">联系客服</p>
					</div>
				</van-col>
				<van-col span="6" v-if="en_video == 1">
					<div @click="toRoute('course')">
						<img src="../assets/img/new_ico/6.png" alt="" />
						<p class="baseFont">新手学堂</p>
					</div>
				</van-col>
				<van-col span="6" v-if="isReg">
					<div @click="toReg()">
						<img src="../assets/img/new_ico/4.png" alt="" />
						<p class="baseFont">预注册</p>
					</div>
				</van-col>
			</van-row>
		</div>
		<div class="border-line border-line-bold"></div>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<div class="tixianList" v-for="tixian in cashInfo" :key="tixian.index">
				<van-row type="flex" justify="space-between" align="center">
					<van-col span="3">
						<img :src="tixian.img" alt="" class="userImg" style="display: inline-block;vertical-align: middle;margin:10px;width:28px;height: 28px;" />
					</van-col>
					<van-col span="11">
						<p style="font-size: 16px;" class="textone">{{ tixian.name }}</p>
					</van-col>
					<van-col span="10">
						<p style="text-align: right;padding-right: 5%">
							提现
							<span class="redTxt">{{ tixian.money / 100 }}元</span>
							到微信
						</p>
						<p style="text-align:right;margin-top: 5px;color:#999999;padding-right: 5%;">
							刚刚
						</p>
					</van-col>
				</van-row>
				<div class="border-line"></div>
			</div>
		</van-pull-refresh>
		<van-popup v-model="adShow">
			<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/ad_mentor.png" class="qr_img" alt @click="toMentor" />
		</van-popup>
		<van-dialog v-model="regShow" :show-cancel-button="false" :show-confirm-button="false" style="text-align: center;padding-bottom: 10px;"
		 title="温馨提醒">
			<p>点击按钮复制预注册链接在微信中打开</p>
			<input type="hidden" v-model="regUrl">
			<van-button size="small" type="primary" 　v-clipboard:copy="regUrl" 　　v-clipboard:success="onCopy"
			 　　v-clipboard:error="onError">
				复制预注册链接
			</van-button>
		</van-dialog>
	</div>
</template>

<script>
	import common from '../assets/js/common.js';
	import Cookie from 'js-cookie';
	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'my',
		data() {
			return {
				cashInfo: {},
				list: [],
				loading: false,
				finished: false,
				active_my: 2,
				icon1: require('../assets/img/guagua/money.png'),
				icon2: require('../assets/img/guagua/mentor.png'),
				icon3: require('../assets/img/guagua/my.png'),
				activeIco: require('../assets/img/guagua/refresh.png'),
				isLogin: false,
				styleObj: {
					width: '100%',
					display: 'block',
					'text-align': 'center',
					'font-size': '34px',
					color: '#ffffff',
					'z-index': '4',
					position: 'absolute',
					top: '40%'
				},
				userInfo: {
					img: '',
					id: '',
					balance: 0
				},
				pubmsgs: [],
				isLoading: false,
				actived: 2,
				isSign: false,
				adShow: false,
				en_video: 0,
				en_rank: 0,
				en_prize: 0,
				en_sign: 0,
				isReg: false,
				regShow: false,
				regUrl: '123123'
			};
		},
		mounted() {
			var that = this;
			window.callBackByLogin = function(unionid, openid, headimgurl, nickname, sex) {
				common.login(unionid, openid, headimgurl, nickname, sex, that);
			};
		},
		methods: {
			toReg() {
				this.regShow = true;
			},
			onCopy() {
				this.$toast('复制成功');
				this.regShow = false;
			},
			onError() {
				this.$toast('复制失败');
			},
			onClickRight() {
				common.goLink('/setting', this);
			},
			onLoad() {
				// 异步更新数据
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						this.list.push(this.list.length + 1);
					}
					// 加载状态结束
					this.loading = false;

					// 数据全部加载完成
					if (this.list.length >= 40) {
						this.finished = true;
					}
				}, 500);
			},
			toNotice(id) {
				common.goLink('/notice', this);
				common.setVal('noticeInfo', id);
			},
			toLogin() {
				var that = this;
				Native.login();
			},
			toRoute(url) {
				if (url == 'course') {
					this.$router.push('/course');
				} else {
					common.goLink(url, this);
				}
			},
			onRefresh() {
				var that = this;
				common.toAjax(common.host + '/users/getcashlogs', {}, function(res) {
					that.cashInfo = res.data;
					that.isLoading = false;
				});
			},
			toincomeDetails() {
				common.goLink('/income_details', this);
			},
			toMentor() {
				common.goLink('/mentor', this);
			},
			adReg() {
				var x = new Date(
					new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
				);

				Cookie.set('isShowed', 1, {
					expires: x,
					path: ''
				});
				// Cookie.set('isShowed', 1, { expires: 10000, path: '' });
				// common.setVal('adShow_time', new Date().getTime());
			},
			showAd() {
				var that = this;
				if (Cookie.get('isShowed') == undefined) {
					that.adReg();
					that.adShow = true;
				} else {
					that.adShow = false;
				}
			}
		},
		activated() {
			var that = this;
			that.checkRoute();
			that.my();
			if (common.getVal('userInfo') != null) {
				this.userInfo = common.getVal('userInfo');
			}
			if (!window.localStorage.isLogin) {
				that.isLogin = false;
			} else {
				that.isLogin = common.getVal('isLogin');
			}
			common.toAjax(common.host + '/users/userData', {}, function(res) {
				if (res.err_code != 800) {
					if (res.err_code == 0) {
						common.setVal('userInfo', res.data);
						common.setVal('en_rank', res.data.en_rank);
						that.userInfo = common.getVal('userInfo');
						that.isLogin = true;
						that.showAd();
					} else {
						that.$toast(res.err_msg);
					}
				} else {
					that.isLogin = false;
				}
			});
			common.toAjax(common.host + '/common/pubmsgs', {}, function(res) {
				that.pubmsgs = res.data.msgs;
				common.setVal('pubmsgs', res.data.msgs);
				common.setVal('switch', res.data.switch);
				that.en_video = res.data.switch.en_video;
				that.en_prize = res.data.switch.en_prize;
				that.en_rank = res.data.switch.en_rank;
				that.en_sign = res.data.switch.en_sign;
			});
			common.toAjax(common.host + '/users/getcashlogs', {}, function(res) {
				that.cashInfo = res.data;
			});
		}
	};
</script>

<style scoped>
	.navTop {
		background: #ffffff;
	}

	#cover {
		position: relative;
		height: 199px;
		z-index: 0;
	}

	.top_bg {
		width: 100%;
		height: 199px;
		position: absolute;
		top: 0;
		z-index: 1;
	}

	.mask {
		background: rgba(0, 0, 0, 0.54);
		width: 100%;
		height: 199px;
		z-index: 2;
		position: absolute;
		top: 0;
	}

	.row_top {
		width: 100%;
		height: 199px;
		z-index: 3;
		position: absolute;
		top: 0;
	}

	.textone {
		overflow: hidden;
		max-height: 25px;
		line-height: 25px;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
	}

	.top_num {
		width: 100%;
		font-size: 24px;
		margin-top: 80%;
		line-height: 24px;
		text-align: center;
		color: #ffffff;
	}

	.top_text {
		width: 100%;
		margin-top: 8%;
		text-align: center;
		font-size: 14px;
		color: #d1d0d0;
	}

	.top_text span {
		font-size: 12px;
	}

	.top_user_img {
		width: 100%;
		text-align: center;
		margin-top: 20%;
		position: relative;
		height: 90px;
	}

	.top_user_img span {
		width: 90px;
		height: 90px;
		border-radius: 100%;
		background: -webkit-linear-gradient(#c8ffcb, #98e59d);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(#c8ffcb, #98e59d);
		/* Opera 11.1 - 12.0 */
		/* Firefox 3.6 - 15 */
		background: -webkit-gradient(linear, left top, left bottom, from(#c8ffcb), to(#98e59d));
		background: linear-gradient(#c8ffcb, #98e59d);
		/* 标准的语法 */
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -45px;
		margin-top: -45px;
		display: block;
	}

	.top_user_img img {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -40px;
		margin-top: -40px;
		width: 80px;
		height: 80px;
		display: block;
		border-radius: 100%;
	}

	.top_user_name {
		margin-top: 2px;
		color: #ffffff;
		font-size: 20px;
		text-align: center;
		width: 100%;
		overflow: hidden;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.top_user_tel {
		color: #d1d0d0;
		text-align: center;
		width: 100%;
	}

	#setting-option {
		z-index: 4;
		position: absolute;
		right: 5%;
		top: 5%;
		color: #ffffff;
		font-size: 28px;
	}

	#setting-option img {
		-webkit-transform: scale(0.7);
		-ms-transform: scale(0.7);
		transform: scale(0.7);
	}

	.van-nav-bar {
		background: #5da968;
		z-index: 1 !important;
	}

	.van-col {
		overflow-x: hidden;
	}

	#top-green,
	.van-nav-bar__right>.van-icon-setting-o {
		color: #ffffff !important;
	}

	.van-list {
		margin-top: 20px;
	}

	.tixianList {
		background: #ffffff !important;
	}

	.qr_img {
		width: 100%;
		display: block;
	}

	.van-popup {
		width: 85% !important;
		background-color: transparent !important;
	}
</style>
