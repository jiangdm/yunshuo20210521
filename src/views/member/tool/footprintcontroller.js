import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      integral: window.localStorage.integral || '积分',
      checkList: [],
      datas: [],
      checkAll: false
    };
  },

  activated() {
    this.getData();
  },

  mounted() {
  },
  methods:{
    getData() {
      let that = this;

      let json = { "i": this.fun.getKeyByI(), "type": this.fun.getTyep() };
      $http.get('member.member-history.index', json).then(function (response) {
        console.log(response);
        if (response.result == 1) {
          that.datas = response.data;
        }

      }, function (response) {
        console.log(response);
      });
    },

    delteteItem(item, i) {
      console.log(i);
      let that = this;
      let json = { id: item.id, "i": this.fun.getKeyByI(), "type": this.fun.getTyep() };

      $http.get('member.member-history.destroy', json, "处理中...").then(function (response) {
        console.log(response);
        if (response.result == 1) {
          that.datas.splice(i, 1);
          Toast("操作成功");
        } else {
          Toast(response.msg);
        }

      }, function (response) {
        console.log(response);
      });

    },

    toItem(item) {
      if(item.owner_id != 0){
        this.$router.push(this.fun.getUrl('goodsO2O',{id: item.goods.id,tag:"o2o",store_id:item.owner_id}));

      }else{
        this.$router.push(this.fun.getUrl('goods',{id: item.goods.id}));
      }
    }
  },
  components: { cTitle }
};