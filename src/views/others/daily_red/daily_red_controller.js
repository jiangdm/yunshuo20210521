import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      show: false,
      redData: {},
      red_packet: "",
      shareData: {},
      tapOne: false,
      receive_log: "",
      bjcolor: "",
      receive_color: "",
      amount_color: "",
      out_color: "",
      red_packet_color: "",
      amount: "",
      business_hours_start: "",
      setTime: null,
      assgin_hours: "",
      timestamp: "",
      Difference: "",
      countdown: "00:00:00",
      timeShow: false,
      link: {}
    };
  },
  deactivated() {
    clearInterval(this.setTime);
  },
  activated() {
    this.getData();
    this.getShare();
  },
  methods: {
    goback() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else if (this.url) {
        // this.$router.push(this.fun.getUrl(this.url));
      } else {
        this.$router.go(-1);
      }
    },
    getShare() {
      let that = this;
      $http
        .get("plugin.red-packet.api.red-packet-logs.share", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            that.shareData = response.data;
            // this.initShare();
            that.fun.wxShare(
              "",
              {},
              {
                title: that.shareData.share_title,
                imgUrl: that.shareData.share_pictures,
                description: that.shareData.share_content
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        })
        .catch(error => {});
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.shareData.share_title) ? data.share.title : that.shareData.share_title;

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.shareData.share_pictures) ? data.share.icon : that.shareData.share_pictures;
        let _desc = that.fun.isTextEmpty(that.shareData.share_content) ? data.share.desc : that.shareData.share_content;

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
    golink() {
      if (this.link.is_advert == "1") {
        if (!this.fun.isTextEmpty(this.link.advert_url)) {
          if (this.link.is_browse) {
            // 已经观看过了，不请求接口
            window.location.href = this.link.advert_url;
            return;
          } else {
            // 没观看过，请求记录接口
            let that = this;
            $http
              .get("plugin.red-packet.api.red-packet-logs.set-link-log", { red_packet_id: that.redData.amount.id }, "加载中")
              .then(response => {
                if (response.result === 1) {
                  window.location.href = this.link.advert_url;
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      }
    },
    getData(kid) {
      $http
        .get(
          "plugin.red-packet.api.red-packet-logs.index",
          {
            red_packet_id: kid ? kid : ""
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.redData = response.data;
            this.amount = response.data.amount;
            this.receive_log = response.data.receive_log;
            this.bjcolor = response.data.color;
            this.receive_color = response.data.receive_color;
            this.amount_color = response.data.amount_color;
            this.out_color = response.data.out_color;
            this.red_packet_color = response.data.red_packet_color;
            this.fun.setWXTitle(this.redData.red_packet_title);
            this.link = response.data.link;
            if (
              this.redData.receive_one == 0 &&
              !this.fun.isTextEmpty(this.redData.redPacket && Number(this.receive_log.amount_sum) - Number(this.receive_log.receive_amount) > 0) &&
              Number(this.amount.number_sum) - Number(this.amount.totle) > 0
            ) {
              if (this.redData.business_hours_start != 0 && !this.fun.isTextEmpty(this.redData.business_hours_start) && this.redData.business_hours_start != null) {
                this.timeShow = true;
                this.business_hours_start = response.data.business_hours_start;
                this.timestamp = new Date().getTime();
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                // 可以领取红包的时间
                this.assgin_hours = `${year}/${month}/${day} ${response.data.business_hours_start}:00`;
                this.assgin_hours = Date.parse(this.assgin_hours);
                this.Difference = this.assgin_hours - this.timestamp;
                this.timeOut();
              }
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    timeOut() {
      var that = this;
      let millisecond = this.Difference;
      this.setTime = setInterval(() => {
        if (millisecond < 1000) {
          clearInterval(that.setTime);
          that.timeShow = false;
          return;
        }
        millisecond -= 1000;
        that.transformRemainTime(millisecond);
      }, 1000);
    },
    transformRemainTime: function(millisecond) {
      var that = this;
      // var countdownObj = that.countdown;
      // 秒数
      var seconds = Math.floor(millisecond / 1000);
      // 天数
      let day = that.formatTime(Math.floor(seconds / 3600 / 24));
      // 小时
      let hour = that.formatTime(Math.floor((seconds / 3600) % 24));
      // // 分钟
      let minute = that.formatTime(Math.floor((seconds / 60) % 60));
      // // 秒
      let second = that.formatTime(Math.floor(seconds % 60));
      if (day == "00") {
        that.countdown = `${hour}:${minute}:${second}`;
      } else {
        that.countdown = `${day}:${hour}:${minute}:${second}`;
      }
    },
    //格式化时间为2位
    formatTime: function(time) {
      if (time < 10) {
        return "0" + time;
      } else {
        return time;
      }
    },
    toPage(str) {
      this.$router.push(this.fun.getUrl(str));
    },
    sureGet() {
      if(this.link.is_advert && !this.link.is_browse){
        Toast('请先点击顶部图片进行浏览');
        return;
      }
      if (this.tapOne) {
        return;
      }
      this.tapOne = true;
      let usid = localStorage.getItem("uid");
      let that = this;
      $http
        .get("plugin.red-packet.api.red-packet-logs.memberAmount", { red_packet_id: that.redData.amount.id, uid: usid }, "加载中")
        .then(response => {
          if (response.result === 1) {
            if (response.data.price) {
              if (response.data.price == "0") {
                Toast(response.msg);
              }
            } else {
              that.show = true;
              if (response.data) {
                that.red_packet = Number(response.data).toFixed(2);
              }
              that.getData(that.redData.amount.id);
            }
          } else {
            setTimeout(() => {
              that.tapOne = false;
            }, 1000);
            Toast(response.msg);
          }
        })
        .catch(error => {
          that.tapOne = false;
          console.log(error);
        });
    },
    toGood(id) {
      this.$router.push(
        this.fun.getUrl("goods", {
          id: id
        })
      );
    }
  },
  components: { cTitle }
};
