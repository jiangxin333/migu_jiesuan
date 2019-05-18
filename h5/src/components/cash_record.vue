<template>
	<div class="navTop">
		<van-nav-bar title="提现记录" left-arrow @click-left="onClickLeft" fixed />

		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<div :style="style" class="cashList">
				<van-list v-model="loading" :finished="finished" finished-text="提现记录仅供最近3天记录查询" @load="onLoad" :immediate-check="false">
					<van-collapse v-model="activeNames" :accordion="true">
						<van-collapse-item :name="index" v-for="(item, index) in list" :key="index" :disabled="item.status!=2" :is-link="item.status==2">
							<van-row type="flex" justify="space-between" align="center" slot="title" :style="item.status!=2?'margin-right:25px;color:#323232':''">
								<van-col span="7">
									<span class="orangeTxt" v-if="item.status == 0">申请提现</span>
									<span class="greenTxt" v-if="item.status == 1">提现成功</span>
									<span class="redTxt" v-if="item.status == 2">提现失败</span>
								</van-col>
								<van-col span="5">
									<span>{{ item.money / 100 }}元</span>
								</van-col>
								<van-col span="12">
									<span>{{ item.created_at }}</span>
								</van-col>
							</van-row>
							<p>失败原因: {{item.remark}}</p>
						</van-collapse-item>
					</van-collapse>
				</van-list>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
import common from '../assets/js/common';

export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'cash_record',
	data() {
		return {
			list: [],
			loading: true,
			finished: false,
			isLoading: false,
			style: {
				width: '100%',
				height: window.innerHeight - 45 + 'px',
				background: '#ffffff'
			},
			spanWidth: window.innerWidth / 3 + 'px',
			pageNum: 1,
			isRequest: true,
			activeNames: [],
			lastid: 0
		};
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1);
		},
		onLoad() {
			console.log('load');
			var that = this;
			// 异步更新数据
			if (that.isRequest) {
				that.isRequest = false;
				common.toAjax(common.host + '/getcashs/userlog', { page: that.pageNum }, function(res) {
					// 加载状态结束
					that.loading = false;
					that.isRequest = true;
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							// 数据全部加载完成
							if (res.data.data == '') {
								that.finished = true;
								console.log('finish');
							} else {
								console.log('data', res.data.data);
								that.list = that.list.concat(res.data.data);
								console.log('list', that.list);
								that.pageNum++;
							}
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
		onRefresh() {
			console.log('refresh');
			var that = this;
			that.list = [];
			that.pageNum = 1;
			that.finished = false;
			that.loading = false;
			setTimeout(function() {
				that.isLoading = false;
				that.onLoad();
			}, 300);
		}
	},
	activated() {
		this.checkRoute();
		this.pageNum = 1;
		this.list=[];
		this.onLoad();
		this.activeNames=[];
		// $('.navTop').css({
		// 	'min-height': window.innerHeight - 45 + 'px',
		// 	'padding-bottom': '60px'
		// });
	}
};
</script>

<style scoped>
.cashList span {
	height: 30px;
	line-height: 30px;
	font-size: 14px;
	text-align: center;
	display: block;
}
</style>
