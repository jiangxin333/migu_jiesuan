<template>
	<div class="navTop">
		<van-nav-bar title="联系客服" left-arrow @click-left="onClickLeft" fixed />
		<div class="whiteBg noAlign">
			<van-row>
				<van-col span="16">
					<p>{{ services.name.title }}-{{ services.name.text_value }}</p>
					<p>QQ号：{{ services.weixin.text_value }}</p>
					<p>客服工作时间：{{ services.hours.text_value }}</p>
				</van-col>
				<van-col span="8">
					<van-button
						size="small"
						type="primary"
						v-clipboard:copy="services.weixin.text_value"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
					>
						复制QQ号
					</van-button>
				</van-col>
			</van-row>
		</div>
		<div class="whiteBg">
			<p>扫描二维码</p>
			<div id="ermContent"></div>
		</div>
		
	</div>
</template>

<script>
import common from '../assets/js/common';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'services',
	data() {
		return {
			services: {
				name: {
					title: '',
					text_value: ''
				},
				weixin: {
					text_value: ''
				},
				hours: {
					text_value: ''
				},
				video: {
					text_value: ''
				}
			}
		};
	},
	methods: {
		onClickLeft: function() {
			this.my();
			this.Toast.clear();
			common.goBack(this);
		},
		onCopy() {
			this.$toast('复制成功');
		},
		onError() {
			this.$toast('复制失败');
		}
	},
	activated() {
		var that = this;
		that.checkRoute();
		common.toAjax(
			common.host + '/common/customer',
			{},
			function(res) {
				console.log(res.data);
				if (res.err_code != 800) {
					if (res.err_code == 0) {
						that.Toast.clear();
						that.services = res.data;
						$('#ermContent').html(res.data.code.value);
					} else {
						that.$toast(res.err_msg);
					}
				} else {
					common.goLink('/login', that);
				}
			},
			that
		);
	}
};
</script>

<style scoped>
.whiteBg {
	background: #ffffff;
	padding: 10px 5%;
	width: 90%;
	margin-bottom: 10px;
}
.whiteBg p {
	text-align: center;
	margin: 5px auto;
}
.whiteBg.noAlign p {
	text-align: left;
}
.whiteBg p:first-child {
	text-align: left;
}
.ermImg {
	width: 120px;
	margin: 10px auto;
}
.video {
	width: 100%;
}
</style>
