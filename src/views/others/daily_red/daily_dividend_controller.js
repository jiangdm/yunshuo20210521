import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      show: false,
      redData: {},
      daily_dividend: "",
      shareData: {},
      tapOne: false,
      receive_log: "",
      bjcolor: "",
      receive_color: "",
      amount_color: "",
      out_color: "",
      daily_dividend_color: "",
      amount: "",
      business_hours_start: "",
      setTime: null,
      assgin_hours: "",
      timestamp: "",
      Difference: "",
      countdown: "00:00:00",
      timeShow: false,
      credit6:'0.00',
      million:'0.00',
      integral:'0.00',
      receive_amount:'0.00',
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
        .get("plugin.daily-dividend.api.daily-dividend-Logs.share", {}, "加载中")
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
              .get("plugin.red-packet.api.red-packet-logs.set-link-log", { daily_dividend_id: that.redData.amount.id }, "加载中")
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
          //"plugin.red-packet.api.red-packet-logs.index",
          "plugin.daily-dividend.api.daily-dividend-Logs.index",
          {
            daily_dividend_id: kid ? kid : ""
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);

            this.redData = response.data;
            this.amount = response.data.amount;
            this.receive_log = response.data.receive_log;
            this.bjcolor = '#ef4841';//response.data.color
            this.receive_color = response.data.receive_color;
            this.amount_color = response.data.amount_color;
            this.out_color = response.data.out_color;
            this.daily_dividend_color = response.data.daily_dividend_color;
            //this.redData.receive_one = {integral:'1723.33',receive_amount : '1723.33'};
            this.integral = this.redData.receive_one ? this.redData.receive_one.integral : '0.00';
            this.receive_amount = this.redData.receive_one ? this.redData.receive_one.receive_amount : '0.00';
            this.income_credit6 = this.redData.member.income_credit6;
            this.fun.setWXTitle(this.redData.daily_dividend_title);
            this.credit6 = this.redData.member.credit6;
            this.million = this.redData.million;

          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
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
        .get("plugin.red-packet.api.red-packet-logs.memberAmount", { daily_dividend_id: that.redData.amount.id, uid: usid }, "加载中")
        .then(response => {
          if (response.result === 1) {
            if (response.data.price) {
              if (response.data.price == "0") {
                Toast(response.msg);
              }
            } else {
              that.show = true;
              if (response.data) {
                that.daily_dividend = Number(response.data).toFixed(2);
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
    },
    accMul(num1,num2){
      let r1, r2, m;
      r1 = (''+num1).split('.')[1].length;
      r2 = (''+num2).split('.')[1].length;
      m = Math.pow(10,Math.max(r1,r2));
      return (num1 * m + num2 * m) / m;
    },
  },
  components: { cTitle }
};
