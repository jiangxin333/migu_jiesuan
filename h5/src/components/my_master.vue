<template>
	<div class="navTop" style="padding-top: 30px;">
		<van-nav-bar title="我的师傅" left-arrow @click-left="onClickLeft" fixed />

		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="true">
			<div class="mainBody" :style="mainBody">
				<div class="redTop"></div>
				<div style="width: 100%;height: 100%;position: absolute;top:15px;left:0;z-index: 9999;">
					<div class="whiteCard">
						<p>
							<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/master-1.png" alt="" />
							<span>你的师傅：</span>
							<span style="max-width:30%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ user_name }}</span>
							<span>({{ phone }})</span>
						</p>
						<p>
							<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/master-2.png" alt="" />
							<span>师傅徒弟数：</span>
							<span class="redTxt">{{ personNum }}人</span>
						</p>
						<p>
							<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/master-3.png" alt="" />
							<span>师傅累计收益：</span>
							<span class="redTxt">{{ totoalPrice }}元</span>
						</p>
					</div>
					<div class="whiteCard">
						<p style="font-size: 14px" solt="header">联系方式</p>
						<div class="inputGroup">
							<van-row>
								<van-col span="16">
									<van-field v-model="weixin" center readonly border left-icon="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/weixin.png"
									 :placeholder="weixinNum"></van-field>
								</van-col>
								<van-col span="8">
									<van-button size="small" type="primary" :disabled="weixin == ''" v-clipboard:copy="weixin" v-clipboard:success="onCopy"
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
									<van-button size="small" type="primary" :disabled="QQ == ''" v-clipboard:copy="QQ" v-clipboard:success="onCopy"
									 v-clipboard:error="onError">
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
		name: 'my_master',
		data() {
			return {
				isLoading: false,
				personNum: 0,
				phone: '13800000000',
				user_name: '转转用户',
				id: 2342410,
				totoalPrice: common.tofix2(0 / 100),
				weixin: '',
				weixinNum: '暂无师傅微信信息',
				QQ: '',
				qqNum: '暂无师傅QQ信息',
				mainBody: {
					'position': 'relative',
					'min-height': window.innerHeight * 0.9 + 'px'
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
					type: 1
				},
				function(res) {
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							console.log(res.data);
							that.phone = res.data.tel;
							that.personNum = res.data.td_count;
							that.totoalPrice = res.data.total_income / 100;
							that.user_name = res.data.user_name;
							if (res.data.qq != '') {
								that.QQ = res.data.qq;
							}
							if (res.data.weixin != '') {
								that.weixin = res.data.weixin;
							}
						} else {
							that.$toast(res.err_msg);
						}
					} else {
						that.$toast(res.err_msg);
						setTimeout(function() {
							common.goLink('/login', that);
						}, 10000);
					}
				}
			);
		}
	};
</script>

<style scoped>
.mainBody {
		position: relative;
		height: 500px;
		padding-top: 10px;
	}

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
</style>
