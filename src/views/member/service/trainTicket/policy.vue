<template>
  <div id="policy" :class="'policy'+$store.state.service.lang">
    <c-title :hide="false" text='保单'></c-title>
    <div style="height: 40px;"></div>
    <ul class="plocyDetail">
      <li>
        <label>保单号</label>
        <div>成人票</div>
      </li>
      <li>
        <label>保险公司</label>
        <div>明亚保险</div>
      </li>
      <li>
        <label>保险类型</label>
        <div>交通工具意外险2元</div>
      </li>
    </ul>

  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  components: { cTitle },
  data() {
    return {
      language: {}
    };
  },
  methods: {
    //初始化语言
    initLang() {
      if (sessionStorage.languageService) {
        this.language = JSON.parse(sessionStorage.languageService).trainSearchResults;
      } else {
        this.language = this.$store.state.service.languageService.trainSearchResults;
      }
    }
  },
  //实时监测this.$store.state.service.chinese的变化，获取最新的语言包
  computed: {
    getLangState() {
      return this.$store.state.service.languageService;
    }
  },
  watch: {
    getLangState(val) {
      if (val) {
        this.language = JSON.parse(sessionStorage.languageService).trainSearchResults;
      } else {
        this.language = this.$store.state.service.languageService.trainSearchResults;
      }
    }
  },

  mounted() {
    this.initLang();
  },

  activated() {
    this.$store.commit("onload");
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .policych {
    ul {
      margin-top: 0.625rem;
      background-color: #fff;
      padding-left: 0.875rem;
    }

    li:last-child {
      border: none;
    }

    li {
      display: flex;
      flex-flow: row;
      height: 2.8125rem;
      line-height: 2.8125rem;
      font-size: 16px;
      padding-right: 0.875rem;
      background: #fff;
      border-bottom: solid 0.0625rem #ebebeb;

      label {
        width: 6.25rem;
        text-align: left;
      }

      div {
        flex: 1;
        text-align: left;
        color: #8c8c8c;
      }
    }
  }

  .policywei {
    li {
      display: flex;
      flex-flow: row;
      height: 2.8125rem;
      line-height: 2.8125rem;
      font-size: 16px;
      margin-bottom: 0.625rem;
      padding: 0 0.9375rem;
      background: #fff;

      label {
        width: 5rem;
        text-align: right;
        order: 2;
      }

      div {
        flex: 1;
        order: 1;
        text-align: right;
      }
    }
  }
</style>