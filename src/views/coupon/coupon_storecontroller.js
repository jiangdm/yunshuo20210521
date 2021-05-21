import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin";
import {Sticky } from "vant";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      selected: "",
      coupon_list: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      // srcOne:require('../../assets/images/couponsbg_6@2x.png'),
      _status:1,
      types:[],
      typesIndex:0,
      slide_shows:[],
      isLoading:false,
      coupon_form:''
    };
  },
  computed:{
    
  },
  methods: {
    initData() {
      this.coupon_list = [];
      this.page = 1;
      this.goload = true;
      this.total_page = 0;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.typesIndex = 0;
    },
    //更新
    loadTop() {
      this.initData();
      this.getNetData();
      // this.$refs.loadmore.onTopLoaded();
    },
    toStore() {
      this.$router.push(this.fun.getUrl("coupon", {}));
    },
    // 加载更多
    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      // if (this.isLoadMore) {
      //   this.getMoreData(this.page);
      //   this.$refs.loadmore.onBottomLoaded();
      // } else {
      //   console.log("没有更多数据");
      // }
    },
    setTypesIndex(ind){
      if(this.typesIndex == ind){
        return;
      }
      this.typesIndex = ind;
      this.getNetData();
    },
    toRouteLink(link){
      console.log(link);
    },
    selectedcoupon(item, index) {
      //领取

      var that = this;
      if(!that.fun.isTextEmpty(that.coupon_form)){
        that.$router.push(
          that.fun.getUrl("DiyForm", { id:that.coupon_form ,tag:'coupon'})
        );
        return;
      }
      //use_type==2为指定商品
      if(item.use_type == 2) {
        that.$router.push(
          that.fun.getUrl("CouponIndependent", { id:item.id })
        );
        return;
      }
      $http
        .get(
          "coupon.member-coupon.get-coupon",
          { coupon_id: item.id },
          "正在抢此优惠券"
        )
        .then(
          function(response) {
            if (response.result == 1) {
              var temp = response.data;
              that.$set(that.coupon_list, index, temp);
              for(let i =0;i<that.coupon_list.length;i++){
                if(that.coupon_list[i].coupon_type_name == '平台商品'){
                  that.coupon_list[i].type = 1;
                }else if(that.coupon_list[i].coupon_type_name == '兑换券'){
                  that.coupon_list[i].type = 2;
                }else if(that.coupon_list[i].coupon_type_name == '分类商品'){
                  that.coupon_list[i].type = 3;
                }else if(that.coupon_list[i].coupon_type_name == '指定商品'){
                  that.coupon_list[i].type = 4;
                }else if(that.coupon_list[i].coupon_type_name == '酒店商品'){
                  that.coupon_list[i].type = 5;
                }else if(that.coupon_list[i].coupon_type_name == '门店商品'){
                  that.coupon_list[i].type = 6;
                }else if(that.coupon_list[i].coupon_type_name == '商品和门店'){
                  that.coupon_list[i].type = 8;
                }
              }
              that.$dialog.alert({message:"领取成功"});
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    //发起http请求
    getNetData() {
      var that = this;
      let json = { page: 1,coupon_type :that.typesIndex};
      $http
        .get(
          "coupon.member-coupon.coupons-for-member",
          json,
          "正在获取优惠券..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              var myData = response.data;
              for(let i =0;i<myData.data.data.length;i++){
                console.log(myData.data.data[i]);
                if(myData.data.data[i].coupon_type_name == '平台商品'){
                  myData.data.data[i].type = 1;
                }else if(myData.data.data[i].coupon_type_name == '兑换券'){
                  myData.data.data[i].type = 2;
                }else if(myData.data.data[i].coupon_type_name == '分类商品'){
                  myData.data.data[i].type = 3;
                }else if(myData.data.data[i].coupon_type_name == '指定商品'){
                  myData.data.data[i].type = 4;
                }else if(myData.data.data[i].coupon_type_name == '酒店商品'){
                  myData.data.data[i].type = 5;
                }else if(myData.data.data[i].coupon_type_name == '门店商品'){
                  myData.data.data[i].type = 6;
                }else if(myData.data.data[i].coupon_type_name == '商品和门店'){
                  myData.data.data[i].type = 8;
                }
              }
              
              that.total_page = response.data.data.last_page;
              that.coupon_list = myData.data.data;
              that.types = myData.search_array;
              that.slide_shows = myData.slide_shows;
              that.isLoading = false;
              if(response.data.coupon_form){
                that.coupon_form = response.data.coupon_form;
              }else{that.coupon_form ='';}
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    getMoreData(page) {
      var that = this;
      that.isLoadMore = false;
      console.log(this.page , this.total_page);
      if (this.page >= this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "coupon.member-coupon.coupons-for-member",
            {
              page: this.page,
              coupon_type :that.typesIndex,
              i: this.fun.getKeyByI(),
              type: this.fun.getTyep()
            },
            "正在获取更多..."
          )
          .then(
            function(response) {
              if (response.result == 1) {
                var myData = response.data;

                that.loading = false;
                that.allLoaded = false;
                for(let i =0;i<myData.data.data.length;i++){
                  console.log(myData.data.data[i]);
                  if(myData.data.data[i].coupon_type_name == '平台商品'){
                    myData.data.data[i].type = 1;
                  }else if(myData.data.data[i].coupon_type_name == '兑换券'){
                    myData.data.data[i].type = 2;
                  }else if(myData.data.data[i].coupon_type_name == '分类商品'){
                    myData.data.data[i].type = 3;
                  }else if(myData.data.data[i].coupon_type_name == '指定商品'){
                    myData.data.data[i].type = 4;
                  }else if(myData.data.data[i].coupon_type_name == '酒店商品'){
                    myData.data.data[i].type = 5;
                  }else if(myData.data.data[i].coupon_type_name == '门店商品'){
                    myData.data.data[i].type = 6;
                  }else if(myData.data.data[i].coupon_type_name == '商品和门店'){
                    myData.data.data[i].type = 8;
                  }
                }
                that.coupon_list = that.coupon_list.concat(myData.data.data); //数组拼接
                that.isLoadMore = true;
                if(response.data.coupon_form){
                  that.coupon_form = response.data.coupon_form;
                }else{that.coupon_form ='';}
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  activated() {
    // this.srcOne = require('../../assets/images/couponsbg_6@2x.png')
    this.toi = this.fun.getKeyByI();
    this.coupon_list = [];
    this.initData();
    this.getNetData();
  },
  components: { cTitle,Sticky }
};
