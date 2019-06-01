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
						<van-button type="primary" @click="toShare">点我赚钱</van-button>
					</div>
				</van-col>
			</van-row>
		</div>
		<van-actionsheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
		<van-dialog v-model="shareShow" :show-cancel-button="false" :show-confirm-button="false" style="text-align: center;padding-bottom: 10px;"
		 title="温馨提醒">
			<p>点击按钮复制分享链接在微信中打开</p>
			<input type="hidden" v-model="shareUrl" />
			<van-button size="small" type="primary" 　v-clipboard:copy="shareUrl" 　　v-clipboard:success="onCopy"
			 　　v-clipboard:error="onError">复制分享链接</van-button>
		</van-dialog>
	</div>
</template>

<script>
	import common from '../assets/js/common.js';

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
				show: false,
				shareDesc: '',
				actions: [{
						name: '微信分享给好友群'
					},
					{
						name: '微信分享到朋友圈'
					}
				],
				time: '',
				login_key: '',
				shareShow: false,
				shareUrl: '',
				shareType: 'fakeShare'
			};
		},
		mounted() {
			var that = this;
			window.callBackByShare = function() {
				that.shareShow = true;
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
						type: 'POST',
						xhrFields: {
							withCredentials: true
						},
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
									that.shareTitle = res.data.title;
									that.shareLink = res.data.link;
									that.shareImg = res.data.shareImg;
									that.shareDesc = res.data.desc;
									that.login_key = res.data.login_key;
									that.Toast.clear();
								});
							} else {
								that.Toast.message = '加载失败，请点击后退按钮返回上一页重新加载';
								$('body').removeClass('van-toast--unclickable');
								that.time = setTimeout(function() {
									that.Toast.clear();
									// that.$router.go(-1);
								}, 2000);
							}
						},
						error: function() {
							that.Toast.message = '加载失败，请点击后退按钮返回上一页重新加载';
							$('body').removeClass('van-toast--unclickable');
							that.time = setTimeout(function() {
								that.Toast.clear();
								// that.$router.go(-1);
							}, 2000);
						}
					});
				}
			},
			toShare() {
				this.show = true;
			},
			timest() {
				var tmp = Date.parse(new Date()).toString();
				tmp = tmp.substr(0, 10);
				return tmp;
			},
			onCopy() {
				this.$toast('复制成功');
			},
			onError() {
				this.$toast('复制失败');
			},
			onSelect(item) {
				var that = this;
				var pic = that.shareImg;
				var desc = common.subString(that.shareDesc, 20);
				var title = that.shareTitle;
				var login_key;
				// 			if(common.getVal('userInfo').login_key==undefined){
				// 				login_key=0
				// 			}else{
				// 				login_key=common.getVal('userInfo').login_key
				// 			}
				switch (item.name) {
					case '微信分享给好友群':
						common.toAjax(
							common.host + '/sharelog/info', {
								article_id: that.$route.params.id,
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
										that.shareUrl = res.data.url;
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
									}
								);
								//短链接模式结束
								// 分享网页
								// Native.share(encodeURI(that.shareLink + '&rand_no=' + rand_no) , title, desc, pic, false);

								// 							api.sendEvent({
								// 								name: 'share',
								// 								extra: {
								// 									type: 'page',
								// 									pic: pic, // 缩略图
								// 									contentUrl: encodeURI(that.shareLink + '&rand_no=' + rand_no), // 网页地址
								// 									description: desc, // 描述
								// 									title: title, // 标题
								// 									scene: 'session' // session表示发送给还有，timeline表示分享朋友圈
								// 								}
								// 							});
							}
						);

						break;
					case '微信分享到朋友圈':
						common.toAjax(
							common.host + '/sharelog/info', {
								article_id: that.$route.params.id,
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
										that.shareUrl = res.data.url;
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
									}
								);
							}
						);

						break;
					default:
						break;
				}
			},
			onCancel() {
				this.show = false;
			},
			openUC() {
				var that = this;
				that.$dialog
					.alert({
						title: '温馨提醒',
						message: '分享仅支持UC手机浏览器和QQ手机浏览器哦！',
						showConfirmButton: true,
						showCancelButton: false,
						confirmButtonText: '知道啦！'
					})
					.then(() => {
						$.ajax({
							url: common.host + '/frauddata/sharelog',
							data: {
								article_id: that.id,
								title: that.shareTitle,
								img: that.shareImg,
								link: encodeURI(that.shareLink)
							},
							type: 'POST',
							xhrFields: {
								withCredentials: true
							},
							success: function(res) {
								var url =
									location.protocol + '//' +
									location.host +
									'/c/akai.html?url=' +
									encodeURIComponent(that.shareLink) +
									'&title=' +
									that.shareTitle +
									'&desc=' +
									that.shareDesc +
									'&img=' +
									encodeURIComponent(that.shareImg) +
									'&login_key=' +
									that.login_key +
									'&rand_no=' +
									res.data.rand_no;
								console.log(url);
								api.sendEvent({
									name: 'openh5',
									extra: {
										url: url // 需要http开头的完整url
									}
								});
							}
						});
					});
			}
		},
		activated() {
			this.checkRoute();
			this.$nextTick(function() {
				this.id = this.$route.params.id;
				this.getData();
			});
			if (common.getVal('loginData').app_share_type != 'fakeShare') {
				this.shareType = 'share';
			}
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
