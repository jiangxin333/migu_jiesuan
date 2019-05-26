<template>
	<div class="navTop">
		<van-nav-bar :title="pass_title" left-arrow @click-left="onClickLeft" fixed />
		<van-cell-group>
			<van-field v-model="tel" type="text" required clearable label="手机号" placeholder="请输入手机号" @blur="checkPhone(tel)" @keypress="checkLength()" />
			<van-field
				v-model="old_pass"
				:type="type_old"
				required
				clearable
				label="原密码"
				:right-icon="icon_old"
				placeholder="请输入原密码"
				@click-right-icon="showIco1"
				v-if="this.$route.params.id == 0"
				:error="old_pass == '' && checked"
				:error-message="old_pass == '' && checked ? '原密码不能为空' : ''"
				@blur="checkPass(true)"
				@focus="checkPass(false)"
			/>
			<van-field
				v-model="new_pass"
				:type="type_new"
				:required="this.$route.params.id == 1"
				clearable
				label="新密码"
				:right-icon="icon_new"
				placeholder="请输入新密码"
				:error="new_pass_confirm != '' && new_pass == ''"
				@click-right-icon="showIco2"
			/>
			<van-field
				v-model="new_pass_confirm"
				:type="type_new_confirm"
				:required="this.$route.params.id == 1"
				clearable
				label="再次确认新密码"
				label-width="120px"
				:right-icon="icon_new_confirm"
				placeholder="请再次输入新密码"
				@click-right-icon="showIco3"
				:error="new_pass_confirm == '' && new_pass != ''"
				:error-message="new_pass != new_pass_confirm ? '两次密码输入不一致' : ''"
			/>
		</van-cell-group>
		<van-cell-group style="width: 90%;margin: 10px auto;background: transparent;" :border="false">
			<van-button size="large" type="primary" square block @click="submitPass">{{ pass_btn }}</van-button>
		</van-cell-group>
	</div>
</template>

<script>
import common from '../assets/js/common';
export default {
	inject: ['checkRoute'],
	name: 'password',
	data() {
		return {
			isShow_old: false,
			isShow_new: false,
			isShow_new_confirm: false,
			tel: '',
			old_pass: '',
			new_pass: '',
			new_pass_confirm: '',
			pass_title: '',
			pass_btn: '',
			checked: false,
			tem_tel: ''
		};
	},
	computed: {
		//明文显示密码控制器
		type_old() {
			return this.isShow_old ? 'text' : 'password';
		},
		type_new() {
			return this.isShow_new ? 'text' : 'password';
		},
		type_new_confirm() {
			return this.isShow_new_confirm ? 'text' : 'password';
		},
		icon_old() {
			return this.isShow_old ? 'eye' : 'eye-o';
		},
		icon_new() {
			return this.isShow_new ? 'eye' : 'eye-o';
		},
		icon_new_confirm() {
			return this.isShow_new_confirm ? 'eye' : 'eye-o';
		}
	},
	methods: {
		onClickLeft: function() {
			this.$router.go(-1);
		},
		//明文显示密码控制器showIco1，showIco2，showIco3
		showIco1() {
			this.isShow_old = !this.isShow_old;
		},
		showIco2() {
			this.isShow_new = !this.isShow_new;
		},
		showIco3() {
			this.isShow_new_confirm = !this.isShow_new_confirm;
		},
		//提交表单
		submitPass() {
			var that = this;

			if (this.tel == '') {
				this.$toast('手机号不能为空');
				return false;
			}
			if (this.$route.params.id == 0) {
				if (this.new_pass == '' && this.new_pass_confirm == '') {
					this.$toast('检测到未输入新密码，默认为未修改密码，将于2秒后返回上一页');
					setTimeout(function() {
						that.$router.go(-1);
					}, 2000);
					return false;
				}
			}
			if (this.$route.params.id == 1) {
				if (this.new_pass == '' || this.new_pass_confirm == '') {
					this.$toast('绑定密码时，密码不能为空');
					return false;
				} else {
					if (this.new_pass != this.new_pass_confirm) {
						return false;
					}
				}
			}
			common.toAjax(
				common.host + '/users/newcontact',
				{
					tel: that.tel,
					old_password: that.old_pass,
					password: that.new_pass,
					confirm_password: that.new_pass_confirm,
					type: "password"
				},
				function(res) {
					if (res.err_code != 800) {
						if (res.err_code == 0) {
							that.$dialog.alert({ message: res.err_msg }).then(() => {
								that.$router.go(-1);
							});
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
		},
		checkPass(check) {
			//默认只在离开原密码后才校验，进入的时候清空校验信息
			this.checked = check;
		},
		checkPhone(phoneNum) {
			//手机号正则校验
			if (!/^1[34578]\d{9}$/.test(phoneNum) && this.tel != '') {
				this.$toast('手机号码有误，请重填');
				this.tel = '';
				return false;
			} else {
				return true;
			}
		},
		checkLength() {
			//显示11位手机号输入长度
			console.log(this.tel.length);
			if (this.tel.length == 10) {
				this.tem_tel = this.tel;
			}
			if (this.tel.length >= 11) {
				this.tel = this.tem_tel;
				return false;
			}
		}
	},
	activated() {
		this.checkRoute();
		this.old_pass = '';
		this.new_pass = '';
		this.new_pass_confirm = '';
		this.checked = false;
		this.isShow_old = false;
		this.isShow_new = false;
		this.isShow_new_confirm = false;
		//判断页面来源（0为修改页面，1为绑定页面）
		var id = this.$route.params.id;
		if (id == 0) {
			this.pass_title = '修改密码';
			this.pass_btn = '修改密码';
		} else {
			this.pass_title = '绑定密码';
			this.pass_btn = '绑定密码';
		}
		//从用户信息中取出手机号回填，如果是正常手机号则回填，否则不回填
		var user_tel = common.getVal('userInfo').tel;
		if (/^1[34578]\d{9}$/.test(user_tel)) {
			this.tel = user_tel;
		}
	}
};
</script>

<style></style>
