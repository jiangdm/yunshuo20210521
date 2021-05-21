import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      transferID: '',
      transferIntegral: '',
      integral: {}
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.transferIntegral = '';
      this.transferID = '';
      this.integral = {};
    },
    getData() {
      $http
        .get('plugin.integral.Frontend.Controllers.Page.transfer-love', {}, ' ')
        .then(response => {
          if (response.result === 1) {
            this.integral = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    sureTransfer() {
      if (!this.transferIntegral) {
        Toast('请输入转让数额');
        return;
      }
      if (Number(this.transferIntegral) > Number(this.integral.member_integral)) {
        Toast(`输入的${this.integral.member_integral}数额超过已有的` + this.integral.member_integral);
        return;
      }
      $http
        .get(
          'plugin.integral.Frontend.Modules.Integral.Controllers.Transfer.love-transformation',
          {
            change_value: this.transferIntegral,
            recipient_id: this.transferID
          },
          '转让中'
        )
        .then(response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl('Integral_love_detail'));
            Toast('转化成功');
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
