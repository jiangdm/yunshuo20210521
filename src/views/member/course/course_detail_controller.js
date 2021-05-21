import cTitle from "components/title";
import { Toast } from 'vant';

var submitActionTag = "";

// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second;

  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return (
      hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2)
    );
  } else {
    return "0:00:00";
  }
}

export default {
  data() {
    return {
      // 折叠面板
      activeNames:[],
      show1: false,
      service_QRcode: "",
      service_mobile: "",
      //是否开启直播
      live: false,
      live_title: "",
      info: {},
      is_zhibo: false,
      //标题
      goodTit: "",
      //价格
      goodPrice: "",
      //章节数
      chapterNum: 0,
      //讲师头像
      teacherImg: "",
      //讲师姓名
      teacherName: "",
      //章节列表
      chapterdigList: [],
      //播放src
      vedioSrc: "",

      is_show: true,
      is_vshow: false,

      isLook: false,
      //商品价格
      goodsPrice: 0,

      //商品详情
      goodsContent: "",

      //推荐商品
      pushGoodList: [],

      active: 9999,
      first_active: 9999,
      is_study: false,

      is_update: false,

      is_buy: false,

      contentShow: false,

      pushShow: false,

      rewardShow: false,
      rewardMoney: "",
      actionSheetItems: [],
      //弹窗按钮控制
      actionSheetShow: false,

      rewardBtnShow: false,

      //分享数据
      courseShare: {},

      //商品图片
      goodsImg: "",

      //客服参数
      cservice: "",

      //课程id
      courseId: "",
      //章节id
      chapter_id: "",

      //tab active class
      tabActive: "first",

      //打赏金额选项
      rewardArr: [
        {
          value: 1,
          name: "5元"
        },
        {
          value: 2,
          name: "10元"
        },
        {
          value: 3,
          name: "20元"
        },
        {
          value: 4,
          name: "其他金额"
        }
      ],

      rewardMoneyBtn: false,

      moneyActiveClass: 9999,

      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      },
      sliderTime: 0,
      songStop: true,
      isVoice: false,
      isVideo: false,

      isVideoOn: true,
      loadBtn: true,
      //价格权限
      vip_level_status: {},
      video_image: null, //视频封面
      see_levels: "",
      is_try_time: null,

      rewardPayshow: false,
      payPassBoxShow: false,
      passwordInfo: {},
      pwds: [],
      pwd: "",
      pw1: "",
      pw2: "",
      pw3: "",
      pw4: "",
      pw5: "",
      pw6: ""
    };
  },

  mounted() {
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  },
  methods: {
    //初始化pop
    initPayPassBox() {
      this.pwds = [];
      this.pwd = "";
      this.pw1 = "";
      this.pw2 = "";
      this.pw3 = "";
      this.pw4 = "";
      this.pw5 = "";
      this.pw6 = "";
    },
    //密码组装
    onPassword(value) {
      if (this.pwd.length < 6) {
        this.pwd = this.pwd + value;
        this.setPwdView(); //设置密码显示
      }
      if (this.pwd.length == 6) {
        this.hidePayPassBox();
        this.getVerifyPassword(this.pwd); //请求密码验证接口
        this.pwd = ""; //复位
      }
    },
    //设置密码 view显示
    setPwdView() {
      let pwdLength = this.pwd.length;
      if (pwdLength <= 0) {
        return;
      }
      switch (pwdLength) {
      case 1:
        this.pw1 = this.pwd.substring(0, 1);
        break;
      case 2:
        this.pw2 = this.pwd.substring(1, 2);
        break;
      case 3:
        this.pw3 = this.pwd.substring(2, 3);
        break;
      case 4:
        this.pw4 = this.pwd.substring(3, 4);
        break;
      case 5:
        this.pw5 = this.pwd.substring(4, 5);
        break;
      case 6:
        this.pw6 = this.pwd.substring(5, 6);
        break;
      default:
        break;
      }
    },

    //删除密码
    pwdDelete() {
      let pwdLength = this.pwd.length;
      if (pwdLength <= 0) {
        return;
      }
      // let that = this;

      switch (pwdLength) {
      case 1:
        this.pwd = this.pwd.substring(0, 0);
        this.pw1 = "";
        break;
      case 2:
        this.pwd = this.pwd.substring(0, 1);
        this.pw2 = "";
        break;
      case 3:
        this.pwd = this.pwd.substring(0, 2);
        this.pw3 = "";
        break;
      case 4:
        this.pwd = this.pwd.substring(0, 3);
        this.pw4 = "";
        break;
      case 5:
        this.pwd = this.pwd.substring(0, 4);
        this.pw5 = "";
        break;
      case 6:
        this.pwd = this.pwd.substring(0, 5);
        this.pw6 = "";
        break;
      default:
        break;
      }
    },

    //验证密码
    getVerifyPassword(pwd) {
      //order.pay.wechatPay
      var that = this;
      $http.get("payment.password.check", { password: pwd }, "").then(
        function(response) {
          if (response.result == 1) {
            that.passwordInfo.need_password = false;
            that.payPost(that.passwordInfo);
          } else {
            that.$dialog.confirm({ message: response.msg})
              .then(() => {
                if (response.data.code == 2001) {
                //商城支付密码设置未开启
                //that.$router.go(-1);
                } else if (response.data.code == 2002) {
                //用户未设置支付密码
                //去设置密码
                  that.$router.push(
                    that.fun.getUrl("set_balance_password", {})
                  );
                } else if (response.data.code == 2003) {
                //支付密码错误
                }
              }).catch(() => {
                if (response.data.code == 2001) {
                //商城支付密码设置未开启
                } else if (response.data.code == 2002) {
                //用户未设置支付密码
                } else if (response.data.code == 2003) {
                //支付密码错误
                }
              });
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});

        }
      );
    },
    rewardPayCancelBtn() {
      this.rewardPayshow = false;
    },
    showPayPassBox() {
      this.initPayPassBox();
      this.rewardPayshow = false;
      this.payPassBoxShow = true;
    },
    hidePayPassBox() {
      this.payPassBoxShow = false;
    },
    error(e) {
      this.$dialog.alert({message:"音频出错了" + e});
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.readyState = this.$refs.audio.readyState;
      this.audio.maxTime = parseInt(res.target.duration);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
    },
    select(src) {
      if (this.songStop) {
        this.$refs.audio.play(); //继续播放
        this.songStop = false;
      } else {
        this.$refs.audio.pause();
        this.songStop = true;
      }
    },
    // 播放音频
    play() {
      this.$refs.audio.play();
      this.songStop = false;
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
      this.songStop = true;
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true;
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
    ended() {
      this.selectedNum = Number(this.selectedNum) + 1;

      if (this.selectedNum > Object.keys(this.goodsInfo.curriculum).length) {
        return;
      }
      this.$refs.audio.src = this.vedioSrc;
      this.play();
      console.log(this.$refs.audio.src, "ended");
    },
    handleTouchStart(e) {
      this.setValue(e.touches[0]);

      document.addEventListener("touchmove", this.handleTouchMove);
      document.addEventListener("touchup", this.handleTouchEnd);
      document.addEventListener("touchend", this.handleTouchEnd);
      document.addEventListener("touchcancel", this.handleTouchEnd);
      // e.preventDefault();
      // this.onDragStart(e);
    },
    handleTouchMove(e) {
      this.setValue(e.changedTouches[0]);
    },
    handleTouchEnd(e) {
      this.setValue(e.changedTouches[0]);
      document.removeEventListener("touchmove", this.handleTouchMove);
      document.removeEventListener("touchup", this.handleTouchEnd);
      document.removeEventListener("touchend", this.handleTouchEnd);
      document.removeEventListener("touchcancel", this.handleTouchEnd);
      // this.onDragStop(e);
    },
    // 从点击位置更新 value
    setValue(e) {
      // let that = this;
      const { maxTime, minTime, step } = this.audio;
      let value =
        ((e.clientX - this.$refs.slider.offsetLeft) /
          this.$refs.slider.offsetWidth) *
        (maxTime - minTime);
      value = Math.round(value / step) * step + minTime;
      value = parseFloat(value.toFixed(5));

      if (value > maxTime) {
        value = maxTime;
      } else if (value < minTime) {
        value = minTime;
      }
      this.$refs.audio.currentTime = value;
    },
    secret(string, code, operation) {
      code = CryptoJS.MD5(code).toString();
      var iv = CryptoJS.enc.Utf8.parse(code.substring(0, 16));
      var key = CryptoJS.enc.Utf8.parse(code.substring(16));
      if (operation) {
        return CryptoJS.AES.decrypt(string, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
      }
      return CryptoJS.AES.encrypt(string, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();
    },
    addzhibo() {
      $http
        .get(
          "plugin.video-demand.api.video-course-goods.get-live-info",
          { goods_id: this.$route.params.goods_id }
        )
        .then(response => {
          if (response.result === 1) {
            this.info = JSON.parse(this.secret(response.data, "zoQUA@257ggflNmMppKzcU7QgYyp!tU&h54VNN3u!PAU$8FxBW", true));
            this.livezhibo();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    livezhibo() {
      if (!this.is_zhibo) {
        var liveSdk = new PolyvLiveSdk({
          channelId: this.info.channelId,
          sign: this.info.sign, // 频道验证签名
          timestamp: this.info.timestamp, // 毫秒级时间戳
          appId: this.info.appId,
          user: {
            userId: this.info.userId,
            userName: this.teacherName,
            pic: this.goodsImg
          }
        });
        liveSdk.on(PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
          if (data.watchStatus == "live") {
            this.is_zhibo = true;
            this.is_show = false;
            this.is_vshow = false;
            setTimeout(() => {
              liveSdk.setupPlayer({
                el: "#player",
                type: "auto"
              });
            }, 1000);
          } else {
            Toast("直播结束");
          }
        });
      }
    },
    getQrCode() {
      $http.get("member.member.getArticleQr", {}, "").then(
        response => {
          if (response.result === 1) {
            this.codeUrl = response.data;
          } else {
            this.$dialog.alert({message:response.msg});

          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getDetailInfo() {
      $http
        .get(
          "plugin.video-demand.api.video-course-goods.get-course-goods-detail",
          { goods_id: this.$route.params.goods_id }
        )
        .then(response => {
          if (response.result === 1) {
            this.live = response.data.live;
            this.live_title = response.data.live_title;
            // if (
            //   this.fun.isTextEmpty(response.data.has_many_dig_chapter) ||
            //   response.data.has_many_dig_chapter.length == 0
            // ) {

            //   this.$router.go(-1);
            // }
            if (response.data.has_one_goods.status == 0) {
              this.$dialog.alert({message:"课程已下架！"});
              this.$router.go(-1);
            }
            else {
              this.chapterdigList = response.data.has_many_dig_chapter;
            }

            this.rewardBtnShow = response.data.is_reward == 0 ? false : true;

            this.goodTit = response.data.has_one_goods.title;
            this.goodPrice = response.data.has_one_goods.price;
            // 价格权限
            if (response.data.has_one_goods.vip_level_status) {
              this.vip_level_status =
                response.data.has_one_goods.vip_level_status;
            }

            this.chapterNum = response.data.course_chapter_num;

            this.teacherImg =
              response.data.has_one_lecturer.has_one_member.avatar;

            this.teacherName = response.data.has_one_lecturer.real_name;

            this.goodsContent = response.data.has_one_goods.content;

            this.contentShow = !this.fun.isTextEmpty(
              response.data.has_one_goods.content
            );
            this.see_levels = response.data.see_levels;
            let playCourse = "";
            let playActive = 0;
            let first_playActive = 0;
            let has_many_dig_chapter = response.data.has_many_dig_chapter;
            for (let j = 0; j < has_many_dig_chapter.length; j++) {
              if (
                has_many_dig_chapter[j].has_many_chapter.length > 0 &&
                this.chapter_id
              ) {
                first_playActive = j;
                for (
                  let i = 0;
                  i < has_many_dig_chapter[j].has_many_chapter.length;
                  i++
                ) {
                  if (
                    has_many_dig_chapter[j].has_many_chapter[i].id ===
                    Number(this.chapter_id)
                  ) {
                    playCourse = has_many_dig_chapter[j].has_many_chapter[i];
                    playActive = i;
                  }
                }
              } else {
                playCourse = has_many_dig_chapter[j].has_many_chapter[0];
              }
            }
            this.chapter_id = playCourse.id;
            this.isLook = playCourse.is_audition == 0 ? false : true;

            //会员升级课程id
            this.courseId = response.data.id;

            if (!this.fun.isTextEmpty(response.data.pushGoods)) {
              this.pushShow = true;
              this.pushGoodList = response.data.pushGoods;
            }

            //分享数据
            this.courseShare = response.data.has_one_goods.has_one_share;

            this.goodsImg = response.data.has_one_goods.thumb;

            // this.initShare();
            let that = this;
            this.fun.wxShare(
              "",
              {},
              {
                title: that.fun.isTextEmpty(that.courseShare.share_title) ? that.goodTit : that.courseShare.share_title,
                link:document.location.href + "&share_tag=2&chapter_id=" + that.chapter_id,
                imgUrl: that.fun.isTextEmpty(that.courseShare.share_thumb) ? that.goodsImg : that.courseShare.share_thumb,
                description: that.fun.isTextEmpty(that.courseShare.share_desc) ? "" : that.courseShare.share_desc
              },
              data => {
                if (!that.fun.isTextEmpty(data.shop && data.shop.shop)) {
                  that.initCservice(data.shop.shop.cservice); //客服重新赋值
                }
              }
            );

            switch (response.data.watch) {
            case 0:
              //
              this.is_update = false;
              this.is_study = false;
              this.is_buy = false;
              this.videoInit(playActive, playCourse, first_playActive);

              // this.is_update = true;
              // this.is_buy = true;
              // this.is_study = true;
              break;
            case 1:
              //判断是否免费章节
              if (playCourse.is_audition == 1) {
                this.is_study = true;
                this.is_update = false;
                this.is_buy = false;
                this.is_show = false;
                this.is_vshow = true;
                this.videoInit(playActive, playCourse, first_playActive);
                break;
              } else if (!this.see_levels) {
                this.is_study = true;
                this.is_update = false;
                this.is_buy = false;
                this.is_show = false;
                this.is_vshow = true;
                this.videoInit(playActive, playCourse, first_playActive);
                break;
              } else if (playCourse.is_audition == 0) {
                this.$dialog.alert({message:"请升级会员或者购买课程"});
                this.is_update = true;
                this.is_buy = true;
                this.is_study = true;
                break;
              } else {
                break;
              }
              // this.is_study = true;
              // this.is_update = false;
              // this.is_buy = false;
              // this.is_show =false;
              // this.is_vshow=true;
              // this.videoInit(0, playCourse.video_address);
              // break;
            case 2:
              //
              this.is_update = false;
              this.is_study = false;
              this.is_buy = false;
              this.videoInit(playActive, playCourse, first_playActive);
              break;
            case 3:
              //
              this.is_buy = false;
              this.is_update = false;
              this.is_study = false;
              this.videoInit(playActive, playCourse, first_playActive);
              break;
            default:
              break;
            }
            setTimeout(() => {
              this.loadBtn = false;
            }, 500);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //根据观看权限
    viewPermission(id, index, course_id, audition, first_index) {
      clearTimeout(this.is_try_time);
      this.is_zhibo = false;
      var box = document.getElementsByClassName("pv-ppt-layout pv-ppt-normal");
      if (box.length > 0) {
        box[0].remove();
      }
      this.is_show = true;
      this.is_vshow = false;
      this.chapter_id = id;
      if (this.wxJsSdkConfig) {
        this.share(this.wxJsSdkConfig);
      }

      let param = {
        goods_id: this.$route.params.goods_id,
        chapter_id: id
      };
      $http
        .get(
          "plugin.video-demand.api.video-course-goods.get-video-address",
          param
        )
        .then(response => {
          if (response.result === 1) {
            //判断观看类型
            this.viewType(
              response.data.watch,
              index,
              response.data.video_address,
              course_id,
              id,
              audition,
              response.data.video_cover_address,
              first_index,
              response.data.is_try,
              response.data.try_time
            );
          } else {
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //观看视频
    videoPlay(index, src, course_id, id, video_image, first_index) {
      this.is_show = false;
      this.is_vshow = true;

      this.vedioSrc = "";
      this.video_image = video_image;
      this.active = index;
      this.first_active = first_index;
      this.vedioSrc = src;

      this.songStop = true;
      this.sliderTime = 0;
      this.audio = {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      };

      //初始化vedio监听事件
      this.removeListenVideo();
      //判断当前路径
      this.isMp4(this.vedioSrc);
      //监听video
      this.listenVideo();

      $http
        .get("plugin.video-demand.api.video-demand-member.set-watch-history", {
          course_id: course_id,
          chapter_id: id
        })
        .then(response => {
          // console.log(response);
        })
        .catch(error => {
          // console.log(error);
        });
    },

    videoInit(index, item, first_index) {
      this.is_show = false;
      this.is_vshow = true;

      this.vedioSrc = "";
      this.active = index;
      this.first_active = first_index;
      this.viewPermission(item.id, index, item.course_id, item.is_audition, first_index);

      // this.isMp4(this.vedioSrc);
      //
      // this.listenVideo();
    },

    viewType(type, index, address, course_id, id, audition, video_image, first_index, is_try, try_time) {
      if (is_try == 1 && type == 1 && audition == 1) {
        this.is_study = true;
        this.is_update = false;
        this.is_buy = false;
        this.isLook = true;
        this.videoPlay(index, address, course_id, id, video_image, first_index);
        return;
      } else if ((type != 2 && type != 3) && is_try == 1 && try_time > 0) {
        // 试看的逻辑：商品--课程管理--章节勾选了试看权限，是整个章节都可以试看，上面的试看时长是针对进入到这个商品后开始计时，达到时间后会提示升级或者购买商品。
        this.is_study = true;
        this.is_update = false;
        this.is_buy = false;
        this.isLook = true;
        this.videoPlay(index, address, course_id, id, video_image, first_index);
        this.is_try_time = setTimeout(() => {
          this.is_zhibo = false;
          this.is_show = true;
          this.is_vshow = false;
          this.vedioSrc = "";

          this.$dialog.alert({message:"请升级会员或者购买课程"});
          this.is_update = true;
          this.is_buy = true;
          this.is_study = false;
          this.isLook = false;
        }, try_time * 1000);
        return;
      }
      switch (type) {
      case 0:
        //

        this.$dialog.alert({message:"请升级会员或者购买课程"});
        this.is_update = true;
        this.is_buy = true;
        this.is_study = false;
        this.isLook = false;
        break;
      case 1:
        //章节免费试看
        if (audition == 1) {
          this.is_study = true;
          this.is_update = false;
          this.is_buy = false;
          this.isLook = true;
          this.videoPlay(index, address, course_id, id, video_image, first_index);
          break;
        } else if (audition == 0) {
          this.$dialog.alert({message:"请升级会员或者购买课程"});
          this.is_update = true;
          this.is_buy = true;
          this.is_study = false;
          this.isLook = false;
          break;
        } else {
          break;
        }
      case 2:
        //等级权限

        this.is_update = false;
        this.is_study = false;
        this.is_buy = false;
        this.isLook = true;
        this.videoPlay(index, address, course_id, id, video_image, first_index);
        break;
      case 3:
        //购买权限

        this.is_buy = false;
        this.is_study = false;
        this.is_update = false;
        this.isLook = true;
        this.videoPlay(index, address, course_id, id, video_image, first_index);

        break;
      default:
        break;
      }
    },

    //立即学习
    study() {
      if (this.loadBtn) {
        return;
      }
      this.is_show = false;
      this.is_vshow = true;
    },

    //升级会员
    update() {
      if (JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay == "1" && this.fun.isIphone()) {
        this.$dialog.alert({
          message: "十分抱歉，由于相关规定，你暂时无法在这里充值！"
        });
        return false;
      }
      this.$router.push(
        this.fun.getUrl("CourseMemberUpdate", { id: this.courseId, goods: this.$route.params.goods_id })
      );
    },

    //立即购买
    buy() {
      if (JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay == "1" && this.fun.isIphone()) {
        this.$dialog.alert({
          message: "十分抱歉，由于相关规定，你暂时无法在这里充值！"
        });
        return false;
      }
      if (this.vip_level_status && this.vip_level_status.status == 1) {
        Toast(this.vip_level_status.tips);
        return false;
      }
      if (this.loadBtn) {
        return;
      }
      submitActionTag = "-2"; //立即购买
      let _optionsId = "";
      let _total = 1;
      let _goodsId = this.$route.params.goods_id;
      this.$router.push(
        this.fun.getUrl("goodsorder", {}, {
          tag: submitActionTag,
          goodsId: _goodsId,
          optionsId: _optionsId,
          total: _total
        })
      );
      //this.$router.push(this.fun.getUrl('goods',{id: this.$route.params.goods_id}));
    },

    //跳转至我的课程
    toMyCourse() {
      this.$router.push(this.fun.getUrl("CourseMy"));
    },

    //打赏 显示
    showPopReward() {
      this.rewardShow = true;
    },

    //打赏 隐藏
    hidePopReward() {
      this.rewardShow = false;
      this.rewardMoneyBtn = false;
    },

    //确定打赏
    confirmReward() {
      this.hidePopReward();
      if (this.fun.isTextEmpty(this.rewardMoney)) {
        Toast("请输入或选择打赏金额");
        return;
      }

      if (this.rewardMoney <= 0) {
        Toast("打赏金额必须大于0");
        return;
      }

      this.getPayData();

      console.log(this.rewardMoney);
    },

    //获取支付类型参数
    getPayData() {
      this.actionSheetItems = [];
      $http
        .get("plugin.video-demand.api.lecturer-reward.pay-type", {})
        .then(response => {
          if (response.result == 1) {
            let btnData = response.data.buttons;
            this.btnData = btnData;
            this.rewardPayshow = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //初始化支付回调
    initPayCallBack(item) {
      let callback = null;
      let that = this;
      switch (item.value) {
      case 1:
        callback = that.weChatPay;
        break;
      case 2:
        callback = that.aliPay;
        break;
      case 3:
        callback = that.balancePay;
        break;
      case 6:
        callback = that.newWeChatPay;
        break;
      case 12:
        callback = that.yunPay;
        break;
      case 7:
        callback = that.cloudAlipay;
        break;
      case 9:
        callback = that.appWeiPay;
        break;
      case 28:
        callback = that.hJWechatPay;
        break;
        // 汇聚支付 支付宝
      case 29:
        callback = that.HJaliPay;
        break;
      case 33:
        callback = that.jueqiAlipay;
        break;
      default:
        break;
      }
      return callback;
    },

    //微信支付
    weChatPay() {
      this.payPost(1);
    },
    //支付宝支付
    aliPay() {
      this.payPost(2);
    },
    //余额支付
    balancePay() {

      this.payPost(3);
    },
    //新版微信支付
    newWeChatPay() {
      this.payPost(6);
    },
    //芸支付
    yunPay() {
      this.payPost(12);
    },
    hJWechatPay() {
      this.payPost(28);
    },
    cloudAlipay() {
      this.payPost(7);
    },
    appWeiPay() {
      this.payPost(9);
    },
    //崛企支付
    jueqiAlipay() {
      this.payPost(33);
    },
    // 汇聚 支付宝
    HJaliPay() {
      this.payPost(29);
    },
    //支付
    payPost(data) {
      console.log(data);
      if (data.need_password) {
        this.passwordInfo = data;
        this.showPayPassBox();
        return;
      }
      let that = this;
      let json = {
        pay_method: data.value,
        amount: this.rewardMoney,
        pay_name: data.name,
        goods_id: this.$route.params.goods_id
      };
      $http
        .get(
          "plugin.video-demand.api.lecturer-reward.run-reward-pay",
          json,
          "支付中..."
        )
        .then(response => {
          if (response.result == 1) {
            switch (data.value) {
            case 1: //微信
              wx.config(response.data.js);
              that.WXPay(response.data.config);
              break;
            case 2: //支付宝
              that.$router.push(
                that.fun.getUrl("alipayCourse", {
                  status: "9",
                  url: response.data
                })
              );
              break;
            case 3: //余额
              that.$dialog.alert({message:response.msg});
              break;
            case 6: //新版微信 link
              window.location.href = response.data;
              break;
            case 12: //芸支付 微信
              that.newWXPay(response.data.config);
              break;
            case 7: //云收银支付宝
              that.$router.push(
                that.fun.getUrl("alipayCourse", {
                  status: "9",
                  url: response.data
                })
              );
              break;
            case 9: //微信app
              YDB.SetWxpayInfo(
                that.$store.state.temp.mailInfo.name,
                "订单号：" + response.data.order_sn,
                that.rewardMoney,
                response.data.order_sn,
                that.fun.getKeyByI()
              );
              break;
            case 28: // 汇聚微信支付
              console.log("---------汇聚微信支付-------");
              that.hjWxPay(response.data);
              break;
            case 29: //汇聚 支付宝
              that.HJToappliy(response.data);
              break;
            case 33://崛企支付
              window.location.href = response.data.url;
              break;
            default:
              break;
            }
          } else {
            that.$dialog.alert({message:response.msg});
          }
        })
        .catch(error => {

        });
    },
    // 第三方汇聚微信支付
    hjWxPay(data) {
      console.log(data, "参数");

      let obj = JSON.parse(data.data.rc_Result);
      this.newWXPay(obj);
      console.log("第三方汇聚微信支付");
    },
    //旧版微信支付参数
    WXPay(payParams) {
      var that = this;
      wx.chooseWXPay({
        appId: payParams.appId,
        timestamp: payParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: payParams.paySign, // 支付签名
        success: function(res) {
          // 支付成功后的回调函数
          if (res.errMsg == "chooseWXPay:ok") {
            that.$dialog.alert({message:"支付成功"}).then(()=>{
              that.$router.go(-1);
            });

            that.getCurrentPayStatus(); //重新获取
            that.getTodayPay();
          } else {
            that.$dialog.alert({message:"支付失败"});

          }
        },
        cancel: function(res) {
          //支付取消
        },
        fail: function(res) {
          that.$dialog.alert({message:"支付失败，请返回重试"});

        }
      });
    },
    // 汇聚支付跳转
    HJToappliy(data) {
      if (data.msg != "") {
        this.$dialog.alert({message:data.msg});

      } else {
        window.href = data.data.rc_Result;
      }
    },
    //新版微信支付参数
    newWXPay(payParams) {
      var that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: payParams.appId, //公众号名称，由商户传入
          timeStamp: payParams.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: payParams.nonceStr, //随机串
          package: payParams.package,
          signType: payParams.signType, //微信签名方式：
          paySign: payParams.paySign //微信签名
        },

        function(res) {
          that.b = res;
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg == "get_brand_wcpay_request:ok") {

            that.$dialog.alert({message:"支付成功"});
            that.getCurrentPayStatus(); //重新获取
            that.getTodayPay();
          } else {
            that.$dialog.alert({message:"支付失败"});

          }
        }
      );
    },

    //初始化分享设置
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = { url: _url };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result == 1) {
            that.wxJsSdkConfig = response.data;
            if (response.data.config) {
              that.share(response.data);
            }
            if (!that.fun.isTextEmpty(response.data.shop)) {
              that.initCservice(response.data.shop.cservice); //重新赋值
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //分享
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.courseShare.share_title)
          ? that.goodTit
          : that.courseShare.share_title;
        //let _link = document.location.href + "&mid=" + data.info.uid + "&share_tag=2";
        //let _link = location.protocol+'//'+location.host+location.pathname +'?i='+ that.fun.getKeyByI() +"&type=" +that.fun.getTyep()+ "&mid=" + data.info.uid + "&share_tag=2";

        let _link =
          document.location.href + "&share_tag=2&chapter_id=" + that.chapter_id;
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.courseShare.share_thumb)
          ? that.goodsImg
          : that.courseShare.share_thumb;
        let _desc = that.fun.isTextEmpty(that.courseShare.share_desc)
          ? data.shop.name
          : that.courseShare.share_desc;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },

    init() {
      this.service_mobile = "";
      this.service_QRcode = "";
      this.show1 = false;
      this.cservice = "";
      this.is_try_time = null;
      this.loadBtn = true;
      this.is_study = false;
      this.is_update = false;
      this.is_buy = false;
      this.is_show = true;
      this.is_vshow = false;
      this.vedioSrc = "";
      this.rewardShow = false;
      this.rewardMoney = "";
      this.payData = [];
      this.actionSheetShow = false;
      this.courseId = "";
      this.chapter_id = "";
      this.codeUrl = "";
      this.is_zhibo = false;
      this.live = false;
      this.live_title = "";
      this.info = {};

    },

    //初始化客服参数
    initCservice(newCservice) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
        return;
      }

      if (this.$store.state.temp.mailInfo.hasOwnProperty("cservice")) {
        this.cservice = this.$store.state.temp.mailInfo.cservice;
      }
      if (this.$store.state.temp.mailInfo.hasOwnProperty("service_QRcode")) {
        this.service_QRcode = this.$store.state.temp.mailInfo.service_QRcode;
      }
      if (this.$store.state.temp.mailInfo.hasOwnProperty("service_mobile")) {
        this.service_mobile = this.$store.state.temp.mailInfo.service_mobile;
      }
    },

    //推荐商品跳转
    pushGoodGoto(val) {
      if (val.is_course == 1) {
        this.$router.push(
          this.fun.getUrl("CourseDetail", { id: val.id })
        );
      } else if (val.is_course == 0) {
        this.$router.push(this.fun.getUrl("goods", { id: val.id }));
      } else {
        return;
      }
    },

    //选择打赏金额
    chooseMoney(type, index) {
      this.moneyActiveClass = index;
      this.rewardMoney = "";
      switch (type) {
      case 1:
        this.rewardMoney = 5;
        break;
      case 2:
        this.rewardMoney = 10;
        break;
      case 3:
        this.rewardMoney = 20;
        break;
      case 4:
        this.rewardMoneyBtn = false;
        this.showPopReward();
        break;
      default:
        break;
      }
    },

    moneyShow() {
      this.moneyActiveClass = 9999;
      this.rewardMoneyBtn = true;
      this.rewardMoney = 0;
    },

    //判断是否MP4
    isMp4(src) {
      if (src.endsWith(".mp4")) {
        this.isVoice = false;
        this.isVideo = true;
      } else {
        this.isVideo = false;
        this.isMp3(src);
      }
    },

    //判断是否MP3
    isMp3(src) {
      if (src.endsWith(".mp3") && this.fun.getPhoneEnv() != 3) {
        this.isVoice = true;
      } else {
        this.isVoice = false;
      }
    },

    //监听video
    listenVideo() {
      if (this.isVideo) {
        // console.log(222);
        this.$nextTick(() => {
          //let video=document.querySelector('video');
          this.$refs.video.addEventListener(
            "play",
            () => {
              this.isVideoOn = false;
            },
            false
          );

          this.$refs.video.addEventListener(
            "pause",
            () => {
              this.isVideoOn = true;
            },
            false
          );

          this.$refs.video.addEventListener(
            "end",
            () => {
              this.isVideoOn = true;
            },
            false
          );

          this.$refs.video.addEventListener(
            "loadeddata",
            () => {
              // this.isVideoOn = true;
              // if(this.fun.getPhoneEnv()==1){
              this.isVideoOn = false;
              // }
            },
            false
          );
        });
      } else {
        return;
      }
    },

    //取消监听video
    removeListenVideo() {
      if (this.isVideo && this.$refs.video) {
        this.$nextTick(() => {
          console.log(this.$refs.video);
          this.$refs.video.removeEventListener("play", this.listenVideo, false);

          this.$refs.video.removeEventListener(
            "pause",
            this.listenVideo,
            false
          );

          this.$refs.video.removeEventListener("end", this.listenVideo, false);

          this.$refs.video.removeEventListener(
            "loadeddata",
            this.listenVideo,
            false
          );
        });
      }
    },

    videoClick() {
      let video = this.$refs.video;
      if (video.paused) {
        this.isVideoOn = false;
        video.play();
      } else {
        this.isVideoOn = true;
        video.pause();
      }
    },
    clearSrcoll() {
      var currentPosition, timer;
      var speed = 1; //页面滚动距离
      timer = setInterval(function() {
        currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, currentPosition); //页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0, currentPosition); //页面向下滚动
        clearInterval(timer);
      }, 1);
    }
  },
  activated() {
    this.tabActive = "first";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (!document.getElementById('PolyvLiveSdk')) {  //避免多次引入
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://player.polyv.net/livesdk/polyv-live.min.js';
      script.id = 'PolyvLiveSdk';
      document.body.appendChild(script);
      script.onload=script.onreadystatechange=function() {
        if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
          console.log('js onload');
        }
        script.onload=script.onreadystatechange=null;     //删除事件处理函数。
      };
    }
    this.init();
    this.chapter_id = this.fun.getKey("chapter_id");
    this.getDetailInfo();
  },

  deactivated() {
    clearTimeout(this.is_try_time);
    this.removeListenVideo();
  },

  components: { cTitle, }
};
