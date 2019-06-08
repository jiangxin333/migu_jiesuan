<template>
	<div class="navTop">
		<van-nav-bar title="文章分享收益明细" left-arrow @click-left="onClickLeft" fixed />
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="!isNodata">
			<div :style="style" class="cashList">
				<van-row
					type="flex"
					justify="space-between"
					align="center"
					v-for="(item, index) in list"
					:key="index"
				>
					<van-col span="7">
						<span>文章阅读 x {{ item.is_valid }}</span>
					</van-col>
					<van-col span="5">
						<span>{{ (item.view_money * item.is_valid) / 100 }}元</span>
					</van-col>
					<van-col span="12">
						<span>{{ item.updated_at }}</span>
					</van-col>
				</van-row>
			</div>
		</van-pull-refresh>
		<img src="../assets/img/blank_1.png" v-if="isNodata" style="width: 60%;position: fixed;top:45%;left:50%;transform: translate3d(-50%,-50%,0);"/>
	</div>
</template>

<script>
import common from '../assets/js/common';

export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'share_detail',
	data() {
		return {
			list: [],
			isLoading: false,
			style: {
				width: '100%',
				height: window.innerHeight + 'px',
				background: '#ffffff'
			},
			spanWidth: window.innerWidth / 3 + 'px',
			id: '',
			isNodata:false,
			nodata:''
		};
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1);
		},
		onRefresh() {
			var that = this;
			var id = that.$route.params.id;
			that.loading = true;
			that.finished = false;
			that.list = [];
			common.toAjax(common.host + '/users_money/share_info/' + id, {}, function(res) {
					// 加载状态结束
				that.isLoading = false;
				if (res.err_code != 800) {
					if (res.err_code == 0) {
						if (res.data != '') {
							that.list = res.data;
							that.$toast('数据更新成功');
						}
					} else {
						that.nodata=res.info;
						that.isNodata=true;
					}
				} else {
					that.$toast(res.err_msg);
					window.localStorage.isLogin = false;
					setTimeout(function() {
						common.goLink('/login', that);
					}, 1000);
				}
			});
		}
	},
	activated() {
		this.checkRoute();
		this.isNodata=false;
		this.onRefresh();
		$('.navTop').css({
			'min-height': window.innerHeight - 110 + 'px',
			'padding-bottom': '60px'
		});
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
	border-bottom: 1px solid #dddddd;
}
</style>
