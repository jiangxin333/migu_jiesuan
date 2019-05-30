<template>
	<div class="navTop" :style="{ 'max-width': bodyW }">
		<van-nav-bar title="幸运抽奖" left-arrow @click-left="onClickLeft" fixed />
		<div :class="'danmu plane' + (index + 1)" :style="{ top: item.top }" v-for="(item, index) in planeList" :key="index">
			<div class="planeContent" v-if="index == 0">
				<img src="https://qiniustore.zmr016.com/quzhuan/imgs/wheel-plane.gif" alt />
				<div style="font-size:14px;color:#000000;position: absolute; left:28%;top:50%;height: 30px;margin-top: -10px;" id="plane1"></div>
			</div>
			<div class="normalContent" v-if="index != 0">
				<img src="https://qiniustore.zmr016.com/quzhuan/imgs/news.jpg" alt id="plane2Img" />
				<div id="plane2" style="color:#000000;"></div>
			</div>
		</div>
		<div class="myCoin">剩余{{ left_chances }}次机会</div>
		<div class="mainBody">
			<div id="luck">
				<!-- luck -->
				<table style="border-spacing:.08rem .03rem;">
					<tr>
						<td class="luck-unit luck-unit-0" :style="lotteryHeight">
							<img :src="prize_list[2].img" />
							<p>{{ prize_list[2].txt }}</p>
						</td>
						<td class="luck-unit luck-unit-1" :style="lotteryHeight">
							<img :src="prize_list[3].img" />
							<p>{{ prize_list[3].txt }}</p>
						</td>
						<td class="luck-unit luck-unit-2" :style="lotteryHeight">
							<img :src="prize_list[4].img" />
							<p>{{ prize_list[4].txt }}</p>
						</td>
					</tr>
					<tr>
						<td class="luck-unit luck-unit-7" :style="lotteryHeight">
							<img :src="prize_list[9].img" />
							<p>{{ prize_list[9].txt }}</p>
						</td>
						<td class="cjBtn" id="btn" :style="lotteryHeight"></td>
						<td class="luck-unit luck-unit-3" :style="lotteryHeight">
							<img :src="prize_list[5].img" />
							<p>{{ prize_list[5].txt }}</p>
						</td>
					</tr>
					<tr>
						<td class="luck-unit luck-unit-6" :style="lotteryHeight">
							<img :src="prize_list[8].img" />
							<p>{{ prize_list[8].txt }}</p>
						</td>
						<td class="luck-unit luck-unit-5" :style="lotteryHeight">
							<img :src="prize_list[7].img" />
							<p>{{ prize_list[7].txt }}</p>
						</td>
						<td class="luck-unit luck-unit-4" :style="lotteryHeight">
							<img :src="prize_list[6].img" />
							<p>{{ prize_list[6].txt }}</p>
						</td>
					</tr>
				</table>
			</div>
			<!-- luckEnd -->
		</div>
		<div class="bsBtn noactive" @click="ermShare">邀请好友赚取抽奖机会</div>
		<input type="hidden" id="prized" :value="0" />

		<img src="../assets/img/draw_rule_1.png" alt="" class="explainCard" />
		<div class="explainCard ruleBody"><div class="ruleContent" id="ruleCon"></div></div>
		<img src="../assets/img/draw_rule_3.png" alt="" class="explainCard" />
		<van-actionsheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
		<!-- <van-popup v-model="ermShow">
			<img :src="ermUrl" class="qr_img" alt />
			<input
				type="button"
				class="ermBtn shareBtn"
				value="分享图片给朋友"
				@click="ermShare()"
			/>
		</van-popup> -->
		<div style="background:rgba(0,0,0,.7);position: fixed;top:0;width: 100%;height: 100%;z-index: 999999999999;" v-if="tipsShow" @click="showTips">
			<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/share_tip.png" alt="" style="width: 100%;" />
		</div>
		<van-popup v-model="ermShow">
			<img :src="ermUrl" class="qr_img" alt />
			<p style="text-align: center;margin-top: 5px;">
				<input
					type="button"
					class="ermBtn shareBtn"
					value="长按可保存图片或分享给朋友"
					style="border:none;background: transparent; color: #FFFFFF;width: 220px;font-size: 14px;"
				/>
			</p>
		</van-popup>
	</div>
</template>

<script>
var $luck, $units;
var _self = this;
var luck = {
	index: 0, //当前转动到哪个位置，起点位置
	count: 0, //总共有多少个位置
	timer: 0, //setTimeout的ID，用clearTimeout清除
	speed: 20, //初始转动速度
	times: 0, //转动次数
	cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
	prize: -1, //中奖位置
	init: function(id) {
		if ($('#' + id).find('.luck-unit').length > 0) {
			$luck = $('#' + id);
			$units = $luck.find('.luck-unit');
			this.obj = $luck;
			this.count = $units.length;
			$luck.find('.luck-unit-' + this.index).addClass('active1');
		}
	},

	roll: function() {
		var index = this.index;
		var count = this.count;
		var luck = this.obj;
		$(luck)
			.find('.luck-unit-' + index)
			.removeClass('active1');
		index += 1;
		if (index > count - 1) {
			index = 0;
		}
		$(luck)
			.find('.luck-unit-' + index)
			.addClass('active1');
		this.index = index;
		return false;
	},
	stop: function(index) {
		this.prize = index;
		return false;
	}
};

var click = false;
import common from '../assets/js/common';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'luck_draw',
	data() {
		return {
			baseCoin: 100,
			bsNum: 1,
			myCoin: 2596,
			prize_list: [
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' },
				{ img: '', txt: '' }
			],
			prizedList: [],
			activity_id: '',
			chances: 999999999999999,
			time: '',
			danmu_index: 0,
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
			ermUrl: '',
			actions: [
				{
					name: '微信分享给好友群'
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
			tipsShow: false,
			time1: '',
			time2: '',
			time3: '',
			time4: '',
			isInit: false,
			lotteryHeight: {
				width: (window.innerWidth * 0.81) / 3 + 'px!important',
				height: (window.innerWidth * 0.81) / 3 + 'px!important',
				border: '4px solid #b60714'
			},
			tabHeight: {
				width: window.innerWidth * 0.81 + 'px!important',
				height: window.innerWidth * 0.81 + 'px!important'
			},
			prizeIndex: '',
			qrcode_link:'',
			timline_qrcode_link:'',
			shareData:null
		};
	},
	methods: {
		onClickLeft: function() {
			this.Toast.clear();
			window.gbTurntable = undefined;
			this.$router.go(-1);
			this.$dialog.close();
		},
		init() {
			var that = this;
			luck.init('luck');
		},
		toSetbs(bsNum) {
			this.bsNum = bsNum;
		},

		toShare() {
			this.show = true;
		},
		onSelect(item) {
			var that = this;
			var scene_pic,timeline_pic,scene_desc,timeline_desc,scene_title,timeline_title;
			scene_pic=common.getRandomData(that.shareData.share_info.img);
			scene_title=common.getRandomData(that.shareData.share_info.title);
			scene_desc=common.getRandomData(that.shareData.share_info.desc);
			timeline_pic=common.getRandomData(that.shareData.timeline_share_info.img);
			timeline_title=common.getRandomData(that.shareData.timeline_share_info.title);
			timeline_desc=common.getRandomData(that.shareData.timeline_share_info.desc);
			switch (item.name) {
				case '微信分享给好友群':
					// 分享网页
					api.sendEvent({
						name: 'share',
						extra: {
							type: 'page',
							pic: scene_pic, // 缩略图
							contentUrl: encodeURI(that.qrcode_link), // 网页地址
							description: scene_desc, // 描述
							title: scene_title, // 标题
							scene: 'session' // session表示发送给还有，timeline表示分享朋友圈
						}
					});
					break;
				case '微信分享到朋友圈':
					// 分享网页
					api.sendEvent({
						name: 'share',
						extra: {
							type: 'page',
							pic: timeline_pic, // 缩略图
							contentUrl: encodeURI(that.timline_qrcode_link), // 网页地址
							description: timeline_desc, // 描述
							title: timeline_title, // 标题
							scene: 'timeline' // session表示发送给还有，timeline表示分享朋友圈
						}
					});
					break;
				case '分享二维码':
					that.ermShow = true;
					that.show = false;
					break;
				default:
					break;
			}
		},

		onCancel() {
			this.show = false;
		},
		ermShare() {
			this.ermShow = true;

// 			// 分享图片
// 			api.sendEvent({
// 				name: 'share',
// 				extra: {
// 					type: 'image',
// 					pic: this.ermUrl // 图片地址
// 				}
// 			});
		},
		roll() {
			var that = this;
			luck.times += 1;
			luck.roll();
			var prize_index;
			if (luck.times > luck.cycle + 10 && luck.prize == luck.index) {
				console.log('index',that.prizeIndex)
				that.$toast('恭喜抽中'+that.prize_list[that.prizeIndex].txt);
				clearTimeout(luck.timer);
				luck.prize = -1;
				luck.times = 0;
				click = false;
			} else {
				if (luck.times < luck.cycle) {
					luck.speed -= 10;
				} else if (luck.times == luck.cycle) {
					
				} else {
					if (luck.times > luck.cycle + 10 && ((luck.prize == 0 && luck.index == 9) || luck.prize == luck.index + 1)) {
						luck.speed += 110;
					} else {
						luck.speed += 20;
					}
				}
				if (luck.speed < 40) {
					luck.speed = 40;
				}

				luck.timer = setTimeout(that.roll, luck.speed);
			}
			return false;
		}
	},
	created() {},
	activated() {
		clearTimeout(this.time);
		this.checkRoute();
		this.tipsShow = false;
		this.left_chances=common.getVal('userInfo').prize_chance;
		var that = this;
		if (that.$store.state.data != '') {
			that.ermUrl = that.$store.state.qrcode_img;
			that.qrcode_link=that.$store.state.qrcode_link;
			that.timline_qrcode_link=that.$store.state.timeline_qrcode_link;
			that.shareData=that.$store.state.data;
		} else {
			common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
				if(res.err_code==0){
					that.ermUrl = res.data.qrcode_img;
					that.$store.commit('SETIMG', res.data.qrcode_img);
					that.qrcode_link=res.data.qrcode_link;
					that.timline_qrcode_link=res.data.timeline_qrcode_link;
					that.shareData=res.data;
					that.$store.commit('SETLINK', res.data.qrcode_link);
					that.$store.commit('SETLINK_TIMELINE', res.data.timeline_qrcode_link);
					that.$store.commit('SETDATA',res.data);
				}
			});
		}
		$('#app').on('click', '#btn', function() {
			if (click) {
				return false;
			} else {
				click=true;
				// 获取中奖信息
				common.toAjax(
					common.host + '/prizes/get_prize',
					{
						rize: that.bsNum,
						act_id: that.activity_id
					},
					function(res) {
						if (res.err_code != 800) {
							if (res.err_code == 0) {
								var id = res.data.prize_id;
								var prize = -1;
								that.left_chances = res.data.left_chances;
								for (var i in that.prize_list) {
									if (that.prize_list[i].id == id) {
										console.log('i--------------',i)
										that.prizeNum = i;
										luck.prize = i - 2;
										prize = i - 1;
										luck.speed = 100;
										that.prizeIndex=i;
										that.roll();
										return false;
									}
								}
							} else {
								that.$toast(res.err_msg);
							}
						} else {
							that.$toast(res.err_msg);
							setTimeout(function() {
								that.$router.push('/login');
							}, 1000);
						}
					}
				);
			}
		});
		if (!that.isInit) {
			common.toAjax(
				common.host + '/activity/info',
				{ type: 'luck_draw' },
				function(res) {
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							that.activity_id = res.data.id;
							that.share_host = res.data.share_host;
							$('.ruleContent').html(res.data.activity.rule);
							common.toAjax(common.host + '/prizes/list', { activity_id: that.activity_id }, function(res) {
								if (res.err_code != 800) {
									if (res.err_code == 0) {
										that.Toast.clear();
										that.prize_list = res.data.prize_list;
										that.left_chances = res.data.left_chances;
										that.init();
										that.isInit = true;
									} else {
										that.$toast(res.err_msg);
									}
								} else {
									that.$toast(res.err_msg);
									setTimeout(function() {
										that.$router.push('/login');
									}, 1000);
								}
							});
						} else {
							that.$dialog
								.alert({
									title: '温馨提醒',
									message: res.err_msg,
									confirmButtonText: '点击返回上一页'
								})
								.then(() => {
									that.$dialog.close();
									that.Toast.clear();
									// that.$router.go(-1);
								});
							$('body').removeClass('van-toast--unclickable');
						}
					} else {
						that.$toast(res.err_msg);
						setTimeout(function() {
							that.$router.push('/login');
						}, 1000);
					}
				},
				that
			);
			$('.gb-turntable-btn').removeClass('disabled');
		}
		common.toAjax(common.host + '/prizes/latest_prized', {}, function(res) {
			if (res.err_code != 800) {
				if (res.err_code == 0) {
					that.prizedList = res.data;

					var count = 0;
					plane();
					function plane() {
						var name1 = (that.prizedList[count].name ? that.prizedList[count].name : that.prizedList[count].tel).substring(0, 5);
						var name2 = (that.prizedList[count + 1].name ? that.prizedList[count + 1].name : that.prizedList[count + 1].tel).substring(0, 5);
						var str1 =
							`<p style="width: 300px;overflow: hidden;text-overflow: ellipsis;-o-text-overflow: ellipsis;white-space:nowrap;">恭喜<span class="redTxt">` +
							name1 +
							`</span>,获得<span class="redTxt">` +
							that.prizedList[count].prize_name +
							`</span>  ` +
							that.prizedList[count].get_time;+`</p>`
						var str2 =
							`<p style="width: 240px;overflow: hidden;text-overflow: ellipsis;-o-text-overflow: ellipsis;white-space:nowrap;">恭喜<span class="redTxt">` +
								name2 +
								`</span>,获得<span class="redTxt">` +
								that.prizedList[count + 1].prize_name +
								`</span>  ` +
								that.prizedList[count + 1].get_time;+`</p>`

						$('#plane1').html(str1);
						$('#plane2').html(str2);
						$('#plane2Img').prop('src', that.prizedList[count + 1].img);

						count += 2;
						clearTimeout(that.time);

						if (count > 9) {
							count = 0;
						}
						that.time = setTimeout(function() {
							plane();
						},10000);
					}
				} else {
					that.$toast(res.err_msg);
				}
			} else {
				that.$toast(res.err_msg);
				setTimeout(function() {
					that.$router.push('/login');
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
	background: url('https://qiniustore.zmr016.com/quzhuan/imgs/wheel_bg.png') no-repeat;
	background-size: cover;
	position: relative;
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

.myCoin {
	position: absolute;
	width: 240px;
	height: 30px;
	line-height: 30px;
	top: 8%;
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
	padding: 0 15% 1%;
}
.van-nav-bar {
	z-index: 9999 !important;
}

.danmu {
	position: fixed;
	left: 0;
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
	animation: danmu 10s ease-in-out infinite;
}

.planeContent {
	position: relative;
}
.planeContent img {
	width: 510px;
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
	height: 40px;
	line-height: 40px;
	font-size: 12px;
	background: #f4cd1c;
	border-radius: 5px;
	border: none;
	color: #de480d;
}
/*九宫格转盘UI样式*/
.mainBody {
	width: 83%;
	margin: 70px auto 10px;
	background: #b60714;
	border-radius: 10px;
	padding: 1%;
}
#luck {
	width: 98%;
	background-size: 100%;
	background-repeat: no-repeat;
	margin: 1%;
}
#btn .cjBtn,
.active1,
td {
	width: 27%;
	background-repeat: no-repeat;
	background-size: 100% 100%;
}
.luck-unit p {
	font-weight: bold;
}
#btn.cjBtn {
	background-image: url(../assets/img/cjBtn.png);
	background-size: 100% 100%;
}
#luck .active1 {
	background-image: url(../assets/img/active.png);
}

td {
	text-align: center;
	background-image: url(../assets/img/proBj.png);
	background-size: 100% 100%;
}
td img {
	width: 40%;
	margin: 0 auto;
}
table {
	margin: 0 auto;
}
@-webkit-keyframes danmu {
	from {
		visibility: visible;
		-webkit-transform: translateX(500px);
	}
	to {
		visibility: visible;
		-webkit-transform: translateX(-100%);
	}
}
</style>
