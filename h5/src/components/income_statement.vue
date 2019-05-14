<template>
	<div class="navTop">
		<van-nav-bar title="收益说明" left-arrow @click-left="onClickLeft" fixed />
		<div class="panelCard" v-for="(item, index) in incomeinfo" :key="index">
			<van-cell-group>
				<div style="text-align: center;padding:15px 0;border-bottom: 1px solid #dddddd;">
					<div class="line"></div>
					<span class="titleTxt">{{ item.title }}</span>
					<div class="line right_line"></div>
				</div>
				<div class="footContent" style="padding:2% 5%" :id="index"></div>
			</van-cell-group>
		</div>
		
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'income_statement',
	data() {
		return {
			incomeinfo: []
		};
	},
	methods: {
		onClickLeft: function() {
			this.$router.go(-1);
		}
	},
	activated() {
		var that = this;
		that.checkRoute();
		common.toAjax(common.host + '/users_money/getincomeinfo', {}, function(res) {
			if (res.err_code != 800) {
				if (res.err_code == 0) {
					that.incomeinfo = res.data;
					console.log('incomeinfo', res);
					that.$nextTick(function() {
						for (var i = 0; i < that.incomeinfo.length; i++) {
							console.log(that.incomeinfo[i].value);
							$('#' + i).html(that.incomeinfo[i].value);
						}
					});
				} else {
					that.$toast(res.err_msg);
				}
			} else {
				that.$toast(res.err_msg);
				setTimeout(function() {
					common.goLink('/login', that);
				}, 1000);
			}
		});
	}
};
</script>

<style scoped>
.panelCard {
	width: 94%;
	margin: 2% 3%;
}
</style>
