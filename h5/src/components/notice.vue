<template>
    <div class="navTop" style="background: #ffffff;">
        <van-nav-bar
                :title="noticeTitle"
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
        name: "notice",
        data(){
            return{
                noticeInfo:{},
                noticeTitle:'公告',

            }
        },
        methods:{
            onClickLeft:function () {
				this.my();
				this.$router.go(-1);
            },

        },
        mounted() {
            $('#content').html(this.noticeInfo.content)
            this.noticeTitle=this.noticeInfo.title;
        },
        activated() {
			this.checkRoute();
            this.noticeInfo=common.getVal('pubmsgs')[common.getVal('noticeInfo')]
            console.log('notice',this.noticeInfo)
            $('.navTop').css('min-height',window.innerHeight-45+'px')
            $('#content').html(this.noticeInfo.content)
            this.noticeTitle=this.noticeInfo.title;
        }
    }
</script>

<style scoped>
    #content{
        padding:2%;
    }
</style>