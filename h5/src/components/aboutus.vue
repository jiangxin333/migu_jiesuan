<template>
    <div class="navTop" style="background: #ffffff;">
        <van-nav-bar
                title="关于我们"
                left-arrow
                @click-left="onClickLeft"
                fixed
        />
        <div id="content">

        </div>
    </div>
</template>

<script>
    import common from '../assets/js/common'
    export default {
		inject:['checkRoute','money','mentors','my'],
        name: "aboutus",
        data(){
            return{
                weixin:'123123213lsdfkjsdlfkj',
                weixin2:'fsdjflsdfjwoer'
            }
        },
        methods:{
            onClickLeft:function () {
                this.$router.go(-1);
            }
        },
        activated() {
			this.checkRoute();
            $('.navTop').css('min-height',window.innerHeight-45+'px')
            $('#content').html(common.getVal('commonInfo').aboutus.value)
        }
    }
</script>

<style scoped>
    .topImg{
        width: 100%;
    }
    .logoImg{
        width: 60px;
        height: 60px;
        position: absolute;
        top:50%;
        left:50%;
        margin-top: -40px;
        margin-left: -30px;
    }
    .appName{
        position: absolute;
        top:60%;
        color: #ffffff;
        font-size: 16px;
    }
    #content p{
        text-indent: 2em;
        line-height: 2em;
        padding:0 4%;
        width: 92%;
    }
    #content p:last-child{
        text-indent: 0;
        text-align: center;
    }
</style>