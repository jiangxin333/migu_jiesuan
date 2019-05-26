<template>
	<div class="navTop" :style="{ 'max-width': bodyW }">
		<van-nav-bar title="幸运抽奖" left-arrow @click-left="onClickLeft" fixed />
		<div :class="'danmu plane' + (index + 1)" :style="{ top: item.top }" v-for="(item, index) in planeList" :key="index">
			<div class="planeContent" v-if="index == 0">
				<img src="https://qiniustore.zmr016.com/quzhuan/imgs/wheel-plane.gif" alt />
				<div style="font-size:14px;color:#000000;position: absolute; left:150px;top:50%;height: 30px;margin-top: -15px;" id="plane1"></div>
			</div>
			<div class="normalContent" v-if="index != 0">
				<img src="https://qiniustore.zmr016.com/quzhuan/imgs/news.jpg" alt id="plane2Img" />
				<div id="plane2" style="color:#000000;"></div>
			</div>
		</div>

		<div class="mainBody">
			<div class="myCoin">剩余{{ left_chances }}次机会</div>
			<div id="content" ontouchstart>
				<div class="wrapper typo" id="wrapper">
					<section id="turntable" class="gb-turntable">
						<div class="gb-turntable-container"><canvas class="gb-turntable-canvas" width="300" height="300px">抱歉！浏览器不支持。</canvas></div>
						<a class="gb-turntable-btn">抽奖</a>
					</section>
				</div>
			</div>
		</div>
		<div class="bsBtn noactive" @click="toShare">邀请好友赚取抽奖机会</div>
		<input type="hidden" id="prized" :value="0" />

		<img src="../assets/img/draw_rule_1.png" alt="" class="explainCard" />
		<div class="explainCard ruleBody"><div class="ruleContent"></div></div>
		<img src="../assets/img/draw_rule_3.png" alt="" class="explainCard" />
		<van-actionsheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
		<van-popup v-model="ermShow">
			<img :src="ermImg" class="qr_img" alt />
			<input type="button" class="ermBtn shareBtn" value="分享图片给朋友" @click="ermShare()" />
		</van-popup>
	</div>
</template>

<script>
import common from '../assets/js/common';
// import '../assets/choujiang/js/GB-canvas-turntable';
import '../assets/choujiang/css/typo/typo.css';
import '../assets/choujiang/css/GB-canvas-turntable.css';

export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'luck_draw',
	data() {
		return {
			baseCoin: 100,
			bsNum: 1,
			myCoin: 2596,
			prizes: [],
			prizedList: [],
			activity_id: '',
			chances: 999999999999999,
			time: '',
			danmu_index: 0,
			isActive: true,
			planeList: [
				{
					top: '70px'
				},
				{
					top: '170px'
				}
			],
			left_chances: 0,
			show: false,
			ermShow: false,
			ermImg: '',
			actions: [
				{
					name: '微信分享给好友'
				},
				{
					name: '微信分享到朋友圈'
				},
				{
					name: '分享二维码'
				}
			],
			bodyW: window.innerWidth + 'px',
			gbTurntable: '',
			isInit: false,
			shareType:'share'
		};
	},
	methods: {
		onClickLeft: function() {
			clearTimeout(this.time);
			this.Toast.clear();
			window.gbTurntable = undefined;
			console.log('window', window);
			this.$router.go(-1);
		},
		init() {
			var that = this;
			var coinTemp;

			// 奖品(模拟数据)
			gbTurntable.init({
				id: 'turntable',
				config: function(callback) {
					// 配置奖品参数
					// 获取奖品信息
					// callback && callback(['11元红包','2元红包','3元红包','4元红包','5元红包','6元红包']);
					// 真实数据应该类似{id: 2, name: '奖品名称', 'img': '奖品图标', weight: '中奖概率1-10'}
					callback && callback(that.prizes);
				},
				getPrize: function(callback) {
					// 获取奖品参数
					// 获取中奖信息
					common.toAjax(
						common.host + '/prizes/get_prize',
						{
							rize: that.bsNum,
							act_id: that.activity_id
						},
						function(res) {
							if (res.status != 800) {
								if (res.status == 10000) {
									console.log(res);
									var id = res.data.prize_id;
									that.left_chances = res.data.left_chances;
									for (var i in that.prizes) {
										if (that.prizes[i].id == id) {
											that.prizeNum = i;
											console.log('奖品', that.prizes[i].txt);
											callback && callback(i);
										}
									}
								} else {
									that.$toast(res.info);
									$('.gb-turntable-btn').removeClass('disabled');
								}
							} else {
								that.$toast(res.info);
								setTimeout(function() {
									common.goLink('/login', that);
								}, 1000);
							}
						}
					);
				},
				gotBack: function() {
					// 中奖回调参数
					that.$toast('恭喜抽中' + that.prizes[that.prizeNum].txt);
					that.myCoin = coinTemp;
					var userInfo = common.getVal('userInfo');
					userInfo.coin = coinTemp;
					common.setVal('userInfo', userInfo);
				}
			});
		},
		toSetbs(bsNum) {
			this.bsNum = bsNum;
		},
		danmu() {
			let style = document.createElement('style');
			document.head.appendChild(style);
			let width = window.innerWidth;
			let posY = Math.floor(Math.random() * (window.innerHeight - 300) + 150);
			console.log(posY);
			let from = `from { visibility: visible; -webkit-transform: translateX(${width}px) ; }`;
			let to = `to { visibility: visible; -webkit-transform: translateX(-100%); }`;
			style.sheet.insertRule(`@-webkit-keyframes danmu { ${from} ${to} }`, 0);
		},
		posY() {
			var that = this;
			that.time = setTimeout(function() {
				that.danmu_index++;
				that.danmu();
				if (that.danmu_index > that.prizedList.length) {
					that.danmu_index = 1;
				}
				that.posY();
			}, 10000);
		},
		toShare() {
			this.show = true;
		},
		onSelect(item) {
			var that = this;
			var pic = common.getVal('userInfo').img;
			var desc = '送你一份零花钱，每天都能领，和好友一起分享';
			var title = '欢迎加入【' + common.getVal('loginData').platform_name + '】与好友一起轻松赚钱';
			var link = that.share_host + '/wxlogin?type=luck_draw&&parent_user_id=' + common.getVal('passwd_id');
			var st_use_type = common.getVal('loginData').st_use_type;
			switch (item.name) {
				case '微信分享给好友':
					// 分享网页
					// Native.share(encodeURI(link), title, desc, pic, false);
					if (st_use_type == 'img') {
						if (this.ermImg != '') {
							// 分享图片
							api.sendEvent({
								name: that.shareType,
								extra: {
									type: 'image',
									scene: 'session',
									timeline: false, // false表示发送给还有，true表示分享朋友圈
									pic: that.ermImg // 图片地址
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
				case '微信分享到朋友圈':
					// 分享网页
					// Native.share(encodeURI(link), title, desc, pic, true);
					if (st_use_type == 'img') {
						if (this.ermImg != '') {
							// 分享图片
							api.sendEvent({
								name: that.shareType,
								extra: {
									type: 'image',
									scene: 'timeline',
									timeline: true, // false表示发送给还有，true表示分享朋友圈
									pic: that.ermImg // 图片地址
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
				// case '分享二维码':
				// 	that.ermShow = true;
				// 	that.show = false;
				// 	break;
				default:
					break;
			}
		},
		onCancel() {
			this.show = false;
		},
		ermShare() {
			// 分享图片
			api.sendEvent({
				name: 'share',
				extra: {
					type: 'image',
					pic: this.ermImg // 图片地址
				}
			});
		}
	},
	created() {
		const s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = 'https://quzhuan.oss-cn-beijing.aliyuncs.com/js/GB-canvas-turntable.js';
		s.id = 'luck_drawJS';
		document.body.appendChild(s);
		var that = this;
		that.posY();
		common.toAjax(
			common.host + '/activity/info',
			{ type: 'luck_draw' },
			function(res) {
				if (res.status != 800) {
					if (res.status == 10000) {
						that.activity_id = res.data.id;
						that.share_host = res.data.share_host;
						that.ermImg = res.data.qrcode_img;
						$('.ruleContent').html(res.data.activity.rule);
						common.toAjax(common.host + '/prizes/list/' + that.activity_id, {}, function(res) {
							if (res.status != 800) {
								if (res.status == 10000) {
									that.Toast.clear();
									that.prizes = res.data.prize_list;
									that.left_chances = res.data.left_chances;
									that.init();
									that.isInit = true;
								} else {
									that.$toast(res.info);
								}
							} else {
								that.$toast(res.info);
								setTimeout(function() {
									common.goLink('/login', that);
								}, 1000);
							}
						});
					} else {
						that.isActive = false;

						that.$dialog
							.alert({
								title: '温馨提醒',
								message: res.info,
								confirmButtonText: '点击返回上一页'
							})
							.then(() => {
								that.$dialog.close();
								that.Toast.clear();
								that.$router.go(-1);
							});
						$('body').removeClass('van-toast--unclickable');
					}
				} else {
					that.$toast(res.info);
					setTimeout(function() {
						common.goLink('/login', that);
					}, 1000);
				}
			},
			that
		);
		$('.gb-turntable-btn').removeClass('disabled');
	},
	activated() {
		this.checkRoute();
		var that = this;
		if (common.getVal('loginData').app_share_type != 'share') {
			this.shareType = 'fakeShare';
		}
		if (!that.isInit) {
			common.toAjax(
				common.host + '/activity/info',
				{ type: 'luck_draw' },
				function(res) {
					if (res.status != 800) {
						if (res.status == 10000) {
							that.activity_id = res.data.id;
							that.share_host = res.data.share_host;
							that.ermImg = res.data.qrcode_img;
							console.log(res.data.activity.rule);
							$('.ruleContent').html(res.data.activity.rule);
							common.toAjax(common.host + '/prizes/list/' + that.activity_id, {}, function(res) {
								if (res.status != 800) {
									if (res.status == 10000) {
										that.Toast.clear();
										that.prizes = res.data.prize_list;
										that.left_chances = res.data.left_chances;
										that.init();
										that.isInit = true;
									} else {
										that.$toast(res.info);
									}
								} else {
									that.$toast(res.info);
									setTimeout(function() {
										common.toLogin(that);
									}, 1000);
								}
							});
						} else {
							that.isActive = false;

							that.$dialog
								.alert({
									title: '温馨提醒',
									message: res.info,
									confirmButtonText: '点击返回上一页'
								})
								.then(() => {
									that.$dialog.close();
									that.Toast.clear();
									that.$router.go(-1);
								});
							$('body').removeClass('van-toast--unclickable');
						}
					} else {
						that.$toast(res.info);
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				},
				that
			);
			$('.gb-turntable-btn').removeClass('disabled');
		}
		common.toAjax(common.host + '/prizes/latest_prized', {}, function(res) {
			if (res.status != 800) {
				if (res.status == 10000) {
					that.prizedList = res.data;
					console.log(that.prizedList);
					var count = 0;
					plane();
					function plane() {
						setTimeout(function() {
							console.log(count);
							var name1 = that.prizedList[count].name ? that.prizedList[count].name : that.prizedList[count].tel;
							var name2 = that.prizedList[count + 1].name ? that.prizedList[count + 1].name : that.prizedList[count + 1].tel;
							var str1 =
								`恭喜<span class="redTxt">` +
								name1 +
								`</span>,获得<span class="redTxt">` +
								that.prizedList[count].prize_name +
								`</span>  ` +
								that.prizedList[count].get_time;
							var str2 =
								`恭喜<span class="redTxt">` +
								name2 +
								`</span>,获得<span class="redTxt">` +
								that.prizedList[count + 1].prize_name +
								`</span>  ` +
								that.prizedList[count + 1].get_time;

							$('#plane1').html(str1);
							$('#plane2').html(str2);
							$('#plane2Img').prop('src', that.prizedList[count + 1].img);
							count += 2;
							plane();
							if (count > 9) {
								count = 0;
							}
						}, 10000);
					}
				} else {
					that.$toast(res.info);
				}
			} else {
				that.$toast(res.info);
				setTimeout(function() {
					common.goLink('/login', that);
				}, 1000);
			}
		});
	}
};
</script>

<style scoped>
.wrapper {
	padding: 20px 20px;
}

.navTop {
	background: url(https://qiniustore.zmr016.com/quzhuan/imgs/wheel_bg.png) no-repeat;
	background-size: cover;
}

.fork-github {
	position: fixed;
	right: -100px;
	top: 45px;
	z-index: 9999;
	padding: 2px 100px;
	font-size: 12px;
	background-color: #444;
	border: 1px solid #000;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
	text-align: center;
}

.fork-github a {
	color: #fff;
}

.gb-turntable a.gb-turntable-btn {
	border: none;
	font-size: 12px;
}

.gb-turntable-item span {
	padding-top: 20px !important;
}

.mainBody {
	width: 99%;
	padding-top: 70px;
	padding-left: 1%;
	position: relative;
}

.myCoin {
	position: absolute;
	width: 240px;
	height: 30px;
	line-height: 30px;
	top: 7%;
	left: 50%;
	margin-left: -120px;
	text-align: center;
	border: 2px solid #f8cd2e;
	background: #fda229;
	color: #ffffff;
	border-radius: 30px;
	font-size: 16px;
}

.bsBtn {
	width: 240px;
	height: 50px;
	line-height: 50px;
	margin: 0 auto;
	text-align: center;
	border: 4px solid #fedba1;
	background: #f5dc9f;
	color: #bf7239;
	border-radius: 30px;
	font-size: 16px;
}

.BtnTxt1,
.BtnTxt2,
.BtnTxt3 {
	height: 50px;
	width: 80px;
	display: block;
	color: #c27b4d;
	font-weight: bold;
}

.BtnTxt1 {
	border-radius: 30px 0 0 30px;
}

.BtnTxt3 {
	border-radius: 0 30px 30px 0;
}

.active {
	background: #eab360;
}

.noactive {
	background: linear-gradient(to bottom, #eab360 0%, #f5dc9f 50%, #eab360 100%);
}

.explainCard {
	width: 100%;
	margin: 0;
	padding: 0;
	border: none;
}
.explainCard.ruleBody {
	background-image: url('../assets/img/draw_rule_2.png');
	background-repeat: repeat-y;
	background-size: 100% 100%;
	border: none;
	margin-top: -10px;
	margin-bottom: -10px;
	padding: 2% 0;
	z-index: 1999;
}
.ruleBody .ruleContent {
	padding: 0 15%;
}
.van-nav-bar {
	z-index: 9999 !important;
}

.danmu {
	position: fixed;
	left: 0;
	visibility: hidden;
	background: url('');
	/*position: absolute;*/
	z-index: 9999999;
	color: #ffffff;
	font-size: 24px;
}
.plane1 {
	animation: danmu 10s ease-in-out infinite;
}
.plane2 {
	animation: danmu 8s ease-in-out 2s infinite;
}

.planeContent {
	position: relative;
}
.planeContent img {
	width: 500px;
}
.normalContent {
	position: relative;
	height: 28px;
	border: none;
	border-radius: 30px;
	background: #dddddd;
	font-size: 12px;
	padding-left: 30px;
	line-height: 28px;
	padding-right: 10px;
	color: #999999;
}
.normalContent img {
	position: absolute;
	left: -10px;
	top: 50%;
	margin-top: -15px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
}
.qr_img {
	width: 300px;
	display: block;
}
.van-popup {
	background-color: transparent;
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
</style>
