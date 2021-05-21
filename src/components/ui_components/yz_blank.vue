<!-- 空白显示组件 可自定义图片、文字、按钮-->
<template>
  <div id="yz_blank" v-if="this.fun.isTextEmpty(datas)">
    <div v-if="!this.$store.state.isloadding && this.fun.isTextEmpty(datas)">
      <img :src="image" class="noData_imgs" alt="" />
      <p class="noData_text">{{ text }}</p>
      <router-link :to="fun.getUrl(tolink, Params, Query)" tag="span" class="noData_btn" v-if="isBtn">{{ btnText }}</router-link>
    </div>
    <p v-show="this.$store.state.isloadding" class="noData_text">正在加载中.....</p>
  </div>
</template>

<script>
export default {
  props: {
    //数据，为空才显示
    datas: {
      type: [String, Object, Array]
    },
    //图片地址
    image: {
      type: String,
      default: require("../../assets/images/energytank_blank@2x.png")
    },
    //提示文字
    text: {
      type: String,
      default: "暂无信息"
    },
    //按钮是否显示，默认不显示
    isBtn: {
      type: Boolean,
      default: false
    },
    //按钮显示文字
    btnText: {
      type: String,
      default: "返回"
    },
    //按钮跳转链接
    tolink: {
      type: String,
      default: ""
    },
    //Params参数
    Params: {
      type: Object,
      default: () => ({})
    },
    //Query参数
    Query: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },

  components: {},
  computed: {},
  methods: {
    routerAdress() {}
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_blank {
  margin: 2rem auto;
  text-align: center;

  .noData_imgs {
    width: 80%;
  }

  .noData_text {
    color: #999;
    margin: 1.5rem 0;
  }

  .noData_btn {
    display: block;
    width: 12rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: 2rem;
    font-size: 1rem;
    background-image: -webkit-linear-gradient(bottom, #ff8a66, #ff6260, #ff6260);
    color: #fff;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
