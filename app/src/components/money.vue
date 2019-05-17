<template>
	<div>
		<!-- <button style="position: fixed;width: 120px;height:40px;background: lightblue;top:70%;left:50%;margin-left: -60px;border-radius: 10px;border: none;z-index: 9999999999;" @click="toWeb">测试分享</button> -->
		<van-tabs
			v-model="active"
			swipeable
			sticky
			animated
			color="#5da968"
			:line-width="20"
			:line-height="3"
			:offset-top="0"
			@change="changeActive"
		>
			<van-tab v-for="(item, index) in menus" :key="index" :title="item.name">
				<div style="padding-bottom: 60px;position: relative;">
					<van-list
						:v-model="'loading'"
						:finished="finished"
						finished-text="没有更多了"
						:loading="checkLoading"
						@load="onLoad"
						:offset="300"
						:immediate-check="isImmCheck"
					>
					
						<van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="!init">
							<div
								class="listCard"
								v-for="listitem in listArr"
								:key="listitem.index"
								:id="activeIndex"
								@click="goArticle(listitem.article_id, listitem.is_video)"
							>
								<van-row>
									<van-col span="24">
										<van-row type="flex" justify="space-between">
											<van-col span="16">
												<van-row>
													<van-col span="24">
														<div
															style="height:40px;margin-bottom: 30px;"
														>
															<span
																class="articleTitle"
																:style="
																	'font-weight:' +
																		listitem.list_title_bold +
																		';color:' +
																		listitem.list_title_color +
																		';'
																"
															>
																{{ listitem.title }}
															</span>
														</div>
													</van-col>
												</van-row>
												<van-row type="flex" align="bottom">
													<van-col span="6">
														<img
															:src="listitem.icon"
															alt
															class="articleType"
														/>
														<span class="articleType_txt">
															{{ listitem.tag_name }}
														</span>
													</van-col>
													<van-col span="18">
														<span
															class="redTxt"
															style="float: right;margin-right: 10px;"
														>
															{{ listitem.view_money / 100 }}元/次
														</span>
														<!-- <span class="grayTxt" style="float: right;">分享所得：</span> -->
													</van-col>
												</van-row>
											</van-col>
											<van-col span="7">
												<img :src="listitem.imgs" alt class="listitemImg" />
											</van-col>
										</van-row>
									</van-col>
								</van-row>
							</div>
						</van-pull-refresh>
					</van-list>
				</div>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'money',
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
			checkLoading: false
		};
	},
	methods: {
		onLoad(index) {
			if (index == undefined) {
				index = 0;
			}
			var id = common.getVal('menus')[this.activeIndex].id;
			this.loading = false;
			this.checkLoading = true;
			var that = this;
			if (that.isRequest) {
				that.isRequest = false;
				that.$http
					.get(common.host + '/article/list?type=' + id + '&page=' + that.pageNum)
					.then(response => {
						var res = response.body;
						that.$nextTick(() => {
							if (res.data == '') {
								that.checkLoading = false;
								that.finished = true;
								return;
							} else {
								that.listArr = that.listArr.concat(res.data);
								that.pageNum++;
								that.isRequest = true;
								this.isLoading = false;
								that.checkLoading = false;
							}
						});
					});
			}
		},
		onRefresh() {
			this.isRequest = false;
			this.finished = false;
			this.loading = false;
			this.isLoading = true;
			this.pageNum = 1;
			this.checkLoading = true;
			var id = common.getVal('menus')[this.activeIndex].id;
			this.$http.get(common.host + '/article/list?type=' + id + '&page=1').then(response => {
				var res = response.body;
				this.$nextTick(() => {
					this.listArr = res.data;
					this.isLoading = false;
					this.init = false;
					this.pageNum = 2;
					this.isRequest = true;
					this.checkLoading = false;
				});
			});
		},
		changeActive: function(index) {
			this.checkLoading = false;
			if (this.activeIndex != index) {
				this.active = index;
				this.activeIndex = index;
				this.finished = true;
				this.listArr = [];
				this.init = true;
				this.onRefresh();
			}
			if (index == 0) {
				this.activeIndex = 0;
				this.finished = true;
				this.listArr = [];
				this.init = true;
				this.onRefresh();
			}
		},
		goArticle(id, $video) {
			if ($video == 1) {
				var url ='/article/article_share_app.html?article_id=' + id;
				Native.openOtherWindow(url)
			} else {
// 				var url = location.href + '/money_article/' + id;
// 				api.sendEvent({
// 					name: 'openWin',
// 					extra: {
// 						url: url // 需要http开头的完整url
// 					}
// 				});
				this.$router.push({ path: '/money_article/' + id });
			}
		},
		toWeb() {
			var picurl="https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3380362153,2833752586&fm=85&app=57&f=PNG?w=121&h=75&s=E4C2F012C63F718A326419CF0300C030"
			Native.shareImg(picurl,false)
		}
	},
	created() {
		var that = this;
		this.$http.get(common.host + '/article/types').then(response => {
			var res = response.body;
			this.$nextTick(() => {
				this.menus = res.data;
				common.setVal('menus', res.data);
				this.onRefresh();
				this.listTotal = common.getVal('menus');
				this.activeArr = common.getVal('menus');
			});
		});
		// this.$http.get(common.host + '/article/list').then((response) => {
		//     var res = response.body;
		//     this.$nextTick(() => {
		//         this.listTotal[0] = res.data;
		//         this.activeArr[0] = 'true';
		//         for (var i = 1; i < this.listTotal.length; i++) {
		//             this.activeArr[i] = null
		//             this.listTotal[i] = null
		//         }
		//
		//         common.setVal('listArr', res.data)
		//         this.init = false
		//
		//     })
		//
		// })
	},
	activated() {
		this.money();
		this.checkRoute();
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

.articleType {
	width: 12px;
	height: 12px;
	display: inline-block;
	vertical-align: middle;
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

.listitemImg {
	width: 100%;
	height: 90px;
	background: #000;
}

.listCard {
	display: block;
	margin: 10px 2%;
	width: 96%;
}

.loadingIco {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -15px;
	margin-left: -15px;
}
</style>
