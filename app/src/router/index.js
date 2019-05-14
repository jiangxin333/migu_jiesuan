import Vue from 'vue'
import Router from 'vue-router'
const mentor = resolve => require(['@/components/mentor2.vue'], resolve)
const article = resolve => require(['@/components/money2.vue'], resolve)
const my = resolve => require(['@/components/my2.vue'], resolve)
const setting = resolve => require(['@/components/setting.vue'], resolve)
const mentorcontact = resolve => require(['@/components/mentorcontact.vue'], resolve)
const opinion = resolve => require(['@/components/opinion.vue'], resolve)
const protocol = resolve => require(['@/components/protocol.vue'], resolve)
const aboutus = resolve => require(['@/components/aboutus.vue'], resolve)
const notice = resolve => require(['@/components/notice.vue'], resolve)
const income_details = resolve => require(['@/components/income_details.vue'], resolve)
const income_statement = resolve => require(['@/components/income_statement.vue'], resolve)
const login = resolve => require(['@/components/login2.vue'], resolve)
const cash_withdrawal = resolve => require(['@/components/cash_withdrawal.vue'], resolve)
const rank = resolve => require(['@/components/rank.vue'], resolve)
const luck_draw = resolve => require(['@/components/luck_draw2.vue'], resolve)
const sign = resolve => require(['@/components/sign.vue'], resolve)
const sign_rule = resolve => require(['@/components/sign_rule.vue'], resolve)
const services = resolve => require(['@/components/services.vue'], resolve)
const my_master = resolve => require(['@/components/my_master.vue'], resolve)
const money_article = resolve => require(['@/components/money_article.vue'], resolve)
const my_apprentice = resolve => require(['@/components/my_apprentice.vue'], resolve)
const cash_record = resolve => require(['@/components/cash_record.vue'], resolve)
const mentor_share = resolve => require(['@/components/mentor_share.vue'], resolve)
const share_detail = resolve => require(['@/components/share_detail.vue'], resolve)
const course = resolve => require(['@/components/course.vue'], resolve)

// 新的页面路由
const services2 = resolve => require(['@/components/services2.vue'], resolve)
const article2 = resolve => require(['@/components/money2.vue'], resolve)
const my2 = resolve => require(['@/components/my2.vue'], resolve)
const luck_draw2 = resolve => require(['@/components/luck_draw2.vue'], resolve)
const mentor2 = resolve => require(['@/components/mentor2.vue'], resolve)
const video = resolve => require(['@/components/video_list.vue'], resolve)
const notice_list = resolve => require(['@/components/notice_list.vue'], resolve)
const password = resolve => require(['@/components/password.vue'], resolve)
const vip = resolve => require(['@/components/vip'], resolve)
const task = resolve => require(['@/components/task'], resolve)

//方便测试，新增测试路由，指向验证码登录页面，验证码登录页面可以使用万能验证码999999进行登录。测试登录路由仅支持路由访问，没有其他入口进行这个页面。访问这个路由必须有上级页面才行。
const test = resolve => require(['@/components/login'], resolve)
Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: [{
			path: '/',
			name: 'money2',
			component: article2
		},
		{
			path: '/my',
			name: 'my2',
			component: my2
		},
		{
			path: '/mentor',
			name: 'mentor',
			component: mentor2
		},
		{
			path: '/article',
			name: 'money2',
			component: article2
		},
		{
			path: '/setting',
			name: 'setting',
			component: setting
		},
		{
			path: '/mentorcontact',
			name: 'mentorcontact',
			component: mentorcontact
		},
		{
			path: '/opinion',
			name: 'opinion',
			component: opinion
		},
		{
			path: '/protocol',
			name: 'protocol',
			component: protocol
		},
		{
			path: '/aboutus',
			name: 'aboutus',
			component: aboutus
		},
		{
			path: '/notice',
			name: 'notice',
			component: notice
		},
		{
			path: '/income_details',
			name: 'income_details',
			component: income_details

		},
		{
			path: '/income_statement',
			name: 'income_statement',
			component: income_statement

		},
		{
			path: '/login',
			name: 'login2',
			component: login

		},
		{
			path: '/cash_withdrawal',
			name: 'cash_withdrawal',
			component: cash_withdrawal
		},
		{
			path: '/rank',
			name: 'rank',
			component: rank
		},
		{
			path: '/luck_draw',
			name: 'luck_draw',
			component: luck_draw2
		},
		{
			path: '/sign',
			name: 'sign',
			component: sign
		},
		{
			path: '/sign_rule',
			name: 'sign_rule',
			component: sign_rule
		},
		{
			path: '/services',
			name: 'services',
			component: services2
		}, {
			path: '/my_master',
			name: 'my_master',
			component: my_master
		},
		{
			path: '/money_article/:id',
			name: 'money_article',
			component: money_article
		},
		{
			path: '/my_apprentice/:id',
			name: 'my_apprentice',
			component: my_apprentice
		},
		{
			path: '/cash_record',
			name: 'cash_record',
			component: cash_record
		},
		{
			path: '/mentor_share',
			name: 'mentor_share',
			component: mentor_share
		},
		{
			path: '/share_detail/:id',
			name: 'share_detail',
			component: share_detail
		},
		{
			path: '/course',
			name: 'course',
			component: course
		},
		//新注册页面路由
		{
			path: '/video_list',
			name: 'video_list',
			component: video
		},
		{
			path: '/notice_list',
			name: 'notice_list',
			component: notice_list
		},
		{
			path: '/password/:id',
			name: 'password',
			component: password
		},
		{
			path: '/vip',
			name: 'vip',
			component: vip
		},
		{
			path: '/task',
			name: 'task',
			component: task
		},
		//测试用登录页
		{
			path:'/test',
			name:'login',
			component:test
		}
		// 		{
		// 			path: '/mentor',
		// 			name: 'mentor2',
		// 			component: mentor2
		// 		},
		// 		{
		// 			path: '/luck_draw',
		// 			name: 'luck_draw2',
		// 			component: luck_draw2
		// 		},
		// 		{
		// 			path: '/money',
		// 			name: 'money2',
		// 			component: money2
		// 		},
		// 		{
		// 			path: '/my',
		// 			name: 'my2',
		// 			component: my2
		// 		}

	],

})
