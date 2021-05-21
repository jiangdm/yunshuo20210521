<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="html-box" v-if="(datas.show_list && datas.show_list.length > 0) || datas.list.length > 0">
      <div id="membermerchant">
        <div class="title" @click="changeShow">
          <div style="display: flex;">
            <div class="spare"></div>
            <h3>{{ datas.title }}</h3>
          </div>
          <i v-show="datas.list_style == '2' && !show" style="flex: 1; text-align: right; font-size: 20px;" class="iconfont icon-member-top"></i>
        </div>

        <ul class="tool-box" v-if="datas.list_style == '1'">
          <li v-for="icon in datas.show_list" :key="icon.url" v-if="notShow.indexOf(icon.url) < 0" @click="pluginGoto(icon)">
            <i class="iconfont" :class="icon.class"></i>
            <div>{{ icon.title }}</div>
          </li>
          <li v-for="(item, index) in datas.list" :key="index" @click="gotoUrl(item)">
            <img class="diy-img" :src="item.image || emptyImage" alt="" />
            <div style="margin-top: 9px;">{{ item.text }}</div>
          </li>
        </ul>

        <ul class="tool-boxlis" v-if="datas.list_style == '2'" v-show="show">
          <li v-for="icon in datas.show_list" :key="icon.url" v-if="notShow.indexOf(icon.url) < 0" @click="pluginGoto(icon)">
            <div class="lis">
              <i class="iconfont" :class="icon.class" :style="{'fontSize': icon.class==='icon-fontclass-yuncang'?'20px':'28px'}"></i>
              <div>{{ icon.title }}</div>
            </div>
            <i class="iconfont icon-member_right"></i>
          </li>
          <li v-for="(item, index) in datas.list" :key="index" @click="gotoUrl(item)">
            <div class="lis">
              <img class="diy-img" :src="item.image || emptyImage" alt="" />
              <div style="margin-left: 5px;">{{ item.text }}</div>
            </div>
            <i class="iconfont icon-member_right"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from "@/assets/images/new_diy/image.png";
// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    const { preview_color, text_color } = this.datas;

    return `
      .component-${this.id} .html-box {
          background-color: ${preview_color.color};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ""});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
      }

      .component-${this.id} .html-box .tool-box, .component-${this.id} .html-box .tool-boxlis{
          color: ${text_color};
      }
  `;
  }
};

export default {
  props: ["id", "datas", "member_item", "notShow"],
  data() {
    return {
      emptyImage,
      show: true
    };
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  methods: {
    changeShow() {
      this.show = !this.show;
    },
    gotoUrl(item) {
      if (item.h5_link) {
        window.location.href = item.h5_link;
      }
    },
    pluginGoto(item) {
      if (item.name == "article") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            id: "0"
          })
        );
      } else if (item.name == "courier") {
        window.localStorage.setItem("couriername", item.title);
        this.$router.push(this.fun.getUrl(item.url));
      } else if (item.name == "supplier") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            uid: this.member_item.uid
          })
        );
      } else {
        this.$router.push(this.fun.getUrl(item.url));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  list-style: none;
  padding: 0;
  margin: 0;
}

// 默认
.component-wrapper {
  width: 100%;
}

.html-box {
  min-height: 30px;
}

#membermerchant {
  overflow: hidden;
  color: #333;

  .title {
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 14px;

    /* border: solid 1px #f3f3f3; */
  }

  .spare {
    width: 4px;
    height: 16px;
    border-radius: 1px;
    background-color: #f15353;
    margin-top: 11px;
    margin-right: 6px;
  }

  h3 {
    color: #333;
    text-align: left;
    font-size: 16px;
    box-sizing: border-box;
  }

  .tool-boxlis {
    display: -webkit-box;
    display: -webkit-flex;
    padding: 10px 0 10px 0;
    flex-direction: column;

    .lis {
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    .diy-img {
      width: 23px;
      height: 23px;
      margin: 6px;
      display: block;
    }

    li {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      margin-bottom: 10px;
      padding: 0 10px;

      .span {
        line-height: 30px;
      }
    }

    li i {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      color: #c9c9c9;
      line-height: 36px;

      /* margin-bottom: 4px; */
    }

    li .lis i {
      color: #f15353;
      margin-right: 5px;
      font-size: 25px;
    }
  }

  .tool-box {
    padding: 20px 0 10px 0;
    display: flex;
    flex-wrap: wrap;

    li {
      width: 25%;
      position: relative;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      margin-bottom: 10px;

      .span {
        line-height: 30px;
      }
    }

    .diy-img {
      width: 28px;
      height: 28px;
      margin: 6px auto;
      display: block;
    }

    li i {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      line-height: 36px;
      font-size: 20px;
      margin-bottom: 7px;
    }
    // 工具图标
    .iconfont {
      display: inline-block;
      font-size: 30px;
      color: rgb(241, 83, 83);
    }

    .icon-member-apply1 {
      background: url("../../assets/images/member/member_a(9).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-apply1::before {
      content: "";
    }

    .icon-member-supplier {
      background: url("../../assets/images/member/member_a(53).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-supplier::before {
      content: "";
    }

    .icon-fontclass-cefu {
      background: url("../../assets/images/member/member_a(129).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-cefu::before {
      content: "";
    }

    .icon-fontclass-shipindati {
      background: url("../../assets/images/member/member_a(135).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-shipindati::before {
      content: "";
    }

    .icon-fontclass-manghe {
      background: url("https://www.yunzmall.com/min_img/member/member_a(139).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-manghe::before {
      content: "";
    }

    .icon-fontclass-zitidian {
      background: url("../../assets/images/member/member_a(130).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-zitidian::before {
      content: "";
    }

    .icon-fontclass-xiaoshoubaobiao {
      background: url("../../assets/images/member/member_a(128).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-xiaoshoubaobiao::before {
      content: "";
    }

    .icon-member-replenishment {
      background: url("../../assets/images/member/member_a(67).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-replenishment::before {
      content: "";
    }

    .icon-member-express-list {
      background: url("../../assets/images/member/member_a(68).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-express-list::before {
      content: "";
    }

    .icon-member-hotel-apply {
      background: url("../../assets/images/member/member_a(56).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-hotel-apply::before {
      content: "";
    }

    .icon-member_appointment {
      background: url("../../assets/images/member/member_a(85).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_appointment::before {
      content: "";
    }

    .icon-member_hotel {
      background: url("../../assets/images/member/member_a(56).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_hotel::before {
      content: "";
    }

    .icon-member-store-apply1 {
      background: url("../../assets/images/member/member_a(27).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-store-apply1::before {
      content: "";
    }

    .icon-member_store {
      background: url("../../assets/images/member/member_a(26).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_store::before {
      content: "";
    }

    .icon-member-cashier {
      background: url("../../assets/images/member/member_a(34).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-cashier::before {
      content: "";
    }

    .icon-member-mendian1 {
      background: url("../../assets/images/member/member_a(40).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-mendian1::before {
      content: "";
    }

    .icon-delivery_order {
      width: 1.75rem;
      height: 1.75rem;
      margin-bottom: 0.11em;
    }

    .icon-service_station {
      width: 1.75rem;
      height: 1.75rem;
      margin-bottom: 0.11em;
    }

    .icon-member_voice_center {
      background: url("../../assets/images/member/member_a(75).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_voice_center::before {
      content: "";
    }

    .icon-member_installment_buycar {
      background: url("../../assets/images/member/member_a(80).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_installment_buycar::before {
      content: "";
    }

    .icon-member_place_apply {
      background: url("../../assets/images/member/member_a(77).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_place_apply::before {
      content: "";
    }

    .icon-member_auctionofficer_apply {
      background: url("../../assets/images/member/member_a(96).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_auctionofficer_apply::before {
      content: "";
    }

    .icon-member_auctionofficer_apply {
      background: url("../../assets/images/member/member_a(96).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_auctionofficer_apply::before {
      content: "";
    }

    .icon-fontclass-anzhuangfuwuhy {
      background: url("https://www.yunzmall.com/min_img/member/member_a(144).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-anzhuangfuwuhy::before {
      content: "";
    }

    .icon-member_auctionofficer_admin {
      background: url("../../assets/images/member/member_a(97).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_auctionofficer_admin::before {
      content: "";
    }

    .icon-member_auctionofficer_index {
      background: url("../../assets/images/member/member_a(98).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_auctionofficer_index::before {
      content: "";
    }

    .icon-member_branch {
      background: url("../../assets/images/member/member_a(101).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_branch::before {
      content: "";
    }

    .icon-member_host_application {
      background: url("../../assets/images/member/member_a(91).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_host_application::before {
      content: "";
    }

    .icon-member_meeting_active {
      background: url("../../assets/images/member/member_a(88).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_meeting_active::before {
      content: "";
    }

    .icon-fontclass-yuncang {
      background: url("../../assets/images/member/member_a(125).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-yuncang::before {
      content: "";
    }
  }
}
</style>
