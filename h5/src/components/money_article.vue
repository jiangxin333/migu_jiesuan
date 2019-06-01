<template>
	<div class="navTop" style="background:#ffffff">
		<van-nav-bar title left-arrow @click-left="onClickLeft" fixed />
		<div style="padding:0 2% 70px" class="articleMain">
			<p style="font-size: 20px;font-weight:bold;background:#ffffff;">{{ article_title }}</p>
			<div id="content"></div>
		</div>
		<div class="navBottom">
			<van-row gutter="20">
				<van-col span="8">
					<div class="rowItem">好友浏览</div>
				</van-col>
				<van-col span="8">
					<div class="rowItem redTxt">{{ view_money / 100 }}元/次</div>
				</van-col>
				<van-col span="8">
					<div class="rowItem">
						<van-button type="primary" @click="toSharePage">点我赚钱</van-button>
					</div>
				</van-col>
			</van-row>
		</div>
		<van-actionsheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
		<div style="background:rgba(0,0,0,.7);position: fixed;top:0;width: 100%;height: 100%;z-index: 999999999999;" v-if="tipsShow"
		 @click="showTips">
			<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/share_tip.png" alt="" style="width: 100%;" />
		</div>
	</div>
</template>

<script>
	import common from '../assets/js/common.js';
	import wx from 'weixin-js-sdk';

	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'money_article',
		data() {
			return {
				style: {
					height: window.innerHeight * 0.8 + 'px'
				},
				isOpen: false,
				isRequest: true,
				listArr: [],
				id: '',
				view_money: 0,
				shareTitle: '',
				shareImg: '',
				shareLink: '',
				shareRand_no: '',
				article_title: '',
				rand_no: '',
				show: false,
				shareDesc: '',
				actions: [{
						name: '微信分享给好友'
					},
					{
						name: '微信分享到朋友圈'
					}
				],
				time: '',
				tipsShow: false,
				time1: '',
				time2: '',
				time3: '',
				time4: ''
			};
		},
		methods: {
			onClickLeft() {
				// clearInterval(this.time);
				clearTimeout(this.time);
				this.Toast.clear();
				this.$router.go(-1);
				// api.closeWin();
			},
			getData() {
				var that = this;
				var pathArr = this.$route.path.split('/');
				$('#content').html('');
				$('.articleMain').css('padding-bottom', '0');
				this.article_title = '';
				if (pathArr[1] == 'money_article') {
					that.Toast = that.$toast.loading({
						duration: 0, // 持续展示 toast
						forbidClick: true, // 禁用背景点击
						loadingType: 'spinner',
						message: '加载中',
						mask: true
					});
					$.ajax({
						url: common.host + '/article/info',
						data: {
							article_id: this.$route.params.id
						},
						xhrFields: {
							withCredentials: true
						},
						type: 'POST',
						success: function(res) {
							if (res.err_code == 0) {
								$('body').removeClass('van-toast--unclickable');

								$('#content').html(res.data.content);
								$('#content img').css('max-width', '100%');
								that.article_title = res.data.title;
								$('.articleMain').css('padding-bottom', '70px');
								that.$nextTick(function() {
									that.view_money = res.data.view_money;
									that.listArr = res.data.recommend_list;
									that.shareHost = res.data.share_host;
									that.login_key = res.data.login_key;
									that.Toast.clear();
								});
							} else {
								that.Toast.message = '加载失败，请点击后退按钮返回上一页重新加载';
								$('body').removeClass('van-toast--unclickable');
								that.time = setTimeout(function() {
									that.Toast.clear();
									that.$router.go(-1);
								}, 2000);
							}
						},
						error: function() {
							that.Toast.message = '加载失败，请点击后退按钮返回上一页重新加载';
							$('body').removeClass('van-toast--unclickable');
							that.time = setTimeout(function() {
								that.Toast.clear();
								that.$router.go(-1);
							}, 2000);
						}
					});
				}
			},
			toShare() {
				this.show = true;
			},
			toSharePage() {
				var that = this;
				// that.shareHost=host;
				// this.show = true;
				var url =
					'/article/share?article_id=' +
					that.id +
					'&login_key=' +
					that.login_key;
				location.href = url;
			},
			showTips() {
				var that = this;
				common.clearHide(that);
				that.tipsShow = !that.tipsShow;
				common.toAjax(
					common.host + '/frauddata/sharelog', {
						article_id: that.$route.params.id,
						title: that.shareTitle,
						img: that.shareImg,
						link: encodeURI(that.shareLink)
					},
					function(res) {
						var rand_no = res.data.rand_no;
						wx.showMenuItems({
							menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
						});
						//需在用户可能点击分享按钮前就先调用
						console.log(
							that.shareTitle +
							'/t' +
							common.subString(that.shareDesc, 20) +
							'/t' +
							that.shareLink +
							'&rand_no=' +
							rand_no +
							'/t' +
							that.shareImg
						);
						wx.updateAppMessageShareData({
							title: that.shareTitle, // 分享标题
							desc: common.subString(that.shareDesc, 20), // 分享描述
							link: encodeURI(that.shareLink + '&rand_no=' + rand_no), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: that.shareImg, // 分享图标
							success: function() {
								// 设置成功
							}
						});
						wx.updateTimelineShareData({
							title: that.shareTitle, // 分享标题
							link: encodeURI(that.shareLink + '&rand_no=' + rand_no), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: that.shareImg, // 分享图标
							success: function() {
								// 设置成功
							}
						});
						wx.onMenuShareAppMessage({
							title: that.shareTitle, // 分享标题
							desc: common.subString(that.shareDesc, 20), // 分享描述
							link: encodeURI(that.shareLink + '&rand_no=' + rand_no), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: that.shareImg, // 分享图标
							success: function() {
								// 设置成功
							}
						});
						wx.onMenuShareTimeline({
							title: that.shareTitle, // 分享标题
							link: encodeURI(that.shareLink + '&rand_no=' + rand_no), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: that.shareImg, // 分享图标
							success: function() {
								// 设置成功
							}
						});
					}
				);
			},
			timest() {
				var tmp = Date.parse(new Date()).toString();
				tmp = tmp.substr(0, 10);
				return tmp;
			},
			onSelect(item) {
				var that = this;
				var pic = that.shareImg;
				var desc = common.subString(that.shareDesc, 20);
				var title = that.shareTitle;
				switch (item.name) {
					case '微信分享给好友':
						common.toAjax(
							common.host + '/frauddata/sharelog', {
								article_id: that.$route.params.id,
								title: that.shareTitle,
								img: that.shareImg,
								link: encodeURI(that.shareLink)
							},
							function(res) {
								that.show = false;
								var rand_no = res.data.rand_no;
								// 分享网页
								api.sendEvent({
									name: 'share',
									extra: {
										type: 'page',
										pic: pic, // 缩略图
										contentUrl: encodeURI(that.shareLink + '&rand_no=' + rand_no), // 网页地址
										description: desc, // 描述
										title: title, // 标题
										scene: 'session' // session表示发送给还有，timeline表示分享朋友圈
									}
								});
							}
						);

						break;
					case '微信分享到朋友圈':
						common.toAjax(
							common.host + '/frauddata/sharelog', {
								article_id: that.$route.params.id,
								title: that.shareTitle,
								img: that.shareImg,
								link: encodeURI(that.shareLink)
							},
							function(res) {
								that.show = false;
								var rand_no = res.data.rand_no;
								// 分享网页
								api.sendEvent({
									name: 'share',
									extra: {
										type: 'page',
										pic: pic, // 缩略图
										contentUrl: encodeURI(that.shareLink + '&rand_no=' + rand_no), // 网页地址
										description: desc, // 描述
										title: title, // 标题
										scene: 'timeline' // session表示发送给还有，timeline表示分享朋友圈
									}
								});
							}
						);

						break;
					default:
						break;
				}
			},
			onCancel() {
				this.show = false;
			}
		},
		activated() {
			var that = this;
			that.tipsShow = false;
			that.checkRoute();
			common.delayHide(that);
			that.$nextTick(function() {
				that.id = that.$route.params.id;
				that.getData();
				// 			if (common.isWeixinBrowser()) {
				// 				var baseUrl = location.href.split('#/')[0];
				// 				common.toAjax(
				// 					common.host + '/h5/signpackage',
				// 					{ url: encodeURIComponent(baseUrl) },
				// 					function(res) {
				// 						if (res.err_code == 808) {
				// 							location.href = res.data.host + '/apparticle_h5#/';
				// 						} else {
				// 							//接口入住权限验证配置
				// 							wx.config({
				// 								debug: res.data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				// 								appId: res.data.appId, // 必填，公众号的唯一标识
				// 								timestamp: res.data.timestamp, // 必填，生成签名的时间戳
				// 								nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
				// 								signature: res.data.signature, // 必填，签名，见附录1
				// 								jsApiList: res.data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				// 							});
				// 							wx.ready(function() {
				// 								common.delayHide(that);
				// 							});
				// 							//通过error接口处理失败验证
				// 							wx.error(function(res) {
				// 								// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				// 							});
				// 						}
				// 					}
				// 				);
				// 			}
			});
		},
		deactivated() {
			console.log('leave page');
			$('script').each(function() {
				$(this).remove();
			});
		}
	};
</script>

<style scoped>
	#article {
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.openArticle {
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	.related {
		color: green;
		border-bottom: 2px solid green;
		width: 100%;
		margin: 2% 0;
		padding-bottom: 10px;
		font-size: 14px;
	}

	.articleType_txt {
		font-size: 12px;
		display: inline-block;
		vertical-align: middle;
	}

	.articleType {
		width: 12px;
		height: 12px;
		display: inline-block;
		vertical-align: middle;
	}

	.articleTitle {
		font-size: 14px;
		width: 100%;
		overflow: hidden;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.listitemImg {
		width: 100%;
		height: 90px;
		background: #000;
	}

	.listCard {
		display: block;
		margin: 0 2%;
		padding: 10px 0;
		width: 96%;
		border-bottom: 1px solid #dddddd;
	}

	.listCard:last-child {
		border-bottom: none;
	}

	.navBottom {
		width: 100%;
		height: 58px;
		border-top: 2px solid #dddddd;
		position: fixed;
		bottom: 0;
		background: #ffffff;
	}

	.rowItem {
		width: 100%;
		height: 58px;
		line-height: 58px;
		text-align: center;
	}

	#content img {
		max-width: 100% !important;
	}
</style>
