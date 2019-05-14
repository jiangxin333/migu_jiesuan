<template>
	<div class="navTop">
		<van-nav-bar title="通知中心" left-arrow @click-left="onClickLeft" fixed />
		<van-notice-bar
			:text="msg.title"
			color="#333333"
			background="#ffffff"
			left-icon="volume-o"
			mode="link"
			:scrollable="false"
			@click="toNotice(msgindex)"
			v-for="(msg, msgindex) in pubmsgs"
			:key="msgindex"
		/>
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	name: 'notice_list',
	data() {
		return {
			pubmsgs: '',
			direction: ''
		};
	},
	activated() {
		var that = this;
		common.toAjax(common.host + '/common/pubmsgs', {}, function(res) {
			that.pubmsgs = res.data.msgs;
		});
	},
	methods: {
		onClickLeft() {
			common.goBack(this);
		},
		toNotice(id) {
			common.goLink('/notice', this);
			common.setVal('noticeInfo', id);
		}
	}
};
</script>

<style></style>
