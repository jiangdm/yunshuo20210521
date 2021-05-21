import cTitle from "components/title";
import { Toast } from 'vant';
import cMyswipe from "components/myswipe";
import { Swipe, SwipeItem } from "components/meswipe";
export default {
  data() {
    return {
      record:[],
      posterShow: false,
      invite_mobile:'',
      posterImg: {},
      show1:false,
      id:'',
      goods_id:'',
      auction:'',
      auctioneer:'',
      passwd:'',
      is_verify:'',
      status:'',
      password:'',
      now: "",
      show2:false,
      price:0,
      rewardPayshow: false,
      btnData: [],
      isclick:true,
    };
  },
  activated() {
    window.scrollTo(0,0); //页面向上滚动
    this.initData();
    this.id=this.$route.params.id;
    this.goods_id=this.$route.params.goods_id;
    this.now=new Date(this.timestampToTime(new Date().valueOf()/1000)).valueOf()/1000;
    this.getStatus();

  },
  methods: {
    payBtn(type, name) {
      if(type==3&&!this.isclick){
        return;
      }
      let that = this;
      let json = {
        money:Number(that.auction.prepayment),
        goods_id:Number(that.goods_id),
        pay_way:Number(type)
      };
      $http
        .post(
          "plugin.auction.api.prepayment.recharge",
          json,
          "支付中..."
        )
        .then(response => {
          that.rewardPayshow = false;
          if (response.result == 1) {
            switch (type) {
            case '1': //微信
              wx.config(response.data.js);
              that.WXPay(response.data.config);
              break;
            case '2': //支付宝
              that.$router.push(
                that.fun.getUrl("alipayCourse", {
                  status: "9",
                  url: response.data
                })
              );
              break;
            case '3': //余额
              if(that.isclick){
                console.log(response.msg);
                Toast(response.msg);
                that.isclick=false;
                that.rewardPayshow = false;
                that.getData();
              }
              break;
            case '6': //新版微信 link
              window.location.href = response.data;
              break;
            case '12': //芸支付 微信
              that.newWXPay(response.data.config);
              break;
            case '7': //云收银支付宝
              that.$router.push(
                that.fun.getUrl("alipayCourse", {
                  status: "9",
                  url: response.data
                })
              );
              break;
            case '9': //微信app
              YDB.SetWxpayInfo(
                that.$store.state.temp.mailInfo.name,
                "订单号：" + response.data.order_sn,
                that.rewardMoney,
                response.data.order_sn,
                that.fun.getKeyByI()
              );
              break;
            default:
              break;
            }
          } else {
            that.$dialog.alert({message:response.msg});

          }
        })
        .catch(error => {
          that.$dialog.alert({message:response.msg});

        });
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
        success: function (res) {
          // 支付成功后的回调函数
          if (res.errMsg == "chooseWXPay:ok") {
            that.$router.go(-1);
            that.$dialog.alert({message:"支付成功"});
            that.getCurrentPayStatus(); //重新获取
            that.getTodayPay();
          } else {
            that.$dialog.alert({message:"支付失败"});
          }
        },
        cancel: function (res) {
          //支付取消
        },
        fail: function (res) {
          that.$dialog.alert({message:"支付失败，请返回重试"});
        }
      });
    },
    //新版微信支付参数
    newWXPay(payParams) {
      var that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest", {
          appId: payParams.appId, //公众号名称，由商户传入
          timeStamp: payParams.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: payParams.nonceStr, //随机串
          package: payParams.package,
          signType: payParams.signType, //微信签名方式：
          paySign: payParams.paySign //微信签名
        },

        function (res) {
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

    rewardPayCancelBtn() {
      this.rewardPayshow = false;
    },
    //获取支付类型参数
    getPayData() {
      this.actionSheetItems = [];
      let json={goods_id:this.goods_id};
      $http
        .get("plugin.auction.api.prepayment.page", json)
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
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "/";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "/";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes());
      // let s = this.change(date.getSeconds());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    toRecord(){
      this.$router.push(this.fun.getUrl("auctionRecord",{goods_id:this.goods_id}));
    },
    bidTo(){
      let json={goods_id:Number(this.goods_id),price:Number(this.price)};
      $http
        .post(
          "plugin.auction.api.bid.bid",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            Toast(response.msg);
            this.show2=false;
            this.getData();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    up(){
      this.price=Number(Number(this.price)+Number(this.auction.mini_markup));
    },
    down(){
      if(Number(this.price)<=Number(this.auction.now_price)){
        Toast('出价不能小于起拍价');
        return;
      }
      this.price=Number(Number(this.price)-Number(this.auction.mini_markup));
    },
    timeEnd() {
      if(this.auction){
        this.now=new Date(this.timestampToTime(new Date().valueOf()/1000)).valueOf()/1000;
        this.getData();
      }
    },
    bid(){
      if(this.invite_mobile==0){
        this.$router.push(this.fun.getUrl('editmobile'));
      }else if(this.auction.is_prepay==0){
        Toast(`需先支付${this.auction.prepayment}保证金方可出价`);
        this.getPayData();
      }
      else{
        this.show2=true;
      }
    },
    getInvite(){
      $http.get("member.member.isValidatePage").then(res => {
        if (res.result === 1) {
          this.invite_mobile=res.data.invite_mobile;
        }
      });
    },
    initData(){
      this.posterShow=false;
      this.posterImg={};
      this.show1=false,
      this.id='';
      this.goods_id='';
      this.auction='';
      this.auctioneer='';
      this.passwd='';
      this.is_verify='';
      this.status='';
      this.password='';
      this.now='';
      this.show2=false;
      this.price=0;
      this.rewardPayshow=false;
      this.btnData=[];
      this.isclick=true;
      this.record=[];
    },
    confirm(){
      let json={art:'verifyPassword',auction_id:this.id,passwd:this.password};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.show1=false;
            this.getStatus();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStatus(){
      let json={
        member_id:this.id
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.status=response.data.getVerify.status;
            this.is_verify=response.data.getVerify.is_verify;
            if(this.is_verify==0&&this.status==1){
              this.show1=true;
            }else{
              this.is_verify=1;
              this.getData();
              this.getInvite();
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toShop(){
      this.$router.push(this.fun.getUrl("auctioneerShop",{id:this.id}));
    },
    toMy(){
      this.$router.push(this.fun.getUrl("myIndex"));
    },
    toBuy(){
      this.$router.push(
        this.fun.getUrl("auctiongoodsorder", {
          tag: 'auction',
          goodsId: this.goods_id,
          total: 1,
          fixed_price:1,
          acution_sn:this.auction.acution_sn
        })
      );
    },
    todian(){
      this.$router.push(this.fun.getUrl("auctioneerShop",{id:window.localStorage.uid}));
    },
    //跳转购物车
    gotoCart() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    goto() {
      this.$router.go(-1);

    },
    //海报生成
    postShow() {
      if(!this.fun.isTextEmpty(this.posterImg.base64Image)){
        this.posterShow = true;
      }else{
        let toastPoster = Toast({
          duration: -1, // 持续展示 toast
          message: '正在为您生成海报中'
        });
        $http
          .get(
            "plugin.auction.api.goodsPoster.generateGoodsPoster",
            { id: this.goods_id},
            ""
          )
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              this.posterImg = response.data;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({message:response.msg});
            }
          })
          .catch(error => {
            toastPoster.clear();
            console.log(error);
          });
      }
    },
    toCollect(){
      let json={
        art:'collectionShop',
        auctioneer_id:this.id
      };
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            Toast(response.data.collectionShop);
            this.getData();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取数据
    getData() {
      let that = this;
      let json={member_id:this.id,goods_id:this.goods_id,art:'goodsDetail'};
      $http
        .get(
          "plugin.auction.api.index.getAuctionData",json,"获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.auction=response.data.goodsDetail.auction;
            this.auctioneer=response.data.goodsDetail.auctioneer;
            this.record=this.auction.bid_record.data;
            this.price=Number(this.auction.now_price);
            // this.initShare();
            this.fun.wxShare(
              "",
              {},
              {
                title: !that.fun.isTextEmpty(that.auction.has_one_share.share_title) ? that.auction.has_one_share.share_title : '',
                imgUrl: !that.fun.isTextEmpty(that.auction.has_one_share.share_thumb) ? that.auction.has_one_share.share_thumb : '',
                description: !that.fun.isTextEmpty(that.auction.has_one_share.share_desc) ? that.auction.has_one_share.share_desc : ''
              }
            );
          } else {
            this.$dialog.alert({message:response.msg});
            this.$router.go(-1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //初始化分享设置
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appSharesinit();
        return;
      }
      this.$dialog.alert({ message: "请点击右上角微信分享"});
    },
    //app获取分享数据
    appSharesinit() {
      var that = this;
      var _url = document.location.href;
      var json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      var that = this;
      var _title = that.fun.isTextEmpty(
        that.auction.has_one_share.share_title
      )
        ? that.auction.title
        : that.auction.has_one_share.share_title;
      var _link = document.location.href + "&share_tag=2";
      _link = that.fun.isMid(_link, data.info.uid);

      var _imgUrl = that.fun.isTextEmpty(
        that.auction.has_one_share.share_thumb
      )
        ? that.auction.thumb
        : that.auction.has_one_share.share_thumb;
      var _desc = that.fun.isTextEmpty(that.auction.has_one_share.share_desc)
        ? data.shop.shop.name
        : that.auction.has_one_share.share_desc;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";
        if (that.fun.isTextEmpty(that.auction.has_one_share)) {
          //返回的goodsInfo.has_one_share数据中没有相应对象
          _title = that.auction.title;
          _imgUrl = that.auction.thumb;
          _desc = data.shop.shop.name;
        } else {
          _title = that.fun.isTextEmpty(
            that.auction.has_one_share.share_title
          )
            ? that.auction.title
            : that.auction.has_one_share.share_title;
          _imgUrl = that.fun.isTextEmpty(
            that.auction.has_one_share.share_thumb
          )
            ? that.auction.thumb
            : that.auction.has_one_share.share_thumb;
          _desc = that.fun.isTextEmpty(that.auction.has_one_share.share_desc)
            ? data.shop.shop.name
            : that.auction.has_one_share.share_desc;
        }

        //let _link = document.location.href + "&mid=" + data.info.uid + "&share_tag=2";
        //let _link = location.protocol+'//'+location.host+location.pathname +'?i='+ that.fun.getKeyByI() +"&type=" +that.fun.getTyep()+ "&mid=" + data.info.uid + "&share_tag=2";

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

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
  },
  components: {
    cTitle,
    Swipe, SwipeItem, cMyswipe,
  }
};
