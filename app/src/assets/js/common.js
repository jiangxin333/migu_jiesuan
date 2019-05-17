export default {
	/**
	 * 转换成2为小数的值显示
	 * @date 2019-02-13
	 * @param  i int型
	 * @return num int型
	 * @author LiuHongyuan
	 */
	tofix2: function(i) {
		var num = i.toFixed(2);
		return num;
	},
	/**
	 * 判断是否显示tabbar
	 * @date 2019-02-13
	 * @param  $route->路由信息（obj对象）
	 * @return 返回true，false
	 * @author LiuHongyuan
	 */
	tabShow: function($route) {
		if (
			$route.name == "my" ||
			$route.name == "mentor" ||
			$route.name == "moeny"
		) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 验证码倒计时
	 * @date 2019-02-13
	 * @param that->页面this对象 
	 * @param phone->手机号码 int型
	 * @param count->倒计时起始时间，int型
	 * @param max->倒计时最大时间，int型
	 * @return 无
	 * @author LiuHongyuan
	 */
	countDown: function(that, phone, count, max) {
		var tthat = this;
		that.time = setTimeout(function() {
			that.smsTxt = "(" + (max - count) + "s)后重新获取";
			that.canClick = true;
			count++;
			if (count > max) {
				that.smsTxt = "获取验证码";
				if (that.phone == "" || that.yzm == "") {
					that.canClick = true;
				} else {
					that.canClick = false;
				}
				clearTimeout(that.time);
			} else {
				tthat.countDown(that, phone, count, max);
			}
		}, 1000);
	},
	/**
	 * 校验登录状态（通过localstorage里的isLogin判断）
	 * @date 2019-02-13
	 * @param  that->页面this对象
	 * @return 无
	 * @author LiuHongyuan
	 */
	checkLogin: function(that) {
		if (
			window.localStorage.isLogin == false ||
			window.localStorage.isLogin == undefined
		) {
			this.goLink("/login", that);
		}
	},
	/**
	 * 校验本地缓存中字段是否存在
	 * @date 2019-02-13
	 * @param  name 字段key名字 str字符型
	 * @return 返回true,false
	 * @author LiuHongyuan
	 */
	checkStoreage(name) {
		if (
			window.localStorage.getItem(name) == "" ||
			window.localStorage.getItem(name) == undefined ||
			window.localStorage.getItem(name) == "undefined"
		) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 存储数据到本地缓存（仅支持json对象存储，普通单字段存储建议使用window.localStorage进行存储。该方法与getVal配套使用）
	 * @date 2019-02-13
	 * @param key->数据关键字名字 str字符型
	 * @param json->数据对象
	 * @return 无
	 * @author LiuHongyuan
	 */
	setVal(key, json) {
		window.localStorage.setItem(key, JSON.stringify(json));
	},
	/**
	 * 提取本地缓存数据（仅支持json对象读取，普通单字段读取建议使用window.localStorage进行读取。该方法与setVal配套使用）
	 * @date 2019-02-13
	 * @param key->数据关键字名字 str字符型
	 * @return json->数据对象
	 * @author LiuHongyuan
	 */
	getVal(key) {
		return JSON.parse(window.localStorage.getItem(key));
	},
	/**
	 * 路由跳转
	 * @date 2019-02-13 
	 * @param  url->路由地址，str字符型
	 * @param  that->页面this对象
	 * @return 无
	 * @author LiuHongyuan
	 */
	goLink(url, that) {
		if (this.getVal("isLogin") == true) {
			that.$router.push({
				path: url
			});
		} else {
			if (that.$route.path == '/my') {
				that.$router.push("/login")
			} else {
				that.$router.push({
					path: "/my"
				});
			}
		}
	},
	/**
	 * 公共ajax请求
	 * @date 2019-02-13 
	 * @param  url->请求地址 str字符型
	 * @param  data->请求发送的数据，json对象
	 * @param  success->成功回调方法，function对象
	 * @param  that->页面this对象
	 * @return 无
	 * @author LiuHongyuan
	 */
	toAjax(url, data, success, that) {
		if (that) {
			//当页面传入this对象的时候，出现加载遮罩层
			that.Toast = that.$toast.loading({
				duration: 0, // 持续展示 toast
				forbidClick: true, // 禁用背景点击
				loadingType: "spinner",
				message: "加载中",
				mask: true
			});
			setTimeout(function() {
				$('body').removeClass('van-toast--unclickable')
			}, 1000)

			$.ajax({
				url: url,
				data: data,
				type: "POST",
				timeout: 10000, //超时时间设置，单位毫秒
				xhrFields: {
					withCredentials: true
				},
				success: success,
				error: function() {
					that.Toast.message = "加载失败";
					setTimeout(function() {
						that.Toast.clear();
						that.$router.go(-1);
					}, 2000);
				}
			});
		} else {
			//当页面没有传入this对象的时候，直接请求
			$.ajax({
				url: url,
				data: data,
				type: "POST",
				timeout: 10000, //超时时间设置，单位毫秒
				xhrFields: {
					withCredentials: true
				},
				success: success,
				error:function(error){
					alert('error:'+JSON.stringify(error))
				}
			});
		}
	},

	// 截取字符串 返回 len 长度的字符串
	subString(str, len) {
		var strlen = 0;
		var s = "";
		for (var i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) > 128) {
				strlen += 2;
			} else {
				strlen++;
			}
			s += str.charAt(i);
			if (strlen >= len) {
				return s + "...";
			}
		}
		return s;
	},
	/**
	 * 微信登录(login页面)
	 * @date 2019-02-13 
	 * @param  that->页面this对象
	 * @return 无
	 * @author LiuHongyuan
	 */
	login(that) {
		var tthat = this; //tthat.js this对象
		api.addEventListener({
			name: 'wxLogind'
		}, function(ret, err) {
			//测试code请放开这段代码，注释掉ajax请求
			// 			that.code = ret.value.code;
			// 			that.$toast(ret.value.code)
			// 			that.isTest = true;
			// 			return;
			//正式使用请注释掉上面代码，放开ajax请求
			tthat.toAjax(tthat.host + '/appwechatlogin', {
				code: ret.value.code,
				from: 'app'
			}, function(res) {
				if (res.err_code == 2001) {
					var regUrl = '/userlogin/bindtel?data=' + res.data.data + '&img=' + res.data.img;
					window.localStorage.backUrl = location.protocol+'//' + location.host + "/apparticle#/my";
					// document.write(regUrl)
					location.href = regUrl;
				} else {
					if (res.err_code == 0) {
						window.localStorage.isLogin = true;
						var msg = res.err_msg;
						that.$toast(res.err_msg);
						if (that.$route.path == '/login') {
							that.$router.go(-1);
						}
						//login页登录请使用这段
						// 					that.clearInfo();
						// 					tthat.toAjax(tthat.host + '/users/userData', {}, function(
						// 						ress
						// 					) {
						// 						if (ress.err_code != 800) {
						// 							if (ress.err_code == 0) {
						// 								tthat.setVal('userInfo', ress.data);
						// 								tthat.setVal('passwd_id', ress.data.passwd_id);
						// 								that.userInfo = tthat.getVal('userInfo');
						// 								that.isLogin = true;
						// 								setTimeout(function() {
						// 									that.$router.go(-1);
						// 								}, 2000);
						// 							} else {
						// 								that.$toast(ress.err_msg);
						// 							}
						// 						} else {
						// 							that.isLogin = false;
						// 						}
						// 					});
						//微信直接登录使用这段
						tthat.toAjax(tthat.host + '/users/userData', {}, function(res) {
							if (res.err_code != 800) {
								if (res.err_code == 0) {
									tthat.setVal('userInfo', res.data);
									tthat.setVal('en_rank', res.data.en_rank)
									that.userInfo = tthat.getVal('userInfo');
									that.isLogin = true;
									that.showAd();
								} else {
									that.$toast(res.err_msg);
								}
							} else {
								that.isLogin = false;
							}
						});
					} else {
						window.localStorage.isLogin = false;
						that.$toast(res.err_msg);
						// that.clearInfo();//使用login页登录的时候请放开这段注释
					}
				}

			})
		});
		api.sendEvent({
			name: 'wxLogin',
			extra: {}
		});
	},
	/**
	 * 微信登录(任务中心，师徒页面)
	 * @date 2019-02-13 
	 * @param  that->页面this对象
	 * @return 无
	 * @author LiuHongyuan
	 */
	loginOther() {
		var tthat = this; //tthat.js this对象
		var logined=false;
		api.addEventListener({
			name: 'wxLogind'
		}, function(ret, err) {
			//测试code请放开这段代码，注释掉ajax请求
			// alert(ret.value.code)
			// that.code = ret.value.code;
			// that.$toast(ret.value.code)
			// that.isTest = true;
			// return;
			//正式使用请注释掉上面代码，放开ajax请求
			tthat.toAjax(tthat.host + '/appwechatlogin', {
				code: ret.value.code,
				from: 'app'
			}, function(res) {
				if (res.err_code == 2001) {
					var regUrl = '/userlogin/bindtel?data=' + res.data.data + '&img=' + res.data.img;
					window.localStorage.backUrl = location.protocol+'//' + location.host + "/apparticle#/my";
					// document.write(regUrl)
					location.href = regUrl;
				} else {
					if (res.err_code == 0) {
						//微信直接登录使用这段
						tthat.toAjax(tthat.host + '/users/userData', {}, function(res) {
							if (res.err_code != 800) {
								if (res.err_code == 0) {
									tthat.setVal('userInfo', res.data);
									tthat.setVal('en_rank', res.data.en_rank)
									window.localStorage.isLogin = true;
								} else {
								}
							} else {
								window.localStorage.isLogin = false;
							}
						});
					} else {
						window.localStorage.isLogin = false;
						// that.clearInfo();//使用login页登录的时候请放开这段注释
					}
				}

			})
		});
		api.sendEvent({
			name: 'wxLogin',
			extra: {}
		});
	},
	/**
	 * 通用返回上一页方法
	 * @date 2019-02-13 
	 * @param  that->页面this对象
	 * @return 无
	 * @author LiuHongyuan
	 */
	goBack(that) {
		that.$router.go(-1);
	},
	/**
	 * 时间戳格式化函数 
	 * @date 2019-02-13 
	 * @param  {string} format    格式 
	 * @param  {int}    timestamp 要格式化的时间 默认为当前时间 
	 * @return {string}           格式化的时间字符串 
	 * @author LiuHongyuan
	 */
	date(format, timestamp) {
		var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
		var pad = function(n, c) {
			if ((n = n + "").length < c) {
				return new Array(++c - n.length).join("0") + n;
			} else {
				return n;
			}
		};
		var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var txt_ordin = {
			1: "st",
			2: "nd",
			3: "rd",
			21: "st",
			22: "nd",
			23: "rd",
			31: "st"
		};
		var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September",
			"October", "November", "December"
		];
		var f = {
			// Day 
			d: function() {
				return pad(f.j(), 2)
			},
			D: function() {
				return f.l().substr(0, 3)
			},
			j: function() {
				return jsdate.getDate()
			},
			l: function() {
				return txt_weekdays[f.w()]
			},
			N: function() {
				return f.w() + 1
			},
			S: function() {
				return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'
			},
			w: function() {
				return jsdate.getDay()
			},
			z: function() {
				return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0
			},

			// Week 
			W: function() {
				var a = f.z(),
					b = 364 + f.L() - a;
				var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
				if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
					return 1;
				} else {
					if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
						nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
						return date("W", Math.round(nd2.getTime() / 1000));
					} else {
						return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
					}
				}
			},

			// Month 
			F: function() {
				return txt_months[f.n()]
			},
			m: function() {
				return pad(f.n(), 2)
			},
			M: function() {
				return f.F().substr(0, 3)
			},
			n: function() {
				return jsdate.getMonth() + 1
			},
			t: function() {
				var n;
				if ((n = jsdate.getMonth() + 1) == 2) {
					return 28 + f.L();
				} else {
					if (n & 1 && n < 8 || !(n & 1) && n > 7) {
						return 31;
					} else {
						return 30;
					}
				}
			},

			// Year 
			L: function() {
				var y = f.Y();
				return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
			},
			//o not supported yet 
			Y: function() {
				return jsdate.getFullYear()
			},
			y: function() {
				return (jsdate.getFullYear() + "").slice(2)
			},

			// Time 
			a: function() {
				return jsdate.getHours() > 11 ? "pm" : "am"
			},
			A: function() {
				return f.a().toUpperCase()
			},
			B: function() {
				// peter paul koch: 
				var off = (jsdate.getTimezoneOffset() + 60) * 60;
				var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
				var beat = Math.floor(theSeconds / 86.4);
				if (beat > 1000) beat -= 1000;
				if (beat < 0) beat += 1000;
				if ((String(beat)).length == 1) beat = "00" + beat;
				if ((String(beat)).length == 2) beat = "0" + beat;
				return beat;
			},
			g: function() {
				return jsdate.getHours() % 12 || 12
			},
			G: function() {
				return jsdate.getHours()
			},
			h: function() {
				return pad(f.g(), 2)
			},
			H: function() {
				return pad(jsdate.getHours(), 2)
			},
			i: function() {
				return pad(jsdate.getMinutes(), 2)
			},
			s: function() {
				return pad(jsdate.getSeconds(), 2)
			},
			//u not supported yet 

			// Timezone 
			//e not supported yet 
			//I not supported yet 
			O: function() {
				var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
				if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
				else t = "+" + t;
				return t;
			},
			P: function() {
				var O = f.O();
				return (O.substr(0, 3) + ":" + O.substr(3, 2))
			},
			//T not supported yet 
			//Z not supported yet 

			// Full Date/Time 
			c: function() {
				return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()
			},
			//r not supported yet 
			U: function() {
				return Math.round(jsdate.getTime() / 1000)
			}
		};

		return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
			var ret
			if (t != s) {
				// escaped 
				ret = s;
			} else if (f[s]) {
				// a date function exists 
				ret = f[s]();
			} else {
				// nothing special 
				ret = s;
			}
			return ret;
		});
	},
	/**
	 * 发布时间格式化函数 
	 * @date 2019-02-13 
	 * @param  {string} time    格式 
	 * @return {string}         格式化的时间字符串 
	 * @author LiuHongyuan
	 */
	publishTime(time) {
		var date1 = time; //开始时间
		var date2 = new Date(); //结束时间
		var date3 = date2.getTime() - new Date(date1).getTime(); //时间差的毫秒数      
		//计算出相差天数
		var days = Math.floor(date3 / (24 * 3600 * 1000))
		//计算出小时数
		var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
		var hours = Math.floor(leave1 / (3600 * 1000))
		//计算相差分钟数
		var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
		var minutes = Math.floor(leave2 / (60 * 1000))
		//计算相差秒数
		var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
		var seconds = Math.round(leave3 / 1000)
		if (days > 0) {
			return time;
		} else if (hours > 0) {
			return hours + "小时 " + minutes + " 分钟" + seconds + " 秒前"
		} else if (minutes > 0) {
			return minutes + " 分钟" + seconds + " 秒前"
		} else {
			return seconds + " 秒前"
		}
	},
	host: "", //打包域名
	// host:"http://test.itbsdtbsz.cn",	
	// host: "http://migutest.zmr016.com", //结算测试域名
	host: "http://migu.zmr016.com", //结算测试域名
	// host: "http://app.qiucool.cn",//正式域名
	// host:"http://test.baichengiu.cn",
	// host:"http://midd.qiucool.cn",//测试域名
	// host:"http://test.rmdhuychg.cn",//测试域名
	// host:"http://qz.wooyii.cn",
	// host:"http://apptest.qiucool.cn",
	// host:"http://migutest.zmr016.com",//网页授权域名
	// host: "http://www.lhy.com", //刘弘愿 本地域名
	// host: 'http://quzhuan.com', //刘茂良 本地域名
	// host: 'http://www.quzhuan.com',//王利祥 本地域名
	// host:'http://byquzhuan.com',// 何长庆 本地域名
};
