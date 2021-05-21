<!-- 微信分享指导 文字提示可自定义 -->
<!-- demo:  <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img> -->
<template>
  <div id="yz_wechatShareImg">
    <div v-if="showWechatshar" @click="onClick" class="yz_wechatShareImg-main">
      <img src="../../assets/images/wn_zhishi@2x.png" alt="" />
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "showWechatshar",
    event: "onEmit"
  },
  props: {
    //提示文字
    text: {
      type: String,
      default: "请点击右上角进行分享"
    },
    //按钮是否显示，默认不显示
    showWechatshar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  methods: {
    onClick() {
      this.$emit("onEmit", false);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_wechatShareImg {
  .yz_wechatShareImg-main {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;

    img {
      position: absolute;
      top: 1.5rem;
      right: 1rem;
      width: 4rem;
    }

    p {
      position: fixed;
      top: 40%;
      width: 100%;
      text-align: center;
      font-size: 1.25rem;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
