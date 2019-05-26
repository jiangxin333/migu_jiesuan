<template>
	<div class="navTop">
		<van-nav-bar title="新手学堂" left-arrow @click-left="onClickLeft" fixed />
		<p class="question_title">资金问题</p>
		<van-collapse v-model="activeNames" accordion>
			<van-collapse-item title="平台内作弊行为规则与惩罚" name="1">
				<p class="space">{{ appname }}有严格的反作弊机制，存在以下原因的账号将无法提现，严重的将会被平台禁封：</p>
				<p>a.用不允许的设备（阅读模拟器，群控系统等）操作邀请或获取收益；</p>
				<p>b.虚假号，空号，未开通手机号等，用违规的手机号注册邀请或获取收益；</p>
				<p>c.用程序等工具（软件，脚本等）操作邀请或获取收益；</p>
				<p>d.用同设备上（或模拟器上）注册或登录多个账号邀请或获取收益；</p>
				<p>e.刷接口等通过攻击行为邀请或获取收益；</p>
				<p>f.一个账号在多个设备频繁切换登陆。</p>
			</van-collapse-item>
			<van-collapse-item title="为什么阅读了文章没有资金？" name="2">
				<p>
					阅读文章会有一定机率获得资金奖励，但并不是每次阅读都有奖励哦！快速频繁浏览资讯、文章没有看完、随意滚屏等，获得资金的机率就很低，请以平常心去阅读您感兴趣的内容。
				</p>
			</van-collapse-item>
			<van-collapse-item title="为什么徒弟分享的文章被阅读后，师父没收到进贡？" name="3">
				<p class="space">
					{{
						appname
					}}平台对于进贡机制管理非常严格，对阅读质量要求更高，只有当徒弟分享的文章被阅读后，对平台产生了价值的情况下才会有进贡奖励，因此徒弟分享的文章被阅读可能未产生进贡也是正常的。
				</p>
				<p class="space">注：分享的文章被阅读要产生价值，就必须满足至少以下几点：充分的阅读时间、符合正常的阅读习惯、不能伪造阅读、读者不能随意切换文章/随意滑动屏幕等。</p>
			</van-collapse-item>
			<van-collapse-item title="阅读文章奖励条件" name="4">
				<p class="space">每篇文章阅读时常30s以上获得奖励。</p>
				<p class="space">每篇文章阅读时长30秒以上，必须是真实阅读操作；</p>
				<p class="space">为了保证优质的阅读，每天仅对分享的前50篇文章应用奖励计划，所以建议亲们抽选并分享更能让读者感兴趣的文章，吸引更多的读者产生优质阅读。</p>
			</van-collapse-item>
		</van-collapse>
		<p class="question_title">收徒问题</p>
		<van-collapse v-model="activeNames1" accordion>
			<van-collapse-item title="收徒有什么好处？" name="1">
				<p>1、收徒能让您的收益迅速增加，每收1位有效徒弟奖励10元；</p>
				<p>2、徒弟分享文章产生的有效阅读，能给师父带来一定金额的进贡哦~ 注：当然啦，“上”不可能不封顶的...</p>
				<p>3、徒弟收徒后，师父就“晋级”了，可以得到徒弟的徒弟分享文章产生收益的额外进贡~</p>
				<p>注：当然啦，通过师徒关系可以获得收益，但“上”不可能不封顶的...</p>
			</van-collapse-item>
			<van-collapse-item title="如何快速收徒？" name="2">
				<p class="space">【方法1】分享邀请好友:</p>
				<p class="space">打开{{ appname }}——点击右下角“我的”——点击“每邀请一位好友…”——分享到朋友圈、微信等</p>
				<p class="space">【方法2】微信群发好友:</p>
				<p class="space">
					先点击“立即收徒按钮…”——群发邀请——保存图片——群发收徒图片；然后打开微信通用、功能——“群发助手”——新建群发——选择好友——可点击右上角的全选——点击下一步即可（每次群发人数不能超过200人）
				</p>
			</van-collapse-item>
			<van-collapse-item title="分享出去的收徒链接打不开怎么办？" name="3">
				<p class="space">重新分享一次链接给朋友，最新的可正常打开。</p>
				<p class="space">（如果多次尝试失败，请联系【设置】中【关于我们】的【在线官方客服】获得帮助）</p>
			</van-collapse-item>
		</van-collapse>
		<p class="question_title">提现问题</p>
		<van-collapse v-model="activeNames2" accordion>
			<van-collapse-item title="如何微信提现？" name="1">
				<p>
					当您零钱达到一定金额元，即可进入“我的”->“兑现提现”一栏，进入后可以看到微信红包1元、3元、10元、100元、200元、500元等供您选择。（请确认后选择，提现后则不可撤销）
				</p>
			</van-collapse-item>
			<van-collapse-item title="提现多久到账？" name="2"><p>提现申请提交后，次日开始计算3个工作日内处理完成。（双休日、节假日顺延）</p></van-collapse-item>
		</van-collapse>
		<p class="question_title">新手问题</p>
		<van-collapse v-model="activeNames4" accordion>
			<van-collapse-item :title="appname + '是什么？'" name="1">
				<p>
					"{{ appname }}"是一款国内优质的手机网赚钱平台,在"{{ appname }}"每天都有海量文章发布,将文章内容分享到微信朋友圈,微信好友,朋友点击就能轻松获得收入。
					无论你是学生还是白领，无论你在赖床还是上班，每天用闲暇时间打开"{{ appname }}"点一点,再也不用担心没有话费和流量了!
				</p>
			</van-collapse-item>
			<van-collapse-item :title="appname + '为什么会给您奖励？'" name="2">
				<p>
					{{
						appname
					}}为了引领全民阅读，为了帮助大家养成良好的阅读习惯，在阅读文章的过程中，将给于一定的资金奖励，而奖励的资金也会在次日自动换算成零钱，让您阅读不仅增长见识，而且还能有所收益。
				</p>
			</van-collapse-item>
		</van-collapse>
		<p class="question_title"></p>
		<van-collapse v-model="activeNames5" accordion>
			<van-collapse-item
				title="关于官方客服在线
			"
				name="1"
			>
				<p>我们上班是早上9点到下午6点，可以通过“个人中心”->“联系客服”页面获取客服信息添加客服小妹的QQ进行咨询；</p>
			</van-collapse-item>
		</van-collapse>
	</div>
</template>

<script>
import common from '../assets/js/common.js';
export default {
	inject: ['checkRoute', 'money', 'mentors', 'my'],
	name: 'course',
	data() {
		return {
			activeNames: [],
			activeNames1: [],
			activeNames2: [],
			activeNames3: [],
			activeNames4: [],
			activeNames5: [],
			appname: common.getVal('loginData').platform_name
		};
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1);
		}
	},
	activated() {
		this.checkRoute();
		this.activeNames = [];
		this.activeNames1 = [];
		this.activeNames2 = [];
		this.activeNames3 = [];
		this.activeNames4 = [];
		this.activeNames5 = [];
	}
};
</script>

<style scoped>
p.question_title {
	padding: 3%;
	background: #f2f2f2;
	font-size: 16px;
	color: #ff0000;
	margin: 0;
}
p {
	color: #000000;
	font-size: 12px;
}
p.space {
	margin-bottom: 10px;
}
</style>
