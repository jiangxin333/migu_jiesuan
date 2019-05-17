<template>
	<div style="background: #FFFFFF;padding-bottom: 50px;">
		<!-- <button style="position: fixed;width: 120px;height:40px;background: lightblue;top:70%;left:50%;margin-left: -60px;border-radius: 10px;border: none;" @click=""></button> -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<div :style="clickH">
				<van-list :v-model="'loading'" :finished="finished" :finished-text="finishedTxt" :loading-text="loadingTxt"
				 :error.sync="error" :error-text="errorTxt" :loading="checkLoading" @load="onLoad" :offset="300">
					<div class="listCard" v-for="(listitem, listIndex) in listArr" :key="listIndex" :id="listitem.article_id" @click="goArticle(listitem.article_id, listitem.is_video)">
						<span class="articleTitle" :style="'font-weight:' + listitem.list_title_bold + ';color:' + listitem.list_title_color + ';'">{{ listitem.title }}</span>
						<van-row style="margin:10px auto 2px">
							<img v-lazy="listitem.img_array[0]" alt class="listitemImg bigImg" :style="bigStyle" />
						</van-row>
						<van-row style="padding:0 0 10px;border-bottom: 1px solid #e5e5e5;">
							<van-col span="9" style="text-align: left;">
								<img :src="listitem.icon" alt class="articleType" />
								<span class="articleType_txt redTxt">{{ listitem.tag_name == undefined ? '测试标签' : listitem.tag_name }}</span>
							</van-col>
							<van-col span="6" style="text-align: center;">
								<span class="redTxt">{{ listitem.view_money / 100 }}元/次</span>
							</van-col>
							<van-col span="9" style="text-align: right;">
								<span class="articleType_price">{{ listitem.pub_start_at }}</span>
							</van-col>
						</van-row>
					</div>
				</van-list>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
	import common from '../assets/js/common.js';
	export default {
		inject: ['checkRoute', 'video'],
		name: 'video_list',
		data() {
			return {
				active: 0,
				actived: 0,
				menus: [],
				contentHeight: window.innerHeight + 'px',
				contentColor: '#5da968',
				list: [],
				isLoading: false,
				loading: false,
				finished: false,
				active_money: 0,
				icon1: require('../assets/img/guagua/money.png'),
				icon2: require('../assets/img/guagua/mentor.png'),
				icon3: require('../assets/img/guagua/my.png'),
				activeIco: require('../assets/img/guagua/refresh.png'),
				menu1: [],
				list1: [],
				listTotal: [],
				listArr: [],
				activeIndex: 0,
				activeArr: [],
				pageNum: 1,
				init: false,
				isRequest: true,
				oldActive: '',
				isImmCheck: false,
				activeTop: 0,
				checkLoading: false,
				smallStyle: {
					width: '32%',
					margin: 'auto 0.66%',
					height: (window.innerWidth * 0.3 * 135) / 229 + 'px',
					'border-radius': '6px'
				},
				bigStyle: {
					width: '100%',
					height: (window.innerWidth * 135) / 229 + 'px',
					'border-radius': '6px'
				},
				isFrame: true,
				finishedTxt: '没有更多了',
				loadingTxt: '加载中...',
				successTxt: '刷新成功',
				refreshTxt: '加载中...',
				successTime: 2000,
				clickH: {
					// height:window.innerHeight-120+'px'
				},
				error: false,
				errorTxt: '请求失败，点击重新加载',
				isRefresh: false,
				timer: null
			};
		},
		methods: {
			onLoad(index) {
				if (index == undefined) {
					index = 0;
				}
				this.checkLoading = true;
				var that = this;
				if (that.isRequest) {
					that.isRequest = false;
					that.$http
						.get(common.host + '/article/list?type=0&page=' + that.pageNum, {
							timeout: 10000
						})
						.then(response => {
							var res = response.body;
							console.log(res.data.length);
							that.$nextTick(() => {
								if (res.data.length < 15 && that.pageNum == 1) {
									that.listArr = res.data;
									for (var i in that.listArr) {
										that.listArr[i].pub_start_at = common.publishTime(common.date('Y-m-d', that.listArr[i].pub_start_at));
									}
									that.isRequest = true;
									that.isLoading = false;
									that.checkLoading = false;
									that.finishedTxt = '没有更多了';
									that.checkLoading = false;
									that.finished = true;
								}
								if (res.data.length < 15 && that.pageNum > 1) {
									var temp_list = res.data;
									for (var i in temp_list) {
										temp_list[i].pub_start_at = common.publishTime(common.date('Y-m-d', temp_list[i].pub_start_at));
									}
									that.listArr = that.listArr.concat(temp_list);
									that.isRequest = true;
									that.isLoading = false;
									that.checkLoading = false;
									that.finishedTxt = '没有更多了';
									that.checkLoading = false;
									that.finished = true;
								}
								if (res.data == '') {
									that.checkLoading = false;
									that.finished = true;
									return;
								} else {
									if (that.isRefresh) {
										that.listArr = res.data;
										for (var i in that.listArr) {
											that.listArr[i].pub_start_at = common.publishTime(common.date('Y-m-d', that.listArr[i].pub_start_at));
										}
										that.isRefresh = false;
									} else {
										var temp_list = res.data;
										for (var i in temp_list) {
											temp_list[i].pub_start_at = common.publishTime(common.date('Y-m-d', temp_list[i].pub_start_at));
										}
										that.listArr = that.listArr.concat(temp_list);
									}
									that.pageNum++;
									that.isRequest = true;
									that.isLoading = false;
									that.checkLoading = false;
									that.finishedTxt = '没有更多了';
								}
							});
						})
						.catch(function(err) {
							console.log(err);
							clearTimeout(that.timer);
							if (err.ok == false && err.status == 0) {
								that.isLoading = false;
								that.init = false;
								that.isRequest = true;
								that.checkLoading = false;
								that.error = true;
								that.errorTxt = '网络异常，请检查网络环境后点击此处重新加载';
								if (that.pageNum == 1) {
									that.errorTxt = '网络异常，请检查网络环境';
									that.timer = setTimeout(function() {
										that.error = false;
									}, 2000);
								}
							}
							if (err.ok == false && err.status == 500) {
								that.isLoading = false;
								that.init = false;
								that.isRequest = true;
								that.checkLoading = false;
								that.error = true;
								that.errorTxt = '服务器异常，请联系客服反馈问题';
								if (that.pageNum == 1) {
									that.timer = setTimeout(function() {
										that.error = false;
									}, 2000);
								}
							}
							that.clickH = {
								'min-height': window.innerHeight - 120 + 'px',
								'padding-bottom': '60px'
							};
						});
				}
			},
			onRefresh() {
				this.isRequest = true;
				this.finished = false;
				this.loading = false;
				this.pageNum = 1;
				this.checkLoading = false;
				this.isLoading = true;
				this.isRefresh = true;
				this.onLoad();
			},
			goArticle(id, $video) {
				if ($video == 1) {
					var url = '/article/article_share_app.html?article_id=' + id;
					location.href = url;
				} else {
					this.$router.push({
						path: '/money_article/' + id
					});
				}
			},
			toWeb() {
				var url = 'http://' + location.host + '/test_webview.html';
				alert(url);
				api.sendEvent({
					name: 'openWin',
					extra: {
						url: url // 需要http开头的完整url
					}
				});
			}
		},
		created() {
			var that = this;
			this.onLoad();
		},
		activated() {
			this.video();
			this.checkRoute();
			this.listArr=[];
			this.pageNum = 1;
			this.onLoad()
		}
	};
</script>

<style scoped>
	.articleType_txt {
		font-size: 12px;
		display: inline-block;
		vertical-align: middle;
		margin: 0 2px;
	}

	.articleType_price {
		font-size: 12px;
		float: right;
		margin-right: 10px;
	}

	.articleType {
		width: 12px;
		height: 12px;
		display: inline-block;
		vertical-align: middle;
	}

	.articleTitle {
		font-size: 18px;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}

	.listitemImg {
		width: 100%;
		background: #000;
	}

	.listCard {
		display: inline-block;
		margin: 5px 3% 0;
		width: 94%;
	}

	.loadingIco {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -15px;
		margin-left: -15px;
	}
</style>
