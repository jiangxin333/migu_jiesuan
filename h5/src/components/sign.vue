<template>
  <div class="navTop" style="background: #fcf5eb;">
    <van-nav-bar
      title="签到"
      left-arrow
      right-text="签到规则"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
    />
    <div class="topSign">
      <ul class="dayIcon">
        <li v-for="(item,index) in signPrize" :key="index">
          <div class="outCircle">
            <div class="inCircle">
              <span style="font-size: 18px">{{item}}</span>
              <span style="margin-top: -4px">元</span>
              <img src="../assets/img/isSign.png" alt class="rightImg" v-if="index+1<=signDay">
            </div>
          </div>
          <span class="signDay">第{{index+1}}天</span>
        </li>
      </ul>
      <div style="clear:both"></div>
      <p
        style="width: 100%;text-align: center;color: #ffffff;font-size: 18px;margin:20px auto;"
      >连续签到，最高可得{{signPrize[6]}}元哦~</p>
      <div class="btn-outLine" @click="toSign">
        <div class="btn-inLine">{{!isSign?'签到':'已签到'}}</div>
      </div>
      <!-- <div class="btn-draw" @click="todraw" v-if="isSign">积分到手&nbsp;&nbsp;立即抽奖</div> -->
    </div>
    <div id="taskBody">
      <p style="font-size: 18px;text-align: center;width: 100%;" class="redTxt">新手任务</p>
      <div class="taskCard">
        <van-row>
          <van-col span="16">
            <p class="boldTxt">1.注册登录
              <span class="redTxt">{{task.login.value}}元</span>
            </p>
            <p class="grayTxt">成为{{appname}}用户，每天赚不停</p>
          </van-col>
          <van-col span="8">
            <div class="btn btn0" v-if="task.login.status==0">去完成</div>
            <div class="btn btn1" v-if="task.login.status==1" @click="toGetCoin('login')">立即领取</div>
            <div class="btn btn2" v-if="task.login.status==2">已完成</div>
          </van-col>
        </van-row>
      </div>
      <div class="taskCard">
        <van-row>
          <van-col span="16">
            <p class="boldTxt">2.签到赚现金
              <span class="redTxt">{{task.demolitionred.value}}元</span>
            </p>
            <p class="grayTxt">签到可以获得现金，每天赚不停</p>
          </van-col>
          <van-col span="8">
            <div class="btn btn0" v-if="task.demolitionred.status==0" @click="toPage('sign')">去完成</div>
            <div
              class="btn btn1"
              v-if="task.demolitionred.status==1"
              @click="toGetCoin('demolitionred')"
            >立即领取</div>
            <div class="btn btn2" v-if="task.demolitionred.status==2">已完成</div>
          </van-col>
        </van-row>
      </div>
      <div class="taskCard">
        <van-row>
          <van-col span="16">
            <p class="boldTxt">3.幸运抽奖
              <span class="redTxt">{{task.draw.value}}元</span>
            </p>
            <p class="grayTxt">10000元大奖等你哦</p>
          </van-col>
          <van-col span="8">
            <div class="btn btn0" v-if="task.draw.status==0" @click="toPage('draw')">去完成</div>
            <div class="btn btn1" v-if="task.draw.status==1" @click="toGetCoin('draw')">立即领取</div>
            <div class="btn btn2" v-if="task.draw.status==2">已完成</div>
          </van-col>
        </van-row>
      </div>
      <div class="taskCard">
        <van-row>
          <van-col span="16">
            <p class="boldTxt">4.分享文章
              <span class="redTxt">{{task.share.value}}元</span>
            </p>
            <p class="grayTxt">好友阅读后还会获得更多奖励哦</p>
          </van-col>
          <van-col span="8">
            <div class="btn btn0" v-if="task.share.status==0" @click="toPage('money')">去完成</div>
            <div class="btn btn1" v-if="task.share.status==1" @click="toGetCoin('share')">立即领取</div>
            <div class="btn btn2" v-if="task.share.status==2">已完成</div>
          </van-col>
        </van-row>
      </div>
      <div class="taskCard">
        <van-row>
          <van-col span="16">
            <p class="boldTxt">5.微信提现随机红包</p>
            <p class="grayTxt">进行提现还可以获得最高10元红包奖励</p>
          </van-col>
          <van-col span="8">
            <div class="btn btn0" v-if="task.random.status==0" @click="toPage('cash')">去完成</div>
            <div class="btn btn1" v-if="task.random.status==1" @click="toGetCoin('random')">立即领取</div>
            <div class="btn btn2" v-if="task.random.status==2">已完成</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import common from "../assets/js/common";

export default {
	inject:['checkRoute','money','mentors','my'],
  name: "sign",
  data() {
    return {
      signPrize: [30, 40, 50, 60, 70, 80, 90],
      signDay: 0,
      isSign: false,
      task: {
        login: {
          status: 0,
          value: 0
        },
        demolitionred: {
          status: 0,
          value: 0
        },
        draw: {
          status: 0,
          value: 0
        },
        share: {
          status: 0,
          value: 0
        },
        random: {
          status: 0,
          value: 0
        }
      },
			appname:''
    };
  },
  methods: {
    onClickLeft: function() {
			this.my();
			common.goBack(this);
    },
    onClickRight: function() {
      common.goLink("/sign_rule", this);
    },
    toSign() {
      var that = this;
      if (that.isSign) {
        return;
      }
      common.toAjax(
        common.host + "/users/sign",
        {
          id: common.getVal("userInfo").id
        },
        function(res) {
          if (res.err_code != 800) {
            if (res.err_code == 0 || res.err_code == 100) {
              that.$dialog
                .alert({
                  confirmButtonText: "好的",
                  message: res.err_msg
                })
                .then(() => {
                  // on close
                  that.isSign = true;
									if(that.task.demolitionred.status==0){
										that.task.demolitionred.status=1;
									}
                  that.signDay++;
                  var userInfo = common.getVal("userInfo");
                  userInfo.coin += res.data;
                  common.setVal("userInfo", userInfo);
                });
            } else {
              that.$toast(res.err_msg);
            }
          } else {
            that.$toast(res.err_msg);
             window.localStorage.isLogin = false;
            setTimeout(function() {
              common.goLink("/login", that);
            }, 1000);
          }
        }
      );
    },
    todraw() {
      common.goLink("/luck_draw", this);
    },
    toPage(page) {
      switch (page) {
        case "sign":
          this.toSign();
          break;
        case "draw":
          common.goLink("/luck_draw", this);
          break;
        case "money":
          common.goLink("/article", this);
					this.money();
          break;
        case "cash":
          common.goLink("/cash_withdrawal", this);
          break;
      }
    },
    toGetCoin(type) {
      var that = this;
      common.toAjax(
        common.host + "/signs/tasked",
        {
          type: type
        },
        function(res) {
          that.$toast(res.err_msg);
          if (res.err_code != 800) {
            if (res.err_code == 0) {
              that.$toast(res.err_msg);
              var userInfo = common.getVal("userInfo");
              userInfo.balance = res.data.balance;

              common.setVal("userInfo", userInfo);

              that.task = JSON.parse(res.data.task);
            }
          } else {
             window.localStorage.isLogin = false;
            setTimeout(function() {
              common.goLink("/login", that);
            });
          }
        }
      );
    }
  },
  activated() {
    var that = this;
		that.checkRoute();
		that.appname=common.getVal('loginData').platform_name;
    if (common.getVal("userInfo") != null) {
      this.task = JSON.parse(common.getVal("userInfo").task);
    }
    common.toAjax(common.host + "/users/signList", {}, function(res) {
      if (res.err_code != 800) {
        if (res.err_code == 0) {
          that.signDay = res.data.continue_day;
          that.signPrize = res.data.day_money;
          that.isSign = res.data.is_sign;
        } else {
          that.$toast(res.err_msg);
        }
      } else {
        that.$toast(res.err_msg);
         window.localStorage.isLogin = false;
        setTimeout(function() {
          common.goLink("/login", that);
        }, 1000);
      }
    });
    common.toAjax(common.host + "/signs/tasklist", {}, function(res) {
      if (res.err_code != 800) {
        if (res.err_code == 0) {
          that.task = res.data;
        } else {
          that.$toast(res.err_msg);
        }
      } else {
        that.$toast(res.err_msg);
         window.localStorage.isLogin = false;
        setTimeout(function() {
          common.goLink("/login", that);
        }, 1000);
      }
    });
  }
};
</script>

<style scoped>
.topSign {
  width: 100%;
  height: 320px;
  background: red;
}

.dayIcon {
  margin: 0 auto;
  clear: both;
  width: 96%;
}

.dayIcon li {
  float: left;
  list-style: none;
  margin: 5px;
  text-align: center;
}

.outCircle {
  width: 34px;
  height: 34px;
  background: #ffffff;
  border-radius: 50%;
  margin-bottom: 5px;
  padding: 4px;
}

.inCircle {
  width: 31px;
  height: 31px;
  border-radius: 50%;
  border: 1px solid #ff5b56;
  position: relative;
}

.dayIcon li span {
  width: 28px;
  text-align: center;
  color: #ff5b56;
  font-size: 12px;
  -webkit-transform: scale(0.6);
  -moz-transform: scale(0.6);
  -ms-transform: scale(0.6);
  -o-transform: scale(0.6);
  transform: scale(0.6);
}

.dayIcon .inCircle span {
  width: 32px;
  text-align: center;
  color: #ff5b56;
  font-size: 16px;
  line-height: 17px;
  display: block;
}
.dayIcon .inCircle span:first-child {
  margin-top: 2px;
}

.signDay {
  color: #ffffff !important;
}

.rightImg {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
}

.btn-outLine {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin: 0 auto;
  border: 6px solid #ff4444;
  padding: 6px;
  background: #ffffff;
}

.btn-inLine {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 1px solid #ff5b56;
  line-height: 68px;
  text-align: center;
  font-size: 16px;
}

.btn-draw {
  width: 140px;
  height: 30px;
  background: #f0be43;
  border-radius: 30px;
  border: none;
  -webkit-box-shadow: 1px 1px 1px #000000;
  -moz-box-shadow: 1px 1px 1px #000000;
  box-shadow: 1px 1px 1px #000000;
  text-align: center;
  line-height: 30px;
  margin: 20px auto;
  color: red;
  font-weight: bolder;
  font-size: 14px;
}

#taskBody {
  width: 90%;
  margin: 20px 5%;
  min-height: 400px;
  background: url("https://qiniustore.zmr016.com/quzhuan/imgs/task_bg.png") no-repeat;
  background-size: 100% 400px;
}

.taskCard {
  width: 90%;
  margin: 10px 5%;
  font-size: 14px;
}

.boldTxt {
  font-weight: bolder;
}

.btn {
  width: 70px;
  height: 26px;
  border-radius: 20px;
  line-height: 26px;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  margin: 5px auto auto;
}

.btn0 {
  background: #ca513e;
}

.btn1 {
  background: #edbd4e;
}

.btn2 {
  background: #cccccc;
}
</style>