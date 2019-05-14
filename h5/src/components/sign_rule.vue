<template>
    <div class="navTop" style="background: #ffffff;">
        <van-nav-bar
                title="签到规则"
                left-arrow
                @click-left="onClickLeft"
                fixed
        />
        <div id="content"></div>
    </div>
</template>

<script>
    import common from '../assets/js/common'
    export default {
		inject:['checkRoute','money','mentors','my'],
        name: "sign_rule",
        data(){
            return{

            }
        },
        methods:{
            onClickLeft:function () {
               common.goBack(this);
            },

        },
        activated() {
			this.checkRoute();
            $('.navTop').css('min-height',window.innerHeight-45+'px')
            $('#content').html(common.getVal('commonInfo').signin.value)
        }
    }
</script>

<style scoped>
    #content{
        padding:2%;
    }
    html,body{
        background: #ffffff!important;
    }
</style>