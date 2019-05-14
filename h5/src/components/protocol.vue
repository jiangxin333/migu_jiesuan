<template>
    <div class="navTop" style="background: #ffffff;">
        <van-nav-bar
                title="使用条款及隐私协议"
                left-arrow
                @click-left="onClickLeft"
                fixed
        />
        <div id="content"></div>
    </div>
</template>

<script>
    import common from '../assets/js/common.js'
    export default {
		inject:['checkRoute','money','mentors','my'],
        name: "protocol",
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
            $('#content').html(common.getVal('commonInfo').agreement.value)
        }


    }
</script>

<style scoped>
    #content{
        padding:2%;
    }
</style>