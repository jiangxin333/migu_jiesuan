<template>
	<div class="navTop">
		<van-nav-bar title="提现" left-arrow right-text="提现记录" @click-left="onClickLeft" @click-right="onClickRight" fixed />
		<p class="cash_p" style="text-align: left;padding:4% 10%;color:#333333;">我的余额</p>
		<p class="cash_p" style="color: #999999;padding:0 10%;margin-bottom: 20px;">
			<span class="redTxt cashNum">{{ userInfo.balance / 100 }}</span>
			<span class="cashNum" style="margin-left: 5px;">元</span>
		</p>

		<div v-if="userInfo.balance >= userInfo.lower_money">
			<van-cell-group>
				<van-field
					v-model="cashMoney"
					placeholder="请输入要提现的金额"
					:clearable="true"
					:border="false"
					:readonly="userInfo.en_getcash_num == 0"
					type="number"
					input-align="center"
					@blur="showPicker"
				>
					<img src="https://quzhuan.oss-cn-beijing.aliyuncs.com/img/rmb.png" alt="" slot="left-icon" class="leftIco" />
					<span style="color:lightblue;" slot="button" @click="showPicker" v-if="columns.length > 0">选择金额</span>
					<span style="color:lightblue;margin-left: 10px;" slot="button" @click="getCash" v-if="userInfo.en_getcash_num == 1">全部提现</span>
				</van-field>
			</van-cell-group>
		</div>
		<!-- <van-cell-group>
			<van-cell>
				<van-row>
					<van-col span="12">提现中余额</van-col>
					<van-col span="12">
						<span style="float: right;text-align: right;" class="redTxt">
							{{ myBalance }} 元
						</span>
					</van-col>
				</van-row>
			</van-cell>
		</van-cell-group> -->

		<div v-if="userInfo.balance < userInfo.lower_money">
			<van-panel>
				<div slot="header" class="cash_p" style="display: block;height:40px;line-height: 40px;">微信提现</div>
				<div slot="footer">
					<p class="cash_p redTxt cashNum">你的提现余额不足</p>
					<p class="cash_p" style="font-size: 12px;margin:10px auto">
						余额达到
						<span class="redTxt">{{ userInfo.lower_money / 100 }}元</span>
						就可以进行提现哦！
					</p>
				</div>
			</van-panel>
		</div>
		<div class="btn">
			<van-button size="large" type="primary" square block @click="toArticle" v-if="userInfo.balance < userInfo.lower_money">去赚余额</van-button>
			<van-button size="large" type="primary" square block @click="drawCash" v-if="userInfo.balance >= userInfo.lower_money">提现</van-button>
		</div>
		<div class="getCoin">
			<h3>如何赚取奖励</h3>
			<h4>1.邀请好友阅读热门文章可获得奖励；</h4>
			<h4>2.收徒弟，师父可以获得徒弟的收益奖励哦；</h4>
			<h4>3.分享热门文章到朋友圈更容易获得奖励哦；</h4>
		</div>
		<van-popup v-model="show_picker" position="bottom" style="width: 100%!important;">
			<van-picker :columns="columns" :show-toolbar="showTool" title="" @confirm="onConfirm" @cancel="onCancel" />
		</van-popup>
		<van-popup v-model="ermShow">
			<img :src="ermUrl" class="qr_img" alt />
			<input type="button" class="ermBtn shareBtn" value="分享图片给朋友" @click="ermShare()" />
		</van-popup>
		<van-popup v-model="bindShow" :close-on-click-overlay="false">
			<img :src="bindurl" class="qr_img" alt />
			<input
				type="button"
				class="ermBtn shareBtn"
				style="background:#FF4444;color:#FFFFFF;top:91%;width:auto;padding:0 2%;margin:0;transform: translate3d(-50%,8%,0);"
				value="发送图片到微信长按识别"
				@click="bindShare()"
			/>
		</van-popup>
	</div>
</template>

<script>
import common from '../assets/js/common.js';

export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'cash_withdrawal',
	data() {
		return {
			userInfo: '',
			cashMoney: 0,
			show: false,
			myBalance: 0,
			columns: [],
			show_picker: false,
			showTool: true,
			shareShow: false,
			ermShow: false,
			ermUrl: '',
			bindurl: '',
			bindShow: false
		};
	},
	methods: {
		ermShare() {
			this.shareShow = false;
			this.ermShow = false;
			// 分享图片
			api.sendEvent({
				name: 'share',
				extra: {
					type: 'image',
					timeline: false, // false表示发送给还有，true表示分享朋友圈
					pic: this.ermUrl // 图片地址
				}
			});
		},
		bindShare() {
			this.bindShow = false;
			// 分享图片
			api.sendEvent({
				name: 'share',
				extra: {
					type: 'image',
					timeline: false,
					pic: this.bindurl // 图片地址
				}
			});
		},
		onCopy() {
			this.$toast('复制成功');
			this.bindShow = false;
		},
		onError() {
			this.$toast('复制失败');
		},
		drawCash: function() {
			var that = this;
			console.log('draw');
			if (this.cashMoney == '') {
				this.$toast('请输入提现金额后再提现');
				return;
			}
			if (this.shareShow) {
				that.$dialog
					.confirm({
						title: '温馨提示',
						message: '邀请分享给好友吧，助力提现更快到账哦～',
						showConfirmButton: true,
						showCancelButton: false,
						confirmButtonText: '好的'
					})
					.then(() => {
						this.ermShow = true;
					});
				return;
			}
			common.toAjax(
				common.host + '/getcashs/apply',
				{
					money: that.cashMoney
				},
				function(res) {
					if (res.err_code != 800) {
						that.$toast(res.err_msg);
						if (res.err_code == 2005) {
							that.bindShow = true;
						} else if (res.err_code == 20052) {
							that.$toast.clear();
							that.$dialog
								.confirm({
									title: '温馨提示',
									message: res.err_msg,
									showConfirmButton: true,
									showCancelButton: false,
									confirmButtonText: '好的'
								})
								.then(() => {
									that.$router.replace('/article');
								});
						} else {
							that.bindShow = false;
							if (res.err_code == 0) {
								var userInfo = common.getVal('userInfo');
								userInfo.balance = res.data.balance;
								that.userInfo.balance = res.data.balance;
								common.setVal('userInfo', userInfo);
								that.shareShow = true;
							}
							common.toAjax(common.host + '/getcashs/cashing', {}, function(res) {
								if (res.err_code != 800) {
									if (res.err_code == 0) {
										that.myBalance = res.data.cashing / 100;
										// that.columns = res.data.getcashes_btn;
										that.getCashBtn(res.data.getcashes_btn);
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
					} else {
						that.$toast(res.err_msg);
						window.localStorage.isLogin = false;
						setTimeout(function() {
							common.toLogin(that);
						}, 1000);
					}
				}
			);
		},
		onClickLeft: function() {
			this.$router.go(-1);
			this.$dialog.close();
			this.ermShow = false;
			this.shareShow = false;
		},
		onClickRight() {
			common.goLink('/cash_record', this);
		},
		getCash() {
			this.cashMoney = this.userInfo.balance / 100;
		},
		tolowerCash(money) {
			if (money < this.userInfo.lower_money / 100 && this.userInfo.en_getcash_num == 1) {
				this.$toast('最低提现金额为' + this.userInfo.lower_money / 100 + '元');
			}
		},
		toArticle() {
			common.goLink('/article', this);
			this.money();
		},
		onConfirm(picker, value, index) {
			this.cashMoney = picker.text;
			this.show_picker = false;
		},
		onCancel() {
			this.show_picker = false;
		},
		showPicker() {
			this.show_picker = true;
		},
		getCashBtn(data) {
			var btnsArr = [];
			this.cashMoney = data[0];
			if (data[0] > this.userInfo.balance / 100) {
				this.showTool = false;
			} else {
				this.showTool = true;
			}
			for (var i = 0; i < data.length; i++) {
				var btnArr = {
					text: '',
					disabled: true
				};
				btnArr.text = data[i];
				if (data[i] == 1) {
					btnArr.disabled = false;
				} else {
					btnArr.disabled = true;
					if (data[i] > this.userInfo.balance / 100 || data[0] == 1) {
						btnArr.disabled = true;
					} else {
						btnArr.disabled = false;
					}
				}
				btnsArr.push(btnArr);
			}
			this.columns = btnsArr;
		}
	},
	activated() {
		var that = this;
		that.checkRoute();
		that.cashMoney = 0;
		that.showTool = true;
		that.userInfo = common.getVal('userInfo');
		if (that.$store.state.qrcode_img != '') {
			that.ermUrl = that.$store.state.qrcode_img;
		} else {
			common.toAjax(common.host + '/user_st/st_img', { type: 'mentor' }, function(res) {
				if (res.err_code == 0) {
					that.ermUrl = res.data.qrcode_img;
					that.$store.commit('SETIMG', res.data.qrcode_img);
					// this.show = true;
				} else {
					that.$toast(res.info);
				}
			});
		}
		$('.van-icon--image').css('margin-top', '3px!important');
		common.toAjax(common.host + '/getcashs/cashing', {}, function(res) {
			if (res.err_code != 800) {
				if (res.err_code == 0) {
					that.myBalance = res.data.cashing / 100;
					that.bindurl = res.data.bindurl;
					if (res.data.bindurl != '') {
						that.bindShow = true;
					} else {
						that.bindShow = false;
					}
					if (res.data.need_st == true) {
						that.shareShow = true;
					}
					// that.columns = res.data.getcashes_btn;
					that.getCashBtn(res.data.getcashes_btn);
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
};
</script>

<style scoped>
.cash_p {
	width: 80%;
	text-align: center;
	font-size: 14px;
	margin: 0 auto;
}

.cashNum {
	font-size: 18px;
	display: inline-block;
	vertical-align: middle;
}
.cash_p.cashNum {
	width: 100%;
}
.getCoin {
	margin: 5%;
}
.value_right {
	text-align: right !important;
}
.leftIco {
	width: 18px;
	margin-top: 2px;
}
.van-popup {
	background-color: transparent;
	width: 80%;
}
.van-popup img {
	width: 100%;
}
.ermBtn {
	width: 110px;
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	background: #f4cd1c;
	border-radius: 5px;
	border: none;
	color: #de480d;
	position: fixed;
	top: 90%;
	margin-left: -55px;
}

.ermBtn.shareBtn {
	left: 50%;
}
</style>
