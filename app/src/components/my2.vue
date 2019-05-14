<template>
	<div class="navTop myTop" style="padding-bottom: 60px;">
		<div id="cover">
			<img src="../assets/img/new_ico/top_bg.png" alt="" class="top_bg" />
			<!-- <div class="mask"></div> -->
			<!-- <div id="my_center" v-if="isLogin"><van-cell title="个人中心" is-link style="background: transparent;" to="/mentorcontact"></van-cell></div> -->
			<van-row class="row_top row_userInfo" v-if="isLogin">
				<van-col span="24">
					<img class="hea_img" :src="userInfo.img" alt="" @click="toincomeDetails" />
					<p class="top_user_img"><!-- <span class="imgBg"></span> --></p>
					<p class="userName">{{ userInfo.name }}</p>
				</van-col>
				<!-- <van-col span="12">
					<p class="top_user_name">{{ userInfo.name }}</p>
					<p class="top_user_tel">转转号:{{ userInfo.tel }}</p>
				</van-col> -->
			</van-row>
			<van-row class="row_top" v-if="isLogin">
				<van-col span="8" style="height: 100%;">
					<p class="top_text">
						总收益
						<span>(元)</span>
					</p>
					<p class="top_num" style="">{{ userInfo.income_money / 100 }}</p>
				</van-col>
				<van-col span="8" style="height: 100%;">
					<p class="top_text">
						今日收益
						<span>(元)</span>
					</p>
					<p class="top_num" style="">{{ userInfo.today_money / 100 }}</p>
				</van-col>
				<van-col span="8" style="height: 100%;">
					<p class="top_text">
						我的余额
						<span>(元)</span>
					</p>
					<p class="top_num" style="">{{ userInfo.balance / 100 }}</p>
				</van-col>
			</van-row>
			<div @click="toLogin" class="toLogin" v-if="!isLogin">点击登录</div>
			<van-icon name="volume-o" id="contact-option" @click="onClickLeft" />
			<van-icon name="setting-o" id="setting-option" @click="onClickRight" />
			<p class="my_center">个人中心</p>
		</div>
		<!-- 	<van-cell-group style="display: none;">
			<van-cell is-link :center="true">
				<template slot="title" style="flex:70%">
					<p class="custom-text">邀请好友至少赚14元现金奖励</p>
					<p class="custom-text redTxt">好友每日会进贡收益哦</p>
				</template>
				<img
					src="../assets/choujiang/images/redpacket.png"
					alt=""
					slot="icon"
					style="width:50px;height: 50px;"
				/>
			</van-cell>
			<van-row class="inviteGroup">
				<van-col span="8">
					<p><img src="../assets/img/invite-weixin.png" alt="" class="inviteImg" /></p>
					<p>微信收徒</p>
				</van-col>
				<van-col span="8">
					<p>
						<img src="../assets/img/invite-pengyouquan.png" alt="" class="inviteImg" />
					</p>
					<p>朋友圈</p>
				</van-col>
				<van-col span="8">
					<p><img src="../assets/img/invite-erm.png" alt="" class="inviteImg" /></p>
					<p>二维码收徒</p>
				</van-col>
			</van-row>
		</van-cell-group> -->
		<div class="top_size">
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
					<van-col span="6">
						<div @click="toRoute('task')">
							<img src="../assets/img/new_ico/5.png" alt="" />
							<p class="baseFont">任务中心</p>
						</div>
						<span class="moneyTxt">赚钱</span>
					</van-col>
					<van-col span="6">
						<div @click="toRoute('mentor')">
							<img src="../assets/img/new_ico/11.png" alt="" />
							<p class="baseFont">邀请好友</p>
						</div>
					</van-col>
					<!-- <van-col span="6" v-if="en_prize == 1">
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
					</van-col> -->
					<!-- <van-col span="6" v-if="isReg">
						<div @click="toReg()">
							<img src="../assets/img/new_ico/4.png" alt="" />
							<p class="baseFont">预注册</p>
						</div>
					</van-col> -->
				</van-row>
			</div>
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item, index) in adImgList" :key="index"><img :src="item.img" alt @click="toAd(item.url)" style="width: 100%;" /></div>
				</div>
			</div>
			<!-- <div style="background-color: rgb(242, 242, 242); height: 8px"></div> -->
			<van-cell-group>
				<van-cell title="排行榜" v-if="en_rank == 1" is-link value="" :icon="icon77" to="/rank" />
				<van-cell title="VIP会员" is-link value="" :icon="icon11" to="/vip" />
				<van-cell title="新手课堂" is-link value="" :icon="icon22" to="/course" />
				<van-cell title="幸运抽奖" is-link value="" :icon="icon33" to="/luck_draw" />
				<van-cell title="签到" is-link value="" :icon="icon44" to="/sign" />
				<van-cell title="联系客服" is-link value="" :icon="icon55" to="/services" />
				<van-cell title="预注册" is-link value="" :icon="icon66" @click="toReg()" v-if="isReg" />
			</van-cell-group>

			<!-- 
			<div class="border-line border-line-bold"></div>
			<div id="btnGroup" v-if="isbtnShow">
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
					<van-col span="6" v-if="en_rank==1">
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
				</van-row>
			</div>
			<div class="border-line border-line-bold"></div>
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
				<div class="tixianList" v-for="tixian in cashInfo" :key="tixian.index">
					<van-row type="flex" justify="space-between" align="center">
						<van-col span="3">
							<img
								:src="tixian.img"
								alt=""
								class="userImg"
								style="display: inline-block;vertical-align: middle;margin:10px;width:28px;height: 28px;"
							/>
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
							<p
								style="text-align:right;margin-top: 5px;color:#999999;padding-right: 5%;"
							>
								刚刚
							</p>
						</van-col>
					</van-row>
					<div class="border-line"></div>
				</div>
			</van-pull-refresh> -->
			<van-popup v-model="adShow"><img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/ad_mentor.png" class="qr_img" alt @click="toMentor" /></van-popup>
		</div>
	</div>
</template>
<script>
import common from '../assets/js/common.js';
import Cookie from 'js-cookie';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'my',
	data() {
		return {
			ico1: require('../assets/img/new_ico/5.png'),
			cashInfo: {},
			noticeTxt: '【新年福利】2019年第一波大奖，我在趣转转等你！',
			list: [],
			loading: false,
			finished: false,
			active_my: 2,
			icon11: require('../assets/img/icon/vip_icon.png'),
			icon22: require('../assets/img/icon/xsxt_icon.png'),
			icon33: require('../assets/img/icon/cj_icon.png'),
			icon44: require('../assets/img/icon/qd_icon.png'),
			icon55: require('../assets/img/icon/kf_icon.png'),
			icon66: require('../assets/img/icon/yzc.png'),
			icon77: require('../assets/img/icon/phb.png'),
			activeIco: require('../assets/img/guagua/refresh.png'),
			isLogin: false,
			adImgList: [],
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
			isbtnShow: false,
			adShow: false,
			en_prize: 0,
			en_video: 0,
			en_rank: 0,
			en_sign: 0,
			myStyle: {
				padding: '0 0 50px',
				width: '100%',
				height: window.innerHeight + 'px',
				'overflow-x': 'hidden',
				'overflow-y': 'auto'
			},
			ad: '',
			adUrl: '',
			isReg: false,
			ad_show: false,
			swiperHeight: {
				height: (window.innerHeight * 80) / 1334 + 'px'
			},
			swiper: null
		};
	},
	methods: {
		onClickRight() {
			common.goLink('/setting', this);
		},
		onClickLeft() {
			common.goLink('/notice_list', this);
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
		toNotice: function(id) {
			common.goLink('/notice', this);
			common.setVal('noticeInfo', id);
		},
		toLogin() {
			this.$router.push('/login');
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
			var x = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
			Cookie.set('isShowed', 1, {
				expires: x,
				path: ''
			});
			// Cookie.set('isShowed', 1, { expires: 10000, path: '' });
			// common.setVal('adShow_time', new Date().getTime());
		},
		toAd(url) {
			var that = this;
			var url = 'http://' + location.host + '/adpage/adpage.html?url=' + encodeURIComponent(url);
			// var url = 'http://migutest.zmr016.com/adpage/adpage.html?url=' + encodeURIComponent(url);
			// window.open(url,'_blank')
			api.sendEvent({
				name: 'openWin',
				extra: {
					url: url // 需要http开头的完整url
				}
			});
		},
		showAd() {
			if (Cookie.get('isShowed') == undefined) {
				this.adReg();
				this.adShow = true;
			} else {
				this.adShow = false;
			}
		},
		initSwiper() {
			if (this.swiper != null) return;
			this.swiper = new Swiper('.swiper-container', {
				loop: true,
				speed: 900,
				autoplay: {
					disableOnInteraction: false,// 触碰后自动切换也不会停止
				},
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents: true //修改swiper的父元素时，自动初始化swiper
			});
		}
	},
	watch: {
		$route() {
			if (this.$route.path == "/my") {
				console.log(this.swiper.autoplay.start());
				this.swiper.autoplay.start();
			} else {
				this.swiper.autoplay.stop();
				console.log(this.swiper.autoplay.stop());
			}
		}
	},
	mounted() {},
	activated() {
		var that = this;
		that.checkRoute();
		that.my();
		if (common.getVal('userInfo') != null) {
			this.userInfo = common.getVal('userInfo');
		}
		if (common.getVal('loginData') != null) {
			this.en_prize = common.getVal('loginData').switch.en_prize;
			this.en_video = common.getVal('loginData').switch.en_video;
			this.en_rank = common.getVal('loginData').switch.en_rank;
			this.en_sign = common.getVal('loginData').switch.en_sign;
			if (common.getVal('loginData').ad_info.length > 0) {
				console.log('inti ');
				this.ad_show = true;
				this.adImgList = common.getVal('loginData').ad_info;
				this.$nextTick(() => {
					// 下一个UI帧再初始化swiper
					this.initSwiper();
				});
			} else {
				this.ad_show = false;
			}
		} else {
			common.toAjax(common.host + '/api/app/commoninfo', {}, function(res) {
				that.en_prize = res.data.switch.en_prize;
				that.en_video = res.data.switch.en_video;
				that.en_rank = res.data.switch.en_rank;
				that.en_sign = res.data.switch.en_sign;
				if (common.getVal('loginData').ad_info.length > 0) {
					console.log('inti ');
					this.ad_show = true;
					this.adImgList = common.getVal('loginData').ad_info;
					this.$nextTick(() => {
						// 下一个UI帧再初始化swiper
						this.initSwiper();
					});
				} else {
					this.ad_show = false;
				}
			});
		}
		if (window.localStorage.isLogin) {
			that.isLogin = common.getVal('isLogin');
		}
		common.toAjax(common.host + '/users/userData', {}, function(res) {
			if (res.err_code != 800) {
				if (res.err_code == 0) {
					common.setVal('userInfo', res.data);
					that.userInfo = common.getVal('userInfo');
					that.isLogin = true;
					window.localStorage.isLogin = true;
					if (res.data.must_set_passwd == 1) {
						common.goLink('/password/1', that);
					} else {
						that.showAd();
					}
				} else {
					that.$toast(res.err_msg);
				}
			} else {
				that.isLogin = false;
				window.localStorage.isLogin = false;
			}
		});
	}
};
</script>

<style scoped>
.navTop {
	background: #ffffff;
	padding: 0;
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

/* 更改样式 */

.hea_img {
	position: absolute;
	width: 90px;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	border: 2px solid #fff;
	border-radius: 50%;
	box-shadow: 0px 0px 8px #000;
	z-index: 4;
}

.userName {
	position: absolute;
	top: 55%;
	left: 50%;
	transform: translateX(-50%);
	font-size: 16px;
	z-index: 6;
}

.img_bg {
	width: 100%;
	padding: 10px 0 8px 0;
}

.img_bg img {
	width: 100%;
}

.my_center {
	position: absolute;
	top: 5%;
	left: 50%;
	color: #fff;
	z-index: 4;
	transform: translateX(-50%);
	font-size: 18px;
}

.top_size {
	margin-top: 50px;
}

.row_top {
	width: 94%;
	z-index: 3;
	position: absolute;
	top: 180px;
	margin: 0 3%;
	background-color: #fff;
	border-bottom-left-radius: 6px;
	border-bottom-right-radius: 6px;
	box-shadow: 0px 3px 8px #fcebe7;
	padding: 5px 0;
}

.row_top.row_userInfo {
	top: 100px;
	border-radius: 0;
	border-top-left-radius: 6px;
	border-top-right-radius: 6px;
	box-shadow: 0px 0px 8px #fcebe7;
}

.toLogin {
	width: 96%;
	height: 140px;
	line-height: 140px;
	margin: 0 2%;
	display: block;
	position: absolute;
	text-align: center;
	font-size: 34px;
	color: #f59647;
	background-color: #fff;
	border-radius: 6px;
	z-index: 4;
	top: 45%;
	box-shadow: 0px 3px 8px #fcebe7;
	padding: 5px 0;
}

.textone {
	overflow: hidden;
	max-height: 25px;
	line-height: 25px;
	text-overflow: ellipsis;
}

.top_num {
	width: 100%;
	font-size: 20px;
	line-height: 20px;
	text-align: center;
	color: #000;
	padding-top: 4px;
	overflow: hidden;
}

.top_text {
	width: 100%;
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
	position: relative;
	height: 90px;
}

.top_user_img span {
	width: 90px;
	height: 90px;
	border-radius: 100%;
	/*background: -webkit-linear-gradient(#c8ffcb, #98e59d); /*Safari 5.1 - 6.0 */
	/* background: -o-linear-gradient(#c8ffcb, #98e59d); /* Opera 11.1 - 12.0 */
	/* background: -moz-linear-gradient(#c8ffcb, #98e59d);/* Firefox 3.6 - 15 */
	/* background: linear-gradient(#c8ffcb, #98e59d); /* 标准的语法 */
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
	margin-top: -35px;
	width: 80px;
	height: 80px;
	display: block;
	border-radius: 100%;
}

.top_user_name {
	margin-top: 6%;
	color: #ffffff;
	font-size: 24px;
	text-align: center;
	width: 100%;
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

#contact-option {
	z-index: 4;
	position: absolute;
	left: 5%;
	top: 5%;
	color: #ffffff;
	font-size: 28px;
}

#setting-option img,
#contact-option img {
	transform: scale(0.7);
}

.van-nav-bar {
	background: #5da968;
	z-index: 1 !important;
}

.van-col {
	overflow-x: hidden;
	border: none !important;
}

#top-green,
.van-nav-bar__right > .van-icon-setting-o {
	color: #ffffff !important;
}

.van-list {
	margin-top: 20px;
}

.tixianList {
	background: #ffffff !important;
}

.baseFont {
	font-size: 12px;
}

.qr_img {
	width: 100%;
	display: block;
}

.van-popup {
	width: 85% !important;
	background-color: transparent !important;
}

/*新版样式*/
.van-cell-group {
	margin: 10px auto;
}

.inviteGroup {
	margin-top: 5px;
	margin-bottom: 5px;
}

.inviteGroup p {
	text-align: center;
}

.inviteGroup p .inviteImg {
	width: 30px;
	height: 30px;
	margin: 0 auto;
}

#my_center {
	position: absolute;
	top: 30%;
	right: 0;
	background: bisque;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	border-radius: 30px 0 0 30px;
	z-index: 9999;
	display: block;
	padding: 0 0 0 1%;
}
.moneyTxt {
	position: absolute;
	width: 35px;
	line-height: 20px;
	top: 3%;
	right: 0;
	padding-bottom: 2px;
	background-color: #fd6a57;
	color: #fff;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
	font-size: 12px;
}
</style>
