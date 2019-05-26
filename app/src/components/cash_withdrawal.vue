<template>
	<div class="navTop" :style="styleH">
		<van-nav-bar style="border-bottom: 1px solid #F1F1F1;" title="提现" left-arrow @click-left="onClickLeft" fixed />
		<div class="cashBox">
			<div class="cashBalance">
				<p style="font-size: 20px;color: #333;">我的余额 : <span class="balanceStyle">￥{{ userInfo.balance / 100 }}</span></p>
			</div>
			<div @click="onClickRight" style="padding-top: 2px;">
				<span style="font-size: 14px; color: #999;padding-right: 5px;">提现记录</span>
				<van-icon style="position: relative; top: 3px;" name="arrow" tag="span" color="#999"></van-icon>
			</div>
		</div>
		<div style="height: 12px; background-color: #F1F1F1;"></div>
		<div class="cashMoney">
			<div v-for="(item,index) in moneyList" :key="index" :class="['card' + index +' card',index == 0 ? 'teshu' : '']" @click="changStyle(index,item.desc,item.money,item.name)">
				<div class="box">
					<p style="font-weight: 700; font-size: 18px;">{{item.money}} <span style="font-size: 14px;">元</span></p>
					<p :class="['color' +index + ' color',index == 0 ? 'teshu1' : '']">{{item.title}}</p>
				</div>
			</div>
		</div>
		<!-- 提现说明-->
		<div class="cashExplain">
			<p style="font-size: 16px;color: #666;">提现说明 :</p>
			<div class="cachMsg cachDesc">{{desc}}</div>
		</div>
		<!-- 赚取奖励 -->
		<div class="attention">
			<p style="font-size: 16px; color: #666;">注意事项 :</p>
			<div class="cachMsg">
				<p>1.申请提现后将在2个工作日内完成审核并打款到账，节假日顺延。</p>
				<p>2.提现账号中填写的真实姓名，请于微信账号的认证姓名保持一致。</p>
				<p>3.提现完成后，可在微信-我-钱包-零钱-零钱明细中查看到账详情。</p>
			</div>
		</div>
		<div class="boxBtn">
			<van-button class="cashBtn" round size="lang" type="danger" @click="drawCash">立即提现</van-button>
		</div>
		<van-popup v-model="ermShow" :close-on-click-overlay="false">
			<img :src="ermUrl" class="qr_img" alt />
			<p style="margin-top: 5px;text-align: center;">
				<input type="button" class="ermBtn" value="分享图片给朋友" @click="ermShare()" />
			</p>
		</van-popup>
			<!-- <van-popup v-model="bindShow" :close-on-click-overlay="false">
				<img :src="bindurl" class="qr_img" alt />
				<input type="button" class="ermBtn shareBtn" style="background:#FF4444;color:#FFFFFF;top:91%;width:auto;padding:0 2%;margin:0;transform: translate3d(-50%,8%,0);"
				 value="发送图片到微信长按识别" @click="bindShare()" />
			</van-popup> -->
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
				show: false,
				myBalance: 0,
				columns: [],
				showTool: true,
				shareShow: false,
				ermUrl: '',
				bindurl: '',
				bindShow: false,
				chooseIndex: 0,
				showMoney: false,
				// 5.20
				shareType: 'share',
				styleH: {
					"height": window.innerHeight - 45 + "px",
					"background-color": "#fff",
				},
				moneyList: [],
				cashMoney: '', //提现金额
				apply_fail_tip: '', //提现驳回消息
				share_day: '', //连续分享天数
				desc: '', //提现说明
				ermShow: false, //是否显示收徒二维码
				name: '', //提现时传给后端
			};
		},
		methods: {
			changStyle(num, desc, money, name) {
				$(".card" + num).addClass("teshu").siblings().removeClass("teshu");
				$(".card p").removeClass("teshu1");
				$(".color" + num).addClass("teshu1");
				this.cashMoney = money;
				this.name = name;
				if (name == "item4") {
					$(".cachDesc").html(desc+ "<span style='color: red;font-weight: 700;'>"+ this.share_day +"天</span>") 
				} else {
					$(".cachDesc").html(desc) 
				};
			},
			ermShare() {
				this.shareShow = false;
				this.ermShow = false;
				// 分享图片
				api.sendEvent({
					name: this.shareType,
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
					name: this.shareType,
					extra: {
						type: 'image',
						timeline: false,
						pic: this.bindurl // 图片地址
					}
				});
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
					common.host + '/getcashs/apply', {
						money: that.cashMoney,
						name: that.name
					},
					function(res) {
						if (res.err_code != 800) {
							that.$toast(res.err_msg);
							if (res.err_code == 2005) {
								that.bindShow = true;
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
										that.$router.replace('/account');
									});
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
			init_chooseBtn() {
				this.chooseIndex = 0;
				this.cashMoney = this.columns[0].text;
			},
			getCashBtn(data) {
				var btnsArr = [];
				this.cashMoney = data[0];
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
				this.init_chooseBtn();
				console.log(this.columns);
			}
		},
		activated() {
			var that = this;
			that.checkRoute();
			that.cashMoney = 0;
			that.showTool = true;
			that.userInfo = common.getVal('userInfo');
			if (common.getVal('loginData').app_share_type != 'share') {
				this.shareType = 'fakeShare';
			}
			if (that.$store.state.qrcode_img != '') {
				that.ermUrl = that.$store.state.qrcode_img;
			} else {
				common.toAjax(common.host + '/user_st/st_img', {
					type: 'mentor'
				}, function(res) {
					if (res.err_code == 0) {
						that.ermUrl = res.data.qrcode_img;
						that.$store.commit('SETIMG', res.data.qrcode_img);
					} else {
						that.$toast(res.err_msg);
					}
				});
			}
			common.toAjax(common.host + '/getcashs/moneybtn', {}, function(res) {
				if (res.err_code == 0) {
					// card盒子数据
					that.moneyList = res.data.btn_info;
					// 提现驳回消息
					that.apply_fail_tip = res.data.apply_fail_tip;
					// 连续分享天数
					that.share_day = res.data.share_day;
					//默认显示第一个提现说明
					that.desc = that.moneyList[0].desc;
					//默认提现金额
					that.cashMoney = that.moneyList[0].money;
					//是否需要收徒才能申请，每个用户控制
					that.shareShow = res.data.need_st;
					//默认第一个提现name
					that.name = that.moneyList[0].name;
					//每次进入页面默认选中第一个
					that.changStyle(0,that.desc,that.cashMoney,that.name);
					//判断是否有驳回消息，并显示
					if (res.data.apply_fail_tip != undefined && res.data.apply_fail_tip != '') {
						that.$dialog
							.confirm({
								title: '温馨提示',
								message: res.data.apply_fail_tip,
								showConfirmButton: true,
								showCancelButton: false,
								confirmButtonText: '去分享'
							})
							.then(() => {
								common.goLink('/mentor',that)
							});
					}
				} else {
					that.$toast(res.err_msg)
				}
			})
		}
	};
</script>

<style scoped>
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
		bottom: 0%;
	}

	.ermBtn.shareBtn {
		left: 50%;
	}

	.choosed {
		color: #ffffff !important;
		background: #db1e1e !important;
	}

	/* 修改样式书写开始*/
	.cashBox {
		width: 92%;
		margin: 0 4% 0;
		display: flex;
		justify-content: space-between;
		text-align: center;
		font-size: 16px;
		padding: 20px 0;
	}

	.balanceStyle {
		border-radius: 8px;
		padding: 0 5px;
		color: #fff;
		background: linear-gradient(to right, #ffbf5c, #ff601c);
		font-size: 16px;
		font-weight: 700;
		border-bottom-left-radius: 0;
	}

	.cashMoney {
		display: flex;
		width: 92%;
		margin: 0 4%;
		flex-wrap: wrap;
		padding-top: 10px;
	}

	.card {
		position: relative;
		width: 31%;
		text-align: center;
		border: 1px solid #666666;
		margin: 2% 1.7% 0 0;
		border-radius: 5px;
		height: 50px;
		color: #333333;
		padding: 4px 0;
	}
	.box {
		position: absolute;
		width: 100%;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.color {
		color: #666;
	}

	/* 提现说明 */
	.cashExplain {
		width: 92%;
		margin: 10px 4% 0;
	}

	.cachMsg {
		margin-top: 15px;
		font-size: 14px;
		color: #999;
	}

	.cachMsg p {
		margin: 5px 0;
	}

	/*注意事项 */
	.attention {
		width: 92%;
		margin: 20px 4% 0;
	}

	/* 提现按钮 */
	.boxBtn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding: 5px 0;
	}

	.cashBtn {
		width: 94%;
		margin: 5px 3%;
	}

	/* card选中样式 */
	.teshu {
		background-color: #FFCCCC;
		color: #FF5C5C;
		border-color: #FF2400;
		background: url("../assets/img/card.png") no-repeat;
		background-size: 23px;
		background-position: top right;
	}

	.teshu1 {
		color: #FF5C5C;
	}
</style>
