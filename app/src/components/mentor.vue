<template>
	<div class="navTop" style="padding-bottom: 60px">
		<van-nav-bar
			title="师徒"
			:left-text="has_sf == 1 ? '我的师傅' : ''"
			@click-left="onClickLeft"
			fixed
		/>
		<img src="https://qiniustore.zmr016.com/quzhuan/imgs/news.jpg" alt class="mentor-adImg" @click="toApprentice" />
		<div id="btn">
			<van-button type="primary" block round size="large" @click="toApprentice">
				立即收徒
			</van-button>
		</div>
		<div class="mentor-adTxt"></div>
		<div class="mentorBox" v-if="has_st == 1">
			<div class="prizeShow">
				<p>师徒今日奖励</p>
				<p>
					<span class="redTxt">{{ td_summary_info.today_money / 100 }}</span>
					元
				</p>
			</div>
			<span class="prizeLine"></span>
			<div class="prizeShow">
				<p>师徒累计奖励</p>
				<p>
					<span class="redTxt">{{ td_summary_info.finish_money / 100 }}</span>
					元
				</p>
			</div>
		</div>
		<div class="mentorBox">
			<van-row type="flex" justify="space-between" v-if="has_st == 1">
				<van-col span="14">
					<span>徒弟：</span>
					<span class="redTxt">{{ td_summary_info.user_td_count }}人</span>
					<span>徒孙：</span>
					<span class="redTxt">{{ td_summary_info.user_ts_count }}人</span>
				</van-col>
				<van-col span="10" style="text-align: left;">
					<span>待领奖励金：</span>
					<span class="redTxt">{{ td_summary_info.wait_money / 100 }}元</span>
				</van-col>
			</van-row>
			<van-row type="flex" justify="space-between" v-if="has_st == 0">
				<van-col span="11">
					<span>徒弟：</span>
					<span class="redTxt">0人</span>
					<span>徒孙：</span>
					<span class="redTxt">0人</span>
				</van-col>
				<van-col span="11">
					<span>待领奖励金：</span>
					<span class="redTxt">{{ wait_money }}元</span>
				</van-col>
			</van-row>
			<van-cell-group v-if="has_st == 0">
				<van-cell
					title="你有一个红包未领取"
					is-link
					:center="true"
					:value="wait_money + '元'"
					value-class="redTxt"
					@click="toApprentice"
				></van-cell>
				<img src="http://quzhuan.oss-cn-beijing.aliyuncs.com/img/icon%20200.png" alt />
			</van-cell-group>
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
				:immediate-check="false"
			>
				<div v-for="(item, index) in td_list" :key="index">
					<van-cell-group v-if="has_st == 1">
						<van-cell
							:title="'TA有' + item.td_count + '个徒弟'"
							:label="'转转号:' + item.tel"
							is-link
							:center="true"
							:to="'/my_apprentice/' + item.id"
							:value="item.data / 100 + '元'"
							value-class="redTxt"
						></van-cell>
						<img :src="item.img" alt />
					</van-cell-group>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script>
import common from '../assets/js/common.js';

export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'mentor',
	data() {
		return {
			active_mentor: 1,
			icon1: require('../assets/img/guagua/money.png'),
			icon2: require('../assets/img/guagua/mentor.png'),
			icon3: require('../assets/img/guagua/my.png'),
			activeIco: require('../assets/img/guagua/refresh.png'),
			has_st: 0,
			has_sf: 0,
			td_list: [],
			// ad: 'https://quzhuan.oss-cn-beijing.aliyuncs.com/img/news.png',
			ad: require('../assets/img/news.jpg'),
			td_summary_info: {
				user_td_count: 0,
				user_ts_count: 0,
				wait_money: 1300
			},
			wait_money: 13,
			actived: 1,
			qr_img: '',
			loading: false,
			finished: false,
			page: 1,
			requestLock: true //list加载更多请求锁，防止接口请求时间过长频繁触发加载事件
		};
	},
	methods: {
		onClickLeft() {
			common.goLink('/my_master', this);
		},
		toApprentice() {
			this.$router.push('/mentor_share');
		},
		onLoad() {
			var that = this;
			that.loading = true;
			if (that.requestLock) {
				that.requestLock = false;
				common.toAjax(common.host + '/user_st/td_list', { page: that.page }, function(
					ress
				) {
					that.requestLock = true;
					that.page++;
					that.loading = false;
					if (ress.status == 10004) {
						that.finished = true;
					} else {
						for (var i = 0; i < ress.data.length; i++) {
							that.td_list.push(ress.data[i]);
							console.log(that.td_list);
						}
					}
				});
			}
		}
	},
	activated() {
		var tips = common.getVal('tips');
		$('.mentor-adTxt').html(tips);
		this.checkRoute();
		this.mentors();
		var that = this;
		that.page=1;
		that.td_list=[]
		if (!common.getVal('isLogin')) {
			setTimeout(function() {
				that.$router.push('/my');
				return;
			}, 300);
		}
		common.toAjax(common.host + '/user_st/income_info', { type: 'mentor' }, function(res) {
			if (res.status != 800) {
				if (res.status == 10000) {
					that.has_st = res.data.has_st;
					that.has_sf = res.data.has_sf;
					that.td_summary_info = res.data.td_summary_info;
					that.wait_money = res.data.wait_money;
					common.setVal('shareUrl', res.data.share_host);
					if (res.data.has_st > 0) {
						common.toAjax(
							common.host + '/user_st/td_list',
							{ page: that.page },
							function(ress) {
								that.page++;
								that.td_list = ress.data;
								console.log(that.td_list);
							}
						);
					}
				} else {
					that.$toast(res.info);
				}
			} else {
				window.localStorage.isLogin = false;
			}
		});
	}
};
</script>

<style scoped>
.van-nav-bar__left > .van-nav-bar__text {
	color: #000000 !important;
}

.mentor-adImg {
	width: 100%;
	height: auto;
}

.mentor-adTxt {
	width: 100%;
	text-align: center;
	color: #999999;
}
.mentorBox {
	width: 88%;
	margin: 20px auto;
	padding: 0 4%;
	background: #ffffff;
}
.van-row {
	height: 60px;
	line-height: 60px;
	background: #ffffff;
}
.van-col:nth-child(1) {
	text-align: left;
}
.van-col:nth-child(2) {
	text-align: right;
}
.van-cell {
	height: 60px;
	padding-left: 40px;
}
.van-cell-group {
	position: relative;
}
.van-cell-group img {
	border-radius: 50%;
	position: absolute;
	width: 30px;
	height: 30px;
	top: 50%;
	left: 0;
	margin-top: -15px;
}
#btn {
	width: 50%;
	padding: 0 25%;
	height: 40px;
	position: absolute;
	top: 30%;
	text-align: center;
}
#btn > .van-button {
	width: 100%;
	height: 100%;
	border-radius: 50px;
	background: #ff5b56;
	line-height: 40px;
	border: none;
	outline: none;
	box-shadow: 1px 1px 1px red;
	color: #ffffff;
}
.prizeShow {
	width: 49%;
	display: inline-block;
	vertical-align: middle;
	text-align: center;
	margin: 20px auto;
	font-size: 16px;
}
.prizeShow p:first-child {
	margin-bottom: 10px;
}
.prizeLine {
	width: 1px;
	height: 20px;
	border-left: 1px solid #cccccc;
	display: inline-block;
	vertical-align: middle;
}
</style>
