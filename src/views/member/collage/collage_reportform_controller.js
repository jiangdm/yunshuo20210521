
import cTitle from "./components/title";
import { Toast } from 'vant';
export default {
  components:{cTitle},
  data(){
    return{
      activeIndex:0,
      bouns:null
    };
  },
  created(){
    this.getData();
  },
  methods:{
    changeVanTabIndex(index){
      console.log(index);
      this.getData();
    },
    async getData(){
      Toast.loading({
        message: '请稍等',
        forbidClick: true,
      });
      let res = await $http
        .get("plugin.collage.api.income.index", {
          getBonus:"getBonus",
          data_type:(this.activeIndex+1)
        });
      Toast.clear();
      if(res.result != 1){
        Toast(res.msg);
        return;
      }
      this.bouns = res.data.getBonus;
      console.log(res.data.getBonus);
    }
  }
};





