<template>
	<div class="navTop">
		<van-nav-bar title="收入明细" right-text="收益说明" left-arrow @click-left="onClickLeft" @click-right="onClickRight" fixed />
		<van-row type="flex" justify="space-between">
			<van-col span="12">
				<div class="incomeShow">
					<p>今日收入</p>
					<p class="redTxt">{{ todayMoney }}元</p>
				</div>
			</van-col>
			<van-col span="12">
				<div class="incomeShow">
					<p>总收入</p>
					<p class="redTxt">{{ totalMoney }}元</p>
				</div>
			</van-col>
		</van-row>
		<div class="detailsList">
			<van-tabs v-model="active" type="card" color="#5da968">
				<van-tab title="文章分享">
					<div class="list_content" :style="{ height: listH }">
						<p class="refreshTime" v-if="isRefresh_articleList">最后更新：{{ refreshTime_articleList }}</p>
						<van-pull-refresh v-model="isLoading_article" @refresh="onRefresh_articleList" loading-text="正在刷新数据">
							<van-list v-model="article_loading" :finished="article_finished" finished-text="文章分享仅供最近3天记录查询" @load="getData_articleList(false)" :immediate-check="true">
								<div class="articleList" v-for="(article, index) in articleList" :key="index">
									<p>{{ article.key }}</p>
									<!-- 类名box_show添加盒子阴影 -->
									<div>
										<div
											class="articleCard box_show"
											v-for="articleinfo in article.money_list"
											:key="articleinfo.key"
											:id="articleinfo.id"
											@click="toSharedetail(articleinfo.id)"
										>
											<van-row type="flex" justify="space-between" align="center" style="margin:10px auto;padding: 2% 0;">
												<van-col span="6"><img :src="articleinfo.img" alt style="width: 92%;margin:4%;height: 60px;" /></van-col>
												<van-col span="18">
													<div class="card-right" style="width: 96%;margin:0 2%">
														<van-row>
															<van-col span="24">
																<span class="articleinfo-title">{{ articleinfo.title }}</span>
															</van-col>
														</van-row>

														<van-row type="flex" justify="space-between">
															<van-col span="6">
																<div class="card-right-bottom">
																	<p class="bottom-left">
																		<span>阅读：</span>
																		<span class="greenTxt">{{ articleinfo.view_num }}</span>
																	</p>
																</div>
															</van-col>
															<van-col span="9">
																<div class="card-right-bottom">
																	<!-- <div v-if="articleinfo.view_num > 0 || (articleinfo.income == articleinfo.share_money && articleinfo.income > 0)">
																		<p class="bottom-middle top">
																			<span>浏览：</span>
																			<span class="greenTxt">{{ articleinfo.view_money / 100 }}元/次</span>
																		</p>
																		<p class="bottom-middle bottom">
																			<span>分享：</span>
																			<span class="greenTxt">{{ articleinfo.share_money / 100 }}元</span>
																		</p>
																	</div> -->
																	<!-- 只显示浏览不显示分享 -->
																	<div>
																		<p class="bottom-middle">
																			<span>浏览：</span>
																			<span class="greenTxt">{{ articleinfo.view_money / 100 }}元/次</span>
																		</p>
																	</div>
																</div>
															</van-col>
															<van-col span="9">
																<div class="card-right-bottom">
																	<p class="bottom-right">
																		<span>收益：</span>
																		<span class="greenTxt">{{ articleinfo.income / 100 }}元</span>
																	</p>
																</div>
															</van-col>
														</van-row>
													</div>
												</van-col>
											</van-row>
										</div>
									</div>
								</div>
							</van-list>
						</van-pull-refresh>
					</div>
				</van-tab>
				<van-tab title="师徒奖励">
					<div class="list_content" :style="{ height: listH, 'padding-top': '20px' }">
						<p class="refreshTime" v-if="isRefresh_mentorList">最后更新：{{ refreshTime_mentorList }}</p>
						<van-pull-refresh v-model="isLoading_mentor" @refresh="onRefresh_mentorList" loading-text="正在刷新数据">
							<van-list v-model="mentor_loading" :finished="mentor_finished" finished-text="师徒奖励仅供最近3天记录查询" @load="getData_mentorList(false)" :immediate-check="false">
								<div class="box_show" style="background:#ffffff;margin-bottom: 5px;" v-for="mentor in mentorList" :key="mentor.index">
									<img :src="mentor.user_img" alt class="userImg" style="display: inline-block;vertical-align: middle;margin:2%;width:30px;height:30px;" />
									<div class="userInfo" style="display: inline-block;vertical-align: middle;width:50%;">
										<p style="margin-bottom: 5px;">{{ mentor.user_name }}</p>
										<p style="margin-top: 5px;color:#999999">{{ mentor.user_tel }}</p>
									</div>
									<p style="text-align: right;display: inline-block;vertical-align: middle;width:30%;" class="redTxt">{{ mentor.data / 100 }}元</p>
								</div>
							</van-list>
						</van-pull-refresh>
					</div>
				</van-tab>
				<van-tab title="其他收入">
					<div class="list_content" :style="{ height: listH }">
						<p class="refreshTime" v-if="isRefresh_otherList">最后更新：{{ refreshTime_otherList }}</p>
						<van-pull-refresh v-model="isLoading_other" @refresh="onRefresh_otherList" loading-text="正在刷新数据">
							<van-list v-model="other_loading" :finished="other_finished" finished-text="其他收入仅供最近3天记录查询" @load="getData_otherList(false)" :immediate-check="false">
								<!-- 这里 -->
								<!-- <van-cell-group v-for="other in otherList" :key="other.index">
									<van-cell :title="other.title" :value="other.updated_at" size="large" :border="false" value-class="greenTxt" />
									<p class="otherMessage">{{ other.desc }}</p>
								</van-cell-group> -->
								<van-collapse v-model="activeNames" accordion>
									<van-collapse-item v-for="(other,index) in otherList" :title="other.title" :value="other.updated_at" :key="index" :name="index">
										<p class="otherMessage">{{ other.desc }}</p>
									</van-collapse-item>
								</van-collapse>
							</van-list>
						</van-pull-refresh>
					</div>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
import common from '../assets/js/common.js';

export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'income_details',
	data() {
		return {
			activeNames: [''],
			todayMoney: 0,
			active: 0,
			totalMoney: 0,
			currentPage_article: 1,
			currentPage_mentor: 1,
			currentPgae_other: 1,
			list: [],
			articleList: [],
			mentorList: [],
			otherList: [],
			article_loading: false,
			article_finished: false,
			mentor_loading: false,
			mentor_finished: false,
			other_loading: false,
			other_finished: false,
			listH: '',
			count: 0,
			isLoading_article: false,
			isLoading_mentor: false,
			isLoading_other: false,
			refreshTime_articleList: '',
			refreshTime_mentorList: '',
			refreshTime_otherList: '',
			isRefresh_articleList: false,
			isRefresh_mentorList: true,
			isRefresh_otherList: false,
			isRequest: false,
			scrolling: false,
			last_id_1: 0,
			last_id_2: 0,
			last_id_3: 0
		};
	},
	methods: {
		onClickLeft: function() {
			this.my();
			this.$router.go(-1);
		},
		onClickRight: function() {
			common.goLink('/income_statement', this);
		},
		onRefresh_articleList() {
			this.isRefresh_articleList = true;
			this.refreshTime_articleList = new Date().toLocaleTimeString();
			this.getData_articleList(true);
		},
		onRefresh_mentorList() {
			this.isRefresh_mentorList = true;
			this.refreshTime_mentorList = new Date().toLocaleTimeString();
			this.getData_mentorList(true);
		},
		onRefresh_otherList() {
			this.isRefresh_otherList = true;
			this.refreshTime_otherList = new Date().toLocaleTimeString();
			this.getData_otherList(true);
		},
		getData_articleList(isRefresh) {
			var that = this;
			if (isRefresh) {
				that.isRequest = true;
				that.last_id_1 = 0;
				common.toAjax(common.host + '/users_money/income', { type: 1, is_refresh: 1, last_id: that.last_id_1 }, function(res) {
					that.article_loading = false;
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							if (res.data.next_page == false) {
								that.article_finished = true;
							}
							that.last_id_1 = res.data.last_id;
							that.articleList = res.data.list;
							that.isLoading_article = false;
							that.isRefresh_articleList = false;
						} else if (res.err_code == 2000) {
							that.article_finished = true;
							that.isLoading_article = false;
							that.isRefresh_articleList = false;
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						window.localStorage.isLogin = false;
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				});
			} else {
				that.isRequest = true;
				common.toAjax(common.host + '/users_money/income', { type: 1, is_refresh: 0, last_id: that.last_id_1 }, function(res) {
					that.article_loading = false;
					console.log('1111');
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							if (res.data.next_page == false) {
								that.article_finished = true;
							}
							that.last_id_1 = res.data.last_id;
							that.articleList = that.articleList.concat(res.data.list);
							that.isLoading_article = false;
							that.isRefresh_articleList = false;
						} else if (res.err_code == 2000) {
							that.article_finished = true;
							that.isLoading_article = false;
							that.isRefresh_articleList = false;
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						window.localStorage.isLogin = false;
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				});
			}
		},
		getData_mentorList(isRefresh) {
			var that = this;
			if (isRefresh) {
				that.isRequest = true;
				that.last_id_2 = 0;
				common.toAjax(common.host + '/users_money/income', { type: 3, is_refresh: 1, last_id: that.last_id_2 }, function(res) {
					that.mentor_loading = false;
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							if (res.data.next_page == false) {
								that.mentor_finished = true;
							}
							that.last_id_2 = res.data.last_id;
							that.mentorList = res.data.list;
							that.isLoading_mentor = false;
							that.isRefresh_mentorList = false;
						} else if (res.err_code == 2000) {
							that.mentor_finished = true;
							that.isLoading_mentor = false;
							that.isRefresh_mentorList = false;
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						window.localStorage.isLogin = false;
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				});
			} else {
				that.isRequest = true;
				common.toAjax(common.host + '/users_money/income', { type: 3, is_refresh: 0, last_id: that.last_id_2 }, function(res) {
					that.mentor_loading = false;
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							if (res.data.next_page == false) {
								that.mentor_finished = true;
							}
							that.last_id_2 = res.data.last_id;
							that.mentorList = that.mentorList.concat(res.data.list);
							that.isLoading_mentor = false;
							that.isRefresh_mentorList = false;
						} else if (res.err_code == 2000) {
							that.mentor_finished = true;
							that.isLoading_mentor = false;
							that.isRefresh_mentorList = false;
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						window.localStorage.isLogin = false;
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				});
			}
		},
		getData_otherList(isRefresh) {
			var that = this;
			if (isRefresh) {
				that.isRequest = true;
				that.last_id_3 = 0;
				common.toAjax(common.host + '/users_money/income', { type: 5, is_refresh: 1, last_id: that.last_id_3 }, function(res) {
					that.other_loading = false;
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							if (res.data.next_page == false) {
								that.other_finished = true;
							}
							that.last_id_3 = res.data.last_id;
							that.otherList = res.data.list;
							that.isLoading_other = false;
							that.isRefresh_otherList = false;
						} else if (res.err_code == 2000) {
							that.other_finished = true;
							that.isLoading_other = false;
							that.isRefresh_otherList = false;
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						window.localStorage.isLogin = false;
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				});
			} else {
				that.isRequest = true;
				common.toAjax(common.host + '/users_money/income', { type: 5, is_refresh: 0, last_id: that.last_id_3 }, function(res) {
					that.other_loading = false;
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							if (res.data.next_page == false) {
								that.other_finished = true;
							}
							that.last_id_3 = res.data.last_id;
							that.otherList = that.otherList.concat(res.data.list);
							that.isLoading_other = false;
							that.isRefresh_otherList = false;
						} else if (res.err_code == 2000) {
							that.other_finished = true;
							that.isLoading_other = false;
							that.isRefresh_otherList = false;
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						window.localStorage.isLogin = false;
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				});
			}
		},
		getData_income() {
			var that = this;
			common.toAjax(common.host + '/users_money/total_today', {}, function(res) {
				if (res.err_code != 800) {
					if (res.err_code == 10000) {
						that.todayMoney = res.data.today / 100;
						that.totalMoney = res.data.all / 100;
					} else {
						that.$toast(res.err_msg);
					}
				} else {
					that.$toast(res.err_msg);
					window.localStorage.isLogin = false;
					setTimeout(function() {
						common.toLogin(that);
					}, 1000);
				}
			});
		},
		toSharedetail(id) {
			common.goLink('/share_detail/' + id, this);
		}
	},
	activated() {
		this.checkRoute();
		// this.getData_articleList(false);
		this.getData_mentorList(false);
		this.getData_otherList(false);
		this.getData_income();
		this.activeNames = [];
	},
	mounted() {
		this.listH = window.innerHeight - $('.van-nav-bar').height() - $('.van-row').height() - $('.van-tabs__wrap').height() + 'px';
	}
};
</script>

<style scoped>
.list_content {
	position: relative;
	z-index: 999;
	overflow-y: scroll;
}

.refreshTime {
	position: absolute;
	top: 0;
	width: 100%;
	text-align: center;
	z-index: 1;
}
.other_content {
	padding-top: 20px;
}
body {
	overflow: hidden !important;
}

.otherMessage {
	padding-left: 5%;
}
.box_show {
	border-radius: 6px;
	-webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	margin: 0 1%;
}
</style>
