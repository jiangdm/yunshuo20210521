<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="html-box" v-if="(datas.show_list && datas.show_list.length > 0) || datas.list.length > 0">
      <div id="membermarket">
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
            <div class="Badge" v-if="icon.total > 0">{{ icon.total > 99 ? "99+" : icon.total }}</div>
          </li>
          <li v-for="(item, index) in datas.list" :key="index" @click="gotoUrl(item)">
            <img class="diy-img" :src="item.image || emptyImage" alt="" />
            <div style="margin-top: 9px;">{{ item.text }}</div>
          </li>
        </ul>

        <ul class="tool-boxlis" v-if="datas.list_style == '2'" v-show="show">
          <li v-for="icon in datas.show_list" :key="icon.url" v-if="notShow.indexOf(icon.url) < 0" @click="pluginGoto(icon)">
            <div class="lis">
              <i class="iconfont" :class="icon.class" style="font-size: 28px;"></i>
              <div>{{ icon.title }}</div>
              <div class="Badge" v-if="icon.total > 0">{{ icon.total > 99 ? "99+" : icon.total }}</div>
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
      } else if (item.name == "m-erweima") {
        this.openQrCode("block");
      } else {
        this.$router.push(this.fun.getUrl(item.url, { selected: "1" }));
      }
    },
    openQrCode(e) {
      this.$emit("openQrCode", e);
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

#membermarket {
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
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      margin-bottom: 10px;
      padding: 0 10px;
      position: relative;

      .span {
        line-height: 30px;
      }

      .Badge {
        height: 0.875rem;
        line-height: 0.875rem;
        font-size: 0.75rem;
        color: #fff;
        padding: 0 0.25rem;
        border-radius: 1rem;
        background-color: #f15353;
        position: absolute;
        top: 0.75rem;
        right: 12%;
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

      .Badge {
        height: 0.875rem;
        line-height: 0.875rem;
        font-size: 0.75rem;
        color: #fff;
        padding: 0 0.25rem;
        border-radius: 1rem;
        background-color: #f15353;
        position: absolute;
        top: -5px;
        left: 55%;
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

    .icon-member-bank-list1 {
      background: url("../../assets/images/member/member_a(29).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-bank-list1::before {
      content: "";
    }

    .icon-member-collect1 {
      background: url("../../assets/images/member/member_a(41).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-collect1::before {
      content: "";
    }

    .icon-member-get-up {
      background: url("../../assets/images/member/member_a(47).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-get-up::before {
      content: "";
    }

    .icon-member-act-signup1 {
      background: url("../../assets/images/member/member_a(15).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-act-signup1::before {
      content: "";
    }

    .icon-fontclass-shequmendian {
      background: url("../../assets/images/member/member_a(155).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-shequmendian::before {
      content: "";
    }

    .icon-member-course3 {
      background: url("../../assets/images/member/member_a(22).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-course3::before {
      content: "";
    }

    .icon-member_goods {
      background: url("../../assets/images/member/member_a(52).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_goods::before {
      content: "";
    }

    .icon-card {
      background: url("../../assets/images/member/member_a(57).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-card::before {
      content: "";
    }

    .icon-member-recharge1 {
      background: url("../../assets/images/member/member_a(3).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-recharge1::before {
      content: "";
    }

    .icon-member_my-friend {
      background: url("../../assets/images/member/member_a(63).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_my-friend::before {
      content: "";
    }

    .icon-fontclass-tuoke {
      background: url("../../assets/images/member/member_a(136).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-tuoke::before {
      content: "";
    }

    .icon-member_card1 {
      background: url("../../assets/images/member/member_a(58).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_card1::before {
      content: "";
    }

    .icon-extension_goods_order {
      background: url("../../assets/images/member/member_a(59).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-extension_goods_order::before {
      content: "";
    }

    .icon-member_my-card {
      background: url("../../assets/images/member/member_a(64).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_my-card::before {
      content: "";
    }

    .icon-member_material {
      background: url("../../assets/images/member/member_a(65).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_material::before {
      content: "";
    }

    .icon-member-help {
      background: url("../../assets/images/member/member_a(2).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-help::before {
      content: "";
    }

    .icon-member-clock1 {
      background: url("../../assets/images/member/member_a(30).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member-clock1::before {
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

    .icon-declaration_system {
      background: url("../../assets/images/member/member_a(66).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-declaration_system::before {
      content: "";
    }

    .icon-order_system {
      background: url("../../assets/images/member/member_a(70).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-order_system::before {
      content: "";
    }

    .icon-fontclass-erweima {
      background: url("../../assets/images/member/tool_a(2).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-erweima::before {
      content: "";
    }

    .icon-fontclass-pinglun {
      background: url("../../assets/images/member/tool_a(4).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-pinglun::before {
      content: "";
    }

    .icon-fontclass-youhuiquan {
      background: url("../../assets/images/member/tool_a(7).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-youhuiquan::before {
      content: "";
    }

    .icon-member_mygroup {
      background: url("../../assets/images/member/member_a(72).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_mygroup::before {
      content: "";
    }

    .icon-extension_video {
      background: url("../../assets/images/member/member_a(73).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-extension_video::before {
      content: "";
    }

    .icon-member_changer_centre {
      background: url("../../assets/images/member/member_a(74).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_changer_centre::before {
      content: "";
    }

    .icon-member_live_normal {
      background: url("../../assets/images/member/member_a(92).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_live_normal::before {
      content: "";
    }

    .icon-member_community {
      background: url("../../assets/images/member/member_a(74).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_community::before {
      content: "";
    }

    .icon-member_advertise_market {
      background: url("../../assets/images/member/member_a(84).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_advertise_market::before {
      content: "";
    }

    .icon-member_bonus_pools {
      background: url("../../assets/images/member/member_a(81).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_bonus_pools::before {
      content: "";
    }

    .icon-member_ejiayou {
      background: url("../../assets/images/member/member_a(103).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_ejiayou::before {
      content: "";
    }

    .icon-member_bonus_pools::before {
      content: "";
    }

    .icon-member_area_search {
      background: url("../../assets/images/member/member_a(121).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_area_search::before {
      content: "";
    }

    .icon-member_mygroupbuy {
      background: url("../../assets/images/member/member_a(122).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_mygroupbuy::before {
      content: "";
    }

    .icon-member_questionsurvey {
      background: url("../../assets/images/member/member_a(111).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_questionsurvey::before {
      content: "";
    }

    .icon-member_groupbuy {
      background: url("../../assets/images/member/member_a(123).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_groupbuy::before {
      content: "";
    }

    .icon-fontclass-kehu {
      background: url("../../assets/images/member/tool_a(3).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-kehu::before {
      content: "";
    }

    .icon-fontclass-tihuoka {
      background: url("../../assets/images/member/member_a(127).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-tihuoka::before {
      content: "";
    }

    .icon-fontclass-anliku {
      background: url("../../assets/images/member/member_a(132).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-anliku::before {
      content: "";
    }

    .icon-fontclass-waikan {
      background: url("../../assets/images/member/member_a(153).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-waikan::before {
      content: "";
    }

    .icon-member_installserver {
      background: url("../../assets/images/member/member_a(114).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_installserver::before {
      content: "";
    }

    .icon-member_active {
      background: url("../../assets/images/member/member_a(100).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_active::before {
      content: "";
    }

    .icon-member_active_search {
      background: url("../../assets/images/member/member_a(99).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_active_search::before {
      content: "";
    }

    .icon-member_team_salereturn {
      background: url("../../assets/images/member/member_a(87).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_team_salereturn::before {
      content: "";
    }

    .icon-member_installserverapply {
      background: url("../../assets/images/member/member_a(113).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_installserverapply::before {
      content: "";
    }

    .icon-member_chamber {
      background: url("../../assets/images/member/member_a(66).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_chamber::before {
      content: "";
    }

    .icon-member_group_livecode {
      background: url("../../assets/images/member/member_a(110).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-member_group_livecode::before {
      content: "";
    }

    .icon-fontclass-yunkucun {
      background: url("../../assets/images/member/member_a(140).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-yunkucun::before {
      content: "";
    }

    .icon-fontclass-shengjima {
      background: url("../../assets/images/member/member_a(141).jpeg") no-repeat center;
      background-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .icon-fontclass-shengjima::before {
      content: "";
    }

    .icon-fontclass-quanzi2 {
      background: url("../../assets/images/extension/member_a(146).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-quanzi2::before {
      content: "";
    }

    .icon-fontclass-quanguojiayou {
      background: url("../../assets/images/member/member_a(151).png") no-repeat center;
      background-size: 28px;
      width: 100%;
      margin-bottom: 4px;
    }

    .icon-fontclass-quanguojiayou::before {
      content: "";
    }
  }
}
</style>
