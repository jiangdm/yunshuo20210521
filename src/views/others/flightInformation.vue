<template>
  <div id="flightInformation">
    <c-title :hide="false" :text="'航班信息收集'"> </c-title>
    <div style="height: 40px;"></div>
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <img :src="banner_one.img_url" alt="" @click="linkUrl(banner_one.link)" />
        </van-swipe-item>
        <van-swipe-item v-if="banner_two.img_url">
          <img :src="banner_two.img_url" alt="" @click="linkUrl(banner_two.link)"/>
        </van-swipe-item>
        <van-swipe-item v-if="banner_three.img_url">
          <img :src="banner_three.img_url" alt="" @click="linkUrl(banner_three.link)"/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="isForm">
      <div class="title">
        <div class="left">
          <div class="line"></div>
          填写表单
        </div>
        <span @click="show = true">说明</span>
      </div>
      <div class="formConten">
        <c-dyPopup v-if="dyFormPopup" :datas="dfData" :form_id="goodDYDormID" :status="true" ref="gofunarr" v-on:gofunarr="dfsave" :identification="true"></c-dyPopup>
      </div>
    </div>
    <div class="selectBox" @click="columnsShow = true">
      <div class="boxCen"><span>*</span>{{ start_name && destination_name && flight_name ? start_name + "-" + destination_name + "-" + flight_name : "请选择航班信息" }}</div>
      <van-icon name="arrow-down" />
    </div>
    <div class="btns" v-if="info.is_submit" @click="gofunarr">提交</div>
    <div class="btns_no" v-else>提交</div>
    <van-popup v-model="show">
      <div class="popbox set-pc-style">
        <div class="title">说明</div>
        <div class="contenTxt" v-html="info.information"></div>
      </div>
      <div class="is_icon">
        <i class="iconfont icon-adsystem_icon_cancle" @click="show = false"></i>
      </div>
    </van-popup>
    <van-popup v-model="columnsShow" position="bottom">
      <van-picker :columns="columns" show-toolbar ref="selectItem">
        <template #default>
          <div class="diyTitle">
            <div class="tapBtn">
              <span @click="columnsShow = false">取消</span>
              <span style="color: #f14e4e;" @click="onConfirm">确认</span>
            </div>
            <div class="selection">
              <span>起始地</span>
              <span>目的地</span>
              <span>航班号</span>
            </div>
          </div>
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>
<script>
import flightInformation_controller from "./flightInformation_controller";

export default flightInformation_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#flightInformation {
  padding-bottom: 2rem;
  background: #fff;

  /deep/ .van-picker-column__item--selected {
    color: #f14e4e;
    font-size: 1.2rem;
  }

  /deep/.van-picker__toolbar {
    height: 100% !important;
  }

  .diyTitle {
    width: 100%;

    .selection {
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 1rem;
      color: #4d4d4d;
      margin-top: 1.63rem;
      margin-bottom: 1.1rem;
    }

    .tapBtn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 1.03rem;
      padding-right: 0.84rem;
      font-size: 1rem;
      color: #999;
      margin-top: 0.91rem;
    }
  }

  .van-popup {
    background-color: transparent !important;
  }

  .is_icon {
    margin-top: 1rem;
  }

  .van-popup i {
    color: #fff;
    font-size: 2.5rem;
  }

  .popbox {
    width: 18.78rem;
    height: 23.75rem;
    background-color: #fff;
    border-radius: 0.31rem;
    padding: 0 1.28rem;
    padding-top: 1.75rem;
    position: relative;
    overflow: hidden;

    .title {
      font-size: 1rem;
      color: #161615;
      text-align: center;
    }

    .contenTxt {
      height: 17rem;
      overflow-y: scroll;
      text-align: left;
      margin-top: 1.19rem;

      /deep/ img {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }

  .btn {
    width: 20rem;
    height: 2.5rem;
    background-color: #c9c9c9;
    border-radius: 1.25rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .btns {
    width: 20rem;
    height: 2.5rem;
    background-color: #f14e4e;
    border-radius: 1.25rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .btns_no {
    width: 20rem;
    height: 2.5rem;
    background-color: #c9c9c9;
    border-radius: 1.25rem;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .selectBox {
    width: 21.56rem;
    height: 2.38rem;
    border-radius: 0.31rem;
    border: solid 0.03rem #959595;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.72rem;
    padding-right: 0.81rem;
    box-sizing: border-box;
    margin-bottom: 3.06rem;

    .boxCen {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.94rem;
    }

    span {
      font-size: 2rem;
      margin-top: 0.7rem;
      margin-right: 0.53rem;
      color: #f14e4e;
    }
  }

  .banner {
    width: 23.44rem;

    img {
      width: 23.44rem;
      height: 0 auto;
    }
  }

  .isForm {
    .formConten {
      padding-top: 0.78rem;
      padding-bottom: 1.25rem;
    }

    .title {
      display: flex;
      justify-content: space-between;
      padding: 0 0.94rem;
      padding-top: 1.44rem;
      align-items: center;

      .left {
        display: flex;
        align-items: center;
        font-size: 1.06rem;

        span {
          font-size: 0.94rem;
          color: #666;
        }
      }

      .line {
        width: 0.13rem;
        height: 0.75rem;
        background-color: #f14e4e;
        border-radius: 0.06rem;
        margin-right: 0.47rem;
      }
    }
  }
}
</style>
