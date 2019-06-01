<template>
	<div class="navTop" :style="navTop">
		<van-nav-bar title="师徒" fixed style="border-bottom: 1px solid #F2F2F2;" left-arrow @click-left="onClickLeft" />
		<!-- 顶部轮播消息 -->
		<div class="swiper-container" :style="swiperHeight">
			<div class="swiper-wrapper">
				<div class="swiper-slide" v-for="(item, index) in data1" :key="index">
					<van-icon name="https://qiniustore.zmr016.com/invite/volume.png" :style="volumeIco" />
					{{ item.name }}刚邀请了{{ item.child_num }}位好友将获得{{ item.total_money / 100 }}元
				</div>
			</div>
		</div>
		<!-- 顶部轮播消息 end -->
		<!-- 顶部广告图 -->
		<div class="topArea" style="position: relative;">
			<img src="https://qiniustore.zmr016.com/invite/top-bg-new.png" alt="" style="width: 100%" />
			<span :style="topTxt">每邀请一位可赚{{ min }}-{{ max }}元</span>
			<div :style="top_input_big" class="top-input-big">
				<van-row :style="top_input_big_row">
					<van-col span="8" :style="top_input_big_span" class="top_input_big_span_txt">已邀请好友</van-col>
					<van-col span="8" :style="top_input_big_span" class="top_input_big_span_txt">有效好友</van-col>
					<van-col span="8" :style="top_input_big_span" class="top_input_big_span_txt">预计收益</van-col>
				</van-row>
				<van-row :style="top_input_big_row">
					<van-col span="8" :style="top_input_big_span">
						<span class="top_input_big_span_num">{{ invite_num }}&nbsp;</span>
						<span class="top_input_big_span_company">位</span>
					</van-col>
					<van-col span="8" :style="top_input_big_span">
						<span class="top_input_big_span_num">{{ friendnum }}&nbsp;</span>
						<span class="top_input_big_span_company">位</span>
					</van-col>
					<van-col span="8" :style="top_input_big_span">
						<span class="top_input_big_span_num">{{ future_money / 100 }}&nbsp;</span>
						<span class="top_input_big_span_company">元</span>
					</van-col>
				</van-row>
			</div>
		</div>
		<!-- 顶部广告图 end -->
		<!-- tab标签卡 -->
		<van-row :style="centerTab_box" type="flex" align="bottom">
			<van-col span="8" v-for="(item, tabIndex) in tabList" :key="tabIndex">
				<div :style="tabIndex == chooseTabIndex ? centerTab_active : centerTab" @click="chooseTab(tabIndex)">{{ item }}</div>
			</van-col>
		</van-row>
		<!-- tab标签卡 end -->
		<!-- tab内容卡 邀请好友 -->
		<div v-if="chooseTabIndex == 0">
			<div class="centerBox" :style="centerBox">
				<!-- 区间信息条 -->
				<p :style="location_p">
					<img src="https://qiniustore.zmr016.com/invite/location.png" alt="" slot="icon" style="transform: scale(.6);-ms-transform: scale(.6);-moz-transform: scale(.6);-webkit-transform: scale(.6);-o-transform: scale(.6);display: inline-block;vertical-align: middle;" />
					<span slot="title" :style="location_txt">当前奖励区间：{{ current_money }}元/位</span>
				</p>
				<!-- 区间信息条 end -->
				<!-- 步骤条 -->
				<div :style="step_box" class="step_box" v-if="stepList == 5">
					<div class="step_yellow" :style="step_yellow">
						<div class="step_red" :style="step_red_5_1" v-if="stepList == 5 && stepNum == 1"></div>
						<div class="step_red" :style="step_red_5_2" v-if="stepList == 5 && stepNum == 2"></div>
						<div class="step_red" :style="step_red_5_3" v-if="stepList == 5 && stepNum == 3"></div>
						<div class="step_red" :style="step_red_5_4" v-if="stepList == 5 && stepNum == 4"></div>
						<div class="step_red" :style="step_red_5_5" v-if="stepList == 5 && stepNum == 5"></div>
					</div>
					<ul :style="ulStyle" class="ulStyle">
						<li v-for="stepIndex in stepList" :key="stepIndex" :class="stepList <= 3 ? 'step3' : 'step5'">
							<img v-lazy="stepNum == stepIndex ? step_active_ico : step_ico" alt="" :style="stepNum == stepIndex ? { 'margin-top': '-3px' } : ''" />
							<img src="https://qiniustore.zmr016.com/invite/money-1.png" alt="" class="currentMoney" :style="currentMoney"
							 v-if="stepIndex == stepNum" />
							<img src="https://qiniustore.zmr016.com/invite/money-2.png" alt="" :style="lastMoney" v-if="stepIndex == stepList" />
							<span class="stepTxt" :style="stepIndex == stepNum ? 'font-weight:bold' : ''" v-if="stepIndex == 1">分享一次</span>
							<span class="stepTxt" :style="stepIndex == stepNum ? 'font-weight:bold' : ''" v-if="stepIndex == 2">分享到群</span>
							<span class="stepTxt" :style="stepIndex == stepNum ? 'font-weight:bold' : ''" v-if="stepIndex == 3">第一位</span>
							<span class="stepTxt" :style="stepIndex == stepNum ? 'font-weight:bold' : ''" v-if="stepIndex == 4">第二位</span>
							<span class="stepTxt" :style="stepIndex == stepList ? updatePrice : ''" v-if="stepIndex == 5">奖励升级</span>
							<span class="updateSpan" :style="updateSpan" v-if="stepIndex == stepList">{{ last_price }}元/位</span>
						</li>
					</ul>
				</div>
				<div :style="step_box" class="step_box" v-if="stepList == 3">
					<div class="step_yellow" :style="step_yellow">
						<div class="step_red" :style="step_red_3_1" v-if="stepList == 3 && stepNum == 1"></div>
						<div class="step_red" :style="step_red_3_2" v-if="stepList == 3 && stepNum == 2"></div>
						<div class="step_red" :style="step_red_3_3" v-if="stepList == 3 && stepNum == 3"></div>
					</div>
					<ul :style="ulStyle" class="ulStyle">
						<li v-for="stepIndex in stepList" :key="stepIndex" :class="stepList <= 3 ? 'step3' : 'step5'">
							<img v-lazy="stepNum == stepIndex ? step_active_ico : step_ico" alt="" :style="stepNum == stepIndex ? { 'margin-top': '-3px' } : ''" />
							<img src="https://qiniustore.zmr016.com/invite/money-1.png" alt="" class="currentMoney" :style="currentMoney"
							 v-if="stepIndex == stepNum" />
							<img src="https://qiniustore.zmr016.com/invite/money-2.png" alt="" :style="lastMoney" v-if="stepIndex == stepList && friendnum <= 21" />
							<span class="stepTxt" :style="stepIndex == stepNum ? 'font-weight:bold' : ''" v-if="stepIndex == 1">第{{ beginNum }}位</span>
							<span class="stepTxt" :style="stepIndex == stepNum ? 'font-weight:bold' : ''" v-if="stepIndex == 2">第{{ middleNum }}位</span>
							<span class="stepTxt stepTxt3" :style="stepIndex == stepList ? updatePrice : ''" v-if="stepIndex == 3 && friendnum <= 21">奖励升级</span>
							<span class="stepTxt stepTxt3" :style="stepIndex == stepList ? updatePrice : ''" v-if="stepIndex == 3 && friendnum > 21">21位及以上</span>
							<span class="updateSpan updateSpan3" :style="updateSpan" v-if="stepIndex == stepList && friendnum <= 21">{{ last_price }}元/位</span>
						</li>
					</ul>
				</div>
				<!-- 步骤条 end -->
				<!-- 奖励卡区域 -->
				<div :style="priceCard_box">
					<!-- 卡片1 -->
					<div style="display: inline-block;vertical-align: middle;position: relative;" @click="showPrice(0)">
						<img src="https://qiniustore.zmr016.com/invite/tip-complete.png" alt="" :style="priceCard" v-if="step > 1" />
						<img src="https://qiniustore.zmr016.com/invite/tip-active.png" alt="" :style="priceCard" v-if="step == 1" />
						<span :style="priceCard_top_complete" v-if="step > 1">{{ data2[0].money / 100 }}元/位</span>
						<span :style="priceCard_top_not_complete" v-if="step <= 1">{{ data2[0].money / 100 }}元/位</span>
						<p :style="priceCard_middle_complete" v-if="step > 1">
							{{ data2[0].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p :style="priceCard_middle_not_complete" v-if="step <= 1">
							{{ data2[0].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_complete" v-if="step > 1">{{ data2[0].name }}</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_not_complete" v-if="step == 1">{{ data2[0].name }}</p>
						<img src="https://qiniustore.zmr016.com/invite/complete.png" alt="" :style="priceCard_complete" v-if="step > 1" />
					</div>
					<img src="https://qiniustore.zmr016.com/invite/double-arrow-right.png" alt="" :style="arrowStyle_right" />
					<!-- 卡片2 -->
					<div style="display: inline-block;vertical-align: middle;position: relative;" @click="showPrice(1)">
						<img src="https://qiniustore.zmr016.com/invite/tip-complete.png" alt="" :style="priceCard" v-if="step > 2" />
						<img src="https://qiniustore.zmr016.com/invite/tip-active.png" alt="" :style="priceCard" v-if="step == 2" />
						<img src="https://qiniustore.zmr016.com/invite/tip-not-complete.png" alt="" :style="priceCard" v-if="step < 2" />
						<span :style="priceCard_top_complete" v-if="step > 2">{{ data2[1].money / 100 }}元/位</span>
						<span :style="priceCard_top_not_complete" v-if="step <= 2">{{ data2[1].money / 100 }}元/位</span>
						<p :style="priceCard_middle_complete" v-if="step > 2">
							{{ data2[1].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p :style="priceCard_middle_not_complete" v-if="step <= 2">
							{{ data2[1].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_complete" v-if="step > 2">{{ data2[1].name }}</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_not_complete" v-if="step <= 2">{{ data2[1].name }}</p>
						<img src="https://qiniustore.zmr016.com/invite/complete.png" alt="" :style="priceCard_complete" v-if="step > 2" />
					</div>
					<img src="https://qiniustore.zmr016.com/invite/double-arrow-right.png" alt="" :style="arrowStyle_right" />
					<!-- 卡片3 -->
					<div style="display: inline-block;vertical-align: middle;position: relative;" @click="showPrice(2)">
						<img src="https://qiniustore.zmr016.com/invite/tip-complete.png" alt="" :style="priceCard" v-if="step > 3" />
						<img src="https://qiniustore.zmr016.com/invite/tip-active.png" alt="" :style="priceCard" v-if="step == 3" />
						<img src="https://qiniustore.zmr016.com/invite/tip-not-complete.png" alt="" :style="priceCard" v-if="step < 3" />
						<span :style="priceCard_top_complete" v-if="step > 3">{{ data2[2].money / 100 }}元/位</span>
						<span :style="priceCard_top_not_complete" v-if="step <= 3">{{ data2[2].money / 100 }}元/位</span>
						<p :style="priceCard_middle_complete" v-if="step > 3">
							{{ data2[2].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p :style="priceCard_middle_not_complete" v-if="step <= 3">
							{{ data2[2].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_complete" v-if="step > 3">{{ data2[2].name }}</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_not_complete" v-if="step <= 3">{{ data2[2].name }}</p>
						<img src="https://qiniustore.zmr016.com/invite/complete.png" alt="" :style="priceCard_complete" v-if="step > 3" />
					</div>
				</div>
				<p :style="arrow_vertical"><img src="https://qiniustore.zmr016.com/invite/double-arrow-right.png" alt="" :style="arrowStyle_vertical" /></p>

				<div :style="priceCard_box">
					<!-- 卡片5 -->
					<div style="display: inline-block;vertical-align: middle;position: relative;" @click="showPrice(4)">
						<img src="https://qiniustore.zmr016.com/invite/tip-active.png" alt="" :style="priceCard_last" v-if="step == 5" />
						<img src="https://qiniustore.zmr016.com/invite/tip-big.png" alt="" :style="priceCard_last" v-if="step < 5" />
						<span :style="priceCard_top_not_complete" v-if="step <= 5">{{ data2[4].money / 100 }}元/位</span>
						<p :style="priceCard_middle_not_complete">
							{{ data2[4].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_not_complete">{{ data2[4].name }}</p>
					</div>
					<img src="https://qiniustore.zmr016.com/invite/double-arrow-right.png" alt="" :style="arrowStyle_left" />
					<!-- 卡片4 -->
					<div style="display: inline-block;vertical-align: middle;position: relative;" @click="showPrice(3)">
						<img src="https://qiniustore.zmr016.com/invite/tip-complete.png" alt="" :style="priceCard" v-if="step > 4" />
						<img src="https://qiniustore.zmr016.com/invite/tip-active.png" alt="" :style="priceCard" v-if="step == 4" />
						<img src="https://qiniustore.zmr016.com/invite/tip-not-complete.png" alt="" :style="priceCard" v-if="step < 4" />
						<span :style="priceCard_top_complete" v-if="step > 4">{{ data2[3].money / 100 }}元/位</span>
						<span :style="priceCard_top_not_complete" v-if="step <= 4">{{ data2[3].money / 100 }}元/位</span>
						<p :style="priceCard_middle_complete" v-if="step > 4">
							{{ data2[3].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p :style="priceCard_middle_not_complete" v-if="step <= 4">
							{{ data2[3].sum_money / 100 }}
							<span style="font-size: 14px;">元</span>
						</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_complete" v-if="step > 4">{{ data2[3].name }}</p>
						<p class="priceCard_bottom" :style="priceCard_bottom_not_complete" v-if="step <= 4">{{ data2[3].name }}</p>
						<img src="https://qiniustore.zmr016.com/invite/complete.png" alt="" :style="priceCard_complete" v-if="step > 4" />
					</div>
				</div>
				<!-- 奖励卡区域 end -->
				<!-- 中间白框圆角底部 -->
				<img src="https://qiniustore.zmr016.com/invite/tip-bo-bottom.png" alt="" :style="tip_bottom" />
				<!-- 中间白框圆角底部 end -->
				<p :style="tip_bottom_txt">累计可赚{{ total_price }}元</p>
				<van-row :style="tip_bottom_cashBtn">
					<van-col span="8" :style="cashMoney_txt">快速提现金额：</van-col>
					<van-col span="8" :style="cashMoney_num">￥{{ cashMoney }}</van-col>
					<van-col span="8" style="text-align: center;min-height: 40px;line-height: 40px;position: relative;" v-if="cashMoney == 0">
						<span class="getCashBtn" :style="getCashBtn_disabled">立即提现</span>
					</van-col>
					<van-col span="8" style="text-align: center;min-height: 40px;line-height: 40px;position: relative;" v-else>
						<span class="getCashBtn" :style="getCashBtn_enable" @click="toCash">立即提现</span>
					</van-col>
				</van-row>
			</div>
			<!-- tab内容卡 end -->
			<!-- 底部提示区域 -->
			<div :style="ruleCard" class="ruleCard">
				<van-row :style="rule_title">
					<van-col span="24">
						<p><span :style="rule_title_main">怎么邀请好友</span></p>
						<p><span :style="rule_title_other">流程就是这么简单</span></p>
					</van-col>
				</van-row>
				<div :style="rule_step_img_box" class="rule_step_img_box">
					<img alt="" src="https://qiniustore.zmr016.com/invite/share.png" :style="rule_step_img" />
					<img alt="" src="https://qiniustore.zmr016.com/invite/to-right.png" :style="rule_step_img_right_1" />
					<img alt="" src="https://qiniustore.zmr016.com/invite/down.png" :style="rule_step_img" />
					<img alt="" src="https://qiniustore.zmr016.com/invite/to-right.png" :style="rule_step_img_right_2" />
					<img alt="" src="https://qiniustore.zmr016.com/invite/money.png" :style="rule_step_img" />
				</div>
				<van-row type="flex" justify="space-between" class="rule_step_img_box" :style="rule_step_other">
					<van-col span="5">
						<p>点击按钮</p>
						<p>分享给好友</p>
					</van-col>
					<van-col span="5">
						<p>好友打开链接</p>
						<p>下载安装</p>
					</van-col>
					<van-col span="5">
						<p>好友登录阅读</p>
						<p>您获得红包</p>
					</van-col>
				</van-row>
				<p style="text-align: justify;color:#FDB6BF;text-justify: ;">特别说明：好友需要在新设备上注册（之前未登录过的账号的手机），并有效阅读3元方可产生奖励</p>
				<van-row :style="rule_title">
					<van-col span="24">
						<p><span :style="rule_title_main">邀请小技巧</span></p>
						<p><span :style="rule_title_other">邀请成功率提升200%</span></p>
					</van-col>
				</van-row>
				<p :style="rule_p">
					<span :style="rule_p_num">1</span>
					邀请您的家人、朋友、同学和同事成功率最高
				</p>
				<p :style="rule_p">
					<span :style="rule_p_num">2</span>
					分享到3个以上的微信群/QQ群，成功邀请的几率
					<span style="color:#ffcc00">提高200%</span>
				</p>
				<p :style="rule_p">
					<span :style="rule_p_num">3</span>
					可以告诉您的朋友：注册可最高领取
					<span style="color:#ffcc00">18~19元现金红包</span>
					，当天即可提现
				</p>
				<p :style="rule_p">
					<span :style="rule_p_num">4</span>
					另外还给您定时红包奖励，定时来取哟
				</p>
				<p :style="rule_p">
					<span :style="rule_p_num">5</span>
					好友每分享一篇文章被他人预读，您获得3元奖励
				</p>
			</div>
			<!-- 底部提示区域 end -->
		</div>
		<!-- tab内容卡 邀请好友 end -->
		<!-- tab内容卡 我的好友 -->
		<div v-if="chooseTabIndex == 1">
			<div class="centerBox" :style="centerBox" v-if="!noData">
				<van-row class="total_friend">
					<van-col span="8" style="text-align:center">
						<p>累计邀请</p>
						<p>
							<span class="total_friend_num">{{ list.length }}</span>
							<span>位</span>
						</p>
					</van-col>
					<van-col span="8" style="text-align:center">
						<p>邀请收益</p>
						<p>
							<span class="total_friend_num">{{ list_today_money / 100 }}</span>
							<span>元</span>
						</p>
					</van-col>
					<van-col span="8" style="text-align:center">
						<p>剩余奖励</p>
						<p>
							<span class="total_friend_num">{{ list_future_money / 100 }}</span>
							<span>元</span>
						</p>
					</van-col>
				</van-row>
				<van-row class="friend_list friend_list_title">
					<van-col span="10" style="text-align: left;text-indent: 24px;">好友昵称</van-col>
					<van-col span="5" style="text-align: center;">当前收益</van-col>
					<van-col span="5" style="text-align: center;">预计收益</van-col>
					<van-col span="4" style="text-align: center;">&nbsp;</van-col>
				</van-row>
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="true">
					<van-row class="friend_list" v-for="(item, index) in list" :key="index">
						<van-col span="10" style="text-align: left;padding-left: 10px;">
							<img :src="item.img" alt="" class="friend_list_img" />
							<span style="display: inline-block;vertical-align: middle;width:60%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ item.name }}</span>
						</van-col>
						<van-col span="5" style="text-align: center;">
							<span>{{ item.total_money / 100 }}元</span>
						</van-col>
						<van-col span="5" style="text-align: center;">
							<span>{{ item.total_money / 100 + item.waite_money / 100 }}元</span>
						</van-col>
						<van-col span="4" style="text-align: center;"><span class="friend_list_detail" @click="toDetail(item.user_id, 1)">详情</span></van-col>
					</van-row>
				</van-list>
			</div>
			<div class="centerBox noData" :style="centerBox" v-if="noData">
				<div class="homeTab2_noFriend">
					<div class="nofriend_icon">
						<p>暂时没有好友哦~</p>
					</div>
					<div class="nofriend_btn" @click="toLeaveShare">赶紧去邀请好友吧</div>
				</div>
			</div>
		</div>
		<!-- tab内容卡 我的好友 end -->
		<!-- tab内容卡 活动抽奖 -->
		<div v-if="chooseTabIndex == 2">
			<div class="centerBox paddingBottom" :style="centerBox">
				<van-cell :center="true" title-class="titleClass" value-class="valueClass" to="">
					<template slot="title">
						<p>{{ activity_title }}</p>
						<p>{{ activity_desc }}</p>
					</template>
					<img src="../assets/img/invite/luck_draw.png" slot="icon" class="iconImg" alt="" />
					<van-button round type="danger" size="small" style="background: #e94a0a;color:#fefefe;border: none;" @click="toLuckDraw">立即抽奖</van-button>
				</van-cell>
				<div style="font-size: 14px;text-align: center;width:100%;height: 30px;line-height:30px;background:#f1f1f1 ;color: #999999;display: block;"
				 v-if="list_2.length > 0">
					- 邀请以下新用户得{{ tomoney }}元 -
				</div>
				<van-row class="friend_list" v-for="(item, index) in list_2" :key="index">
					<van-col span="1" style="text-align: right;">&nbsp;</van-col>
					<van-col span="13" style="text-align: left;padding-left: 10px;">
						<img :src="item.img" alt="" class="friend_list_img" />
						<span style="display: inline-block;vertical-align: middle;">{{ item.name }}</span>
					</van-col>
					<van-col span="9" style="text-align: right;">
						<span class="friend_list_detail" @click="failShare">点击拿{{ tomoney }}元</span>
					</van-col>
					<van-col span="1" style="text-align: right;">&nbsp;</van-col>
				</van-row>
			</div>
		</div>
		<!-- tab内容卡 活动抽奖 end -->
		<!-- 宝箱 -->
		<div class="drag" @click="getCoin">
			<img :src="isOpen ? closeIco : openIco" />
			<p>
				<span class="countdownTime" :style="isOpen ? countdownStyle_end : countdownStyle_init">{{ countdownTime }}</span>
			</p>
		</div>
		<img src="../assets/img/invite/activity-rule.png" alt="" class="ruleImg" @click="showRule" />
		<!-- 宝箱 end -->

		<van-popup v-model="show" :overlay="true" :close-on-click-overlay="ermShow ? true : false" :style="ermShow ? 'background-color:transparent' : ''"
		 @closed="ermShow = false">
			<!-- 宝箱弹窗 -->
			<div class="pop_div" id="getCoin" v-if="isCoinShow">
				<img src="../assets/img/invite/close.png" alt="" class="closeBtn" @click="closeGetCoin()" />
				<p><span class="title">恭喜获得宝箱奖励</span></p>
				<p>
					<span class="number">+{{ coin * 100 }}金币</span>
				</p>
				<p><img src="../assets/img/invite/treasureBox.png" alt="" class="treasureBox" /></p>
				<p><span class="content_p">每邀请一位好友签到，额外再得12元现金</span></p>
				<p><span class="button" @click="shareCoin">分享给好友，再得50金币</span></p>
			</div>
			<!-- 宝箱弹窗 end -->
			<!-- 奖励卡弹窗1-5 -->
			<div class="pop_div price_notice_bg" id="priceNotice" v-if="isPriceShow">
				<img src="../assets/img/invite/close.png" alt="" class="closeBtn" @click="closeBtn()" />
				<p><span class="title">奖励说明</span></p>
				<p>
					<img src="../assets/img/invite/price_notice_ico.png" alt="" class="price_ico" />
					<span class="number">{{ data2[priceNum].sum_money / 100 }}元</span>
				</p>
				<div id="priceDetail" style="padding:0 20px;font-size: 16px;" v-html="htmlCode"></div>
				<p><span class="button" @click="toShare(2)">立即邀请好友</span></p>
			</div>
			<!-- 奖励卡弹窗1-5 end -->
			<!-- 活动规则按钮和弹窗 -->
			<div class="pop_div" id="ruleNotice" v-if="isRuleShow">
				<div style="width: 100%;height: 94%;padding: 3% 0;overflow-y: auto;">
					<img src="../assets/img/invite/close.png" alt="" class="closeBtn" @click="closeBtn()" />
					<p><span class="title">奖励说明</span></p>
					<p class="txt_p">
						<span class="rule_num">1</span>
						邀请好友越多，单人奖励越高。最高可达12元/位
					</p>
					<p class="txt_p">
						<span class="rule_num">2</span>
						奖励发放：每邀请1位好友获得的奖励分4次发放。
						<span class="login-text">好友登录</span>
						您即可获得1元，好友
						<span class="login-text">二次提现成功</span>
						您可得2元奖励，若
						<span class="login-text">好友收徒</span>
						您将再得到1.5元奖励。前2位好友活跃奖励为4.5元；3~5位活跃奖励5.5元；6~10位活跃奖励6.5元；11~20位活跃奖励7.5元；21位以上活跃奖励5.5元。为保障您拿到全部的奖励，请及时
						<span class="login-text">提醒好友完成提现及新手任务</span>
						。
					</p>

					<p class="txt_p">师徒奖励</p>
					<p class="txt_p">
						<van-cell v-for="(item, index) in data3" :key="index" :title="item.title" :value="item.money / 100 + '元'"
						 title-class="cell_title" value-class="cell_value" :class="index % 2 != 0 ? 'odd_title' : 'even_title'" />
					</p>
					<p class="txt_p">
						徒弟活跃奖励
						<span class="txt_p_notice">（除上述其他奖励均为师徒奖励）</span>
					</p>
					<p class="txt_p">
						<van-cell v-for="(item, index) in data2" :key="index" :title="item.name" :value="item.td_active / 100 + '元'"
						 title-class="cell_title" value-class="cell_value" :class="index % 2 != 0 ? 'odd_title' : 'even_title'" />
					</p>
					<p class="txt_p">
						<span class="rule_num">3</span>
						<span style="display: block;">郑重声明：</span>
						为了保证广大用户的收益不受影响，对于存在非正常邀请行为的用户，平台将取消其参加活动的资格，并扣除相应奖励不予结算。
					</p>
					<p class="txt_p">
						<span class="rule_num">4</span>
						最终解释权归咪咕看点所有
					</p>
				</div>
			</div>
			<!-- 活动规则按钮和弹窗 end -->
			<!-- 离开页面弹窗 -->
			<div class="pop_div" id="backAlert" v-if="isBack">
				<p class="title">
					邀请成功即可赚得
					<span>9</span>
					元
				</p>
				<p class="dec">确定真的放弃赚钱机会吗？</p>
				<div class="btn-container">
					<div class="quitBtn" @click="toLeave">算了,不差钱</div>
					<div class="shareBtn border2" @click="toLeaveShare">转发分享赚钱</div>
				</div>
			</div>
			<!-- 离开页面弹窗 end -->
			<!-- 收徒失败分享弹窗 -->
			<div class="pop_div" id="leaveShare" v-if="isFailShare">
				<img src="../assets/img/invite/close.png" alt="" class="closeBtn" @click="closeBtn()" />
				<p><span class="title">奖励说明</span></p>
				<div class="nine-box">
					<div class="nine-box-1">最低</div>
					<div class="nine-box-2">赚</div>
					<div class="nine-box-3">{{ tomoney }}.00</div>
					<div class="nine-box-4">元</div>
				</div>
				<div class="nine-text">
					1.点击下方「
					<span>去分享</span>
					」，长按转发二维码图片
				</div>
				<div class="nine-text-1">2.选择微信群或朋友或者朋友圈</div>
				<div class="nine-text-2">3.点选好友列表某一好友或群或朋友圈</div>
				<div class="nine-text-3">
					4.点击「分享」到
					<span>3个以上</span>
					微信好友/群，成功邀请机率
					<span>提升200%</span>
				</div>
				<p><span class="button" @click="toShare(2)">分享给朋友</span></p>
			</div>
			<!-- 收徒失败分享弹窗 end -->
			<!-- 分享弹窗 -->
			<div class="pop_div" id="leaveShare" v-if="isLeaveShare">
				<img src="../assets/img/invite/close.png" alt="" class="closeBtn" @click="closeBtn()" />
				<p><span class="title">奖励说明</span></p>
				<div class="nine-box">
					<div class="nine-box-1">最低</div>
					<div class="nine-box-2">赚</div>
					<div class="nine-box-3">{{ min }}.00</div>
					<div class="nine-box-4">元</div>
				</div>
				<div class="nine-text">
					1.点击下方「
					<span>去分享</span>
					」，长按转发二维码图片
				</div>
				<div class="nine-text-1">2.选择微信群或朋友或微信朋友圈</div>
				<div class="nine-text-2">3.点选好友列表某一好友或群或者发送朋友圈</div>
				<div class="nine-text-3">
					4.点击「分享」到
					<span>3个以上</span>
					微信好友/群，成功邀请机率
					<span>提升200%</span>
				</div>
				<p><span class="button" @click="toShare(2)">分享给朋友</span></p>
			</div>
			<!-- 分享弹窗 end -->
			<!-- 面对面收徒 -->
			<img :src="ermUrl" alt="" v-if="ermShow" style="width: 100%;" />
			<p style="color:#ffffff;text-align: center;margin-top:20px;font-size: 14px;" v-if="ermShow">长按保存图片，分享到朋友或微信群或朋友圈</p>
			<!-- 面对面收徒 end -->
		</van-popup>

		<!-- 邀请弹窗 -->
		<van-row class="inviteGroup">
			<!-- <van-col span="12">
				<div @click="toShare(0)">
					<p><img src="../assets/img/invite-weixin.png" alt="" class="inviteImg" /></p>
					<p>分享到微信群或朋友收徒</p>
				</div>
			</van-col>
			<van-col span="12">
				<div @click="toShare(1)">
					<p><img src="../assets/img/invite-pengyouquan.png" alt="" class="inviteImg" /></p>
					<p>分享到朋友圈收徒</p>
				</div>
			</van-col> -->
			<van-col span="24">
				<div @click="toShare(2)">
					<p><img src="../assets/img/invite-erm.png" alt="" class="inviteImg" /></p>
					<p style="">分享二维码到朋友圈或微信群或朋友</p>
				</div>
			</van-col>
		</van-row>
		<div class="sharePannel" v-if="enterShow">
			<div class="sharePannelBg"></div>
			<div class="content content1">
				<div class="icon"></div>
				<p class="title">分享狂赚50000元</p>
				<p class="dec">
					微信分享给好友
					<br />
					好友点开，每邀请一位可赚9-12元
				</p>
				<div class="btn mv" @click="toShare(2)">立即分享</div>
				<div class="closeBtn" @click="closeEnter"></div>
			</div>
		</div>
		<img v-lazy="mentor_bottom" alt="" style="width: 100%;margin-top: 10px;" v-if="chooseTabIndex == 0" />
	</div>
</template>

<script>
	import common from '../assets/js/common.js';
	import Swiper from 'swiper';
	import 'swiper/dist/css/swiper.css';

	export default {
		inject: ['checkRoute', 'money', 'mentors', 'my'],
		name: 'new_mentor',
		data() {
			return {
				dragList: 1,
				navTop: {
					background: '#ed2f1e',
					'padding-top': '50px',
					'padding-bottom': '100px',
					'min-height': window.innerHeight - 100 + 'px'
				},
				//轮播区域
				swiperHeight: {
					height: (window.innerHeight * 60) / 1334 + 'px',
					background: '#f2490e',
					'text-align': 'center',
					'line-height': (window.innerHeight * 60) / 1334 + 'px',
					color: '#FFA200',
					position: 'fixed',
					top: '50px',
					width: '100%'
				},
				//轮播条 音量图标
				volumeIco: {
					transform: 'scale(1.1) translateY(1px)',
					'-ms-transform': 'scale(1.1) translateY(1px)',
					'-moz-transform': 'scale(1.1) translateY(1px)',
					'-webkit-transform': 'scale(1.1) translateY(1px)',
					'-o-transform': 'scale(1.1) translateY(1px)',
					'margin-right': (window.innerWidth * 16) / 750 + 'px'
				},
				//小按钮
				topTxt: {
					position: 'absolute',
					top: '70%',
					left: '50%',
					transform: ' translateX(-50%)',
					'-ms-transform': ' translateX(-50%)',
					'-moz-transform': ' translateX(-50%)',
					'-webkit-transform': ' translateX(-50%)',
					'-o-transform': ' translateX(-50%)',
					'font-size': '15px',
					width: (window.innerWidth * 374) / 750 + 'px',
					height: (window.innerHeight * 50) / 1334 + 'px',
					border: '1px solid #ffffff',
					'line-height': (window.innerHeight * 50) / 1334 + 'px',
					'text-align': 'center',
					'border-radius': '40px',
					color: '#ffff00'
				},
				//大按钮
				top_input_big: {
					width: (window.innerWidth * 732) / 750 + 'px',
					height: (window.innerHeight * 160) / 1334 + 'px',
					border: '2px solid #ffff00',
					margin: '0 auto',
					'border-radius': '80px',
					position: 'absolute',
					top: '93%',
					left: '50%',
					transform: ' translateX(-50%)',
					'-ms-transform': ' translateX(-50%)',
					'-moz-transform': ' translateX(-50%)',
					'-webkit-transform': ' translateX(-50%)',
					'-o-transform': ' translateX(-50%)',
				},
				top_input_big_row: {
					width: '100%',
					height: (window.innerHeight * 40) / 1334 + 'px',
					'margin-top': '2%'
				},
				// 大按钮文字
				top_input_big_span: {
					'text-align': 'center',
					'vertical-align': 'bottom',
					height: (window.innerHeight * 40) / 1334 + 'px',
					'line-height': (window.innerHeight * 80) / 1334 + 'px'
				},
				//白色框体
				centerBox: {
					width: (window.innerWidth * 732) / 750 + 'px',
					background: '#FFFFFF',
					margin: '0 auto'
				},
				// 标签卡雨区
				centerTab_box: {
					width: (window.innerWidth * 732) / 750 + 'px',
					margin: (window.innerHeight * 204) / 1334 + 'px auto 0'
				},
				//未激活标签
				centerTab: {
					width: (window.innerWidth * 244) / 750 + 'px',
					height: (window.innerHeight * 80) / 1334 + 'px',
					'line-height': (window.innerHeight * 80) / 1334 + 'px',
					background: '#ffa734',
					display: 'inline-block',
					'text-align': 'center',
					'border-radius': '10px 10px 0 0',
					'font-size': '14px',
					color: '#FD2C23'
				},
				//当前激活标签
				centerTab_active: {
					width: (window.innerWidth * 244) / 750 + 'px',
					height: (window.innerHeight * 100) / 1334 + 'px',
					'line-height': (window.innerHeight * 100) / 1334 + 'px',
					background: '#ffd234',
					display: 'inline-block',
					'text-align': 'center',
					'border-radius': '10px 10px 0 0',
					'font-size': '18px',
					color: '#FD2C23'
				},
				// 区间文字
				location_txt: {
					'margin-left': (window.innerWidth * 20) / 750 + 'px',
					'font-size': '14px',
					color: '#e73e04',
					display: 'inline-block',
					'vertical-align': 'middle'
				},
				// 区间定位图标
				location_p: {
					padding: (window.innerHeight * 32) / 1334 + 'px 0 0 ' + (window.innerWidth * 40) / 750 + 'px'
				},
				// 步骤条区域
				step_box: {
					width: (window.innerWidth * (732 - 80)) / 750 + 'px',
					margin: '0 auto',
					position: 'relative',
					padding: '1px 0'
				},
				//黄色步骤线
				step_yellow: {
					width: (window.innerWidth * (732 - 80)) / 750 + 'px',
					height: '5px',
					background: '#ffe190',
					overflow: 'hidden',
					margin: '60px auto 90px',
					position: 'relative'
				},
				//5步红线第1步
				step_red_5_1: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80)) / 5 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//5步红线第2步
				step_red_5_2: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80) * 2) / 5 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//5步红线第3步
				step_red_5_3: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80) * 3) / 5 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//5步红线第4步
				step_red_5_4: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80) * 4) / 5 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//5步红线第5步
				step_red_5_5: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80) * 5) / 5 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//3步红线第1步
				step_red_3_1: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80)) / 3 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//3步红线第2步
				step_red_3_2: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80) * 2) / 3 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//3步红线第3步
				step_red_3_3: {
					position: 'absolute',
					width: (window.innerWidth * (732 - 80) * 3) / 3 / 750 + 'px',
					height: '5px',
					background: '#fd2d23',
					left: 0
				},
				//当前奖励圆形图标
				step_current: {
					width: (window.innerWidth * 18) / 750 + 'px',
					height: (window.innerWidth * 18) / 750 + 'px',
					'border-radius': '100%',
					border: (window.innerWidth * 7) / 750 + 'px solid #fd2d23',
					background: '#ffd234'
				},
				//非当前奖励圆形图标
				step_other: {
					width: (window.innerWidth * 16) / 750 + 'px',
					height: (window.innerWidth * 16) / 750 + 'px',
					'border-radius': '100%',
					border: (window.innerWidth * 6) / 750 + 'px solid #fd2d23',
					background: '#ffd234'
				},
				//步骤条
				ulStyle: {
					width: (window.innerWidth * (732 - 80)) / 750 + 'px',
					'margin-bottom': '10px',
					position: 'absolute',
					top: '50px'
				},
				//中间白框白色圆角底部
				tip_bottom: {
					width: (window.innerWidth * 732) / 750 + 'px',
					margin: '20px auto -5px',
					transform: 'scale(1.02)',
					'-ms-transform': 'scale(1.02)',
					'-moz-transform': 'scale(1.02)',
					'-webkit-transform': 'scale(1.02)',
					'-o-transform': 'scale(1.02)',
				},
				//累计可赚
				tip_bottom_txt: {
					width: '100%',
					'text-align': 'center',
					position: 'absolute',
					bottom: (window.innerHeight * 203) / 1334 + 'px',
					'font-size': '16px',
					color: '#cb0621'
				},
				//提现区域
				tip_bottom_cashBtn: {
					position: 'absolute',
					bottom: (window.innerHeight * 50) / 1334 + 'px',
					width: '100%',
					'font-size': '16px'
				},
				//提现区域文字
				cashMoney_txt: {
					height: '40px',
					'line-height': '40px',
					color: '#ffffff',
					'padding-left': '5px',
					'white-space': 'nowrap'
				},
				//提现区域金额
				cashMoney_num: {
					height: '40px',
					'line-height': '40px',
					color: '#ffd234',
					'font-size': '17px',
					'white-space': 'nowrap'
				},
				//提现按钮(可用)
				getCashBtn_enable: {
					'text-align': 'center',
					width: (window.innerWidth * 156) / 750 + 'px',
					height: (window.innerHeight * 60) / 1334 + 'px',
					'line-height': (window.innerHeight * 60) / 1334 + 'px',
					background: '#f2ac2f',
					'border-radius': '30px',
					color: '#ffffff',
					display: 'block',
					'white-space': 'nowrap'
				},
				//提现按钮(不可用)
				getCashBtn_disabled: {
					'text-align': 'center',
					width: (window.innerWidth * 156) / 750 + 'px',
					height: (window.innerHeight * 60) / 1334 + 'px',
					'line-height': (window.innerHeight * 60) / 1334 + 'px',
					background: '#dddddd',
					'border-radius': '30px',
					color: '#ffffff',
					display: 'block',
					'white-space': 'nowrap'
				},
				//当前红包图
				currentMoney: {
					width: (window.innerWidth * 72) / 750 + 'px',
					height: (window.innerHeight * 84) / 1334 + 'px',
					position: 'absolute',
					top: '-50px',
					left: '50%',
					transform: 'scale(.8) translateX(-62%)',
					'-ms-transform': 'scale(.8) translateX(-62%)',
					'-moz-transform': 'scale(.8) translateX(-62%)',
					'-webkit-transform': 'scale(.8) translateX(-62%)',
					'-o-transform': 'scale(.8) translateX(-62%)',
				},
				//奖励升级红包图
				lastMoney: {
					width: (window.innerWidth * 118) / 750 + 'px',
					height: (window.innerHeight * 94) / 1334 + 'px',
					position: 'absolute',
					top: '-' + (window.innerHeight * 90) / 1334 + 'px',
					left: '50%',
					transform: 'scale(0.8) translateX(-62%)',
					'-ms-transform': 'scale(0.8) translateX(-62%)',
					'-moz-transform': 'scale(0.8) translateX(-62%)',
					'-webkit-transform': 'scale(0.8) translateX(-62%)',
					'-o-transform': 'scale(0.8) translateX(-62%)',
				},
				//奖励升级文字提示
				updatePrice: {
					border: 'none',
					'border-radius': '15px',
					'text-align': 'center',
					color: '#ffffff',
					background: '#e94a0a'
				},
				//奖励升级顶部价位
				updateSpan: {
					top: '-' + (window.innerHeight * 150) / 1334 + 'px',
					border: 'none',
					'border-radius': '15px',
					'text-align': 'center',
					color: '#ffffff',
					background: '#e94a0a'
				},
				//奖励卡区域
				priceCard_box: {
					width: (window.innerWidth * (732 - 80) * 3) / 3 / 750 + 'px',
					margin: '0 auto'
				},
				//当前奖励卡
				priceCard: {
					width: (window.innerWidth * 170) / 750 + 'px',
					height: (window.innerHeight * 120) / 1334 + 'px',
					transform: 'rotate(180deg)',
					'-ms-transform': 'rotate(180deg)',
					'-moz-transform': 'rotate(180deg)',
					'-webkit-transform': 'rotate(180deg)',
					'-o-transform': 'rotate(180deg)',
				},
				//最终奖励卡
				priceCard_last: {
					width: (window.innerWidth * 410) / 750 + 'px',
					height: (window.innerHeight * 122) / 1334 + 'px'
				},
				//奖励卡顶部价位_完成
				priceCard_top_complete: {
					padding: '2px 5px',
					position: 'absolute',
					top: '-10px',
					left: '50%',
					transform: 'translateX(-50%)',
					'-ms-transform': 'translateX(-50%)',
					'-moz-transform': 'translateX(-50%)',
					'-webkit-transform': 'translateX(-50%)',
					'-o-transform': 'translateX(-50%)',
					'border-radius': '16px',
					background: '#fde68f',
					border: '1px solid #ffffff',
					'text-align': 'center',
					color: '#f2d7aa',
					display: 'block',
					width: 'auto',
					'white-space': 'nowrap'
				},
				//奖励卡顶部价位_未完成
				priceCard_top_not_complete: {
					padding: '2px 5px',
					position: 'absolute',
					top: '-10px',
					left: '50%',
					transform: 'translateX(-50%)',
					'-ms-transform': 'translateX(-50%)',
					'-moz-transform': 'translateX(-50%)',
					'-webkit-transform': 'translateX(-50%)',
					'-o-transform': 'translateX(-50%)',
					'border-radius': '16px',
					background: '#fde68f',
					border: '1px solid #ffffff',
					'text-align': 'center',
					color: '#ab650a',
					display: 'block',
					'white-space': 'nowrap'
				},
				//奖励卡中间金额_完成
				priceCard_middle_complete: {
					position: 'absolute',
					width: '100%',
					top: '40%',
					left: '50%',
					transform: 'translate3d(-50%,-50%,0)',
					'-ms-transform': 'translate3d(-50%,-50%,0)',
					'-moz-transform': 'translate3d(-50%,-50%,0)',
					'-webkit-transform': 'translate3d(-50%,-50%,0)',
					'-o-transform': 'translate3d(-50%,-50%,0)',
					'text-align': 'center',
					color: '#f2d7aa',
					'font-size': '26px'
				},
				//奖励卡中间金额_未完成
				priceCard_middle_not_complete: {
					position: 'absolute',
					width: '100%',
					top: '40%',
					left: '50%',
					transform: 'translate3d(-50%,-50%,0)',
					'-ms-transform': 'translate3d(-50%,-50%,0)',
					'-moz-transform': 'translate3d(-50%,-50%,0)',
					'-webkit-transform': 'translate3d(-50%,-50%,0)',
					'-o-transform': 'translate3d(-50%,-50%,0)',
					'text-align': 'center',
					color: '#ffffff',
					'font-size': '26px'
				},
				//奖励卡中间金额_完成
				priceCard_bottom_complete: {
					position: 'absolute',
					width: '100%',
					bottom: '5px',
					left: '50%',
					transform: 'translateX(-50%)',
					'-ms-transform': 'translateX(-50%)',
					'-moz-transform': 'translateX(-50%)',
					'-webkit-transform': 'translateX(-50%)',
					'-o-transform': 'translateX(-50%)',
					'text-align': 'center',
					color: '#f2d7aa'
				},
				//奖励卡中间金额_完成
				priceCard_bottom_not_complete: {
					position: 'absolute',
					width: '100%',
					bottom: '5px',
					left: '50%',
					transform: 'translateX(-50%)',
					'-ms-transform': 'translateX(-50%)',
					'-moz-transform': 'translateX(-50%)',
					'-webkit-transform': 'translateX(-50%)',
					'-o-transform': 'translateX(-50%)',
					'text-align': 'center',
					color: '#ffffff'
				},
				//奖励卡完成印章
				priceCard_complete: {
					position: 'absolute',
					width: (window.innerWidth * 64) / 750 + 'px',
					height: (window.innerWidth * 64) / 750 + 'px',
					right: '5px',
					bottom: '5px'
				},
				//右箭头
				arrowStyle_right: {
					width: (window.innerWidth * 71) / 750 + 'px',
					height: (window.innerHeight * 46) / 1334 + 'px',
					display: 'inline-block',
					'vertical-align': 'middle'
				},
				//左箭头
				arrowStyle_left: {
					width: (window.innerWidth * 71) / 750 + 'px',
					height: (window.innerHeight * 46) / 1334 + 'px',
					display: 'inline-block',
					'vertical-align': 'middle',
					transform: 'rotate(180deg)',
					'-ms-transform': 'rotate(180deg)',
					'-moz-transform': 'rotate(180deg)',
					'-webkit-transform': 'rotate(180deg)',
					'-o-transform': 'rotate(180deg)',
				},
				//垂直箭头外框
				arrow_vertical: {
					'text-align': 'right',
					'padding-right': (window.innerWidth * 90) / 750 + 'px',
					margin: '5px auto 10px'
				},
				//垂直箭头
				arrowStyle_vertical: {
					width: (window.innerWidth * 71) / 750 + 'px',
					height: (window.innerHeight * 46) / 1334 + 'px',
					display: 'inline-block',
					'vertical-align': 'middle',
					transform: 'rotate(90deg)',
					'-ms-transform': 'rotate(90deg)',
					'-moz-transform': 'rotate(90deg)',
					'-webkit-transform': 'rotate(90deg)',
					'-o-transform': 'rotate(90deg)',
				},
				//底部提示主体
				ruleCard: {
					width: window.innerWidth - (window.innerWidth * 40 * 2) / 750 + 'px',
					margin: '0 auto',
					padding: '0 ' + (window.innerWidth * 40) / 750 + 'px',
					'min-height': '100px'
				},
				//底部规则——标题部分
				rule_title: {
					margin: (window.innerHeight * 70) / 1334 + 'px auto ' + (window.innerHeight * 80) / 1334 + 'px'
				},
				//底部规则——主标题
				rule_title_main: {
					width: (window.innerWidth * 240) / 750 + 'px',
					height: (window.innerHeight * 60) / 1334 + 'px',
					'line-height': (window.innerHeight * 60) / 1334 + 'px',
					'border-radius': '30px',
					background: '#ECCCA2',
					color: '#cb0621',
					display: 'block',
					'text-align': 'center',
					margin: '0 auto',
					'font-weight': 'bold',
					'font-size': '14px'
				},
				//底部规则——副标题
				rule_title_other: {
					'text-align': 'center',
					margin: (window.innerHeight * 20) / 1334 + 'px auto 0',
					display: 'block',
					color: '#ffffff',
					'font-size': '12px'
				},
				//底部规则——步骤图
				rule_step_img_box: {},
				rule_step_img: {
					width: (window.innerWidth * 86) / 750 + 'px',
					height: (window.innerWidth * 86) / 750 + 'px',
					'margin-left': (window.innerWidth * 20) / 750 + 'px',
					'margin-right': (window.innerWidth * 10) / 750 + 'px'
				},
				rule_step_img_right_1: {
					width: (window.innerWidth * 88) / 750 + 'px',
					'margin-left': (window.innerWidth * 40) / 750 + 'px',
					'margin-right': (window.innerWidth * 30) / 750 + 'px'
				},
				rule_step_img_right_2: {
					width: (window.innerWidth * 88) / 750 + 'px',
					'margin-left': (window.innerWidth * 30) / 750 + 'px',
					'margin-right': (window.innerWidth * 30) / 750 + 'px'
				},
				rule_step_other: {
					'margin-top': (window.innerHeight * 28) / 1334 + 'px',
					'margin-bottom': (window.innerHeight * 48) / 1334 + 'px',
					color: '#ffffff'
				},
				//邀请小技巧
				rule_p: {
					'min-height': (window.innerWidth * 42) / 750 + 'px',
					'line-height': (window.innerWidth * 42) / 750 + 'px',
					'padding-left': (window.innerWidth * 60) / 750 + 'px',
					'margin-bottom': (window.innerHeight * 30) / 1334 + 'px',
					color: '#ffffff'
				},
				//邀请小技巧-序号
				rule_p_num: {
					color: '#cb0621',
					position: 'absolute',
					left: '5%',
					width: (window.innerWidth * 42) / 750 + 'px ',
					height: (window.innerWidth * 42) / 750 + 'px ',
					'text-align': 'center',
					'line-height': (window.innerWidth * 42) / 750 + 'px',
					'background-image': 'url(http://qiniustore.zmr016.com/invite/num-bg.png)',
					'background-repeat': 'no-repeat',
					'background-size': (window.innerWidth * 42) / 750 + 'px ' + (window.innerWidth * 42) / 750 + 'px '
				},
				tabList: ['邀请好友', '我的好友', '活动抽奖'], //tab标签卡
				chooseTabIndex: 0, //当前选中标签卡
				cashMoney: 0, //快速提现金额
				total_price: 50223, //累计可赚
				stepNum: 3, //当前步骤条位置
				step: 1, //当前激活奖励卡
				status: 0, //当前奖励卡完成状态
				stepList: 5, //步骤条个数
				step_active_ico: require('../assets/img/invite/step-big.png'), //步骤大圆圈
				step_ico: require('../assets/img/invite/step-small.png'), //步骤小圆圈
				swiper: null, //轮播对象
				data1: [], //轮播模拟数据
				data2: [{
						name: '',
						money: '',
						sum_money: '',
						desc: ''
					},
					{
						name: '',
						money: '',
						sum_money: '',
						desc: ''
					},
					{
						name: '',
						money: '',
						sum_money: '',
						desc: ''
					},
					{
						name: '',
						money: '',
						sum_money: '',
						desc: ''
					},
					{
						name: '',
						money: '',
						sum_money: '',
						desc: ''
					}
				], //奖励卡模拟数据
				//宝箱参数
				isOpen: false, //宝箱是否打开
				openIco: require('../assets/img/invite/chest-open.png'), //宝箱开
				closeIco: require('../assets/img/invite/chest-close.png'), //宝箱关
				countdownTime: '点我开宝箱',
				//可以开宝箱
				countdownStyle_end: {
					padding: '2px 5px',
					'border-radius': '20px',
					margin: '0 auto',
					background: '#dcc043',
					'text-align': 'center',
					display: 'block',
					color: '#ffffff'
				},
				//宝箱倒计时中
				countdownStyle_init: {
					padding: '2px 5px',
					'border-radius': '20px',
					margin: '0 auto',
					background: '#bebebe',
					'text-align': 'center',
					display: 'block',
					color: '#ffffff'
				},
				count: 0, //倒计时开关,
				time: null, //倒计时Interval
				show: false, //弹窗开关
				isCoinShow: false, //宝箱弹窗
				isPriceShow: false, //奖励说明弹窗
				isBack: false, //离开页面弹窗开关
				isRuleShow: false, //活动规则弹窗
				isLeaveShare: false, //离开页面分享弹窗
				isFailShare: false, //收徒失败分享弹窗
				priceNum: 0, //当前点击奖励卡下标
				btnShow: true, //邀请弹窗开关
				list: [], //好友列表
				loading: false, //列表加载状态
				finished: false, //列表没有更多状态
				list_2: [], //抽奖下的列表
				last_id: 0, //好友列表分页参数
				pageNum: 1, //好友列表分页参数
				//下列是对接口增加的参数
				min: 0, //奖励区间最小值
				max: 0, //奖励区间最大值
				friendnum: 0, //徒弟数
				invite_num: 0, //有效好友
				future_money: 0, //预计收益
				current_money: 0, //当前奖励区间
				beginNum: 0, //三步区间开始邀请数
				middleNum: 0, //三步区间中间邀请数
				last_price: 0, //奖励升级价位
				activity_title: '', //活动标题
				activity_desc: '', //活动描述
				coin: 0, //获得金币数
				ermUrl: '', //微信群或朋友图片分享地址
				ermUrl_timeline: '', //朋友圈图片分享地址
				ermShow: false, //二维码弹窗
				list_today_money: 0, //邀请收益
				list_future_money: 0, //累计贡献
				enterShow: true, //进入分享弹窗
				confirmLeave: false, //确认离开
				isRequest: false, //活动抽奖卡是否请求过
				noData: false, //无好友
				mentor_bottom: 'http://qiniustore.zmr016.com/invite/mentor_bottom.png', //邀请小技巧下面的其他说明
				qrcode_link: '', //分享好友群地址
				timline_qrcode_link: '', //分享朋友圈地址
				shareData: null, //分享内容数据对象
			};
		},
		computed: {
			htmlCode() {
				if (this.data2.length > 0) {
					return this.data2[this.priceNum].desc;
				}
			}
		},
		watch: {
			$route() {
				console.log(this.swiper);
				if (this.swiper != null) {
					if (this.$route.path == '/mentor') {
						console.log(this.swiper.autoplay.start());
						this.swiper.autoplay.start();
					} else {
						this.swiper.autoplay.stop();
						console.log(this.swiper.autoplay.stop());
					}
				}
			}
		},
		methods: {
			onClickLeft() {
				this.closeAll();
				this.show = true;
				this.isBack = true;
				this.ermShow = false;
			},
			initSwiper() {
				if (this.swiper != null) return;
				console.log('init swiper');
				this.swiper = new Swiper('.swiper-container', {
					loop: true,
					speed: 500,
					direction: 'vertical',
					autoplay: {
						disableOnInteraction: false // 触碰后自动切换也不会停止
					},
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				});
			},
			init_drag() {
				var cont = $('.drag');
				console.log('init drag', cont);
				var contW = $('.drag').width();
				var contH = $('.drag').height();
				var startX, startY, sX, sY, moveX, moveY, disX, disY, leftX, rightX, topY, bottomY;
				var winW = $(window).width();
				var winH = $(window).height();
				cont.on({
					//绑定事件
					touchstart: function(e) {
						console.log('touchstart');
						startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
						startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
						//console.log("startX="+startX+"************startY="+startY);

						sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
						sY = $(this).offset().top - $(document).scrollTop(); //相对于当前窗口Y轴的偏移量
						console.log('sX=' + sX + '***************sY=' + sY);
						leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
						rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
						topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
						bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
					},
					touchmove: function(e) {
						console.log('touchmove');
						e.preventDefault();
						moveX = e.originalEvent.targetTouches[0].pageX; //移动过程中X轴的坐标
						moveY = e.originalEvent.targetTouches[0].pageY; //移动过程中Y轴的坐标
						//console.log("moveX="+moveX+"************moveY="+moveY);
						if (moveX < leftX) {
							moveX = leftX;
						}
						if (moveX > rightX) {
							moveX = rightX;
						}
						if (moveY < topY) {
							moveY = topY;
						}
						if (moveY > bottomY) {
							moveY = bottomY;
						}
						$(this).css({
							left: moveX + sX - startX,
							top: moveY + sY - startY
						});
					},
					mousedown: function(ev) {
						console.log('mousedown');
						var patch = parseInt($(this).css('height')) / 2;
						//console.log(patch);
						$(this).mousemove(function(ev) {
							console.log('mousemove');
							var oEvent = ev || event;
							//console.log(oEvent.target);
							var oX = oEvent.clientX;
							var oY = oEvent.clientY;
							var t = oY - patch;
							var l = oX - patch;
							var w = $(window).width() - $(this).width();
							var h = $(window).height() - $(this).height();
							if (t < 0) {
								t = 0;
							}
							if (l < 0) {
								l = 0;
							}
							if (t > h) {
								t = h;
							}
							if (l > w) {
								l = w;
							}
							$(this).css({
								top: t,
								left: l
							});
						});
						$(this).mouseup(function() {
							console.log('mouseup');
							$(this).unbind('mousemove');
						});
					}
				});
			},
			init_countDown(second) {
				var that = this;

				that.count = second;
				var h, m, s, mm, ss;
				if (second >= 0) {
					h = Math.floor(second / 60 / 60);
					m = Math.floor((second / 60) % 60);
					s = Math.floor(second % 60);
				}
				//进行倒计时显示
				that.time = window.setInterval(function() {
					that.count--;
					if (that.count == 0) {
						clearInterval(that.time);
						that.isOpen = true;
						that.countdownTime = '点我开宝箱';
					}
					--s;
					if (s < 0) {
						--m;
						s = 59;
					}
					if (m < 0) {
						--h;
						m = 59;
					}
					if (h < 0) {
						s = 0;
						m = 0;
					}
					// 判断当时分秒小于10时补0
					ss = that.checkTime(s);
					mm = that.checkTime(m);
					that.countdownTime = '0' + h + ':' + mm + ':' + ss;
				}, 1000);
			},
			chooseTab(index) {
				console.log(index);
				var that = this;
				if (index == 2 && !that.isRequest) {
					common.toAjax(common.host + '/user_st/redpack', {}, function(res) {
						that.isRequest = true;
						console.log('redpack', res);
						that.activity_title = res.data.activity_list.name;
						that.activity_desc = res.data.activity_list.desc;
						that.list_2 = res.data.noreg_list;
						that.tomoney = res.data.tomoney / 100;
						that.chooseTabIndex = index;
					});
				} else {
					this.chooseTabIndex = index;
				}
			},
			checkTime(i) {
				if (i < 10) {
					i = '0' + i;
				}
				return i;
			},
			getCoin() {
				this.closeAll();
				var that = this;
				common.toAjax(
					common.host + '/prizes/get_prize', {
						rize: 1,
						act_id: 1
					},
					function(res) {
						console.log(res);
						if (res.err_code == 0) {
							clearInterval(that.time);
							that.coin = res.data.money;
							that.$nextTick(() => {
								that.show = true;
								that.isCoinShow = true;
							});
						} else {
							that.$toast('每2小时开启一次，邀请好友越多，奖励越多');
						}
					}
				);
			},
			shareCoin() {
				this.isCoinShow = false;
				this.isOpen = false;
				this.closeBtn();
				this.init_countDown(7200);
				this.toLeaveShare();
			},
			closeGetCoin() {
				this.isCoinShow = false;
				this.isOpen = false;
				this.closeBtn();
				this.init_countDown(7200);
			},
			closeBtn() {
				this.closeAll();
			},
			showPrice(num) {
				this.closeAll();
				this.priceNum = num;
				this.show = true;
				this.isPriceShow = true;
			},
			showRule() {
				this.closeAll();
				this.show = true;
				this.isRuleShow = true;
			},
			onLoad() {
				console.log('load');
				var that = this;
				var temp_flag = false;
				if (that.last_id == 0 && that.pageNum == 1) {
					temp_flag = true;
				} else {
					temp_flag = false;
				}
				common.toAjax(common.host + '/user_st/friend', {
					last_id: that.last_id,
					page: that.pageNum
				}, function(res) {
					// 加载状态结束
					that.loading = false;
					if (res.err_code == 0) {
						if (res.data.td_list.length == 0) {
							that.finished = true;
							if (temp_flag) {
								that.noData = true;
							}
							return;
						} else {
							that.list = that.list.concat(res.data.td_list);
							that.last_id = res.data.last_id;
							that.pageNum++;
							for (var i = 0; i < res.data.td_list.length; i++) {
								var future_money = res.data.td_list[i].total_money + res.data.td_list[i].waite_money;
								that.list_today_money = that.list_today_money + res.data.td_list[i].total_money;
								that.list_future_money = that.list_future_money + future_money;
							}
						}
					} else {
						that.$toast(res.err_msg);
					}
				});
			},
			getSection(data) {
				var arr = [];
				for (var i in data) {
					arr.push(data[i].money);
				}
				var max = Math.max.apply(null, arr);
				var min = Math.min.apply(null, arr);
				this.max = max / 100;
				this.min = min / 100;
			},
			getCurrentMoney(data, invite_num) {
				var current_num;
				console.log('data currentmoney', data, invite_num, this.stepNum);
				var that = this;

				if (invite_num <= data[0].friend_num) {
					current_num = 0;
					this.current_money = data[current_num].money / 100;
				}
				if (invite_num >= data[data.length - 1].friend_num) {
					current_num = data.length - 1;
					this.current_money = data[current_num].money / 100;
				}
				if (data[0].friend_num < invite_num && invite_num < data[data.length - 1].friend_num) {
					for (var i = 0; i < data.length; i++) {
						var min = data[i].friend_num;
						var add = i + 1;
						if (add >= data.length) {
							add = data.length - 1;
						}
						var max = data[add].friend_num;
						if (invite_num > min && invite_num < max) {
							current_num = i + 1;
						}
						// if (data[i].friend_num < invite_num && invite_num < data[i + 1].friend_num && i <= data.length - 1) {
						// 	console.log('i', i, data[i + 1].friend_num);
						// 	current_num = i + 1;
						// }
					}
					this.current_money = data[current_num].money / 100;
				}
			},
			getLastPrice(data, invite_num) {
				var current_num;
				console.log('data price', data, invite_num, this.stepNum);
				var that = this;
				if (invite_num <= 21) {
					if (invite_num <= data[0].friend_num) {
						current_num = 0;
						this.last_price = data[current_num + 1].money / 100;
					}
					if (invite_num >= data[data.length - 1].friend_num) {
						current_num = data.length - 1;
						this.last_price = data[current_num + 1].money / 100;
					}
					if (data[0].friend_num < invite_num && invite_num < data[data.length - 1].friend_num) {
						for (var i = 0; i < data.length; i++) {
							var min = data[i].friend_num;
							var add = i + 1;
							if (add >= data.length) {
								add = data.length - 1;
							}
							var max = data[add].friend_num;
							if (invite_num > min && invite_num < max) {
								current_num = i + 1;
							}
							// if (data[i].friend_num < invite_num && invite_num < data[i + 1].friend_num && i <= data.length - 1) {
							// 	console.log('i', i, data[i + 1].friend_num);
							// 	current_num = i + 1;
							// }
						}
						this.last_price = data[current_num + 1].money / 100;
					}
				}
			},
			getMiddleNum(data, invite_num) {
				var current_num;
				console.log('data midd', data, invite_num, this.stepNum);
				var that = this;
				var flag = false;
				if (invite_num >= 21) {
					console.log('stepNum', this.stepNum);
					that.stepNum = 3;
					this.beginNum = 11;
					this.middleNum = '12~20';
				} else {
					for (var i = 0; i < data.length; i++) {
						var min = data[i].friend_num;
						var add = i + 1;
						if (add >= data.length) {
							add = data.length - 1;
						}
						var max = data[add].friend_num;
						console.log('i', min, max);
						if (invite_num > min && invite_num < max) {
							this.beginNum = min + 1;
							this.middleNum = min + 2 + '~' + max;
						}
						if (invite_num > 2) {
							if (invite_num == min + 1) {
								flag = true;
							}
						}
					}
					if (flag) {
						this.stepNum = 1;
					} else {
						this.stepNum = 2;
					}
				}
			},
			getPriceCard(data, invite_num) {
				var space1, space2, space3, space4, space5;
				space1 = data[0].friend_num;
				space2 = data[1].friend_num;
				space3 = data[2].friend_num;
				space4 = data[3].friend_num;
				space5 = data[4].friend_num;
				if (invite_num <= space1) {
					this.step = 1;
				}
				if (invite_num > space1 && invite_num <= space2) {
					this.step = 2;
				}
				if (invite_num > space2 && invite_num <= space3) {
					this.step = 3;
				}
				if (invite_num > space3 && invite_num <= space4) {
					this.step = 4;
				}
				if (invite_num > space4) {
					this.step = 5;
				}
			},
			getStep(data, friendnum) {
				//当邀请人数在1-2人之间
				if (friendnum < 3) {
					this.stepList = 5; //显示5步图
					if (common.getVal('userInfo').balance == 0) {
						this.stepNum = 1;
					} else {
						if (friendnum == 0) {
							this.stepNum = 2;
						} else {
							if (friendnum == 1) {
								this.stepNum = 3;
							}
							if (friendnum == 2) {
								this.stepNum = 4;
							}
						}
					}
				} else {
					this.stepList = 3;
				}
				this.getCurrentMoney(data, friendnum);
				this.getLastPrice(data, friendnum);
				if (friendnum > 2) {
					this.getMiddleNum(data, friendnum);
				}
				this.getPriceCard(data, friendnum);
			},
			toLeave() {
				this.closeAll();
				clearInterval(this.time);
				this.confirmLeave = true;
				this.$router.go(-1);
			},
			toLeaveShare() {
				this.closeAll();
				this.show = true;
				this.isBack = false;
				this.isLeaveShare = true;
			},
			toDetail(id, type) {
				this.confirmLeave = true;
				switch (type) {
					case 0:
						common.goLink('/my_master', this);
						break;
					case 1:
						common.goLink('/my_apprentice/' + id, this);
						break;
					default:
						break;
				}
			},
			toCash() {
				this.confirmLeave = true;
				common.goLink('/cash_withdrawal', this);
			},
			toShare(name) {
				this.closeAll();
				var that = this;
				var scene_pic, timeline_pic, scene_desc, timeline_desc, scene_title, timeline_title;
				var st_use_type = common.getVal('loginData').st_use_type;
				switch (name) {
					case 0:
						scene_pic = common.getRandomData(that.shareData.share_info.img);
						scene_title = common.getRandomData(that.shareData.share_info.title);
						scene_desc = common.getRandomData(that.shareData.share_info.desc);
						if (st_use_type == 'img') {
							if (this.ermUrl != '') {
								// 分享图片
								api.sendEvent({
									name: that.shareType,
									extra: {
										type: 'image',
										scene: 'session',
										timeline: false, // false表示发送给还有，true表示分享朋友圈
										pic: that.ermUrl // 图片地址
									}
								});
							}
						} else {
							// 分享网页
							api.sendEvent({
								name: that.shareType,
								extra: {
									type: 'page',
									pic: scene_pic, // 缩略图
									contentUrl:  encodeURI(that.qrcode_link), // 网页地址
									description: scene_desc, // 描述
									title: scene_title, // 标题
									scene: 'session',
									timeline: false // false表示发送给还有，true表示分享朋友圈
								}
							});
						}
						break;
					case 1:
						timeline_pic = common.getRandomData(that.shareData.timeline_share_info.img);
						timeline_title = common.getRandomData(that.shareData.timeline_share_info.title);
						timeline_desc = common.getRandomData(that.shareData.timeline_share_info.desc);
						if (st_use_type == 'img') {
							if (this.ermUrl_timeline != '') {
								// 分享图片
								api.sendEvent({
									name: that.shareType,
									extra: {
										type: 'image',
										scene: 'timeline',
										timeline: true, // false表示发送给还有，true表示分享朋友圈
										pic: that.ermUrl_timeline // 图片地址
									}
								});
							}
						} else {
							// 分享网页
							api.sendEvent({
								name: that.shareType,
								extra: {
									type: 'page',
									pic: timeline_pic, // 缩略图
									contentUrl: encodeURI(that.timeline_link), // 网页地址
									description: timeline_desc, // 描述
									title: timeline_title, // 标题
									scene: 'timeline',
									timeline: true // false表示发送给还有，true表示分享朋友圈
								}
							});
						}

						break;
					case 2:
						that.show = true;
						that.ermShow = true;
						break;
					default:
						break;
				}
			},
			toLuckDraw() {
				this.confirmLeave = true;
				common.goLink('/luck_draw', this);
			},
			closeEnter() {
				this.closeAll();
				this.enterShow = false;
				this.init_drag();
				this.initSwiper();
			},
			closeAll() {
				this.show = false;
				this.isBack = false; //离开页面前弹窗提示
				this.isCoinShow = false; //宝箱弹窗
				this.isPriceShow = false; //奖励说明弹窗
				this.isRuleShow = false; //活动规则弹窗
				this.isLeaveShare = false; //离开页面分享弹窗
				this.enterShow = false; //进入页面弹窗
				this.isFailShare = false; //收徒失败分享弹窗
			},
			failShare() {
				this.closeAll();
				this.show = true;
				this.isFailShare = true;
			}
		},
		beforeRouteLeave(to, from, next) {
			if (this.confirmLeave) {
				next();
			} else {
				this.onClickLeft();
				next(false);
			}

			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
		},
		activated() {
			window.scrollTo(0, 0);//当前路由时初始化页面滚动值为0；
			this.checkRoute();
			this.mentors();
			var that = this;
			common.toAjax(common.host + '/users/userData', {}, function(res) {
				if (res.err_code != 800) {
					if (res.err_code == 0) {
						common.setVal('userInfo', res.data);
					}
				}else{
					common.toLogin(that);
					return;
				}
			});
			this.closeBtn();
			this.enterShow = true;
			this.confirmLeave = false;
			clearInterval(that.time);
			that.chooseTabIndex = 0;
			that.list = [];
			that.list_2 = [];
			that.finished = false;
			that.last_id = 0;
			that.pageNum = 1;
			that.list_today_money = 0;
			that.list_future_money = 0;
			that.loading = true;
			that.noData = false;
			that.$nextTick(() => {
				that.onLoad();
			});
			that.cashMoney = common.tofix2(common.getVal('userInfo').balance / 100);
			if (that.$store.state.qrcode_img != '' && that.$store.state.timeline_qrcode_img) {
				that.ermUrl = that.$store.state.qrcode_img;
				that.ermUrl_timeline = that.$store.state.timeline_qrcode_img;
				that.qrcode_link = that.$store.state.qrcode_link;
				that.timline_qrcode_link =  that.$store.state.timeline_qrcode_link;
				that.shareData=that.$store.state.data;
			} else {
				common.toAjax(common.host + '/user_st/st_img', {
					type: 'mentor'
				}, function(res) {
					if (res.err_code == 0) {
						that.ermUrl = res.data.qrcode_img;
						that.ermUrl_timeline = res.data.timeline_qrcode_img;
						that.qrcode_link = res.data.qrcode_link;
						that.timline_qrcode_link = res.data.timeline_qrcode_link;
						that.shareData=res.data;
						that.$store.commit('SETIMG', res.data.qrcode_img);
						that.$store.commit('SETIMG_TIMELINE', res.data.timeline_qrcode_img);
						that.$store.commit('SETLINK', res.data.qrcode_link);
						that.$store.commit('SETLINK_TIMELINE', res.data.timeline_qrcode_link);
						that.$store.commit('SETDATA', res.data);
						// this.show = true;
					} else {
						that.$toast(res.err_msg);
					}
				});
			}
			if (common.getVal('loginData').app_share_type != 'share') {
				this.shareType = 'fakeShare';
			}
			common.toAjax(common.host + '/user_st/income_info', {}, function(res) {
				if (res.err_code == 0) {
					that.$nextTick(() => {
						console.log('income_info', that.stepNum, res);
						that.getSection(res.data.st_rule);
						that.invite_num = res.data.invite_num;
						that.friendnum = res.data.friendnum;
						that.future_money = res.data.future_money;
						that.data1 = res.data.random_friends_info;
						that.data2 = res.data.st_rule;
						that.data3 = res.data.st_prize;
						that.total_price = res.data.allmoney / 100;
						that.getStep(res.data.st_rule, res.data.friendnum);
						if (res.data.boxtime > 0) {
							that.isOpen = false;
							that.init_countDown(res.data.boxtime);
						} else {
							that.isOpen = true;
							that.countdownTime = '点我开宝箱'
						}
					});
				}
			});
		}
	};
</script>

<style scoped>
	.swiper-container {
		top: 46px !important;
	}

	.top-input-big {
		background: -webkit-linear-gradient(#fe4540, #d70e25);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(#fe4540, #d70e25);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(#fe4540, #d70e25);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(#fe4540, #d70e25);
		/* 标准的语法 */
	}

	.top_input_big_span_txt {
		font-size: 14px;
		color: #ffffff;
	}

	.top_input_big_span_num {
		margin-top: 5px;
		font-size: 18px;
		color: #ffda39;
	}

	.top_input_big_span_company {
		font-size: 14px !important;
		color: #ffda39;
	}

	.centerBox {
		position: relative;
	}

	ul:after {
		content: '.';
		display: block;
		height: 0;
		visibility: hidden;
		clear: both;
	}

	li {
		list-style: none;
		float: left;
		text-align: center;
		position: relative;
	}

	li.step5 {
		width: 20%;
	}

	li.step3 {
		width: 33%;
	}

	li span {
		display: block;
	}

	.currentMoney {
		animation: currentStep 1s infinite;
		-ms-animation: currentStep 1s infinite;
		-moz-animation: currentStep 1s infinite;
		-webkit-animation: currentStep 1s infinite;
	}

	.stepTxt {
		position: absolute;
		top: 35px;
		left: 50%;
		transform: translateX(-50%);
		-ms-transform: translateX(-50%);
		-moz-transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
		-o-transform: translateX(-50%);
		width: 100%;
		color: #e94a0a;
		display: block;
		min-width: 70px;
		min-height: 21px;
		line-height: 21px;
	}

	.updateSpan {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		-ms-transform: translateX(-50%);
		-moz-transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
		-o-transform: translateX(-50%);
		width: 100%;
		color: #e94a0a;
		display: block;
		min-width: 60px;
		min-height: 19px;
		line-height: 19px;
	}

	.stepTxt.stepTxt3,
	.updateSpan.updateSpan3 {
		width: 65% !important;
	}

	.updateSpan:after {
		border: solid transparent;
		content: ' ';
		height: 0;
		top: 125%;
		position: absolute;
		width: 0;
		border-width: 0.16rem;
		border-top-color: #e94a0a;
		left: 50%;
		margin-left: -0.16rem;
	}

	.rule_step_img_box img {
		display: inline-block;
		vertical-align: middle;
	}

	.rule_step_img_box .van-col p {
		text-align: center;
	}

	.priceCard_bottom {
		font-size: 12px;
		white-space: nowrap;
	}

	.getCashBtn {
		font-size: 14px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate3d(-50%, -50%, 0);
		-ms-transform: translate3d(-50%, -50%, 0);
		-moz-transform: translate3d(-50%, -50%, 0);
		-webkit-transform: translate3d(-50%, -50%, 0);
		-o-transform: translate3d(-50%, -50%, 0);
	}

	.drag {
		position: fixed;
		top: 10%;
		left: 0;
		z-index: 100;
	}

	.drag img {
		width: 80px;
	}

	.ruleImg {
		width: 50px;
		position: absolute;
		top: 160px;
		right: 0;
		z-index: 99;
	}

	@-ms-keyframes currentStep {
		0% {
			top: -180%;
		}

		50% {
			top: -150%;
		}

		100% {
			top: -180%;
		}
	}

	@-webkit-keyframes currentStep {
		0% {
			top: -180%;
		}

		50% {
			top: -150%;
		}

		100% {
			top: -180%;
		}
	}

	@-moz-keyframes currentStep {
		0% {
			top: -180%;
		}

		50% {
			top: -150%;
		}

		100% {
			top: -180%;
		}
	}

	@keyframes currentStep {
		0% {
			top: -180%;
		}

		50% {
			top: -150%;
		}

		100% {
			top: -180%;
		}
	}

	.pop_div {
		border-radius: 20px;
		position: relative;
		padding-top: 1px;
	}

	.pop_div p {
		text-align: center;
		margin: 20px auto;
	}

	.pop_div .title {
		text-align: center;
		margin-top: 30px;
		font-size: 16px;
	}

	.pop_div .number {
		font-weight: 700;
		color: #fc6f00;
		text-align: center;
		font-size: 22px;
	}

	.pop_div .treasureBox {
		width: 50%;
		margin: 0 auto;
		display: block;
	}

	.pop_div .content_p {
		text-align: center;
		font-size: 16px;
		padding: 0 5%;
		display: block;
	}

	.pop_div .button {
		width: 80%;
		height: 50px;
		line-height: 50px;
		background-image: url(../assets/img/invite/button.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: block;
		margin: 0 auto;
		color: #ffffff;
		font-size: 16px;
		text-align: center;
	}

	.price_notice_bg {
		width: 100%;
		height: 100%;
		background-image: url(../assets/img/invite/price_notice_bg.png) !important;
		background-size: 100% 100% !important;
		background-repeat: no-repeat !important;
		background-color: #ffffff !important;
		position: relative;
	}

	.price_notice_bg .title {
		color: #ff0000;
		font-size: 20px;
		font-weight: bold;
	}

	.price_notice_bg .price_ico {
		width: 40px;
		vertical-align: middle;
		display: inline-block;
	}

	.price_notice_bg .number {
		vertical-align: middle;
		margin-left: 20px;
		color: #000000;
	}

	#ruleNotice {
		padding-top: 10px;
		background-image: url(../assets/img/invite/price_notice_bg.png) !important;
		background-size: 100% 100% !important;
		background-repeat: no-repeat !important;
		background-color: #ffffff !important;
		height: 400px;
		overflow-y: auto;
	}

	#ruleNotice p.txt_p {
		text-align: justify;
		padding-left: 40px;
		padding-right: 40px;
		position: relative;
		font-size: 16px;
		font-weight: lighter;
		color: #333333;
	}

	#ruleNotice .closeBtn {
		position: fixed;
		top: 1%;
		right: 1%;
		z-index: 99999999;
	}

	#ruleNotice .txt_p .rule_num {
		position: absolute;
		left: 15px;
		top: 0;
		width: 18px;
		height: 18px;
		line-height: 18px;
		display: block;
		text-indent: 3px;
		background-image: url(../assets/img/invite/rule_num_bg.png);
		background-repeat: no-repeat;
		background-size: 18px 18px;
		font-weight: normal;
	}

	#ruleNotice .title {
		color: #f5401d;
		font-size: 20px;
		font-weight: normal;
	}

	.van-popup {
		width: 80% !important;
		min-height: 200px;
		border-radius: 10px;
	}

	.closeBtn {
		position: absolute;
		right: 5px;
		top: 5px;
		transform: scale(0.6);
		-ms-transform: scale(0.6);
		-moz-transform: scale(0.6);
		-webkit-transform: scale(0.6);
		-o-transform: scale(0.6);
	}

	.cell_title {
		color: #333333;
		flex: 60%;
	}

	.cell_value {
		color: #f0b601;
	}

	.odd_title {
		background: #fdf6c7;
		width: ;
	}

	.even_title {
		background: #fcf9e4;
	}

	.txt_p_notice {
		color: #999999;
		font-size: 12px;
	}

	.inviteGroup {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #ffffff;
		padding: 20px 0;
	}

	.inviteGroup p {
		text-align: center;
	}

	.inviteGroup p .inviteImg {
		width: 30px;
		height: 30px;
		margin: 0 auto;
	}

	.total_friend {
		height: 100px;
		background: #f1f1f1;
	}

	.total_friend p {
		margin: 10px auto;
		font-size: 16px;
		color: #666666;
	}

	.total_friend p:first-child {
		margin-top: 24px;
	}

	.total_friend span {
		font-size: 14px;
		color: #333333;
	}

	.total_friend span.total_friend_num {
		font-size: 18px;
		font-weight: bold;
		margin-right: 2px;
	}

	.friend_list {
		width: 100%;
		font-size: 14px;
		margin: 20px auto;
	}

	.friend_list_title {
		color: #999999;
		margin: 32px auto 0;
	}

	.friend_list_img {
		border-radius: 100%;
		display: inline-block;
		vertical-align: middle;
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}

	.friend_list span {
		min-height: 30px;
		line-height: 30px;
	}

	.friend_list_detail {
		border-radius: 20px;
		background: #e94a0a;
		padding: 6px 14px;
		color: #ffffff;
		font-size: 12px;
	}

	.titleClass {
		flex: 60%;
		max-width: 60%;
	}

	.iconImg {
		width: 36px;
		height: 36px;
		border-radius: 100%;
	}

	.titleClass p {
		width: 100%;
		font-size: 14px;
		text-align: left;
		color: #333333;
		margin-left: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		/*——必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
		-webkit-line-clamp: 2;
		/* ——显示的行数 */
		-webkit-box-orient: vertical;
		/* ——必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 */
		word-break: break-all;
		/* ——如果一行中带有数字、英文、文字须加此行,起到强制换行的作用 */
	}

	.titleClass p:last-child {
		color: #999999;
		font-size: 12px;
	}

	.valueClass {
		flex: 20%;
		color: red;
		font-weight: bold;
	}

	.downBtn {
		border: none;
		background: #e94a0a;
		padding: 2px 5px;
		border-radius: 5px;
		color: #fefefe;
		font-weight: normal;
	}

	.paddingBottom {
		padding-bottom: 5px;
	}

	#backAlert .title {
		font-weight: 700;
		font-size: 20px;
	}

	#backAlert .title span {
		color: #ff4151;
		font-size: 24px;
	}

	#backAlert .dec {
		font-size: 14px;
	}

	#backAlert .btn-container {
		width: 100%;
		text-align: center;
		padding-top: 10px;
	}

	#backAlert .quitBtn,
	#backAlert .shareBtn {
		display: inline-block;
		vertical-align: middle;
		padding: 5px 10px;
		margin: 0 10px;
		border-radius: 10px;
		border: 1px solid #a0a0a0;
		font-size: 16px;
	}

	#backAlert .shareBtn.border2 {
		background: #f44b50 !important;
		color: #ffffff !important;
		padding: 6px 12px !important;
		border: none !important;
	}

	#leaveShare .title {
		color: #ff490a;
		font-size: 22px;
	}

	#leaveShare .nine-box {
		margin-top: 20px;
		text-align: center;
	}

	#leaveShare .nine-box .nine-box-1 {
		width: 0.28rem;
		font-size: 14px;
		font-weight: 500;
		color: #ffb095;
		margin-right: 0.17rem;
		display: inline-block;
		vertical-align: middle;
	}

	#leaveShare .nine-box .nine-box-2 {
		font-size: 20px;
		font-weight: 500;
		color: #ff490a;
		display: inline-block;
		vertical-align: middle;
	}

	#leaveShare .nine-box .nine-box-3 {
		font-size: 32px;
		font-weight: 400;
		color: #ff490a;
		display: inline-block;
		vertical-align: middle;
		margin: 0 2px;
	}

	#leaveShare .nine-box .nine-box-4 {
		font-size: 24px;
		font-weight: 400;
		color: #ff490a;
		display: inline-block;
		vertical-align: middle;
	}

	#leaveShare .nine-text {
		font-size: 16px;
		font-weight: 500;
		color: #333;
	}

	.nine-text,
	.nine-text-1,
	.nine-text-2,
	.nine-text-3 {
		width: 70%;
		margin: 15px auto;
	}

	#leaveShare .nine-text span {
		color: #ff490a;
	}

	#leaveShare .nine-text-1 {
		font-size: 16px;
		font-weight: 500;
		color: #333;
	}

	#leaveShare .nine-text-2 {
		font-size: 16px;
		font-weight: 500;
		color: #333;
	}

	#leaveShare .nine-text-3 {
		font-size: 16px;
		width: 70%;
		font-weight: 500;
		text-align: left;
		color: #333;
	}

	#leaveShare .nine-text-3 span {
		color: #ff490a;
	}

	.sharePannel {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 2003;
	}

	.sharePannelBg {
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.7;
	}

	.content {
		position: absolute;
		width: 7.9rem;
		background: #fff;
		border-radius: 0.3rem;
		left: 50%;
		top: 50%;
		margin-left: -4rem;
		margin-top: -4rem;
	}

	.content1 {
		height: 5.16rem;
	}

	.content .icon {
		position: absolute;
		width: 3.94rem;
		height: 1.77rem;
		background: url(../assets/img/invite/shareTipIcon2.png) no-repeat;
		background-size: 100%;
		margin-top: -15%;
		left: 50%;
		transform: translateX(-50%);
		-ms-transform: translateX(-50%);
		-moz-transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
		-o-transform: translateX(-50%);
	}

	.content .dec,
	.content .title {
		position: absolute;
		font-weight: 700;
		left: 50%;
		-webkit-transform: translate(-50%);
		-moz-transform: translate(-50%);
		-ms-transform: translate(-50%);
		transform: translate(-50%);
		text-align: center;
	}

	.content .title {
		width: 100%;
		height: 0.4rem;
		line-height: 0.4rem;
		font-size: 0.42rem;
		color: #ff5c00;
		top: 1.14rem;
	}

	.content .dec,
	.content .title {
		position: absolute;
		font-weight: 700;
		left: 50%;
		-webkit-transform: translate(-50%);
		-moz-transform: translate(-50%);
		-ms-transform: translate(-50%);
		transform: translate(-50%);
	}

	.content .dec {
		width: 6rem;
		height: 0.87rem;
		font-size: 0.32rem;
		color: #5f5f5f;
		line-height: 0.5rem;
		top: 2.16rem;
	}

	.content .btn {
		position: absolute;
		width: 4.58rem;
		height: 0.9rem;
		background: url(../assets/img/invite/shareBtnBg.png) no-repeat;
		background-size: 100%;
		font-size: 0.36rem;
		font-weight: 700;
		color: #fff;
		line-height: 0.93rem;
		-webkit-transform-origin: center center;
		-moz-transform-origin: center center;
		-ms-transform-origin: center center;
		transform-origin: center center;
		left: 50%;
		margin-left: -2.29rem;
		text-align: center;
	}

	.mv {
		bottom: -2%;
		-moz-animation: heartBeat 2s infinite;
		animation: heartBeat 2s infinite;
		-webkit-animation: heartBeat 2s infinite;
	}

	.content1 .closeBtn {
		position: absolute;
		width: 1.44rem;
		height: 1.44rem;
		background: url(../assets/img/invite/close3.png) no-repeat;
		background-size: 100%;
		top: 5.5rem;
		left: 50%;
		margin-left: -0.72rem;
	}

	@-webkit-keyframes heartBeat {
		0% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		14% {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}

		28% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		42% {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}

		70% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		85% {
			-webkit-transform: scale(1.3);
			transform: scale(1.3);
		}

		to {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}

	@-moz-keyframes heartBeat {
		0% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}

		14% {
			-webkit-transform: scale(1.3);
			-moz-transform: scale(1.3);
			transform: scale(1.3);
		}

		28% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}

		42% {
			-webkit-transform: scale(1.3);
			-moz-transform: scale(1.3);
			transform: scale(1.3);
		}

		70% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}

		85% {
			-webkit-transform: scale(1.3);
			-moz-transform: scale(1.3);
			transform: scale(1.3);
		}

		to {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	@keyframes heartBeat {
		0% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}

		14% {
			-webkit-transform: scale(1.3);
			-moz-transform: scale(1.3);
			transform: scale(1.3);
		}

		28% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}

		42% {
			-webkit-transform: scale(1.3);
			-moz-transform: scale(1.3);
			transform: scale(1.3);
		}

		70% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}

		85% {
			-webkit-transform: scale(1.3);
			-moz-transform: scale(1.3);
			transform: scale(1.3);
		}

		to {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			transform: scale(1);
		}
	}

	.login-text {
		color: #fc6f00;
	}

	.homeTab2_noFriend {
		width: 6.9rem;
		height: 5.27rem;
		background-color: #fff;
		display: box;
		display: -webkit-box;
		display: -webkit-flex;
		display: -moz-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-align-items: center;
		-moz-align-items: center;
		-ms-align-items: center;
		-o-align-items: center;
		-webkit-box-align: center;
		-moz-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-flex-direction: column;
		-moz-flex-direction: column;
		-ms-flex-direction: column;
		-o-flex-direction: column;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-direction: column;
		margin: 30px auto 0;
	}

	.homeTab2_noFriend .nofriend_icon {
		width: 4.06rem;
		height: 3rem;
		background: url(../assets/img/invite/noFriendTip.png) no-repeat;
		background-size: 100%;
	}

	.homeTab2_noFriend .nofriend_btn {
		width: 6rem;
		height: 1.2rem;
		background: url(../assets/img/invite/nofriendBtnbg.png) no-repeat;
		background-size: 6rem 1.2rem;
		font-size: 0.48rem;
		font-weight: 500;
		color: #fff;
		line-height: 1.2rem;
	}

	.homeTab2_noFriend .nofriend_icon p {
		width: 4rem;
		height: 1.2rem;
		font-size: 0.36rem;
		font-weight: 500;
		color: #cdcdcd;
		line-height: 1.2rem;
		margin: 40% auto;
	}

	.noData {
		text-align: center;
		padding-top: 1px;
	}
</style>
