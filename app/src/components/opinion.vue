<template>
    <div class="navTop">
        <van-nav-bar
                title="意见反馈"
                left-arrow
                @click-left="onClickLeft"
                fixed
        />
        <textarea v-model="opinion" class="textareaBox" maxlength="80" placeholder="感谢你的反馈，如果意见或建议被采纳就有机会获得2000积分" >

        </textarea>
        <div style="margin:5% 2%">
            <van-cell-group>
                <van-field v-model="contactNum" clearable type="text" placeholder="（非必填）请输入联系你的QQ号"/>
            </van-cell-group>
        </div>
        <div class="btn btn-opinion">
            <van-button size="large" type="primary" square block @click="submit">提交</van-button>
        </div>
    </div>
</template>

<script>
    import common from '../assets/js/common.js'
    export default {
		inject:['checkRoute','money','mentors','my'],
        name: "opinion",
        data(){
            return{
                textarea:'',
                contactNum:'',
                opinion:''
            }
        },
        methods:{
            onClickLeft:function () {
                this.$router.go(-1);
            },
            submit(){
                var that=this;
                if(that.opinion!=''){
                    that.$toast('反馈信息提交成功')
                    setTimeout(function () {
                        that.$router.go(-1)
                    },1000)
                }else{
                    that.$toast('请填写反馈信息后再提交')
                }


            }
        },
		activated() {
			this.checkRoute();
		}
    }
</script>

<style scoped>
    .textareaBox{
		box-sizing: border-box;
        width: 96%;
        height: 200px;
        margin:5% 2% 0;
        resize:none;
        border:none;
        padding:1% 3%;
    }
    .btn-opinion{
        width: 96%;
    }
</style>