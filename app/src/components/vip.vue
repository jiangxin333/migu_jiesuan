<template>
	<div class="navTop" :style="styleH">
		<van-nav-bar left-arrow fixed @click-left="onClickLeft" title="VIP会员"/>
		<div class="bgImg">
			<img src="https://qiniustore.zmr016.com/quzhuan/imgs/bac.png" alt="">
			<div class="content">
				<p class="size" style="font-size: 16px; font-weight: 700;">会员专享黑钻&nbsp;&nbsp;未来百倍价值</p>
				<p class="size">--参与分红不清零永久持有--</p>
				<van-button round type="default">暂未开放</van-button>
			</div>
		</div>
		<div class="privilege" style="background-color: #f0f0f0;">
				<h3 class="title" style="color: #333333;padding: 5% 0;">会员特权</h3>
				<div style="text-align: center;">
					<van-row gutter="10">
						<van-col class="box1" span="8">
							<div class="box2">
								<img src="../assets/img/vip/1-icon.png" alt="">
								<p>99元奖励好友成为vip即可获得</p>
							</div>
						</van-col>
						<van-col class="box1" span="8">
							<div class="box2">
								<img src="../assets/img/vip/2-icon.png" alt="">
								<p>会员专属黑钻普通用户无法获得</p>
							</div>
						</van-col>
						<van-col class="box1" span="8">
							<div class="box2">
								<img src="../assets/img/vip/3-icon.png" alt="">
								<p>我的联盟收益增加50%</p>
							</div>
						</van-col>
						<van-col class="box1" span="8">
							<div class="box2">
								<img src="../assets/img/vip/4-icon.png" alt="">
								<p>vip专属提现接口提现24小时到账</p>
							</div>
						</van-col>
						<van-col class="box1" span="8">
							<div class="box2">
								<img src="../assets/img/vip/5-icon.png" alt="">
								<p>一对一专属客服</p>
							</div>
						</van-col>
						<van-col class="box1" span="8">
							<div class="box2">
								<img src="../assets/img/vip/6-icon.png" alt="">
								<p>可在公众号里提现</p>
							</div>
						</van-col>
					</van-row>
				</div>
		</div>
	</div>
</template>

<script>
	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'vip',
		data() {
			return {
				styleH: {
					height: window.innerHeight - 45 + "px",
					"background-color": "#f0f0f0" 
				}
			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			}
		},
		activated() {
			this.checkRoute();
		}
	}
</script>

<style scoped>
	.bgImg {
		position: relative;
	}
	.bgImg img {
		width: 100%;
		height: auto;
	}
	.van-button {
		width: 120px;
		height: 30px;
		color: #aaa198;
		line-height: 30px;
	}
	.content {
		position: absolute;
		width: 100%;
		bottom: 14%;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
	}
	.content .size {
		margin-bottom: 5%;
		color: #5d4214;
		font-size: 14px;
	}
	.privilege {
		width: 96%;
		margin: 0 auto;
	}
	.privilege .title {
		background: url('../assets/img/vip/circle.png') no-repeat;
		background-size: 130px;
		background-position: center center;
		text-align: center;
	}
	.privilege .box1 {
		width: 33%;
		background-color: #f0f0f0;
	}
	.privilege .box2 {
		width: 100%;
		margin-bottom: 10px;
		border-radius: 8px;
		background-color: #fff;
	}
	.privilege .box1 .box2 img {
		width: 50%;
		padding-top: 10px;
	}
	.privilege .box1 .box2 p {
		box-sizing: border-box;
		padding-top: 10px;
		margin: 0 auto;
		width: 67%;
		height: 70px;
		color: #9f9f9f;
	}
</style>
