<template>
	<div class="navTop" style="padding-bottom: 60px;">
		<van-nav-bar title="排行榜" left-arrow @click-left="onClickLeft" fixed />
		<van-row class="rankCard" v-for="(money, index) in moneyList" :key="index" v-if="isShow==0">
			<van-col span="6">
				<span>{{ index + 1 }}</span>
				<img :src="money.img" alt="" />
			</van-col>
			<van-col span="12">
				<span style="overflow: hidden;height:44px;width:100%;line-height: 44px;">{{ money.name == '' ? money.tel : money.name }}</span>
			</van-col>
			<van-col span="6" style="text-align: right;">
				<span>
					<em class="redTxt">{{ money.income_money / 100 }}</em>
					&nbsp;&nbsp;元
				</span>
			</van-col>
		</van-row>
		<van-tabs v-model="active" @change="changeTab(active)"  v-if="isShow==1">
			<van-tab title="月收益排行">
					<van-row class="rankCard" v-for="(money, index) in moneyList" :key="index">
						<van-col span="6">
							<span>{{ index + 1 }}</span>
							<img :src="money.img" alt="" />
						</van-col>
						<van-col span="12">
							<span style="overflow: hidden;height:44px;width:100%;line-height: 44px;">{{ money.name == '' ? money.tel : money.name }}</span>
						</van-col>
						<van-col span="6" style="text-align: right;">
							<span>
								<em class="redTxt">{{ money.income_money / 100 }}</em>
								&nbsp;&nbsp;元
							</span>
						</van-col>
					</van-row>
			</van-tab>
			<van-tab title="今日收益">
				<van-row class="rankCard" v-for="(mentor, index) in mentorList" :key="index">
					<van-col span="6">
						<span>{{ index + 1 }}</span>
						<img :src="mentor.img" alt="" />
					</van-col>
					<van-col span="12">
						<span style="overflow: hidden;height:44px;width:100%;line-height: 44px;">{{ mentor.name == '' ? mentor.tel : mentor.name }}</span>
					</van-col>
					<van-col span="6" style="text-align: right;">
						<span>
							<em class="redTxt">{{ mentor.today_money / 100 }}</em>
							&nbsp;&nbsp;元
						</span>
					</van-col>
				</van-row>
				<p v-if="isToday" style="text-align: center;margin-top: 20px;font-size: 24px;">今日无人上榜！</p>
			</van-tab>
		</van-tabs>
		<div
			style="position: fixed;bottom:0;width: 90%;height: 60px;background:#ff5b56;padding:0 5%;line-height: 60px;"
			v-if="isTotal"
		>
			<van-row type="flex" justify="space-between">
				<van-col span="12">
					<span class="bottomInfo">你当前的排名&nbsp;{{ income_money_rank }}</span>
				</van-col>
				<van-col span="12">
					<span class="bottomInfo infoRight">总收益&nbsp;{{ income_money }}&nbsp;元</span>
				</van-col>
			</van-row>
		</div>
		<div
			style="position: fixed;bottom:0;width: 90%;height: 60px;background:#ff5b56;padding:0 5%;line-height: 60px;"
			v-if="!isTotal&&isShow==1"
		>
			<van-row type="flex" justify="space-between">
				<van-col span="12">
					<span class="bottomInfo">你当前的排名&nbsp;{{ today_money_rank }}</span>
				</van-col>
				<van-col span="12">
					<span class="bottomInfo infoRight">今日收益&nbsp;{{ today_money }}&nbsp;元</span>
				</van-col>
			</van-row>
		</div>
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'rank',
	data() {
		return {
			active: 0,
			moneyList: [],
			mentorList: [],
			isTotal: true,
			today_money: '',
			today_money_rank: '',
			income_money: '',
			income_money_rank: '',
			isShow:common.getVal('loginData').switch.en_rank_today,
			isToday:false
		};
	},
	methods: {
		onClickLeft: function() {
			this.my();
			this.Toast.clear();
			common.goBack(this);
		},
		getRankList: function(index) {
			this.res[0].rank = index;
			for (var i = 0; i < 20; i++) {
				this.moneyList.push(this.res[0]);
				this.mentorList.push(this.res[0]);
			}
		},
		changeTab(index) {
			switch (index) {
				case 0:
					this.isTotal = true;
					break;
				case 1:
					this.isTotal = false;
					break;
				default:
					break;
			}
		}
	},
	activated() {
		var that = this;
		that.checkRoute();
		common.toAjax(
			common.host + '/users/ranking',
			{
				id: common.getVal('userInfo').id
			},
			function(res) {
				if (res.err_code != 800) {
					if (res.err_code == 0) {
						that.Toast.clear();
						if(res.data.today_moneyList==''){
							that.isToday=true;
						}
						that.moneyList = res.data.moneyList;
						that.mentorList = res.data.today_moneyList;
						that.income_money_rank = res.data.income_money_rank;
						that.income_money = res.data.income_money / 100;
						that.today_money_rank = res.data.today_money_rank;
						that.today_money = parseInt(res.data.today_money) / 100;
					}
				}
			},
			that
		);
	}
};
</script>

<style scoped>
.rankCard span,
.rankCard img {
	display: inline-block;
	vertical-align: middle;
	margin-right: 10%;
}
.rankCard span:last-child {
	margin-right: 5%;
}
.rankCard img {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
.rankCard {
	width: 90%;
	background: #ffffff;
	height: 80px;
	line-height: 80px;
	padding: 0 5%;
}
.bottomInfo {
	width: 100%;
	text-align: left;
	display: inline-block;
	font-size: 16px;
	color: #ffffff;
}
.bottomInfo.infoRight {
	text-align: right;
}
</style>
