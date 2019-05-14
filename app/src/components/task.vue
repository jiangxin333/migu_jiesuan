<template>
	<div class="task" :style="styleH">
		<div class="bgHead">
			<div>
				<img class="bgImg" src="https://qiniustore.zmr016.com/task_center/bac1.png" alt="">
				<img class="hea_img" v-if="img" :src="img" alt="" />
				<p class="userName">{{ name }}</p>
			</div>
			<div class="myEarnings">
				<p class="title">我的收益</p>
				<div class="earnings">
					<div>
						<p>当前余额&nbsp;&nbsp;(元)</p>
						<span>{{balance / 100}}</span>
					</div>
					<div>
						<p>今日收益&nbsp;&nbsp;(元)</p>
						<span>{{today_money / 100}}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 签到 -->
		<div class="sign">
			<div class="signLis1">
				<div v-for="(item,index) in signList" :key="index" class="signDay">
					<!-- 已签到显示 -->
					<div v-if="index > signDay - 1" class="box1" :class="'signBox' + index ">
						<p style="padding-top: 5px;">{{date[index]}}</p>
						<div style="margin-top: 5px; padding: 2px 0 5px 0;">
							<span>{{item.value}}</span>
							<img v-if="index > signDay - 1" src="../assets/img/task/111.png" alt="">
							<img v-else src="../assets/img/task/222.png" alt="">
						</div>
					</div>
					<!-- 未签到显示 -->
					<div v-else class="box2" :class="'signBox' + index ">
						<p style="padding-top: 5px;">{{date[index]}}</p>
						<div style="margin-top: 5px; padding: 2px 0 5px 0;">
							<span>{{item.value}}</span>
							<img v-if="index > signDay - 1" src="../assets/img/task/111.png" alt="">
							<img v-else src="../assets/img/task/222.png" alt="">
						</div>
					</div>
				</div>
			</div>
			<div class="signLis2">
				<div>
					<!-- 签到金额 -->
					<p style="font-size: 36px;">{{signMoney}}</p>
					<p style="font-size: 14px; color: #333">当前签到可获得&nbsp;&nbsp;<span style="font-weight: 700;">|</span>&nbsp;&nbsp;连续签到&nbsp;<span
						 style="color: #B33630;font-weight: 700;">{{signDay}}</span>&nbsp;天</p>
				</div>
				<van-button style="height: 35px;box-shadow: 0px 0px 18px #CE1409;" round type="danger" @click="dayGet('sign')" v-if="signed == 0">签到领取</van-button>
				<van-button style="height: 35px;box-shadow: 0px 0px 36px #d6d6d6;" round type="danger" :style="styleBtn" v-else>&nbsp;&nbsp;已领取&nbsp;&nbsp;</van-button>
			</div>
		</div>
		<!-- 新手任务 -->
		<div class="newTask" v-if="taskOk">
			<p class="title" style="padding-bottom: 10px;">新手任务</p>
			<div class="newTaskList">
				<van-cell :center="true" to="" :border="false" v-for="(item1,index) in newTaskList" :key="item1.index">
					<template slot="title">
						<div style="font-weight: 700; font-size: 14px; position: relative;">
							{{item1.title[0]}}
							<img @click="popupMsg(item1.title[2])" class="imgIcon" src="http://qzjiesuan.oss-cn-hangzhou.aliyuncs.com/front/renwu/img/999.png"
							 alt="">
						</div>
						<p style="color: #FF3131; font-size: 12px;">{{item1.title[1]}}</p>
					</template>
					<img :src="item1.title[3]" slot="icon" class="iconImg" alt="" />
					<van-button round type="danger" size="small" :style="" :id="item1.name" @click="newGet(item1.name,item1.value)"
					 v-if="item1.is == 0">{{getMst}}</van-button>
					<van-button round type="danger" size="small" :id="item1.name" :style="styleBtn" v-else>已领取</van-button>
				</van-cell>
			</div>
		</div>
		<!-- 日常任务 -->
		<div class="everydayTask">
			<p class="title" style="padding-bottom: 10px;">日常任务</p>
			<div class="everydayTaskList">
				<van-cell :center="true" to="" :border="false" v-for="(item2,index) in everydayTaskList" :key="index">
					<template slot="title">
						<div style="font-weight: 700; font-size: 14px; position: relative;">
							{{item2.title[0]}}
							<img @click="popupMsg(item2.title[2])" class="imgIcon" src="http://qzjiesuan.oss-cn-hangzhou.aliyuncs.com/front/renwu/img/999.png"
							 alt="">
						</div>
						<p style="color: #FF3131; font-size: 12px;">{{item2.title[1]}}</p>
					</template>
					<img :src="item2.title[3]" slot="icon" class="iconImg" alt="" />
					<van-button round type="danger" size="small" :style="" :id="item2.name" @click="dayGet(item2.name,item2.value)"
					 v-if="item2.is == 0">{{getMst}}</van-button>
					<van-button round type="danger" size="small" :style="styleBtn" :id="item2.name" v-else>已领取</van-button>
				</van-cell>

			</div>
		</div>
		<!-- 推荐分享 -->
		<div class="share" v-if="!taskOk">
			<p class="title" style="padding-bottom: 10px;">推荐分享</p>
			<div class="listCard" v-for="(listitem, listIndex) in articleList" :key="listIndex" :id="listitem.article_id"
			 @click="goArticle(listitem.article_id, listitem.is_video)">
				<van-row>
					<van-col span="24">
						<van-row type="flex" justify="space-between">
							<van-col span="15">
								<van-row>
									<van-col span="24">
										<div style="height:40px;margin-bottom: 30px;">
											<span
												class="articleTitle"
												:style="'font-weight:' + listitem.list_title_bold + ';color:' + listitem.list_title_color + ';'"
											>
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
				<p style="margin: 5px 0 0 20px">{{msg}}</p>
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
					"padding-bottom": "60px",
					"background-color": "#f0f0f0"
				},
				styleBtn: {
					"border-color": "#d6d6d6",
					"background-color": "#d6d6d6"
				},
				date: ["第一天", "第二天", "第三天", "第四天", "第五天", "第六天", "第七天"],
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
				articleList: ''//推荐列表数据
			}
		},
		methods: {
			popupMsg(name) {
				this.msg = name;
				this.showMsg = true;
			},
			hiddenPopup() {
				this.showMsg = false;
			},
			getMoney(name) {
				$("#" + name).html("已领取");
				$("#" + name).css({
					"border-color": "#d6d6d6",
					"background-color": "#d6d6d6"
				})
			},
			newGet(name, value) {
				var that = this;
				common.toAjax(common.host + '/task/getnewpriz', {
					name: name
				}, function(res) {
					if (res.err_code != 2000) {
						console.log("新手任务")
						that.getMoney(name);
						that.$toast(res.err_msg);
						that.today_money = res.data.today_money;
						that.balance = res.data.balance;
					} else {
						that.$toast(res.err_msg);
					}
				})
			},
			dayGet(name, value) {
				var that = this;
				console.log(name);
				if (name == "sign") {
					common.toAjax(common.host + '/signs/sign', {
						name: name
					}, function(res) {
						if (res.err_code != 2000) {
							that.getMoney(name);
							that.$toast(res.err_msg);
							that.today_money = res.data.today_money;
							that.balance = res.data.balance;
							that.signed = 1;
						} else {
							that.$toast(res.err_msg);
						}
					})
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
						var url = 'http://' + location.host + '/article/article_share_app.html?article_id=' + id;
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
			clearInterval(this.time);
			if (!common.getVal('isLogin') != undefined && common.getVal('isLogin') == false) {
				setTimeout(function() {
					that.$router.push('/my');
					// common.login(that);
					return;
				}, 300);
			};
			this.userInfo = common.getVal('userInfo');
			this.img = this.userInfo.img;
			this.name = this.userInfo.name;
			this.balance = this.userInfo.balance;
			this.today_money = this.userInfo.today_money;
			console.log(this.balance, this.today_money);
			console.log(this.userInfo, 3333);
			common.toAjax(common.host + '/task/getlist', {}, function(res) {
				if (res.err_code == 0) {
					//新手任务数据
					that.newTaskList = res.data.new;
					console.log(that.newTaskList, 11111111);
					//每日任务数据
					that.everydayTaskList = res.data.day;
					console.log(that.everydayTaskList, 2222222)
					//新手任务是否完成
					that.taskOk = res.data.isnewtask;
					// that.taskOk = false;
					//判断新手任务完成显示推荐分享
					if (!that.taskOk) {
						that.$http.get(common.host + '/article/list?type=1&page=1&task=task')
						.then(({ data }) => {
							if (data.err_code == 0) {
								that.articleList = data.data;
							} else {
								that.$toast(data.err_msg);
							}
						})
					};
					//签到列表数据
					that.signList = res.data.sign.money;
					//今日是否签到
					that.signed = res.data.sign.signed;
					//已签到天数
					that.signDay = res.data.sign.day;
					if (res.data.sign.day >= 7) {
						that.signMoney = that.signList[that.signList.length - 1].value;
					} else {
						that.signMoney = that.signList[that.signDay].value;
					}
					//测试签到天数
					// var i = 6
					// that.signDay = i;
					// if (i >= 7) {
					// 	console.log(i,222);
					// 	console.log(that.signList.length -1,333333333);
					// 	that.signMoney = that.signList[that.signList.length -1].value;
					// } else {
					// 	that.signMoney = that.signList[i].value;
					// 	console.log(i,1111);
					// }
				}
			});
		}
	}
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
		color: #F3F3F3;
		background-color: #D1D1D1;
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
