<template>
	<div class="navTop" style="padding-bottom: 50px">
		<van-nav-bar title="立即收徒" left-arrow @click-left="onClickLeft" fixed />
		<div class="shareCard btnCard">
			<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/mentor_share_top.png" alt />
			<button class="mentorBtn" @click="toShare">立即收徒赚钱</button>
		</div>
		<div class="shareCard">
			<img src="https://qiniustore.zmr016.com/quzhuan/imgs/mentor_share_1.png" alt />
			<img src="https://qiniustore.zmr016.com/quzhuan/imgs/mentor_share_2.png" alt />
		</div>
		<van-actionsheet
			v-model="show"
			:actions="actions"
			cancel-text="取消"
			@select="onSelect"
			@cancel="onCancel"
		/>
		<van-popup v-model="ermShow">
			<img :src="ermUrl" class="qr_img" alt />
			<input
				type="button"
				class="ermBtn shareBtn"
				value="分享图片给朋友"
				@click="ermShare()"
			/>
		</van-popup>
	</div>
</template>

<script>
import common from '../assets/js/common';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'mentor_share',
	data() {
		return {
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
			ermUrl: ''
			// shareTxt:'欢迎加入【'+common.getVal('loginData').platform_name+'】与好友一起轻松赚钱'
			// shareTxt:'欢迎加入微转客与好友一起轻松赚钱'
		};
	},
	methods: {
		onClickLeft() {
			this.mentors();
			this.$router.go(-1);
		},
		toShare() {
			var that = this;
			if (that.ermUrl != '') {
				that.ermShow = true;
			}
		},
		onSelect(item) {
			var that = this;
			var pic = common.getVal('userInfo').img;
			var desc = '送你一份零花钱，每天都能领，和好友一起分享';
			var title =
				'欢迎加入【' + common.getVal('loginData').platform_name + '】与好友一起轻松赚钱';
			var link =
				common.getVal('shareUrl') +
				'/wxlogin?type=mentor&&parent_user_id=' +
				common.getVal('passwd_id');
			switch (item.name) {
				case '微信分享给好友':
					// 分享网页
					Native.share(encodeURI(link), title, desc, pic, false);
					// 					api.sendEvent({
					// 						name: 'share',
					// 						extra: {
					// 							type: 'page',
					// 							pic: pic, // 缩略图
					// 							contentUrl: encodeURI(link), // 网页地址
					// 							description: desc, // 描述
					// 							title: title, // 标题
					// 							scene: 'session' // session表示发送给还有，timeline表示分享朋友圈
					// 						}
					// 					});
					break;
				case '微信分享到朋友圈':
					// 分享网页
					Native.share(encodeURI(link), title, desc, pic, true);
					// 					api.sendEvent({
					// 						name: 'share',
					// 						extra: {
					// 							type: 'page',
					// 							pic: pic, // 缩略图
					// 							contentUrl: encodeURI(link), // 网页地址
					// 							description: desc, // 描述
					// 							title: title, // 标题
					// 							scene: 'timeline' // session表示发送给还有，timeline表示分享朋友圈
					// 						}
					// 					});
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
			// 分享图片
			Native.shareImg(this.ermUrl, false);
			// Native.shareText(this.shareTxt,false)
			// 			api.sendEvent({
			// 				name: 'share',
			// 				extra: {
			// 					type: 'image',
			// 					pic: this.ermUrl // 图片地址
			// 				}
			// 			});
		}
	},
	activated() {
		this.checkRoute();
		var that=this;
		if (that.$store.state.qrcode_img != '') {
			that.ermUrl = that.$store.state.qrcode_img;
		} else {
			common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
				if (res.status == 10000) {
					that.ermUrl = res.data.qrcode_img;
					that.$store.commit('SETIMG',res.data.qrcode_img)
					// this.show = true;
				} else {
					that.$toast(res.info);
				}
			});
		}
	}
};
</script>

<style scoped>
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
	-webkit-box-shadow: 2px 2px 2px #bc0b0f;
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
