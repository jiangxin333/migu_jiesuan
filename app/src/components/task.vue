<template>
	<div class="task" :style="styleH">
		<div class="bgHead">
			<div>
				<img class="bgImg" src="https://qiniustore.zmr016.com/task_center/bac1.png" alt="" />
				<img class="hea_img" v-if="img" :src="img" alt="" />
				<p class="userName">{{ name }}</p>
			</div>
			<div class="myEarnings">
				<p class="title">我的收益</p>
				<div class="earnings">
					<div @click="toCash">
						<p>当前余额&nbsp;&nbsp;(元)</p>
						<span>{{ balance / 100 }}</span>
					</div>
					<div @click="toCash">
						<p>今日收益&nbsp;&nbsp;(元)</p>
						<span>{{ today_money / 100 }}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 签到 -->
		<div class="sign">
			<div class="signLis1">
				<div v-for="(item, index) in signList" :key="index" class="signDay">
					<!-- 已签到显示 -->
					<div v-if="index > signDay - 1" class="box1" :class="'signBox' + index">
						<p style="padding-top: 5px;">{{ date[index] }}</p>
						<div style="margin-top: 5px; padding: 2px 0 5px 0;">
							<span>{{ item.value }}</span>
							<img v-if="index > signDay - 1" src="../assets/img/task/111.png" alt="" />
							<img v-else src="../assets/img/task/222.png" alt="" />
						</div>
					</div>
					<!-- 未签到显示 -->
					<div v-else class="box2" :class="'signBox' + index">
						<p style="padding-top: 5px;">{{ date[index] }}</p>
						<div style="margin-top: 5px; padding: 2px 0 5px 0;">
							<span>{{ item.value }}</span>
							<img v-if="index > signDay - 1" src="../assets/img/task/111.png" alt="" />
							<img v-else src="../assets/img/task/222.png" alt="" />
						</div>
					</div>
				</div>
			</div>
			<div class="signLis2">
				<div>
					<!-- 签到金额 -->
					<p style="font-size: 36px;">{{ signMoney }}</p>
					<p style="font-size: 14px; color: #333">
						当前签到可获得&nbsp;&nbsp;
						<span style="font-weight: 700;">|</span>
						&nbsp;&nbsp;连续签到&nbsp;
						<span style="color: #B33630;font-weight: 700;">{{ signDay }}</span>
						&nbsp;天
					</p>
				</div>
				<van-button style="height: 35px;line-height: 35px;" round type="danger" @click="dayGet(0,'sign')" v-if="signed == 0">签到领取</van-button>
				<van-button style="height: 35px;line-height: 35px;" round type="danger" :style="styleBtn" v-else>&nbsp;&nbsp;已领取&nbsp;&nbsp;</van-button>
			</div>
		</div>
		<!-- 新手任务 -->
		<div class="newTask" v-if="taskOk">
			<p class="title" style="padding-bottom: 10px;">新手任务</p>
			<div class="newTaskList">
				<van-cell :center="true" to="" :border="false" v-for="(item1, index) in newTaskList" :key="index">
					<template slot="title">
						<div style="font-weight: 700; font-size: 14px; position: relative;">
							{{ item1.title[0] }}
							<img @click="popupMsg(item1.title[2])" class="imgIcon" src="http://qzjiesuan.oss-cn-hangzhou.aliyuncs.com/front/renwu/img/999.png"
							 alt="" />
						</div>
						<p style="color: #FF3131; font-size: 12px;">{{ item1.title[1] }}</p>
					</template>
					<img :src="item1.title[3]" slot="icon" class="iconImg" alt="" />
					<van-button round type="danger" size="small" :id="item1.name" @click="newGet(1,item1.name, item1.title[4],index)" v-if="item1.is == 0">{{ getMst }}</van-button>
					<van-button round type="danger" size="small" :id="item1.name" :style="styleBtn" v-else>已领取</van-button>
				</van-cell>
			</div>
		</div>
		<!-- 日常任务 -->
		<div class="everydayTask">
			<p class="title" style="padding-bottom: 10px;">日常任务</p>
			<div class="everydayTaskList">
				<van-cell :center="true" to="" :border="false" v-for="(item2, index) in everydayTaskList" :key="index">
					<template slot="title">
						<div style="font-weight: 700; font-size: 14px; position: relative;">
							{{ item2.title[0] }}
							<img @click="popupMsg(item2.title[2])" class="imgIcon" src="http://qzjiesuan.oss-cn-hangzhou.aliyuncs.com/front/renwu/img/999.png"
							 alt="" />
						</div>
						<p style="color: #FF3131; font-size: 12px;">{{ item2.title[1]}}</p>
					</template>
					<img :src="item2.title[3]" slot="icon" class="iconImg" alt="" />
					<van-button round type="danger" size="small" @click="dayGet(2,item2.name, item2.value,index)">{{ getMst }}</van-button>
				</van-cell>
			</div>
		</div>
		<!-- 推荐分享 -->
		<div class="share" v-if="!taskOk">
			<p class="title" style="padding-bottom: 10px;">推荐分享</p>
			<div class="listCard" v-for="(listitem, listIndex) in articleList" :key="listIndex" :id="listitem.article_id" @click="goArticle(listitem.article_id, listitem.is_video)">
				<van-row>
					<van-col span="24">
						<van-row type="flex" justify="space-between">
							<van-col span="15">
								<van-row>
									<van-col span="24">
										<div style="height:40px;margin-bottom: 30px;">
											<span class="articleTitle" :style="'font-weight:' + listitem.list_title_bold + ';color:' + listitem.list_title_color + ';'">
												{{ listitem.title }}
											</span>
										</div>
									</van-col>
								</van-row>
								<van-row type="flex" align="bottom">
									<van-col span="6">
										<img :src="listitem.icon" alt class="articleType" style="margin-right: 5px;" />
										<span class="articleType_txt">{{ listitem.tag_name }}</span>
									</van-col>
									<van-col span="18">
										<span class="redTxt" style="float: right;margin-right: 10px;">分享浏览收益{{ listitem.view_money / 100 }}元/次</span>
										<!-- <span class="grayTxt" style="float: right;">分享所得：</span> -->
									</van-col>
								</van-row>
							</van-col>
							<van-col span="8"><img :src="listitem.img_array[0]" alt class="listitemImg" /></van-col>
						</van-row>
					</van-col>
				</van-row>
			</div>
			<p class="more" @click="more">更多阅读&nbsp;...</p>
		</div>
		<van-popup v-model="showMsg" :close-on-click-overlay="false">
			<div>
				<p style="font-weight: 700; font-size: 18px; margin: 10px 0 0 20px;">提示</p>
				<p style="margin: 5px 0 0 20px">{{ msg }}</p>
			</div>
			<span style="position: absolute; bottom: 5px; right: 15px; color: #007AFF;font-size: 14px;" @click="hiddenPopup">我知道了</span>
		</van-popup>
	</div>
</template>

<script>
	import common from '../assets/js/common.js';
	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my', 'task'],
		name: 'task',
		data() {
			return {
				msg: '',
				getMst: '领取',
				time: '',
				styleH: {
					height: window.innerHeight,
					'padding-bottom': '60px',
					'background-color': '#f0f0f0'
				},
				styleBtn: {
					'border-color': '#d6d6d6',
					'background-color': '#d6d6d6'
				},
				date: ['第一天', '第二天', '第三天', '第四天', '第五天', '第六天', '第七天'],
				balance: '', //今日收益
				today_money: '', //当前余额
				newTaskList: '', //新手任务数据
				everydayTaskList: '', //每日任务数据
				taskOk: true, //是否完成新手全部任务
				userInfo: null, //用户信息
				showMsg: false, //是否显示弹出框
				img: '', //用户头像
				name: '', //用户名
				signDay: 0, //签到天数
				signList: '', //签到数据
				signed: 0, //是否签到，
				signMoney: 0, //签到金额
				articleList: '', //推荐列表数据
				ermUrl: '', //收徒-分享微信群或者朋友的图片地址
				ermUrl_timeline:'',//收徒-分享朋友圈的图片地址
				shareType: 'share', //伪装应用开关,
				article_id: '', //文章id
				shareTitle: '', //分享文章使用的标题
				shareImg: '', //分享文章使用的图片地址
				shareLink: '', //分享文章的分享初始地址
				login_key: '', //分享文章用的login_key
				isFrame: true, //控制新开webview个数
			};
		},
		methods: {
			toCash() {
				this.$router.push('/cash_withdrawal');
			},
			popupMsg(name) {
				this.msg = name;
				this.showMsg = true;
			},
			hiddenPopup() {
				this.showMsg = false;
			},
			getMoney(type,index) {
				if(type==0){
					this.signList.signed=1;
				}else if(type=="1"){
					this.newTaskList[index].is=1;
				}else{
					this.everydayTaskList[index].is=1;
				}
			},
			newGet(type1,name, type,index) {
				var that = this;
				if (type == 'shoutu' || type == 'article') {
					switch (type) {
						case 'shoutu':
							that.mentorInfo(type1,name,index);
							break;
						case 'article':
							that.articleInfo(type1,name,index);
							break;
						default:
							break;
					}
				} else {
					that.getnewpriz(type1,name,index);
				}
			},
			getnewpriz(type,name,index) {
				var that = this;
				common.toAjax(
					common.host + '/task/getnewpriz', {
						name: name
					},
					function(res) {
						if (res.err_code != 2000) {
							if (res.err_code == 1987) {
								that.$dialog.confirm({
									title: '温馨提醒',
									message: res.err_msg
								}).then(() => {
									that.toCash();
								})
							} else {
								if (name == "share_timeline" || name == "share_friend") {
									setTimeout(function() {
										that.$dialog.alert({
											message: res.err_msg
										});
										that.getMoney(type,index)
									}, 5000)
									that.today_money = res.data.today_money;
									that.balance = res.data.balance;
									that.taskOk = res.data.isnewtask;
									if (!that.taskOk) {
										that.$http.get(common.host + '/article/list?type=1&page=1&task=task').then(({
											data
										}) => {
											if (data.err_code == 0) {
												that.articleList = data.data;
											} else {
												that.$toast(data.err_msg);
											}
										});
									}
								} else {
									that.$toast(res.err_msg);
									that.getMoney(type,index)
									that.today_money = res.data.today_money;
									that.balance = res.data.balance;
									console.log(res.data.isnewtask,2222);
									that.taskOk = res.data.isnewtask;
									if (!that.taskOk) {
										that.$http.get(common.host + '/article/list?type=1&page=1&task=task').then(({
											data
										}) => {
											if (data.err_code == 0) {
												that.articleList = data.data;
											} else {
												that.$toast(data.err_msg);
											}
										});
									}
								}
							}
						} else {
							that.$toast(res.err_msg);
						}
					}
				);
			},
			articleInfo(type,name,index) {
				console.log('article_info', name)
				var that = this;
				common.toAjax(common.host + '/article/info', {
					article_id: 'duty'
				}, function(res) {
					if (res.err_code == 0) {
						that.$nextTick(function() {
							that.shareTitle = res.data.title;
							that.shareLink = res.data.link;
							that.shareImg = res.data.shareImg;
							that.shareDesc = res.data.desc;
							that.login_key = res.data.login_key;
							that.article_id = res.data.article_id;
							that.articleShare(type,name,index)
						});
					}
				});
			},
			articleShare(type,name,index) {
				var that = this;
				console.log('article share', name)
				switch (name) {
					case 'share_friend':
						common.toAjax(
							common.host + '/sharelog/info', {
								article_id: that.article_id,
								title: that.shareTitle,
								img: that.shareImg,
								link: encodeURIComponent(that.shareLink),
								login_key: that.login_key,
								type: 'scene'
							},
							function(res) {
								that.show = false;
								var rand_no = res.data.rand_no;
								//短链接模式开始
								var shortLink;
								common.toAjax(
									common.host + '/api/outapi/mcrypturl', {
										url: encodeURIComponent(that.shareLink + '&rand_no=' + rand_no),
										type: 'scene'
									},
									function(res) {
										shortLink = res.data.url;
										// 分享网页
										api.sendEvent({
											name: that.shareType,
											extra: {
												type: 'page',
												pic: that.shareImg, // 缩略图
												contentUrl: shortLink, // 网页地址
												description: that.shareDesc, // 描述
												title: that.shareTitle, // 标题
												scene: 'session',
												timeline: false // false表示发送给好友，true表示分享朋友圈
											}
										});
										that.getnewpriz(type,name,index);
									}
								);
							}
						);

						break;
					case 'share_timeline':
						common.toAjax(
							common.host + '/sharelog/info', {
								article_id: that.article_id,
								title: that.shareTitle,
								img: that.shareImg,
								link: encodeURI(that.shareLink),
								login_key: that.login_key,
								type: 'timeline'
							},
							function(res) {
								that.show = false;
								var rand_no = res.data.rand_no;
								//短链接模式开始
								var shortLink;
								common.toAjax(
									common.host + '/api/outapi/mcrypturl', {
										url: encodeURIComponent(that.shareLink + '&rand_no=' + rand_no),
										type: 'timeline'
									},
									function(res) {
										shortLink = res.data.url;
										// 分享网页
										api.sendEvent({
											name: that.shareType,
											extra: {
												type: 'page',
												pic: that.shareImg, // 缩略图
												contentUrl: shortLink, // 网页地址
												description: that.shareDesc, // 描述
												title: that.shareTitle, // 标题
												scene: 'timeline',
												timeline: true // false表示发送给好友，true表示分享朋友圈
											}
										});
										that.getnewpriz(type,name,index);
									}
								);
							}
						);
						break;
					default:
						break;
				}
			},
			mentorInfo(type,name,index) {
				var that = this;
				console.log('mentor info', name)
				if (common.getVal('loginData').app_share_type != 'share') {
					that.shareType = 'fakeShare';
				}
				if (that.$store.state.qrcode_img != '' && that.$store.state.timeline_qrcode_img) {
					that.ermUrl = that.$store.state.qrcode_img;
					that.ermUrl_timeline = that.$store.state.timeline_qrcode_img;
					that.mentorShare(type,name,index);
				} else {
					common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
						if (res.err_code == 0) {
							that.ermUrl = res.data.qrcode_img;
							that.ermUrl_timeline = res.data.timeline_qrcode_img;
							that.$store.commit('SETIMG', res.data.qrcode_img);
							that.$store.commit('SETIMG_TIMELINE', res.data.timeline_qrcode_img);
							that.mentorShare(type,name,index);
							// this.show = true;
						} else {
							that.$toast(res.info);
						}
					});
				}
				
			},
			mentorShare(type,name,index) {
				var that = this;
				console.log('mentor share', name)
				switch (name) {
					case 'share_friend':
						if (that.ermUrl != '') {
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
							that.getnewpriz(type,name,index);
						}
						break;
					case 'share_timeline':
						if (that.ermUrl_timeline != '') {
							// 分享图片
							api.sendEvent({
								name: that.shareType,
								extra: {
									type: 'image',
									scene: 'timeline',
									timeline: true, // false表示发送给还有，true表示分享朋友圈
									pic: that.ermUrl_timeline // 图片地址
								}
							});
							that.getnewpriz(type,name,index);
						}
						break;
					default:
						break;
				}
			},
			dayGet(type,name,value,index) {
				var that = this;
				console.log(name);
				if (name == 'sign') {
					common.toAjax(
						common.host + '/signs/sign', {
							name: name
						},
						function(res) {
							if (res.err_code != 2000) {
								that.getMoney(type,index);
								that.$toast(res.err_msg);
								that.today_money = res.data.today_money;
								that.balance = res.data.balance;
								console.log(that.signDay, '签到天数1');
								that.signDay += 1;
								if (that.signDay >= that.signList.length) {
									that.signMoney = that.signList[that.signList.length - 1].value;
									console.log(that.signMoney, 112233);
								} else {
									that.signMoney = that.signList[that.signDay].value;
									console.log(that.signMoney, 223344);
								}
								console.log(that.signDay, '签到天数2');
								that.signed = 1;
							} else {
								that.$toast(res.err_msg);
							}
						}
					);
				} else {
					common.goLink(value, that);
				}
			},
			goArticle(id, $video) {
				var that = this;
				if ($video == 1) {
					if (that.isFrame) {
						that.isFrame = false;
						setTimeout(function() {
							that.isFrame = true;
						}, 1000);
						var url = location.protocol + '//' + location.host + '/article/article_share_app.html?article_id=' + id;
						api.sendEvent({
							name: 'openWin',
							extra: {
								url: url // 需要http开头的完整url
							}
						});
					}
				} else {
					this.$router.push({
						path: '/money_article/' + id
					});
				}
			},
			more() {
				this.$router.push('/article');
			}
		},
		activated() {
			this.checkRoute();
			this.task();
			var that = this;
			this.userInfo = common.getVal('userInfo');
			this.img = this.userInfo.img;
			this.name = this.userInfo.name;
			this.balance = this.userInfo.balance;
			this.today_money = this.userInfo.today_money;
			console.log(this.balance, this.today_money);
			console.log(this.userInfo, 3333);
			common.toAjax(common.host + '/task/getlist', {}, function(res) {
				that.$toast.clear();
				if (res.err_code == 0) {
					//新手任务数据
					that.newTaskList = res.data.new;
					console.log(that.newTaskList, 11111111);
					//每日任务数据
					that.everydayTaskList = res.data.day;
					console.log(that.everydayTaskList, 2222222);
					//新手任务是否完成
					that.taskOk = res.data.isnewtask;
					// that.taskOk = false;
					//判断新手任务完成显示推荐分享
					if (!that.taskOk) {
						that.$http.get(common.host + '/article/list?type=1&page=1&task=task').then(({
							data
						}) => {
							if (data.err_code == 0) {
								that.articleList = data.data;
							} else {
								that.$toast(data.err_msg);
							}
						});
					}
					//判断到有驳回信息，并且新手任务未完成则提示驳回信息
					if (res.data.apply_fail_tip != undefined && res.data.apply_fail_tip != '' && that.taskOk) {
						that.$dialog
							.confirm({
								title: '温馨提示',
								message: res.data.apply_fail_tip,
								showConfirmButton: true,
								showCancelButton: false,
								confirmButtonText: '去分享'
							})
							.then(() => {
								common.goLink('/mentor',that)
							});
					}
					//签到列表数据
					that.signList = res.data.sign.money;
					//今日是否签到
					that.signed = res.data.sign.signed;
					//已签到天数
					that.signDay = res.data.sign.day;
					if (that.signDay >= that.signList.length) {
						that.signMoney = that.signList[that.signList.length - 1].value;
					} else {
						that.signMoney = that.signList[that.signDay].value;
					}
					//测试签到天数
					// var i = 6
					// that.signDay = i;
					// if (i >= that.signList.length) {
					// 	console.log(i,222);
					// 	console.log(that.signList.length -1,333333333);
					// 	that.signMoney = that.signList[that.signList.length -1].value;
					// } else {
					// 	that.signMoney = that.signList[i].value;
					// 	console.log(i,1111);
					// }
				}
			}, that);
		}
	};
</script>

<style scoped>
	.bgHead {
		position: relative;
		margin-bottom: 12%;
	}

	.title {
		padding: 18px 0 18px 12px;
		font-size: 18px;
		font-weight: 700;
	}

	.bgHead .myEarnings {
		position: absolute;
		width: 94%;
		height: 52%;
		top: 60%;
		left: 3%;
		border-radius: 8px;
		background-color: #fff;
		z-index: 5;
	}

	.bgHead .myEarnings .earnings {
		display: flex;
		justify-content: space-around;
		text-align: center;
		font-size: 14px;
		color: #999999;
	}

	.bgHead .myEarnings .earnings span {
		color: #000;
		font-size: 20px;
	}

	.bgImg {
		width: 100%;
		position: relative;
	}

	/* 签到 */
	.sign {
		width: 94%;
		margin: 0 3%;
		background-color: #fff;
		border-radius: 8px;
	}

	.signLis1 {
		display: flex;
		justify-content: space-between;
		color: #f3f3f3;
		background-color: #d1d1d1;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.signLis2 {
		margin-top: 30px;
		display: flex;
		justify-content: space-between;
		padding: 0 10px 10px;
	}

	.signDay {
		width: 13.5%;

		text-align: center;
	}

	.signDay img {
		width: 10px;
		padding-left: 2px;
	}

	.box2 {
		background-color: #fff;
		color: #000000;
	}

	.box1 {
		background-color: #2e2e2e;
	}

	.signBox0 {
		border-top-left-radius: 8px;
	}

	.signBox6 {
		border-top-right-radius: 8px;
	}

	/* 新手任务 */
	.newTask {
		width: 94%;
		margin: 5% 0 0 3%;
		background-color: #fff;
		border-radius: 8px;
	}

	.iconImg {
		width: 40px;
		margin-right: 10px;
	}

	.van-button {
		height: 25px;
		line-height: 25px;
	}

	.everydayTask {
		width: 94%;
		margin: 5% 0 0 3%;
		background-color: #fff;
		border-radius: 8px;
	}

	.imgIcon {
		width: 16px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 5px;
	}

	.van-popup {
		width: 90%;
		height: 120px;
		font-size: 16px;
		border-radius: 8px;
	}

	.hea_img {
		position: absolute;
		width: 55px;
		top: 25%;
		left: 4%;
		z-index: 5;
		border-radius: 50%;
		border: 2px solid #fff;
	}

	.userName {
		position: absolute;
		top: 0;
		top: 33%;
		left: 25%;
		color: #fff;
		font-size: 20px;
	}

	/*  推荐分享*/
	.share {
		width: 94%;
		margin: 5% 0 0 3%;
		background-color: #fff;
		border-radius: 8px;
	}

	.listCard {
		display: inline-block;
		margin: 5px 3% 0;
		width: 94%;
	}

	.articleTitle {
		font-size: 16px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.articleType {
		width: 12px;
		height: 12px;
		display: inline-block;
		vertical-align: middle;
	}

	.articleType_txt {
		font-size: 12px;
		display: inline-block;
		vertical-align: middle;
		margin: 0 2px;
	}

	.articleType_price {
		font-size: 12px;
		float: right;
		margin-top: 2px;
	}

	.listitemImg {
		width: 100%;
		height: 90px;
		border-radius: 6px;
		background: #000;
	}

	.more {
		padding: 30px 0 10px;
		text-align: center;
		color: #666666;
	}
</style>
