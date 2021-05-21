<template>
  <div id="tokerCode">
    <c-title :hide="false" text="拓客卡"></c-title>
    <div style="width: 100%; height: 40px;"></div>
    <div class="code">
      <span>请商家扫码</span>
      <div class="viewbox">
        <canvas id="qrccode-canvas"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from "components/title";
import QRCode from "qrcode";
var canvas = "";
export default {
  data() {
    return {
      id:''
    };
  },
  activated() {
    let id = this.$route.params.id;
    this.id = id ;
  },
  mounted() {
    this.$nextTick(function () {
      // DOM操作
      canvas = document.getElementById("qrccode-canvas");
      this.createQrc(this.id);
    });
  },
  methods: {
    createQrc(id) {
      let _url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/tokerMerchant/" + id + "?i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + this.fun.getKeyByMid();
      console.log(_url);
      QRCode.toCanvas(canvas, _url, error => {
        if (error) {
          console.log(err);
        } else {
          console.log("success");
          this.show = true;
        }
      });
    }
  },
  components: {
    cTitle
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.code {
  margin-top: 3.16rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .viewbox {
    margin-top: 1.13rem;
  }
}
</style>