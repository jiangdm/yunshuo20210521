import cTitle from "components/title";
import { Toast } from 'vant';
let self = null;
export default {
  data() {
    return {
      id: "",
      dataInfo: {},
      content: "",
      like_num: 0,
      read_num: 0,
      is_advs_type: false,
      is_report_enabled: false,
      is_no_copy_url: false,
      is_no_share: false,
      is_no_share_to_friend: false,
      is_liked: false,
      is_link: false,
      title: "",
      codeUrl: "",
      imgList: [],
      showImg: false,
      imgStart: 0,
      menuLists: [] //微信要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
    };
  },
  beforeRouteLeave(to, from, next) {
    // 注意：从商品详情页跳转到商品详情页不触发，to、from不变
    if (self.showImg) {
      self.showImg = false;
      next(false);
    } else {
      next();
    }
  },
  activated() {
    self = this;
    this.id = this.$route.params.id;
    this.codeUrl = "";
    this.menuLists = [];
    this.imgList = [];
    this.showImg = false;
    this.imgStart = 0;
    //获取数据
    this.getData();
    this.getQrCode();
  },
  mounted() {
    this.dataInfo = {};
    this.title = "";
  },

  methods: {
    getQrCode() {
      $http.get("member.member.getArticleQr", {}, "").then(
        response => {
          if (response.result === 1) {
            this.codeUrl = response.data;
          } else {
            this.codeUrl = false;
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //获取数据
    getData() {
      let that = this;
      let share_uid = this.fun.getKey("share_uid");
      share_uid = this.fun.isTextEmpty(share_uid) ? "" : share_uid;
      let json = { article_id: this.id, share_uid: share_uid };

      $http.get("plugin.article.api.article.get-article", json, "").then(
        function (response) {
          if (response.result == 1) {
            that.title = response.data.title;

            that.dataInfo = response.data;
            that.content = response.data.content;
            that.is_advs_type = response.data.advs_type == 0 ? false : true;
            that.is_report_enabled =
              response.data.report_enabled == 0 ? false : true;

            that.is_no_copy_url = response.data.no_copy_url == 1 ? true : false; //禁止复制链接
            that.is_no_share = response.data.no_share == 1 ? true : false; //禁止分享至朋友圈
            that.is_no_share_to_friend =
              response.data.no_share_to_friend == 1 ? true : false; //禁止分享给好友

            that.is_liked = response.data.liked == 0 ? false : true;
            that.is_link = !that.fun.isTextEmpty(response.data.link);
            that.like_num =
              response.data.like_num + response.data.virtual_like_num;
            that.read_num =
              response.data.read_num + response.data.virtual_read_num;
            // that.initShare();
            if (that.is_no_copy_url) {
              that.menuLists.push("menuItem:copyUrl");
            }
            if (that.is_no_share) {
              that.menuLists.push("menuItem:share:timeline");
            }
            if (that.is_no_share_to_friend) {
              that.menuLists.push("menuItem:share:appMessage");
            }
            that.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid() },
              {
                title: that.fun.isTextEmpty(that.dataInfo.title) ? "" : that.dataInfo.title,
                imgUrl: that.fun.isTextEmpty(that.dataInfo.thumb) ? "" : that.dataInfo.thumb,
                description: that.fun.isTextEmpty(that.dataInfo.desc) ? "" : that.dataInfo.desc,
                menuLists:that.menuLists
              }
            );
            that.fun.setWXTitle(that.dataInfo.title || '详情');
            that.imgList = that.getImgSrc(response.data.content);
          } else {
            if (response.msg == '您尚未购买该文章内容,无法观看') {
              that.$dialog.alert({message:response.msg});
              that.$router.replace(that.fun.getUrl("payList", { id: that.id}));
            }else{
              that.$dialog.alert({ message: response.msg})
                .then(() => {

                  that.$router.push(that.fun.getUrl("notice"));
                }).catch(() => {});
            }
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    handleHtml($event) {
      console.log($event);
      let that = this;
      if ($event.target) {
        if ($event.target.nodeName == 'IMG'&&$event.target.parentElement.nodeName !== 'A') {
          for (let i = 0; i < that.imgList.length; i++) {
            // 编程式
            if ($event.target.currentSrc.indexOf(that.imgList[i]) > -1) {
              that.imgStart = i;
              that.showImg = true;
              return;
            }
          }

        }
      }
    },
    getImgSrc(richtext) {
      let imgList = [];
      richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      return imgList;
    },
    //查看营销
    toAdvs() {
      if (
        !this.fun.isTextEmpty(this.dataInfo) &&
        this.fun.isTextEmpty(this.dataInfo.advs_link)
      ) {
        return;
      }
      window.location.href = this.fun.funHrefFilters(this.dataInfo.advs_link);
    },

    //点赞
    like(like_num) {
      let that = this;
      let json = { article_id: this.id };

      $http.get("plugin.article.api.article.like", json, "").then(
        function (response) {
          if (response.result === 1) {
            if (response.data.liked == 1) {
              that.is_liked = true;
              that.like_num = like_num + 1;
              Toast("点赞成功");
            } else {
              that.is_liked = false;
              that.like_num = like_num - 1;
              if (that.like_num < 0) {
                that.like_num = 0;
              }
              Toast("取消点赞");
            }
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //举报
    report() {
      this.$router.push(this.fun.getUrl("noticeReport", { id: this.id }));
    },

    //阅读原文
    link() {
      window.location.href = this.fun.funHrefFilters(this.dataInfo.link);
    },

    //初始化分享设置
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = { url: _url, mid: this.fun.getKeyByMid() };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function (response) {
          if (response.result === 1) {
            if (response.data.config) {
              that.share(response.data);
            }
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

      if (that.is_no_copy_url) {
        that.menuLists.push("menuItem:copyUrl");
      }
      if (that.is_no_share) {
        that.menuLists.push("menuItem:share:timeline");
      }
      if (that.is_no_share_to_friend) {
        that.menuLists.push("menuItem:share:appMessage");
      }

      wx.config(data.config);
      wx.ready(function () {
        let _title = that.fun.isTextEmpty(that.dataInfo.title)
          ? "文章"
          : that.dataInfo.title;
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.dataInfo.thumb)
          ? ""
          : that.dataInfo.thumb;
        let _desc = that.fun.isTextEmpty(that.dataInfo.desc)
          ? "简介"
          : that.dataInfo.desc;
        wx.showOptionMenu();

        wx.hideMenuItems({
          menuList: that.menuLists
        });

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
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
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });

        // if(that.fun.getWechatVersion()){
        //   wx.updateTimelineShareData({
        //     title: _title, // 分享标题
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     success: function () {
        //       //Toast("分享成功");
        //     },
        //     // cancel: function () {
        //     //   Toast("取消分享");
        //     // }
        //   });

        //   wx.updateAppMessageShareData({
        //     title: _title, // 分享标题
        //     desc: _desc, // 分享描述
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     //type: 'link', // 分享类型,music、video或link，不填默认为link
        //     //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //     success: function () {
        //       //Toast("分享成功");
        //     },
        //     // cancel: function () {
        //     //   Toast("取消分享");
        //     // }
        //   });
        // }else{
        //   wx.onMenuShareTimeline({
        //     title: _title, // 分享标题
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     success: function () {
        //       Toast("分享成功");
        //     },
        //     cancel: function () {
        //       Toast("取消分享");
        //     }
        //   });

        //   wx.onMenuShareAppMessage({
        //     title: _title, // 分享标题
        //     desc: _desc, // 分享描述
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     type: 'link', // 分享类型,music、video或link，不填默认为link
        //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //     success: function () {
        //       Toast("分享成功");
        //     },
        //     cancel: function () {
        //       Toast("取消分享");
        //     }
        //   });
        // }
      });
    }
  },
  components: { cTitle }
};
