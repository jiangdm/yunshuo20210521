import cTitle from 'components/title';
import yzBlank from 'components/ui_components/yz_blank';
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      value: '',
      express_info: [],
      company_name: '',
      express_sn: '',
      thumb: '',
      tel: '',
      status_name: '',
      // 多包裹id
      order_express_id: ''

    };
  },
  methods: {
    init() {
      this.company_name = '';
      this.express_sn = '';
      this.express_info = [];
      this.tel = '';
      this.status_name = '';
      this.thumb = '';
    },
    getExpress() {
      var that = this;
      console.log(that);
      $http.get(that.api, {
        order_id: this.$route.params.id,
        order_express_id: this.order_express_id ? this.order_express_id : '',//添加多一个多包裹id参数
        "i": this.fun.getKeyByI(),
        "type": this.fun.getTyep()
      }, '正在获取快递信息...').then(function (response) {

        if (response.result === 1) {
          var myData = response.data;
          that.company_name = myData.company_name;
          that.express_sn = myData.express_sn;
          that.express_info = myData.data;
          that.tel = myData.tel;
          that.status_name = myData.status_name;
          that.thumb = myData.thumb;

        } else {
          that.$dialog.alert({message:response.msg});

        }
      }, function (response) {
        // error callback
      });

    },

  },
  activated() {
    this.init();
    this.toi = this.fun.getKeyByI();
    if (this.$route.params.fromGrab === 1) {
      this.api = this.$route.params.api;
    } else {
      this.api = 'dispatch.express';
    }
    this.order_express_id = this.$route.params.order_express_id;
    this.getExpress();
  },
  components: {
    cTitle, yzBlank
  }
};