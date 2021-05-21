import { Toast } from 'vant';
import Fun from "../../../fun";

let videoFirst = 0; //第一次初始化
var myVideo = null;
export default {
  data() {
    let that = this;
    return {
      swiperOption: {
        direction: "vertical",
        observer: true,
        width: window.innerWidth,
        height: window.innerHeight,
        watchOverflow: true,
        autoHeight: true,
        autoplay: false,
        pagination: false,
        on: {
          reachEnd() {
            if (videoFirst === 1) {
              that.getMoreData();
            }
            // console.log(that.popularVideo, "popularVideo");
            // 手指触碰拖动最后一张时执行
          },
          slideChangeTransitionEnd() {
            // that.$refs.video.pause();
            that.show = false;
            that.showVideo = that.popularVideo[this.realIndex];
            if (this.realIndex === 0) {
              that.popularVideo[this.realIndex].show = false;
              that.popularVideo[this.realIndex + 1].show = false;
            } else {
              that.popularVideo[this.realIndex - 1].show = false;
              that.popularVideo[this.realIndex].show = false;
              if (that.popularVideo[this.realIndex + 1]) {
                that.popularVideo[this.realIndex + 1].show = false;
              }
            }
            that.fun.setWXTitle(that.showVideo.title);
            window.localStorage.setItem("vid", that.showVideo.id);
            that.cumulativeDuration = parseInt(that.cumulativeDuration + that.currentDuration);//切换视频时计算累计
            that.currentDuration = 0;
            that.AnswerID = 0;
            that.logID = 0;
            setTimeout(() => {
              that.$nextTick(() => {
                that.clickSwiper(this.realIndex);
              });
            }, 300);
            //切换结束时
          }
        }
      },
      popularVideo: [],
      showVideo: {},
      show: false,
      like: false,
      likeNum: 0,
      isPlay: false,
      amount_id: "",
      url: "",
      status: "",
      showShare: false,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      minStyle: true,
      wxJsSdkConfig: {},
      card_id: '',
      loading: true,
      videoTime: null,
      is_plugins: false,
      //答题
      AnswerID: 0,
      showVideoAnswer: false,
      successShow: false,
      errorShow: false,
      subject: null,
      integral: 0,
      integral_name: "积分",
      //短视频红包
      reward_type: 0,//奖励类型（ 1观看累计时长 2看完视频发放奖励）
      logID: 0,//视频已观看记录的视频id
      maxTime: 0,//视频总时长
      activity_reward_id: 0,
      redpack_info: {},//红包设置展示信息
      is_openRedpack: false,
      openRedpackData: [],//短视频红包活动数组
      openRedpackTimes: [],//观看时长集合数组
      showVerification: false,//绑定手机
      showRedpack: false, //红包
      openRedpack: false,
      currentDuration: 0,//当前视频播放时长（重播时复位为0）
      cumulativeDuration: 0,//累计时长
      //绑定手机
      imgcode: "", //图形验证码
      cationCode: false,
      count: "",
      form: {
        mobile: "",
        //验证码
        code: "",
        captcha: ""
      },
      timer: null,
      // 播放视频时请求记录接口
      old_amount_id:'',//避免播放多次同一视频时重复请求
    };
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.initData();
      this.amount_id = this.$route.query.vid || null;
      if (this.$route.query.from && this.$route.query.from == "card") {
        this.url = "plugin.business-card.frontend.controllers.card.paging.videos";
        this.card_id = this.$route.query.card_id;
      } else if (this.$route.query.from && this.$route.query.from == "me") {
        this.url = "plugin.video-share.frontend.video.my-video";
        this.status = this.$route.query.activeName;
      } else {
        this.url = "plugin.video-share.frontend.video.getList";
      }
      window.localStorage.setItem("vid", this.amount_id);
      this.page = this.$route.query.page;
      // 判断是否有page和vid   没有vid就是会员中心进入的样式二   有page的肯定是从列表进入
      if (this.page || !this.amount_id) {
        this.getData();
      } else {
        // 有vid就是分享视频详情 任务编号: 42332
        this.getDetail();
      }
      window.scrollTo(0, 0);
    }

  },
  activated() {
    if (this.$route.params.fromHome === 1) {
      this.initData();
      this.amount_id = this.$route.query.vid || null;
      if (this.$route.query.from && this.$route.query.from == "card") {
        this.url = "plugin.business-card.frontend.controllers.card.paging.videos";
        this.card_id = this.$route.query.card_id;
      } else if (this.$route.query.from && this.$route.query.from == "me") {
        this.url = "plugin.video-share.frontend.video.my-video";
        this.status = this.$route.query.activeName;
      } else {
        this.url = "plugin.video-share.frontend.video.getList";
      }
      window.localStorage.setItem("vid", this.amount_id);
      this.page = this.$route.query.page;
      // 判断是否有page和vid   没有vid就是会员中心进入的样式二   有page的肯定是从列表进入
      if (this.page || !this.amount_id) {
        this.getData();
      } else {
        // 有vid就是分享视频详情 任务编号: 42332
        this.getDetail();
      }
      window.scrollTo(0, 0);
    }
  },
  mounted() {
    videoFirst = 1;
  },
  computed: {
    VideoItemHeightStyle() {
      let that = this;
      setTimeout(() => {
        let clientWidth = window.innerWidth;
        let clientHeight = window.innerHeight;
        // console.log("高度======", clientHeight, window.screen.availHeight, window.screen.height, window.document.body.offsetHeight)
        let params = {};
        if (that.fun.getPhoneEnv() == 3) {
          params = {
            height: "auto",
            width: 375 + "px",
            margin: "0 auto",
            top: "50%",
            transform: "translateY(-50%)"
          };
        } else {
          params = {
            height: clientHeight + "px",
            width: clientWidth + "px"
          };
        }
        return params;
      }, 400);

    },
    answerfilter: function () {
      return this.subject.has_many_answer.filter(function (item) {
        return item.content != '';
      });
    }
  },
  methods: {
    initData() {
      this.popularVideo = [];
      this.loading = true;
      this.cumulativeDuration = 0;//计算累计
      this.currentDuration = 0;
    },
    shareVideo() {
      this.showShare = true;
    },
    close() {
      this.showShare = false;
    },
    toGood(item) {
      this.$router.push(
        this.fun.getUrl("goods", { id: item.goods_id }, { vid: item.id })
      );
    },
    toggleLike(item) {
      item.member_like = !item.member_like;
      !item.member_like ? item.like_num++ : item.like_num--;

      $http
        .post("plugin.video-share.frontend.video.like", {
          video_goods_id: item.id
        })
        .then(response => {
          if (response.result === 1) {
            console.log(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    chooseUser(item) {
      if (item.member.business_card != 0) {
        this.$router.push(
          this.fun.getUrl(
            "BusinessCard",
            {},
            { mark_id: item.member.business_card, mark: "card" }
          )
        );
      }
    },
    // 当加载视频流元数据完成后，会触发该事件的回调函数
    // 视频元数据主要是视频的长度之类的数据
    onLoadedmetadata(res) {
      //单位：秒
      // this.maxTime = parseInt(res.target.duration);
      this.maxTime = parseInt(res);
      console.log("视频总时长", res, this.maxTime);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      // this.currentDuration = res.target.currentTime;
      this.currentDuration = res;
      let minute = parseInt((this.cumulativeDuration + this.currentDuration) / 60);
      // console.log("当前播放时间", this.currentDuration, parseInt(this.cumulativeDuration + this.currentDuration), "累计分钟", minute);
      if (this.openRedpackTimes.indexOf(minute) > -1) {
        //达到累计获奖时长
        this.openRedpackTimes.splice(0, 1);
        console.log("删除一个累计时长条件", this.openRedpackTimes);
        // this.getRedpackReward(1,1)
        this.includeRedpackID('time', minute);
      }
    },
    endedPlay() {
      console.log("播放结束");
      this.AnswerID = 0;
      this.logID = 0;
      this.cumulativeDuration = parseInt(this.cumulativeDuration + this.currentDuration);//结束视频时计算累计
      this.currentDuration = 0;
      this.getSubject();
    },
    clickSwiper(index) {
      if (
        this.popularVideo[index].show &&
        this.amount_id === this.popularVideo[index].id
      ) {
        this.show = false;
        this.popularVideo[index].show = false;
        this.$refs.video.pause();
        return;
      }

      this.show = true;
      this.amount_id = this.popularVideo[index].id;
      this.$set(this.popularVideo[index], "show", true);
      this.$refs.video.play();
      // this.addVideoPlayEnd();
      this.$refs.pic[index].offsetHeight > Math.ceil(window.innerHeight * (7 / 8))
        ? (this.minStyle = false)
        : (this.minStyle = true);
      this.share(this.wxJsSdkConfig);
      // console.log(this.$refs.pic[index].offsetHeight);
    },
    addVideoPlayEnd() {
      if (this.videoTime) clearInterval(this.videoTime);
      console.log(this.amount_id);
      this.videoTime = setInterval(() => {
        let flag = this.$refs.video.ended;
        if (flag) {
          console.log("播放结束");
          this.cumulativeDuration = parseInt(this.cumulativeDuration + this.currentDuration);//结束视频时计算累计
          this.currentDuration = 0;
          this.getSubject();
          clearInterval(this.videoTime);
        }
        console.log(this.$refs.video.ended);
      }, 1000);
    },
    onPlaying() {
      if (this.is_openRedpack && !this.showRedpack) {
        console.log("触发了 onPlaying 1==========================");
        this.getViewTimelog();
      } else {
        console.log("触发了 onPlaying 2==========================");
      }
    },
    getViewTimelog() {

      if (!this.is_openRedpack) {
        return;
      }
      // console.log("////-----------------////////", this.logID, this.amount_id)
      if (this.logID == this.amount_id) {
        return;
      }
      this.logID = this.amount_id;
      console.log("触发了getViewTimelog==========================", this.amount_id, this.maxTime);
      $http
        .get('plugin.video-redpack.frontend.activity.logViewTime', { video_id: this.amount_id, video_length: this.maxTime })
        .then(response => { })
        .catch(err => {
          console.error(err);
        });
    },
    getSubject() {
      if (!this.is_plugins) {
        this.includeRedpackID('vid');
        return;
      }
      if (this.AnswerID == this.amount_id) {
        //防止重复一直请求答题
        this.includeRedpackID('vid');
        return;
      }
      this.AnswerID = this.amount_id;
      $http
        .get('plugin.answer-reward.api.index.get-subject', { vid: this.amount_id }, "load")
        .then((response) => {
          console.log(response);
          if (response.result != 1) {
            this.includeRedpackID('vid', 0, 'fail', response.msg);
            return;
          }
          if (response.data.status != 1) {
            Toast(response.msg);
            this.$refs.video.play();
          } else {
            if (response.data.subject != null) {
              this.$refs.video.pause();//答题播放暂停
              // this.$router.push(this.fun.getUrl("videoAnswer", {}, { vid: this.amount_id }));
              this.integral_name = response.data.integral_name;
              this.subject = response.data.subject;
              this.showVideoAnswer = true;
            } else {
              this.includeRedpackID('vid');
            }
          }
        });
    },
    reward(id) {
      //短视频红包开启，设置观看完指定的视频后获得，
      //如果该视频开启了短视频答题，则需要先 答对 题目才可以获得红包奖励，
      //并且和原短视频答题设置的积分奖励同时获得，弹窗 只 弹出红包领取弹窗，不在显示获得积分弹窗！！
      $http
        .get('plugin.answer-reward.api.index.index',
          {
            vid: this.amount_id,
            subject_id: this.subject.id,
            answer_id: id
          }, "load")
        .then((res) => {
          this.showVideoAnswer = false;
          if (res.result != 1) {
            this.errorShow = true;
          } else {
            if (res.data.status == 0) {
              this.$refs.video.play();
              Toast(res.msg);
            } else if (res.data.status == 1) {
              this.includeRedpackID('vid', 0, 'success');
              this.integral = res.data.integral;
              // this.successShow = true;
            }
          }
          console.log(res);
        });
    },
    includeRedpackID(type, value, status, text) {
      if (this.is_openRedpack) {
        this.logID = 0;
        if (status === 'success') {
          this.showVideoAnswer = false;
        }
        if (type == 'time') {
          //累计时长，获取活动id
          for (let i = 0; i < this.openRedpackData.length; i++) {
            if (this.openRedpackData[i].view_time_data === value) {
              this.activity_reward_id = this.openRedpackData[i].activity_id;
              console.log("达到红包累计时长", this.amount_id, this.activity_reward_id);
              this.getRedpackReward(1, 1);
              return;
            }
          }
        } else if (type == 'vid') {
          //判断当前视频id是否为短视频红包指定视频
          for (let i = 0; i < this.openRedpackData.length; i++) {
            if (this.openRedpackData[i].view_finish_ids.indexOf(this.amount_id) > -1&&this.openRedpackData[i].view_finish_open_state == '1') {
              this.activity_reward_id = this.openRedpackData[i].activity_id;
              console.log("短视频红包指定视频", this.amount_id, this.activity_reward_id);
              this.getRedpackReward(2, 1);
              return;
            }
          }
        }
        if (status === 'success') {
          this.showVideoAnswer = false;
          this.successShow = true;
        } else {
          this.$refs.video.play();
          this.getViewTimelog();
        }

        if (status === 'fail') {
          Toast(text);
        }

      } else {
        if (status === 'success') {
          this.showVideoAnswer = false;
          this.successShow = true;
        }
        if (status === 'fail') {
          Toast(text);
        }
      }

    },
    getRedpackReward(reward_type, request_type) {
      this.reward_type = reward_type;
      $http
        .get('plugin.video-redpack.frontend.activity.reward', { video_id: this.amount_id, activity_id: this.activity_reward_id, reward_type: reward_type, request_type: request_type }, "load")
        .then(response => {
          if (response.result === 1) {
            if (request_type == 1) {
              //确认是否可领
              this.$refs.video.pause();//答题播放暂停
              this.showRedpack = true;
              this.redpack_info = response.data;
            } else {
              //领取红包
              this.redpack_info.amount = response.data.amount;
              this.openRedpack = true;
            }
          } else {
            Toast(response.msg);
            // this.$refs.video.play();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    resetConfig() {
      this.logID = 0;
      this.AnswerID = 0;
      this.$refs.video.play();
    },
    cloneRedpack() {
      this.showRedpack = false;
      this.openRedpack = false;
      if (this.reward_type == 2) {
        this.getViewTimelog();
      }
      this.resetConfig();
    },
    cloneAnswer() {
      this.errorShow = false;
      this.successShow = false;
      this.resetConfig();
      this.getViewTimelog();
    },
    openRedpackM() {
      if (this.redpack_info.bind_mobile == 1 && this.redpack_info.member_bind_mobile == 0) {
        //开启绑定，但用户未绑定手机
        this.getimgdata();
        this.showVerification = true;
        return;
      } else {
        this.getRedpackReward(this.reward_type, 2);
      }
    },
    getDetail() {
      $http
        .get('plugin.video-share.frontend.video.getVideoGoods', { video_goods_id: this.amount_id }, "load")
        .then(response => {
          if (response.result === 1) {
            this.showVideo = response.data.video_goods;
            this.getData(true);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getData(flag) {
      let that = this;
      let json = {};
      if (this.$route.query.from && this.$route.query.from == 'card') {
        json = { page: this.page, card_id: this.card_id };
      } else if (this.$route.query.from && this.$route.query.from == 'me') {
        json = { page: this.page, status: this.status };
      } else {
        json = { page: this.page };
      }
      $http
        .get(this.url, json, "load")
        .then(response => {
          this.swiperOption.height = window.innerHeight;
          this.loading = false;
          if (response.result === 1) {
            try {
              if (response.data.is_plugins) {
                this.is_plugins = response.data.is_plugins;
              }
            } catch (error) {
              console.log(error);
            }
            this.isLoadMore = true;
            if (this.$route.query.from && this.$route.query.from == 'card') {
              this.total_page = response.data.last_page;
              this.popularVideo = response.data.data;
            } else if (this.$route.query.from && this.$route.query.from == 'me') {
              this.total_page = response.data.video.last_page;
              this.popularVideo = response.data.video.data;
            } else {
              this.total_page = response.data.list.last_page;
              this.popularVideo = response.data.list.data;
            }

            if (!this.total_page) {
              this.total_page = 0;
            }
            if (!flag) {
              if (this.$route.query.vid) {
                for (let i = 0; i < this.popularVideo.length; i++) {
                  if (this.popularVideo[i].id == this.amount_id) {
                    this.showVideo = this.popularVideo[i];
                    this.popularVideo.splice(0, i);
                    break;
                  }
                }
              } else {
                this.amount_id = this.popularVideo[0].id;
                this.showVideo = this.popularVideo[0];
              }
            } else {
              if (this.$route.query.vid) {
                for (let i = 0; i < this.popularVideo.length; i++) {
                  if (this.popularVideo[i].id == this.amount_id) {
                    this.popularVideo.splice(i, 1);
                    break;
                  }
                }
                this.popularVideo.unshift(this.showVideo);
              }
            }

            this.$nextTick(() => {
              if (that.popularVideo.length > 0) {
                myVideo = document.getElementById("myVideo");
                // console.log("1111111111111111111111111", document.getElementById("myVideo"))
                myVideo.addEventListener('loadstart', function (e) {
                  // console.log('提示视频的元数据开始加载', e.target.duration, myVideo.duration)
                });
                myVideo.addEventListener('loadedmetadata', function (e) {
                  // console.log('提示视频的元数据已加载', e.target.duration, myVideo.duration, e, myVideo)
                  // that.onLoadedmetadata(e.target.duration)
                });
                myVideo.addEventListener('loadeddata', function (e) {
                  // console.log('提示当前帧的数据是可用的', e.target.duration, myVideo.duration, e, myVideo)
                });
                myVideo.addEventListener('canplay', function (e) {
                  // console.log('提示该视频已准备好开始播放', e.target.duration, myVideo.duration, e, myVideo)
                });
                myVideo.addEventListener('timeupdate', function (e) {
                  // console.log('timeupdate', e.target.duration, '////', myVideo.currentTime)
                  if (e.target.duration > 0) {
                    that.maxTime = parseInt(e.target.duration);
                    // console.log("视频总时长",that.maxTime)
                    if (that.is_openRedpack && !that.showRedpack) {
                      that.getViewTimelog();
                    }
                  }
                  // that.onLoadedmetadata(e.target.duration)
                  that.onTimeupdate(myVideo.currentTime);
                });
                myVideo.addEventListener('playing', function (e) {
                  console.log('playing', e.target.duration);
                  // 播放记录
                  if(that.amount_id == that.old_amount_id) {
                    return;
                  }
                  that.old_amount_id = that.amount_id;
                  that.addRecord();
                  // that.onPlaying()
                });
                myVideo.addEventListener('ended', function (e) {
                  console.log('视频播放完了//////////////////////');
                  that.endedPlay();
                });
              }
            });
            this.fun.setWXTitle(this.showVideo.title);
            // this.initShare();
            this.fun.wxShare(
              "",
              { },
              {
                title: that.fun.isTextEmpty(that.showVideo.title) ? "视频分享" : that.showVideo.title,
                link:that.fun.getSiteRoot() + "/addons/yun_shop/?menu#/videoDetail?i=" + that.fun.getKeyByI() + '&vid=' + that.amount_id,
                imgUrl: that.showVideo.cover,
                description: `我发现了一个不错的视频，快来看看吧~`
              },
              data => {
                this.wxJsSdkConfig = data;
              }
            );

            //短视频红包
            try {
              if (response.data.video_redpack && response.data.video_redpack.is_open === 1) {
                this.is_openRedpack = true;
                this.openRedpackData = response.data.video_redpack.data;
                for (let i = 0; i < this.openRedpackData.length; i++) {
                  if (this.openRedpackData[i].view_time_open_state === '1') {
                    that.openRedpackTimes.push(this.openRedpackData[i].view_time_data);
                  }
                }
                this.openRedpackTimes = this.openRedpackTimes.sort(function (a, b) {
                  return a - b;
                });
                console.log("短视频红包累计观看时长数组", that.openRedpackTimes);
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
        });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {};
        if (this.$route.query.from && this.$route.query.from == 'card') {
          json = { page: this.page, card_id: this.card_id };
        } else if (this.$route.query.from && this.$route.query.from == 'me') {
          json = { page: this.page, status: this.status };
        } else {
          json = { page: this.page };
        }
        $http.get(this.url, json, "加载中").then(
          (response) => {
            that.isLoadMore = true;
            if (response.result === 1) {
              let myData = [];
              if (this.$route.query.from && this.$route.query.from == 'card') {
                myData = response.data.data;
              } else if (this.$route.query.from && this.$route.query.from == 'me') {
                myData = response.data.video.data;
              } else {
                myData = response.data.list.data;
              }

              that.popularVideo = that.popularVideo.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function (response) {
            console.log(response);
          }
        );
      }
    },
    //初始化分享设置
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            this.wxJsSdkConfig = response.data;
            this.share(this.wxJsSdkConfig);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = that.fun.isTextEmpty(that.showVideo.title)
          ? "视频分享"
          : that.showVideo.title;
        let _link = Fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/videoDetail?i=" + Fun.getKeyByI() + '&vid=' + that.amount_id;
        // + '&page=' + that.page 不需要带page  直接请求视频id详情
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.showVideo.cover)
          ? data.share.icon
          : that.showVideo.cover;
        let _desc = that.fun.isTextEmpty(that.showVideo.title)
          ? data.share.desc
          : `我发现了一个不错的视频，快来看看吧~`;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            $http
              .get("plugin.video-share.frontend.video.share", {
                video_goods_id: that.showVideo.id
              })
              .catch(err => {
                console.error(err);
              });
          },
          cancel: function () {
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
          success: function () {
            $http
              .get("plugin.video-share.frontend.video.share", {
                video_goods_id: that.showVideo.id
              })
              .catch(err => {
                console.error(err);
              });
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },
    getimgdata() {
      $http
        .get("home-page.getCaptcha")
        .then(res => {
          if (res.data.captcha.status && res.data.captcha.status == '0') {
            this.imgcode = null;
          }
          if (res.data.captcha.img) {
            this.imgcode = res.data.captcha.img;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 60秒倒计时
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.cationCode = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.cationCode = false;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    // 获取验证码
    VerificationCode() {
      let that = this;
      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast("请填图形验证码");
      }
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
      } else {
        Toast("发送中...");
        //发送获取验证码的请求//旧的请求：member.register.sendCodeV2
        $http
          .get("member.register.alySendCode", {
            mobile: this.form.mobile,
            captcha: this.form.captcha,
            code: this.form.code
          })
          .then(
            response => {
              console.log(response);
              if (response.result == 1) {
                that.cationCode = true;
                that.getCode();
                that.sendCodeAnimation();
              } else {
                this.cationCode = false;
                //刷新图形验证码
                Toast(response.msg);
                this.form.captcha = "";
                this.getimgdata();
              }
            },
            response => {
              console.log(response.msg + "nihao");
            }
          );
      }
    },
    //发送验证码 倒计时
    sendCodeAnimation() {
      setTimeout(() => {
        Toast("已发送");
      }, 1000);
    },
    //提交修改手机的请求
    alterAction() {
      var that = this;
      //发送获取验证码的请求
      if (that.fun.isTextEmpty(this.form.mobile)) {
        Toast("手机号码不能为空", "提示");
        return;
      }
      if (that.fun.isMoblie(this.form.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }
      if (that.fun.isTextEmpty(this.form.code)) {
        Toast("请填写验证码", "提示");
        return;
      }
      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast("图形验证码不能为空");
          return;
        }
      }

      $http
        .post(
          "plugin.video-redpack.frontend.activity.bindMobile",
          this.form,
          "正在绑定手机.."
        )
        .then(
          response => {
            if (response.result == 1) {
              Toast("验证成功！");
              that.showVerification = false;
              that.showRedpack = true;
              that.getRedpackReward(that.reward_type, 2);
            } else {
              Toast(response.msg);
            }
          },
          function (response) {
            console.log(response);
          }
        );
    },
    addRecord() {
      $http
        .get("plugin.video-share.frontend.video.addRecord", {
          video_id: this.amount_id,
        })
        .then(
          response => {
            if (response.result == 1) {
              console.log('播放记录成功');
            } else {
              console.log('播放记录失败');
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    }
  },
  components: {}
};
