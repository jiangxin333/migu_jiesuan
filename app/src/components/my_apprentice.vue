<template>
	<div class="navTop" style="padding-top: 30px;">
		<van-nav-bar title="徒弟详情" left-arrow @click-left="onClickLeft" fixed />

		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<div class="mainBody" :style="mainBody">
				<div class="redTop"></div>
				<div style="width: 100%;height: 100%;position: absolute;top:15px;left:0;z-index: 9999;">
					<div class="whiteCard">
						<van-row>
							<van-col span="5"><img v-lazy="td_img" class="apprenticeImg" alt="" /></van-col>
							<van-col span="19">
								<p style="margin-top: 20px;">转转号：{{ tel }}</p>
								<p>注册时间：{{ reg_time }}</p>
							</van-col>
						</van-row>
					</div>
					<div class="whiteCard">
						<div class="bc">
							<van-row type="flex" justify="space-between">
								<van-col span="9"><span class="taskList-title">任务列表</span></van-col>
								<van-col span="7"><span class="taskList-title">奖励金（元）</span></van-col>
								<van-col span="5"><span class="taskList-title">完成状态</span></van-col>
							</van-row>
						</div>
						<div :class="{ bc2: index % 2 == 0, bc: index % 2 == 1 }" id="taskitem" v-for="(item, index) in taskList" :key="index">
							<van-row type="flex" justify="space-between">
								<van-col span="9">
									<span class="span2">{{ item.name }}</span>
								</van-col>
								<van-col span="7">
									<span class="redTxt">+{{ item.prize_money / 100 }}</span>
									<img src="../assets/img/price.png" alt="" />
								</van-col>
								<van-col span="5"><img :src="item.finish_status == 1 ? completeImg : not_completeImg" alt="" class="statusImg" /></van-col>
							</van-row>
						</div>
					</div>
					<div class="whiteCard">
						<div style="font-size: 14px" solt="header">
							<p style="width: 100%;text-align: center;">联系徒弟完成剩余任务，可获得剩余奖励金</p>
							<p class="redTxt" style="width: 100%;text-align: center;">{{ tel }}</p>
						</div>
						<div class="inputGroup">
							<van-row>
								<van-col span="16">
									<van-field v-model="weixin" center readonly border left-icon="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/weixin.png"
									 :placeholder="weixinNum"></van-field>
								</van-col>
								<van-col span="8">
									<van-button size="small" type="primary" v-clipboard:copy="weixin" v-clipboard:success="onCopy"
									 v-clipboard:error="onError">
										复制微信联系师傅
									</van-button>
								</van-col>
							</van-row>
						</div>
						<div class="inputGroup">
							<van-row>
								<van-col span="16">
									<van-field v-model="QQ" center readonly border left-icon="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/qq.png"
									 :placeholder="qqNum"></van-field>
								</van-col>
								<van-col span="8">
									<van-button size="small" type="primary" v-clipboard:copy="QQ" v-clipboard:success="onCopy" v-clipboard:error="onError">
										复制QQ联系师傅
									</van-button>
								</van-col>
							</van-row>
						</div>
					</div>
				</div>
			</div>
		</van-pull-refresh>
		<input type="hidden" id="weixinNum" :value="weixinNum" />
		<input type="hidden" id="qqNum" :value="qqNum" />
	</div>
</template>

<script>
	import common from '../assets/js/common.js';

	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'my_apprentice',
		data() {
			return {
				isLoading: false,
				personNum: 1,
				totoalPrice: common.tofix2(1810 / 100),
				weixin: '',
				weixinNum: '暂无师傅微信信息',
				QQ: '',
				qqNum: '暂无师傅QQ信息',
				taskList: [],
				td_img: '',
				completeImg: require('../assets/img/complete.png'),
				not_completeImg: require('../assets/img/not_complete.png'),
				tel: '13800000000',
				reg_time: '1900-00-00',
				mainBody: {
					'position': 'relative',
					'min-height': window.innerHeight - 30 + 'px',
					'overflow': 'auto'
				}
			};
		},
		methods: {
			onClickLeft: function() {
				this.mentors();
				this.$router.go(-1);
			},
			onRefresh() {
				setTimeout(() => {
					this.$toast('刷新成功');
					this.isLoading = false;
				}, 500);
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
				common.host + '/user_st/one_info', {
					type: 2,
					uid: that.$route.params.id
				},
				function(res) {
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							that.taskList = res.data.task_list;
							that.tel = res.data.tel;
							that.reg_time = res.data.reg_time;
							that.QQ = res.data.qq;
							that.weixin = res.data.weixin;
							that.td_img = res.data.img;
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						setTimeout(function() {
							common.goLink('/login', that);
						}, 1000);
					}
				}
			);
		}
	};
</script>

<style scoped>
	.redTop {
		background: #ff4444;
		width: 100%;
		height: 80px;
		z-index: 0;
		position: absolute;
		top: 0;
	}

	.whiteCard {
		width: 88%;
		margin: 20px 5%;
		background: #ffffff;
		border-radius: 5px;
		padding: 10px 1%;
	}

	.whiteCard img {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	.whiteCard span {
		font-size: 14px;
	}

	.whiteCard p {
		width: 90%;
		margin: 10px auto;
	}

	.whiteCard img,
	.whiteCard span {
		display: inline-block;
		vertical-align: middle;
	}

	.inputBox,
	.inputBtn {
		display: inline-block;
		vertical-align: middle;
	}

	.inputGroup {
		margin: 10px 4%;
	}

	.inputBox {}

	.van-cell {
		border: 1px solid #dddddd;
		border-radius: 5px 0 0 5px;
		padding: 2px 5px;
	}

	.bc {
		background: #fff8f6;
	}

	.bc2 {
		background: #ffffff;
	}

	.apprenticeImg {
		width: 60px !important;
		height: 60px !important;
		margin: 10px;
		display: block;
		border-radius: 50%;
	}

	.bc,
	.bc2 {
		padding: 10px 0;
	}

	.statusImg {
		width: 40px !important;
		height: 40px !important;
		margin: 0 auto;
		display: inline-block;
	}
</style>
