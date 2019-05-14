<template>
	<div class="navTop">
		<van-nav-bar title="立即收徒" left-arrow @click-left="onClickLeft" fixed />
		<div class="shareCard btnCard">
			<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/mentor_share_top.png" alt />
			<button class="mentorBtn" @click="showTips">立即收徒赚钱</button>
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
		<!-- <van-popup v-model="ermShow">
			<img :src="ermUrl" class="qr_img" alt />
			<input
				type="button"
				class="ermBtn shareBtn"
				value="分享图片给朋友"
				@click="ermShare()"
			/>
		</van-popup> -->
		<div
			style="background:rgba(0,0,0,.7);position: fixed;top:0;width: 100%;height: 100%;z-index: 999999999999;"
			v-if="tipsShow"
			@click="showTips"
		>
			<img
				src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/share_tip.png"
				alt=""
				style="width: 100%;"
			/>
		</div>
		<van-popup v-model="ermShow">
			<img :src="ermUrl" class="qr_img" alt />
			<input
				type="button"
				class="ermBtn shareBtn"
				value="长按可保存图片或分享给朋友"
				style="border:none;background: transparent; color: #FFFFFF;width: 220px;margin-left: -110px;font-size: 14px;"
			/>
		</van-popup>
	</div>
</template>

<script>
import common from '../assets/js/common';
import wx from 'weixin-js-sdk';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'mentor_share',
	data() {
		return {
			show: false,
			ermShow: false,
			tipsShow: false,
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
			time1: '',
			time2: '',
			time3: '',
			time4: '',
			ermUrl: ''
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
					api.sendEvent({
						name: 'share',
						extra: {
							type: 'page',
							pic: pic, // 缩略图
							contentUrl: encodeURI(link), // 网页地址
							description: desc, // 描述
							title: title, // 标题
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
							pic: pic, // 缩略图
							contentUrl: encodeURI(link), // 网页地址
							description: desc, // 描述
							title: title, // 标题
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
		showTips() {
			var that = this;
			that.ermShow = true;
			common.clearHide(that);
			var pic = common.getVal('userInfo').img;
			var desc = '送你一份零花钱，每天都能领，和好友一起分享';
			var title =
				'欢迎加入【' + common.getVal('loginData').platform_name + '】与好友一起轻松赚钱';
			var link =
				common.getVal('shareUrl') +
				'/wxlogin?type=mentor&&parent_user_id=' +
				common.getVal('passwd_id');
			wx.showMenuItems({
				menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
			});
			//需在用户可能点击分享按钮前就先调用
			wx.updateAppMessageShareData({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: pic, // 分享图标
				success: function() {
					// 设置成功
				}
			});
			wx.updateTimelineShareData({
				title: title, // 分享标题
				link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: pic, // 分享图标
				success: function() {
					// 设置成功
				}
			});
			//需在用户可能点击分享按钮前就先调用
			wx.onMenuShareAppMessage({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: pic, // 分享图标
				success: function() {
					// 设置成功
				}
			});
			wx.onMenuShareTimeline({
				title: title, // 分享标题
				link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: pic, // 分享图标
				success: function() {
					// 设置成功
				}
			});
		},
		onCancel() {
			this.show = false;
		}
	},
	created() {
		// 		if (common.isWeixinBrowser()) {
		// 			var baseUrl = location.href.split('#/')[0];
		// 			common.toAjax(
		// 				common.host + '/h5/signpackage',
		// 				{ url: encodeURIComponent(baseUrl) },
		// 				function(res) {
		// 					if (res.err_code == 808) {
		// 						// location.href = res.data.host + '/apparticle_h5#/';
		// 					} else {
		// 						//接口入住权限验证配置
		// 						wx.config({
		// 							debug: res.data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		// 							appId: res.data.appId, // 必填，公众号的唯一标识
		// 							timestamp: res.data.timestamp, // 必填，生成签名的时间戳
		// 							nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
		// 							signature: res.data.signature, // 必填，签名，见附录1
		// 							jsApiList: res.data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		// 						});
		// 						wx.ready(function() {
		// 							common.delayHide(that);
		// 						});
		// 						//通过error接口处理失败验证
		// 						wx.error(function(res) {});
		// 					}
		// 				}
		// 			);
		// 		}
		var that = this;
		if (common.getVal('qrcode_img') != undefined) {
			that.ermUrl = common.getVal('qrcode_img');
		} else {
			common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
				if (res.status == 10000) {
					that.ermUrl = res.data.qrcode_img;
					common.setVal('qrcode_img', res.data.qrcode_img);
					// this.show = true;
				} else {
					that.$toast(res.info);
				}
			});
		}
	},
	activated() {
		this.checkRoute();
		this.ermUrl = common.getVal('qrcode_img');
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
	height: 40px;
	line-height: 40px;
	font-size: 12px;
	background: #f4cd1c;
	border-radius: 5px;
	border: none;
	color: #de480d;
	position: fixed;
	top: 88%;
	margin-left: -55px;
}

.ermBtn.shareBtn {
	left: 50%;
}
</style>
