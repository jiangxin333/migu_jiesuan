<template>
	<div style="background: #FFFFFF;">
		<!-- <button style="position: fixed;width: 120px;height:40px;background: lightblue;top:70%;left:50%;margin-left: -60px;border-radius: 10px;border: none;" @click=""></button> -->
		<van-tabs v-model="active" swipeable sticky animated color="#ff7474" title-active-color="#ff7474" :line-width="20" :line-height="3" :offset-top="0" @change="changeActive">
			<van-tab v-for="(item, index) in menus" :key="index" :title="item.name">
				<div style="padding-bottom: 90px;position: relative;">
					<van-list
						:v-model="'loading'"
						:finished="finished"
						:loading="checkLoading"
						finished-text="没有更多了"
						@load="onLoad"
						:offset="300"
						:immediate-check="isImmCheck"
					>
						<img style="width: 100%;" src="https://qiniustore.zmr016.com/article/%E8%B5%9A%E9%92%B1.png" alt="" />
						<van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="!init">
							<div
								class="listCard"
								v-for="(listitem, listIndex) in listArr"
								:key="listIndex"
								:id="listitem.article_id"
								@click="goArticle(listitem.article_id, listitem.is_video)"
							>
								<van-row>
									<van-col span="24">
										<van-row type="flex" justify="space-between">
											<van-col span="15">
												<van-row>
													<van-col span="24">
														<div style="height:40px;margin-bottom: 30px;">
															<span
																class="articleTitle"
																:style="'font-weight:' + listitem.list_title_bold + ';color:' + listitem.list_title_color + ';'"
															>
																{{ listitem.title }}
															</span>
														</div>
													</van-col>
												</van-row>
												<van-row type="flex" align="bottom">
													<van-col span="6">
														<img :src="listitem.icon" alt class="articleType" style="margin-right: 5px;" />
														<span class="articleType_txt">{{ listitem.tag_name }}</span>
													</van-col>
													<van-col span="18">
														<span class="redTxt" style="float: right;margin-right: 10px;">分享浏览收益{{ listitem.view_money / 100 }}元/次</span>
														<!-- <span class="grayTxt" style="float: right;">分享所得：</span> -->
													</van-col>
												</van-row>
											</van-col>
											<van-col span="8"><img :src="listitem.img_array[0]" alt class="listitemImg" /></van-col>
										</van-row>
									</van-col>
								</van-row>
							</div>
						</van-pull-refresh>
					</van-list>
				</div>
			</van-tab>
		</van-tabs>
		<van-popup v-model="adShow">
			<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/task.png" class="qr_img" style="width: 100%!important;" alt @click="toMentor(0)" />
		</van-popup>
		<van-popup v-model="adShow2">
			<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/ad_mentor_migu_my.png" style="width: 100%!important;" alt @click="toMentor(1)" />
		</van-popup>
	</div>
</template>

<script>
import common from '../assets/js/common.js';
import Cookie from 'js-cookie';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'money2',
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
			ad_show: false,
			adShow: false,
			adShow2: false
		};
	},
	methods: {
		showAd() {
			if (Cookie.get('isShowed') == undefined) {
				this.adReg();
				this.adShow2 = true;
			} else {
				this.adShow2 = false;
			}
		},
		adReg() {
			var x = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
			Cookie.set('isShowed', 1, {
				expires: x,
				path: ''
			});
			// Cookie.set('isShowed', 1, { expires: 10000, path: '' });
			// common.setVal('adShow_time', new Date().getTime());
		},
		toMentor(num) {
			if (num == 0) {
				this.$router.push('/task');
			} else {
				this.$router.push('/mentor');
			}
		},
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
				that.$http.get(common.host + '/article/list?type=' + id + '&page=' + that.pageNum).then(response => {
					var res = response.body;
					that.$nextTick(() => {
						if (res.data == '') {
							that.checkLoading = false;
							that.finished = true;
							return;
						} else {
							var temp_list = res.data;
							for (var i in temp_list) {
								temp_list[i].pub_start_at = common.publishTime(common.date('Y-m-d', temp_list[i].pub_start_at));
							}
							that.listArr = that.listArr.concat(temp_list);
							that.pageNum++;
							that.isRequest = true;
							that.isLoading = false;
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
					for (var i in this.listArr) {
						this.listArr[i].pub_start_at = common.publishTime(common.date('Y-m-d H:i:s', this.listArr[i].pub_start_at));
					}
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
			window.localStorage.index = index;
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
				var url = '/article/article_share.html?article_id=' + id;
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
		this.$http.get(common.host + '/article/types').then(response => {
			var res = response.body;
			console.log(res);
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
		if (window.localStorage.index != undefined) {
			this.changeActive(window.localStorage.index);
		}
		if (window.localStorage.isLogin == 'false' || window.localStorage.isLogin == undefined) {
			this.adShow = true;
		} else {
			this.showAd();
		}
	},
	beforeRouteEnter(to, from, next) {
		if (from.path == '/task') {
			next(vm => {
				vm.listArr = [];
				vm.onRefresh();
			});
		} else {
			next();
		}
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
	margin-top: 2px;
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
	-o-text-overflow: ellipsis;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.listitemImg {
	width: 100%;
	height: 90px;
	border-radius: 6px;
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
.van-popup {
	width: 85% !important;
	background-color: transparent !important;
}
</style>
