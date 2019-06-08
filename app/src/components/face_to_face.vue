<template>
	<div class="navTop face_to_face">
		<van-nav-bar title="二维码推广" left-arrow @click-left="onClickLeft" fixed />
		<div class="conte">
			<img :src="sharImg" alt="">
			<div class="explain">
				<h3 style="font-size: 16px;color: #333;margin-bottom: 10px;">邀请好友 获得更高收益</h3>
				<div style="color: #797979;">
					<p>1、好友注册和邀请人共享10元现金</p>
					<p>2、每邀请2人额外奖励5元起</p>
					<p>3、还有45%一级提成+30%二级提成</p>
				</div>
			</div>
		</div>
		<div class="bottomImg">
			<div class="session textflex" @click="shar(0)">
				<img src="../assets/img/hy.png" alt="">
				<span class="text">分享微信</span>
			</div>
			<div class="timeline textflex" @click="shar(1)">
				<img src="../assets/img/py.png" alt="">
				<span class="text">分享朋友圈</span>
			</div>
		</div>
	</div>
</template>

<script>
	import common from '../assets/js/common.js';
	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my', 'task'],
		name: 'face_to_face',
		data() {
			return {
				msg: '面对面收徒',
				sharImg: '',
				ermUrl: '',//分享好友图片
				ermUrl_timeline: '',//分享朋友圈图片
				shareType: 'fakeShare' //伪装应用
			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			},
			shar(num) {
				var that = this;
				if (num == 0) {
					if (that.ermUrl != '') {
						api.sendEvent({
							name: that.shareType,
							extra: {
								type: 'image',
								scene: 'session',
								timeline: false, // false表示发送给，true表示分享朋友圈
								pic: that.ermUrl // 图片地址
							}
						});
					}
					
				} else {
					if (that.ermUrl_timeline != '') {
						api.sendEvent({
							name: that.shareType,
							extra: {
								type: 'image',
								scene: 'timeline',
								timeline: true, // false表示发送给朋友，true表示分享朋友圈
								pic: that.ermUrl_timeline // 图片地址
							}
						});
					}
					
				}
			}
		},
		
		activated() {
			this.checkRoute();
			if (common.getVal('loginData').app_share_type != 'fakeShare') {
				this.shareType = 'share';
			}
			// 分享好友地址
			this.ermUrl = this.$store.state.data2.qrcode_img;
			// 分享朋友圈地址
			this.ermUrl_timeline = this.$store.state.data2.timeline_qrcode_img;
			console.log(this.$store.state.data2,'收徒热为嘛');
			this.sharImg = this.$store.state.data2.qrcode_img;
			console.log(this.sharImg,15515);
		}
	}
</script>

<style scoped>
	.conte {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 76%;
		transform: translate(-50%,-52%);
		background-color: #fff;
		border-radius: 12px;
		padding-bottom: 6px;
	}
	.explain {
		font-size: 14px;
		padding-left: 20px;
		margin: 14px 0;
	}
	.explain p {
		margin: 8px 0;
	}
	.conte img {
		width: 100%;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
	}
	/* 底部分享 */
	.bottomImg {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 80%;
		height: 60px;
		margin-left: 10%;
		display: flex;
		justify-content: space-between;
		background-color: #f6f6f6;
	}
	.textflex {
		display: flex;
	}
	.textflex img {
		width: 50px;
		height: 50px;
	}
	.text {
		line-height: 50px;
		color: #7F7F7F;
		font-size: 14px;
		padding-left: 10px;
	}
</style>
