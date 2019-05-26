<template>
	<div class="navTop account_course">
		<van-nav-bar title="微信实名教程" style="border-bottom: 1px solid #efefef;" left-arrow @click-left="onClickLeft" fixed />
		<div class="content">
			<p style="font-size: 16px;margin-top: 20px;">如果您的微信账号没有认证，会导致提现失败，请按照以下步骤进行操作：</p>
			<div class="box11">
				<img class="box_img" src="https://qzjiesuan.oss-cn-hangzhou.aliyuncs.com/front/img/course.png" alt="">
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'account_course',
		data() {
			return {
				msg: "实名教程"
			}
		},
		methods: {
			onClickLeft() {
				this.$router.go(-1);
			}
		},
	}
</script>

<style scoped>
	.content {
		width: 92%;
		margin: 0 4%;
	}
	.box11 {
		width: 100%;
		margin-top: 20px;
	}
	.box_img {
		width: 100%;
	}
</style>
