<template>
	<div class="navTop" :style="styleH">
		<van-nav-bar title="联系客服" left-arrow @click-left="onClickLeft" fixed />
		<div class="mainContainer">
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item, index) in serviceList" :key="index">
						<img class="headImg" :src="item.img" alt="" />
						<p style="color: #333333; font-size: 18px;">{{ item.name }}</p>
						<p>客服工作时间 &nbsp;&nbsp;9:00 - 18:00</p>
						<p>
							QQ:
							<span id="qqNum">{{ item.qq }}</span>
						</p>
						<p>
							<van-button size="small" type="info" id="copyBtn">复制QQ号</van-button>
						</p>
						<p><img class="teshuImg" :src="item.qqqrcode" alt="" /></p>
					</div>
				</div>
				<!--右箭头-->
				<div class="swiper-button-prev swiper-button-white"></div>
				<!--左箭头-->
				<div class="swiper-button-next swiper-button-white"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import common from '../assets/js/common.js';
	import Swiper from 'swiper';
	import 'swiper/dist/css/swiper.css';
	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'services',
		data() {
			return {
				serviceList: [],
				styleH: {
					height: ''
				},
				copyVal: ''
			};
		},

		methods: {
			onClickLeft: function() {
				this.my();
				this.Toast.clear();
				common.goBack(this);
			},

			initSwiper() {
				var that = this;
				new Swiper('.swiper-container', {
					loop: true,
					effect: 'cube',
					cubeEffect: {
						slideShadows: true,
						shadow: true,
						shadowOffset: 100,
						shadowScale: 0.6
					},
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					},
					on: {
						click: function(e) {
							if (e.target.id == 'copyBtn') {
								that.copyUrl2(that.serviceList[this.realIndex].qq);
							}
						}
					}
				});
			},
			copyUrl2(val) {
				var that = this;
				this.$copyText(val).then(
					function(e) {
						that.$toast('复制成功');
					},
					function(e) {
						that.$toast('复制失败');
						console.log(e);
					}
				);
			}
		},
		activated() {
			this.styleH.height = window.innerHeight - 45 + 'px';
			var that = this;
			that.checkRoute();
			common.toAjax(
				common.host + '/common/customer', {},
				function(res) {
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							that.Toast.clear();
							that.serviceList = res.data;
							that.$nextTick(function() {
								that.initSwiper();
							});
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
	.navTop {
		background: linear-gradient(#f29123, #f95806);
	}

	.swiper-slide {
		width: 100%;
		background-color: #fff;
		text-align: center;
		border-radius: 6px;
	}

	.swiper-slide p {
		margin-bottom: 10px;
		font-size: 14px;
		color: #9b9b9b;
	}

	img {
		width: 20%;
		border-radius: 50%;
	}

	.headImg {
		padding-top: 5%;
	}

	.mainContainer {
		width: 80%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
	}

	.swiper-container {
		width: 100%;
		border-radius: 6px;
	}

	.teshuImg {
		width: 70%;
		border-radius: 0;
		padding: 5% 0;
	}

	.swiper-button-prev {
		left: -10%;
		outline: none;
	}

	.swiper-button-next {
		right: -10%;
		outline: none;
	}

	.van-button {
		width: 100px;
		height: 28px;
		background-color: #f2891f;
		border: none;
		border-radius: 6px;
	}
</style>
