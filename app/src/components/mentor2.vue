<template>
	<div class="navTop" style="background: #FFFFFF;padding-bottom: 60px;">
		<van-nav-bar title="师徒" fixed style="border-bottom: 1px solid #F2F2F2;" />
		<p style="width: 100%;color: #FFA77C;background: #FFFFF0;text-align: center;margin-top: 1px;font-size: 16px;" v-if="isMsg">
			{{ msg.name }}刚邀请{{ msg.child_num }}位好友获得{{ msg.total_money /100}}元
		</p>
		<img src="https://qiniustore.zmr016.com/quzhuan/imgs/news.jpg" alt class="mentor-adImg" />
		<van-row v-if="!showAll" style="text-align: center;">
			<van-button type="danger" round block size="small" style="width: 40%;margin:0 auto;font-size: 16px;" @click="toShare">点击立即收徒</van-button>
		</van-row>
		<van-row v-if="showAll">
			<van-col span="12" style="text-align: center;">
				<img src="../assets/img/mentor-1.png" alt="" />
				<span>微信邀请</span>
			</van-col>
			<van-col span="12" style="text-align: center;">
				<img src="../assets/img/mentor-2.png" alt="" />
				<span>朋友圈邀请</span>
			</van-col>
			<van-col span="8" style="text-align: center;">
				<img src="../assets/img/invite-erm.png" alt="" />
				<span>二维码邀请</span>
			</van-col>
		</van-row>
		<van-tabs v-model="active" sticky animated :line-width="lineWidth" color="#FF0000" title-active-color="#FF0000" title-inactive-color="#000000">
			<van-tab title="赚钱技巧"></van-tab>
			<van-tab title="我的好友"></van-tab>
		</van-tabs>
		<div v-if="active == 0">
			<div style="border-bottom: 4px solid #F2F2F2;">
				<p style="text-align: center;font-size: 20px;margin:5px auto;colo:#000000">14-18元奖励组成</p>
				<van-row class="redCard">
					<van-col span="6" style="text-align:center;">
						<p>
							<span class="money-card">{{ new_moneys.first_share_getmoney }}元</span>
						</p>
						<p>阅读分享</p>
					</van-col>
					<van-col span="6" style="text-align:center;">
						<p>
							<span class="money-card">{{ new_moneys.first_user_rel }}元</span>
						</p>
						<p>收徒奖励</p>
					</van-col>
					<van-col span="6" style="text-align:center;">
						<p>
							<span class="money-card">{{ new_moneys.register }}元</span>
						</p>
						<p>注册奖励</p>
					</van-col>
					<van-col span="6" style="text-align:center;">
						<p>
							<span class="money-card">{{ new_moneys.first_getcash }}元</span>
						</p>
						<p>提现奖励</p>
					</van-col>
				</van-row>
			</div>

			<div style="">
				<p style="font-size: 20px;font-weight: bold;text-align: center;">收徒小技巧</p>
				<p style="text-align: center;font-size: 14px;color:#7d7e80">收徒成功率提升200%</p>
				<p style="width: 94%;margin:10px 3% 10px ;background: #F2F2F2;padding:10px 0;border-radius: 5px;">
					<span class="listIco">1</span>
					<span class="listTxt">
						邀请你的家人，朋友，同事或同学成功率最高，可获得
						<em class="redTxt">{{ st_trick_money }}元</em>
						现金奖励
					</span>
				</p>
				<p style="width: 94%;margin:0 3% 10px;background: #F2F2F2;padding:10px 0;border-radius: 5px;">
					<span class="listIco">2</span>
					<span class="listTxt">
						分享到3个或以上微信群，成功率提升
						<em class="redTxt">200%</em>
					</span>
				</p>
				<p style="width: 94%;margin:0 3% 10px;background: #F2F2F2;padding:10px 0;border-radius: 5px;">
					<span class="listIco">3</span>
					<span class="listTxt">告诉你的朋友：自己阅读也有钱，轻松月入百万</span>
				</p>
			</div>
		</div>
		<div v-if="active == 1">
			<div id="friendCard">
				<van-row>
					<van-col span="12">今日好友:{{ today_friend_num }}人</van-col>
					<van-col span="12">累计好友人数:{{ total_friend_num }}人</van-col>
				</van-row>
				<van-row>累计奖励:{{ total_money / 100 }}元</van-row>
			</div>
			<p class="tipsTxt">据统计：59%以上的用户</p>
			<p class="tipsTxt" style="margin-bottom: 10px;">靠徒弟进贡，每天在家躺着赚钱</p>
			<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="true">
				<div class="friendCard" :id="sf.id" @click="toDetail(sf.id, 0)" v-if="sf.length!=0">
					<van-row type="flex">
						<van-col span="5"><img v-lazy="sf.img" alt="" /></van-col>
						<van-col span="11">
							<p>
								师傅：
								<span class="friendCard_span">{{ sf.name }}</span>
							</p>
							<p>电话：{{ sf.tel }}</p>
						</van-col>
						<van-col span="8">
							<p>今日收益：{{ sf.today_money / 100 }}元</p>
							<p>总收益：{{ sf.total_money / 100 }}元</p>
						</van-col>
					</van-row>
				</div>
				<div class="friendCard" v-for="(item, index) in td_list" :key="index" :id="item.user_id" @click="toDetail(item.user_id, 1)">
					<van-row type="flex">
						<van-col span="5"><img v-lazy="item.img" alt="" /></van-col>
						<van-col span="11">
							<p>
								徒弟：
								<span class="friendCard_span">{{ item.name }}</span>
							</p>
							<p>电话：{{ item.tel }}</p>
						</van-col>
						<van-col span="8">
							<p>今日收益：{{ item.today_money / 100 }}元</p>
							<p>总收益：{{ item.total_money / 100 }}元</p>
						</van-col>
					</van-row>
				</div>
			</van-list>
		</div>
		<!-- 	<van-actionsheet
			v-model="show"
			:actions="actions"
			cancel-text="取消"
			@select="onSelect"
			@cancel="onCancel"
			style="padding-bottom: 10px;width:101%"
		/> -->
		<van-popup v-model="ermShow" style="background: transparent;">
			<img :src="ermUrl" class="qr_img" alt />
			<input type="button" class="ermBtn shareBtn" value="分享图片给朋友" @click="ermShare()" />
		</van-popup>
		<van-popup v-model="btnShow" position="bottom" :overlay="true">
			<van-row class="inviteGroup">
				<van-col span="12">
					<div @click="onSelect(0)">
						<p><img src="../assets/img/invite-weixin.png" alt="" class="inviteImg" /></p>
						<p>微信收徒</p>
					</div>
				</van-col>
				<van-col span="12">
					<div @click="onSelect(1)">
						<p><img src="../assets/img/invite-pengyouquan.png" alt="" class="inviteImg" /></p>
						<p>朋友圈</p>
					</div>
				</van-col>
				<!-- <van-col span="8">
					<div @click="onSelect(2)">
						<p><img src="../assets/img/invite-erm.png" alt="" class="inviteImg" /></p>
						<p>二维码收徒</p>
					</div>
				</van-col> -->
			</van-row>
		</van-popup>
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'mentor',
	data() {
		return {
			active: 0,
			ad: require('../assets/img/news.jpg'),
			lineWidth: window.innerWidth / 2 - 1,
			quick_money: 19998553,
			showAll: false,
			isMsg: false,
			msg: [],
			total_friend_num: 0,
			today_friend_num: 0,
			total_money: 0,
			tips_money: 5,
			time: '',
			show: false,
			ermShow: false,
			ermImg: '',
			sf: [],
			td_list: [],
			ermUrl: '',
			new_moneys: [],
			btnShow: false,
			loading: false,
			finished: false,
			last_id: 0,
			shareType: 'share'
		};
	},
	computed: {
		st_trick_money() {
			return (
				parseFloat(this.new_moneys.first_getcash) +
				parseFloat(this.new_moneys.first_share_getmoney) +
				parseFloat(this.new_moneys.first_user_rel) +
				parseFloat(this.new_moneys.register)
			);
		}
	},

	methods: {
		toDetail(id, type) {
			switch (type) {
				case 0:
					common.goLink('/my_master', this);
					break;
				case 1:
					common.goLink('/my_apprentice/' + id, this);
					break;
				default:
					break;
			}
		},
		onSelect(name) {
			var that = this;
			var pic = common.getVal('userInfo').img;
			var desc = '送你一份零花钱，每天都能领，和好友一起分享';
			var title = '欢迎加入【趣转转】与好友一起轻松赚钱';
			var link = that.share_host + '/wxlogin?type=mentor&&parent_user_id=' + common.getVal('passwd_id');
			var st_use_type = common.getVal('loginData').st_use_type;

			switch (name) {
				case 0:
					if (st_use_type == 'img') {
						if (this.ermUrl != '') {
							// 分享图片
							api.sendEvent({
								name: that.shareType,
								extra: {
									type: 'image',
									scene: 'session',
									timeline: false, // false表示发送给还有，true表示分享朋友圈
									pic: that.ermUrl // 图片地址
								}
							});
						}
					} else {
						// 分享网页
						api.sendEvent({
							name: that.shareType,
							extra: {
								type: 'page',
								pic: pic, // 缩略图
								contentUrl: link, // 网页地址
								description: desc, // 描述
								title: title, // 标题
								scene: 'session',
								timeline: false // false表示发送给还有，true表示分享朋友圈
							}
						});
					}
					break;
				case 1:
					if (st_use_type == 'img') {
						if (this.ermUrl != '') {
							// 分享图片
							api.sendEvent({
								name: that.shareType,
								extra: {
									type: 'image',
									scene: 'timeline',
									timeline: true, // false表示发送给还有，true表示分享朋友圈
									pic: that.ermUrl // 图片地址
								}
							});
						}
					} else {
						// 分享网页
						api.sendEvent({
							name: that.shareType,
							extra: {
								type: 'page',
								pic: pic, // 缩略图
								contentUrl: link, // 网页地址
								description: desc, // 描述
								title: title, // 标题
								scene: 'timeline',
								timeline: true // false表示发送给还有，true表示分享朋友圈
							}
						});
					}

					break;
				// case 2:
				// 	that.ermShow = true;
				// 	that.show = false;
				// 	that.btnShow = false;
				// 	break;
				default:
					break;
			}
		},
		toShare() {
			// this.ermShow = true;
			// this.show = true;
			this.btnShow = true;
		},
		onCancel() {
			this.show = false;
		},
		ermShare() {
			// 分享图片
			var that = this;
			api.sendEvent({
				name: 'share',
				extra: {
					type: 'image',
					timeline: false, // false表示发送给还有，true表示分享朋友圈
					pic: that.ermUrl // 图片地址
				}
			});
		},
		onLoad() {
			var that = this;
			common.toAjax(common.host + '/user_st/friend', { last_id: that.last_id }, function(res) {
				that.loading = false;
				if(res.err_code==0){
					if(res.data.sf){
						that.sf = res.data.sf;
					}
					if (res.data.last_id == null) {
						that.finished = true;
						return;
					}else{
						that.td_list = that.td_list.concat(res.data.td_list);
						that.last_id = res.data.last_id;
					}
				}else{
					that.finished = true;
				}
			});
		}
	},
	activated() {
		this.checkRoute();
		this.mentors();
		this.sf=[]
		this.td_list=[]
		this.last_id=0;
		this.active=0;
		this.onLoad();
		var that = this;
		if (that.$store.state.qrcode_img != '') {
			that.ermUrl = that.$store.state.qrcode_img;
		} else {
			common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
				that.ermUrl = res.data.qrcode_img;
				that.$store.commit('SETIMG', res.data.qrcode_img);
			});
		}
		if (common.getVal('loginData').app_share_type != 'share') {
			this.shareType = 'fakeShare';
		}
		clearInterval(this.time);
		if (!common.getVal('isLogin') != undefined && common.getVal('isLogin') == false) {
			setTimeout(function() {
				that.$router.push('/my');
				return;
			}, 300);
		}
		common.toAjax(common.host + '/user_st/income_info', {}, function(res) {
			if (res.err_code != 800) {
				that.isMsg = true;
				that.total_friend_num = res.data.friend_prize.friend_total_count;
				that.today_friend_num = res.data.friend_prize.friend_today_count;
				that.total_money = res.data.friend_prize.total_income;
				that.share_host = res.data.share_host;
				that.new_moneys = res.data.new_moneys;
				var i = 0;
				that.msg = res.data.random_friends_info[i];
				that.time = setInterval(function() {
					i++;
					if (i >= res.data.random_friends_info.length) {
						console.log(i);
						clearInterval(that.time);
						setTimeout(function() {
							that.isMsg = false;
						}, 5000);
						return;
					}
					console.log(i + '----' + res.data.random_friends_info.length);
					that.msg = res.data.random_friends_info[i];
				}, 3000);
			}
		});
	}
};
</script>

<style scoped>
.mentor-adImg {
	width: 100%;
	height: auto;
}
.van-row {
	margin: 10px auto;
}
.van-col img {
	width: 30px;
	height: 30px;
	margin-right: 10px;
}
.van-col img,
.van-col span {
	display: inline-block;
	vertical-align: middle;
}
.money-card {
	background: red;
	width: 60px;
	height: 40px;
	line-height: 40px;
	display: block;
	text-align: center;
	margin: 0 auto;
	position: relative;
	color: #ffffff;
}
.redCard p {
	font-size: 13px;
}
.redCard p span {
	font-size: 18px;
}
.money-card:before,
.money-card:after {
	content: '';
	position: absolute;
	display: block;
	width: 0;
	height: 100%;
	top: 0;
}
.money-card:before {
	left: -2px;
	border-right: 4px dotted white;
}
.money-card:after {
	right: -2px;
	border-left: 4px dotted white;
}
.van-tab_pane {
	background-color: #ffffff !important;
}
.listIco {
	border-radius: 100%;
	width: 30px;
	height: 30px;
	background: #a59dd6;
	text-align: center;
	line-height: 30px;
	display: inline-block;
	vertical-align: middle;
	color: #ffffff;
	margin: 0 2%;
}
.listTxt {
	font-size: 16px;
	display: inline-block;
	vertical-align: middle;
	width: 85%;
	color: #000000;
}
#friendCard {
	width: 86%;
	height: 70px;
	padding: 0 2%;
	border: 1px solid #dddddd;
	margin: 20px auto 10px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	border-radius: 10px;
}
.friendCard {
	width: 90%;
	height: 70px;
	padding: 0 2%;
	border: 1px solid #dddddd;
	margin: 10px auto;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 30px 0 rgba(0, 0, 0, 0.19);
	border-radius: 10px;
}
.friendCard img {
	width: 60px;
	height: 60px;
}
.friendCard .van-row {
	height: 60px;
	margin-top: 5px;
}
.friendCard p {
	margin-top: 10px;
}
.friendCard_span {
	margin-top: -4px;
	width: 100px;
	overflow: hidden; /*超出部分隐藏*/
	white-space: nowrap; /*不换行*/
	text-overflow: ellipsis; /*超出部分文字以...显示*/
}
.tipsTxt {
	text-align: center;
	color: #7d7e80;
}
.shareCard {
	width: 100%;
}
.shareCard img {
	width: 100%;
}
.btnCard {
	width: 100%;
	text-align: center;
	background: #ffffff;
	margin: auto auto 20px;
}

.mentorBtn {
	padding: 0 10px;
	height: 40px;
	text-align: center;
	border: none;
	background: #ff5b56;
	margin: 10px auto;
	color: #ffffff;
	border-radius: 5px;
	font-size: 18px;
	letter-spacing: 2px;
	box-shadow: 2px 2px 2px #bc0b0f;
}
.van-button--primary {
	background: #ff5b56;
	border: none;
	-webkit-box-shadow: 1px 1px 1px #000000;
	-moz-box-shadow: 1px 1px 1px #000000;
	box-shadow: 1px 1px 1px #000000;
}
.qr_img {
	width: 300px;
	display: block;
}
.van-actionsheet {
	background: #ffffff !important;
}
.van-popup {
	background: transparent;
}
.van-actionsheet__cancel {
	margin-top: 0 !important;
}
.ermBtn {
	width: 110px;
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	background: #f4cd1c;
	border-radius: 5px;
	border: none;
	color: #de480d;
	position: fixed;
	top: 90%;
	margin-left: -55px;
}

.ermBtn.shareBtn {
	left: 50%;
}
.inviteGroup {
	margin-top: 5px;
	margin-bottom: 5px;
	padding: 20px 0;
}
.inviteGroup p {
	text-align: center;
}
.inviteGroup p .inviteImg {
	width: 30px;
	height: 30px;
	margin: 0 auto;
}
.van-popup {
	background: #ffffff;
}
</style>
