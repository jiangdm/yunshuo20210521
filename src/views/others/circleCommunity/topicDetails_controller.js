import { ActionSheet, Dialog, Toast, Image } from "vant";
import DList from "@/components/dlist";
var share_tag = "-1";

//* 帖子操作菜单选项
let postActionSheet = {
  author: [{ name: "修改", key: "edit" }],
  master: [
    { name: "置顶", key: "top" },
    { name: "推荐", key: "recommend" },
    { name: "未加入可见", key: "displayorder" },
    { name: "删除", key: "delete" }
  ]
};

export default {
  data() {
    return {
      bannerindex: 1,
      mainCommentShow: false,
      replyshow: false,
      amountRewardshow: false,
      rewardPayshow: false,
      stickid: "",
      detailsData: {},
      StickCommentData: [],
      replyName: "",
      replyContent: "",
      host_comment_id: "",
      second_comment_id: "",
      maincomment: "",
      readertype: 1, // 1普通看帖人 2发帖人 3管理人
      is_praise: true,
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
          name: "50元"
        },
        {
          value: 5,
          name: "100元"
        }
      ],
      rewardArrselect: 99999,
      rewardArrmoney: "",
      rewardArrmoneytype: 2,
      btnData: [],
      rewardMoney: 0,
      commentManagement: false,
      is_own: false,
      commend_id: "",
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      stick_flag: 0,
      recommend_flag: 0,

      reward_button: 1,

      passwordInfo: {},
      popupSpecs: false,
      pwds: [],
      pwd: "",
      pw1: "",
      pw2: "",
      pw3: "",
      pw4: "",
      pw5: "",
      pw6: "",

      postId: null,
      post: null,
      showPostOperateMenu: false,
      comments: [],
      commentPagination: {
        loading: false,
        page: 1,
        finished: false
      },
      operateCommentParentIndex: null,
      operateCommentSubIndex: null,
      showCommentActionSheet: false,
      replyCommentContent: "",
      commentActionSheet: [],
      displayReward: false,
      displayGoods: false,
      displayStore: false,
      postOperateActionSheets: []
    };
  },
  activated() {
    if (this.$route.query.pid) {
      this.postId = Number(this.$route.query.pid);
    } else {
      if (this.$route.params.stickId) {
        this.postId = this.$route.params.stickId;
      } else {
        this.$router.go(-1);
      }
    }
    this.getPost();
    this.getSet();

    // this.popupSpecs = true;
    // this.initPop();
    // this.getMicroDetails();
  },

  mounted() {
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      share_tag = this.fun.getKey("share_tag");
    }
  },
  methods: {
    moneyShow() {
      if (this.displayReward === false) {
        return;
      }
      this.rewardArrmoney = "";
      this.rewardArrselect = 9999;
      this.rewardMoney = 0;
      this.amountRewardshow = true;
    },
    shorewardArrBtn(index) {
      this.rewardArrmoneytype = 1;
      this.rewardArrselect = index;
      this.rewardArrmoney = "";
    },
    rewardArrMoneyBtn() {
      this.rewardArrmoneytype = 2;
      this.rewardArrselect = 9999;
    },
    confirmRewardBtn() {
      if (this.displayReward === false) {
        return;
      }
      this.amountRewardshow = false;
      if (this.rewardArrmoneytype == 1) {
        this.rewardMoney = parseInt(this.rewardArr[this.rewardArrselect].name);
      } else if (this.rewardArrmoneytype == 2) {
        this.rewardMoney = this.rewardArrmoney;
      }
      if (this.fun.isTextEmpty(this.rewardMoney)) {
        Toast("请输入或选择打赏金额");
        return;
      }
      if (this.rewardMoney <= 0) {
        Toast("打赏金额必须大于0");
        return;
      }
      this.getPayData();
    },
    rewardPayCancelBtn() {
      this.rewardPayshow = false;
    },
    showPwdPop() {
      this.initPop();
      this.rewardPayshow = false;
      this.popupSpecs = true;
    },
    hidePwdPop() {
      this.popupSpecs = false;
    },
    //初始化pop
    initPop() {
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
        this.hidePwdPop();
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
            that.payBtn(that.passwordInfo);
          } else {
            that.$dialog
              .confirm({ message: response.msg })
              .then(() => {
                if (response.data.code == 2001) {
                  //商城支付密码设置未开启
                  //that.$router.go(-1);
                } else if (response.data.code == 2002) {
                  //用户未设置支付密码
                  //去设置密码
                  that.$router.push(that.fun.getUrl("set_balance_password", {}));
                } else if (response.data.code == 2003) {
                  //支付密码错误
                }
              })
              .catch(() => {
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
          that.$dialog.alert({ message: response.msg });
        }
      );
    },
    //获取支付类型参数
    getPayData() {
      this.actionSheetItems = [];
      $http
        .get("payment.pay-type", {}, "")
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
    payBtn(data) {
      if (data.need_password) {
        this.passwordInfo = data;
        this.showPwdPop();
        return;
      }
      let that = this;
      let json = {
        pay_method: data.value,
        price: this.rewardMoney,
        pay_name: data.name,
        invitation_id: this.post.id
      };
      $http
        .post("plugin.circle.frontend.circle-pay.invitation-reward", json, "支付中...")
        .then(response => {
          that.rewardPayshow = false;
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
              Toast(response.msg);
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
              YDB.SetWxpayInfo(that.$store.state.temp.mailInfo.name, "订单号：" + response.data.order_sn, that.rewardMoney, response.data.order_sn, that.fun.getKeyByI());
              break;
            case 28: //汇聚 微信
              that.newWXPay(JSON.parse(response.data.data.rc_Result));
              break;
            case 29: //汇聚 支付宝
              that.HJToappliy(response.data);
              break;
            default:
              break;
            }
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          that.$dialog.alert({ message: response.msg });
        });
    },
    // 汇聚支付跳转
    HJToappliy(data) {
      if (data.msg != "") {
        this.$dialog.alert({ message: data.msg });
      } else {
        window.href = data.data.rc_Result;
      }
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
            that.$router.go(-1);
            that.$dialog.alert({ message: "支付成功" });

            that.getCurrentPayStatus(); //重新获取
            that.getTodayPay();
          } else {
            that.$dialog.alert({ message: "支付失败" });
          }
        },
        cancel: function(res) {
          //支付取消
        },
        fail: function(res) {
          that.$dialog.alert({ message: "支付失败，请返回重试" });
        }
      });
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
            that.$dialog.alert({ message: "支付成功" });
            that.getCurrentPayStatus(); //重新获取
            that.getTodayPay();
          } else {
            that.$dialog.alert({ message: "支付失败" });
          }
        }
      );
    },
    attentionBtn() {
      if (this.detailsData.is_follow) {
        this.cancelAttention();
      } else {
        this.addAttention();
      }
    },
    sidingsImg(index) {
      this.bannerindex = index + 1;
    },
    getMicroDetails() {
      let that = this;
      let dataJson = {
        tid: this.stickid
      };
      $http.post("plugin.circle.frontend.circle-invitation.details", dataJson, {}).then(response => {
        if (response.result == 1) {
          that.detailsData = response.data;
          if (that.detailsData) {
            if (that.detailsData.is_manager == 1) {
              that.readertype = 3;
            } else if (that.detailsData.is_own == 1) {
              that.readertype = 2;
            }
            if (that.detailsData.is_manager == 1) {
              that.is_praise = true;
            } else {
              that.is_praise = false;
            }
          }
          this.reward_button = response.data.reward_button;
          this.recommend_flag = response.data.is_recommend;
          this.stick_flag = response.data.is_top;
          that.is_own = response.data.is_own == 0 ? false : true;
          that.initShare();
        } else {
          if (share_tag == "-1") {
            that.$router.go(-1);
          } else {
            that.$router.push(that.fun.getUrl("home", {}));
          }
          Toast(response.msg);
        }
      });
    },
    replyCommentsBtn(host_comment_id, second_comment_id, uname, content, is_own) {
      this.host_comment_id = host_comment_id;
      this.second_comment_id = second_comment_id;
      this.replyContent = "";
      this.replyName = uname;
      this.replyshowcontent = content;
      if (is_own == 1) {
        this.is_own = true;
      } else {
        this.is_own = false;
      }
      this.commentManagement = true;
    },
    replyBtn() {
      this.replyshow = true;
      this.commentManagement = false;
    },
    replyCancelBtn() {
      this.commentManagement = false;
    },
    subMainCommentBtn() {
      this.maincomment = "";
      this.mainCommentShow = true;
      this.$nextTick(() => {
        this.$refs.commentInput.focus();
      });
    },
    managementBtn() {
      if (this.readertype == 1) {
        return;
      } else if (this.readertype == 2) {
        this.releaseOperationshow = true;
      } else if (this.readertype == 3) {
        this.adminOperationshow = true;
      }
    },
    reEditBtn() {
      this.$router.push(
        this.fun.getUrl("microEdit", {
          stickid: this.stickid
        })
      );
    },
    reCancelBtn() {
      this.releaseOperationshow = false;
    },
    adCancel() {
      this.adminOperationshow = false;
    },
    goto() {
      if (share_tag == "-1") {
        this.$router.go(-1);
      } else {
        this.$router.push(this.fun.getUrl("home", {}));
      }
    },
    //跳转购物车
    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    //分享
    initShare() {
      let that = this;
      $http
        .post("member.member.wxJsSdkConfig", {
          url: that.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
        })
        .then(response => {
          if (response.result === 1) {
            that.share(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    share(data) {
      //自定义分享
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);
        _title = that.fun.isTextEmpty(that.detailsData.title) ? data.share.title : that.detailsData.title;
        _imgUrl = that.fun.isTextEmpty(that.detailsData.has_one_stick_user) ? data.share.icon : that.detailsData.has_one_stick_user.avatar;
        _desc = that.fun.isTextEmpty(that.detailsData.contents) ? data.share.desc : that.detailsData.contents;
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
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      }
      this.$toast("请点击右上角微信分享");
    },
    pageInit() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    gotoStore(_id) {
      this.$router.push(this.fun.getUrl("HomeSeller", { store_id: _id, circle_invitation_id: this.postId }));
    },
    gotoGoods(_id) {
      this.$router.push(this.fun.getUrl("goods", { id: _id, circle_invitation_id: this.postId }));
    },

    getPost() {
      $http
        .get("plugin.circle.frontend.circle-invitation.details", {
          invitation_id: this.postId
        })
        .then(({ data: response, result, msg }) => {
          if (result == 0) {
            Toast(msg);
            this.$router.go(-1);
            return;
          }
          this.post = response;
          this.loadComments();
          this.computedOperateActionSheets();
        });
    },
    showPostOperate() {
      if (!this.post.is_current_member || !this.post.is_master) {
        return;
      }
      this.showPostOperateMenu = !this.showPostOperateMenu;
    },
    selectPostOperateAction(action) {
      let masterActionKey = "";
      switch (action.key) {
      case "edit":
        if (this.post.is_current_member || this.post.is_master) {
          this.$router.push(
            this.fun.getUrl(
              "circleTopic",
              {},
              {
                isReview: this.post.is_review,
                pid: this.post.id
              }
            )
          );
        }
        break;
      case "delete":
        if (this.post.is_current_member || this.post.is_master) {
          Dialog.confirm({
            title: "删除帖子",
            massage: "确定要删除该帖子吗？",
            beforeClose: (action, done) => {
              if (action === "confirm") {
                $http
                  .post("plugin.circle.frontend.circle-invitation.del", {
                    invitation_id: this.post.id
                  })
                  .then(res => {
                    if (res.result == 0) {
                      Toast(res.msg);
                      return;
                    }
                    Toast("删除成功");
                    done();
                    setTimeout(() => {
                      this.$router.go(-1);
                    }, 100);
                  });
              } else {
                done();
              }
            }
          });
        }
        break;
      case "top":
        masterActionKey = "is_top";
        break;
      case "recommend":
        masterActionKey = "is_recommend";
        break;
      case "displayorder":
        masterActionKey = "is_show";
        break;
      }
      if (masterActionKey && this.post.is_master) {
        $http
          .post("plugin.circle.frontend.circle-invitation.set-invitation-review", {
            invitation_id: this.post.id,
            circle_id: this.post.circle_id,
            invitation_type: masterActionKey
          })
          .then(res => {
            if (res.result == 0) {
              Toast(res.msg);
              return;
            }
            switch (action.key) {
            case "top":
              this.post.is_top = !this.post.is_top;
              break;
            case "recommend":
              this.post.is_recommend = !this.post.is_recommend;
              break;
            case "displayorder":
              this.post.is_show = !this.post.is_show;
              break;
            }
            this.computedOperateActionSheets();
            Toast("操作成功");
          });
      }
    },
    followAuthor() {
      let requestUrl = "plugin.circle.frontend.circle-member.attention-member";
      if (this.post.is_attention) {
        requestUrl = "plugin.circle.frontend.circle-member.cancel-attention";
      }
      let followLoading = Toast.loading();
      $http
        .post(requestUrl, {
          attention_member_id: this.post.member_id
        })
        .then(({ result, msg }) => {
          if (result == 1) {
            this.post.is_attention = !this.post.is_attention;
            followLoading.clear();
          }
          Toast(msg);
        });
    },
    likePost() {
      if (this.post.is_like) {
        Toast("请勿重复点赞帖子");
        return;
      }
      let likeLoading = Toast.loading();
      $http
        .post("plugin.circle.frontend.circle-invitation.like", {
          invitation_id: this.post.id
        })
        .then(res => {
          likeLoading.clear();
          Toast(res.msg);
          if (res.result == 1) {
            this.post.is_like = 1;
            this.post.likeCount++;
          }
        });
    },
    loadComments() {
      if (this.commentPagination.loading || this.commentPagination.finished) {
        return;
      }
      this.commentPagination.loading = true;
      $http
        .post("plugin.circle.frontend.circle-invitation.get-comment-list", {
          invitation_id: this.post.id,
          page: this.commentPagination.page
        })
        .then(({ data: response, result, msg }) => {
          this.commentPagination.loading = false;
          if (result == 0) {
            Toast(msg);
            return;
          }
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.commentPagination.finished = true;
          }
          let comments = response.data;
          if (comments.length > 0) {
            comments.forEach(item => {
              item["subCommentsPagination"] = {
                page: 1,
                finished: item["has_many_comment"] ? item["has_many_comment"].length < 16 : true,
                loading: false
              };
            });
            this.comments.push(...response.data);
          }
          this.commentPagination.page++;
        });
    },
    reloadComments() {
      this.comments = [];
      this.commentPagination = {
        loading: false,
        page: 1,
        finished: false
      };
      this.loadComments();
    },
    likeComment(itemIndex, subIndex = null) {
      let comment = this.comments[itemIndex];
      if (subIndex !== null) {
        comment = comment["has_many_comment"][subIndex];
      }
      if (comment.is_like) {
        Toast("已经点赞过啦~");
        return;
      }
      let likeLoading = Toast.loading();
      $http
        .post("plugin.circle.frontend.circle-invitation.comment-like", {
          invitation_id: this.post.id,
          comment_id: comment.id
        })
        .then(res => {
          likeLoading.clear();
          if (res.result == 1) {
            comment["is_like"] = 1;
            comment["link_count"]++;
          }
          Toast(res.msg);
        });
    },
    async sendComment(parentId = "", subId = "") {
      return await $http.post("plugin.circle.frontend.circle-invitation.comment", {
        invitation_id: this.post.id,
        comment: this.replyContent,
        parent_id: parentId,
        subsubordinate_id: subId
      });
    },
    async commentPost() {
      let { msg, result } = await this.sendComment();
      if (result == 0) {
        Toast(msg);
        return;
      }
      this.replyContent = "";
      this.mainCommentShow = false;
      Toast("评论成功");
      this.reloadComments();
    },
    async replyComment() {
      let comment = this.comments[this.operateCommentParentIndex];

      let parentId = "";
      let subId = "";
      if (this.operateCommentSubIndex == null) {
        parentId = comment["id"];
      } else {
        comment = comment["has_many_comment"][this.operateCommentSubIndex];
        subId = comment["id"];
        parentId = comment["parent_id"];
      }

      const { msg } = await this.sendComment(parentId, subId);
      this.replyshow = false;
      this.replyContent = "";
      this.replyName = "";
      Toast(msg);
      this.reloadComments();
    },
    loadMoreSubComments(itemIndex) {
      // TODO 加载更多 回复评论 的数据，后端没提供接口，暂时无用
      // let comments = this.comments[itemIndex];
    },
    displayCommentActionSheet(itemIndex, subIndex = null) {
      this.operateCommentParentIndex = itemIndex;
      this.operateCommentSubIndex = subIndex;
      let comment = this.comments[itemIndex];
      if (subIndex != null) {
        comment = comment["has_many_comment"][subIndex];
      }

      if (comment.is_current_member || this.post.is_master) {
        this.commentActionSheet = [
          {
            name: "回复",
            key: "reply"
          },
          {
            name: "删除",
            key: "delete"
          }
        ];
      } else {
        this.commentActionSheet = [
          {
            name: "回复",
            key: "reply"
          }
        ];
      }
      this.replyCommentContent = comment.comment;
      this.replyName = comment.nickname;
      this.showCommentActionSheet = true;
    },
    selectCommentActionSheet({ name, key }) {
      let comment = this.comments[this.operateCommentParentIndex];

      if (this.operateCommentSubIndex != null) {
        comment = comment["has_many_comment"][this.operateCommentSubIndex];
      }

      switch (key) {
      case "delete":
        $http
          .post("plugin.circle.frontend.circle-invitation.delete-comment", {
            comment_id: comment.id
          })
          .then(({ result, msg }) => {
            if (result == 1) {
              if (this.operateCommentSubIndex != null) {
                this.comments[this.operateCommentParentIndex]["has_many_comment"].splice(this.operateCommentSubIndex, 1);
              } else {
                this.comments.splice(this.operateCommentParentIndex, 1);
              }
            }
            Toast(msg);
          });
        break;
      case "reply":
        this.replyshow = true;
        break;
      }
    },
    visitMember() {
      this.$router.push(
        this.fun.getUrl(
          "circleMyRelease",
          {},
          {
            member_id: this.post.member_id
          }
        )
      );
    },
    getSet() {
      $http.get("plugin.circle.frontend.circle.get-set").then(({ data }) => {
        this.displayReward = Boolean(data.dashan);
        this.displayGoods = Boolean(data.good_show);
        this.displayStore = Boolean(data.store_show);
      });
    },
    computedOperateActionSheets() {
      if (!this.post) {
        this.postOperateActionSheets = [];
      }
      let postActionSheets = JSON.parse(JSON.stringify(postActionSheet));//* JSON深拷贝的是外界的postActionSheet，主要是去掉VUE的响应式
      if (this.post.is_top) {
        postActionSheets["master"][0]["name"] = "取消置顶";
      }
      if (this.post.is_recommend) {
        postActionSheets["master"][1]["name"] = "取消推荐";
      }
      if (this.post.is_show) {
        postActionSheets["master"][2]["name"] = "取消未加入可见";
      }
      if (this.post.is_current_member && this.post.is_master) {
        this.postOperateActionSheets = postActionSheets["author"].concat(postActionSheets["master"]);
      } else {
        if (this.post.is_current_member) {
          this.postOperateActionSheets = postActionSheets["author"];
        } else if (this.post.is_master) {
          this.postOperateActionSheets = postActionSheets["master"];
        } else {
          this.postOperateActionSheets = [];
        }
      }
    }
  },

  components: {
    VanActionSheet: ActionSheet,
    VanImage: Image,
    DList
  }
};
