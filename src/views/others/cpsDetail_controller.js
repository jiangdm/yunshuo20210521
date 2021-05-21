import cTitle from "components/title";
import { Toast } from 'vant';
export default{
  data(){
    return{
      id:'',
      info:[],
      num:1
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.getdata();
  },
  mouted(){

  },
  methods: {
    submit(){
      let that = this;
      if(this.info.type == '1'){
        if(this.num > 1){
          Toast('直冲只支持单个购买');
          return;
        }
      }
      if(this.info.status == '2'){
        console.log('111111111111111');
        Toast('商品已售罄');
        return;
      }

      that.$router.push(
        that.fun.getUrl(
          "goodsorder",
          {},
          {
            tag: '-2',
            goodsId: that.info.goods_id,
            optionsId: '',
            total: that.num,
            iscps:true,
            cpstype:that.info.type
          }
        )
      );
    },
    goHome(){
      this.$router.push(this.fun.getUrl("home", {}));
    },
    goOrder(){
      this.$router.push(this.fun.getUrl("orderlist", { status: "0" }));
    },
    add(){
      this.num = Number(this.num) + 1;
    },
    cut(){
      this.num = Number(this.num) - 1;
    },
    getdata() {
      let that = this;
      $http
        .get(
          'plugin.aggregation-cps.api.equity.goods-detail',
          {
            id: that.id
          },
          ''
        )
        .then(
          response => {
            if (response.result == 1) {
              console.log(response.data);
              that.info = response.data;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: { 
    cTitle,
   
  }
};