import cTitle from 'components/title';

export default {
  data() {
    return {
      packagesList: [],
      order_id: ''
    };
  },

  methods: {
    // 获取多包裹列表信息
    getPackagesList() {
      let that = this;
      console.log(that.order_id);
      $http
        .get('dispatch.express.getOrderMultiplePackages', { order_id: that.order_id }, '正在获取多包裹...')
        .then(
          function(response) {
            console.log(response);
            if (response.result === 1) {
              that.packagesList = response.data;
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    // 跳转物流详情页
    toLogistics(order_express_id) {
      let that = this;
      this.$router.push(
        this.fun.getUrl('logistics', {
          id:that.order_id,
          order_express_id
        })
      );
    }
  },

  activated() {
    this.order_id = this.$route.params.order_id;//接受orderList传送过来的订单id
    this.getPackagesList();
  },

  components: { cTitle }
};

