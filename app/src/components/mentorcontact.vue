<template>
    <div class="navTop">
        <van-nav-bar
                title="个人信息"
                left-arrow
                @click-left="onClickLeft"
                fixed
        />
       <!-- <p style="color:#ff5b56;padding:4% 4% 2% 4%; font-size: 14px;">提示：</p>
        <p style="color:#ff5b56;padding:0 6%;">1、实名信息必须真实有效；提现会根据实名信息打款</p>
        <p style="color:#ff5b56;padding:0 6%;">2、实名信息一经提交后将无法更改，若需更改，请联系客服。</p> -->
        <van-cell-group style="padding-bottom:10px;margin-bottom: 10px;">
            <img :src="img" alt="" class="userImg">
        <!--   <van-uploader :after-read="onRead">
                <van-icon name="photograph"/>
            </van-uploader> -->
        </van-cell-group>

        <van-cell-group>
            <van-field v-model="name" label="昵称：" type="text" clearable/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="tel" label="手机号：" type="text" :readonly="isTel" clearable/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="qq" label="QQ号：" type="number" clearable/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="weixin" label="微信号：" :error="checkErr" clearable/>
        </van-cell-group>
        <div class="btn">
            <van-button size="large" type="primary" square block @click="submitContact">提交</van-button>
        </div>

    </div>
</template>

<script>
    import common from '../assets/js/common.js'

    export default {
		inject:['checkRoute','money','mentors','my'],
        name: "mentorcontact",
        data() {
            return {
                checkErr: false,
                qq: '',
                weixin: '',
                img: '',
                imgObj: '',
                name: '',
                tel: '',
                radio: '1',
                isTel: false,
                isCheck:false,
            }
        },
        methods: {
            onClickLeft: function () {
                this.$router.go(-1)
            },
            submitContact() {
                var that = this;

                common.toAjax(
                    common.host + '/users/newcontact',
                    {
                        qq: that.qq,
                        weixin: that.weixin,
                        img: that.img,
                        name: that.name,
                        tel: that.tel,
						type: "userinfo"
                    },
                    function (res) {
                        if (res.err_code != 800) {
                            if (res.err_code == 0) {
                                that.$toast(res.err_msg);
                                setTimeout(function () {
                                    that.$router.go(-1)
                                }, 1000)
                            } else {
                                that.$toast(res.err_msg)
                            }
                        } else {
                            that.$toast(res.err_msg)
                            setTimeout(function () {
                                common.goLink('/login', that)
                            }, 1000)
                        }
                    }
                )
            },
            onRead(file) {
                this.img = file.content;
            },
        },
        activated() {
            var that = this;
			that.checkRoute();
            common.toAjax(
                common.host + '/users/usercontact',
                {user_id: common.getVal('userInfo').id},
                function (res) {
                    if (res.err_code != 800) {
                        if (res.err_code == 0) {
                            that.qq = res.data.qq;
                            that.weixin = res.data.weixin;
                            that.name = res.data.name;
                            that.tel = res.data.tel;
                            that.bank = res.data.bank;
                            that.bank_no = res.data.bank_no;
                            that.img = res.data.img;
                            if (res.data.tel != '' && res.data.tel != null) {
                                that.isTel = true;
                            }
                        } else {
                            that.$toast(res.err_msg)
                        }
                    } else {
                        that.$toast(res.err_msg)
                        setTimeout(function () {
                            common.goLink('/login', that)
                        }, 1000)
                    }


                }
            )
        }
    }
</script>

<style scoped>
    .userImg {
        width: 80px;
        height: 80px;
        border: 2px solid #dddddd;
        display: block;
        border-radius: 50%;
        margin: 10px auto;
    }

    .van-uploader {
        text-align: center;
        width: 100px;
        display: block;
        margin: 10px auto auto;
    }

    .van-icon {

        font-size: 25px;
    }

    .van-cell-group {
        padding-top: 1px;
    }
</style>