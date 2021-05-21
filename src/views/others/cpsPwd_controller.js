import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      num: 1,
      arr: [],
      bonus_data: {},
      id: '',
      setTime: '',
      info:[],
      datas:[]
    };
  },
  activated() {
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '查询订单中请稍等',
    });
    console.log(this.$route.params);
    this.id = this.$route.params.order_id;
    this.setTime = setInterval(() => {
      this.getdata();
    }, 2000);
  },
  deactivated() {
    console.log('离开了');
    Toast.clear();
    clearInterval(this.setTime);
  },
  mouted() {

  },
  methods: {
    onCopy(){
      Toast({
        message: '复制成功',
        position: 'bottom',
        duration: 1000
      });
    },
    onError: function (e) {
      Toast({
        message: '复制失败',
        position: 'bottom',
        duration: 1000
      });
    },
    getdata() {
      let that = this;
      $http
        .get(
          'plugin.aggregation-cps.api.equity.order-detail',
          {
            order_id: that.id
          },
        )
        .then(
          response => {
            if (response.result == 1) {
              console.log(response.data, '成功取消setInterval');
              that.info = response.data.coupon_info.coupons[0];
              that.datas = response.data;
              clearInterval(that.setTime);
              Toast.clear();
            } else {
              console.log('失败',response);
              // Toast(response.msg);
            }
          },
        )
        .catch(err => {
          console.error(err);
        });
    },
  },
  components: {
    cTitle,
  }
};