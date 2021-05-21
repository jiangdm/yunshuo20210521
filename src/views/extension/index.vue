<template>
  <div>
    <div v-show="template">
      <!--<c-title :hide="true" :text="$i18n.t('extension.我的推广')"></c-title>-->

      <!-- 优化推广中心 -->
      <div id="extension-box">
        <div id="header">
          <div class="top">
            <div class="img">
              <img :src="userInfo.avatar"
                   style="width: 100%; height: 100%;"/>
            </div>
            <ul class="header-info">
              <li class="header-name">{{ userInfo.nickname }}</li>
              <li v-if="show_member_id != 1">
                <span>[{{$i18n.t("extension.会员")}}ID：{{ userInfo.member_id }}]</span>
              </li>
            </ul>
            <div class="share"
                 @click="toPage('MyIncome')"
                 v-if="shareShow">
              <i class="iconfont icon-extension_code"></i>
              <span>{{income_name_text}}{{$i18n.t("extension.分享")}}</span>
            </div>
          </div>
          <div class="income">
            <ul>
              <li class="header-top">{{$i18n.t("extension.累计")}}{{income_name_text}}</li>
              <li>
                <small>{{$i18n.t("money")}}</small>
                {{ userInfo.grand_total }}
              </li>
            </ul>
            <ul class="right">
              <li class="header-top">{{$i18n.t("extension.可")}}{{this.fun.initWithdrawal()}}{{income_name_text}}</li>
              <li>
                <small>{{$i18n.t("money")}}</small>
                {{ userInfo.usable_total }}
              </li>
            </ul>
            <div class="btn"
                 @click="gotoIncome"
                 v-if="userInfo.auto_withdraw == 0&&withdraw_date&&!withdraw_date.disable"
                 style="position: relative;">

              <button type="button">
                {{$i18n.t("extension.去")}}{{this.fun.initWithdrawal()}}<i class="fa fa-angle-right"></i>
              </button>
            </div>
            <div class="btn"
                 v-if="userInfo.auto_withdraw!=0&&withdraw_date&&!withdraw_date.disable">
              <button type="button"
                      style="background-color: #ccc;">
                {{ userInfo.auto_withdraw }}{{$i18n.t("extension.日自动")}}{{this.fun.initWithdrawal()}}
                <i class="fa fa-angle-right"></i>
              </button>
            </div>
            <div class="btn"
                 @click="toToast"
                 v-if="withdraw_date&&withdraw_date.disable"
                 style="position: relative; width: 26%;">

              <button type="button" style="background-color: #ccc;">
                {{withdraw_date.day}}号可提现<i class="fa fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>

        <ul id="detail">
          <li @click="toPage('myEarnings')"
              v-if="showEarning">
            <i class="iconfont icon-extension_receive"></i>
            <span>{{$i18n.t("extension.领取收益")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li @click="toPage('incomedetails')">
            <i class="iconfont icon-member_integral"></i>
            <span>{{income_name_text}}{{$i18n.t("extension.明细")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li @click="toPage('presentationRecord')">
            <i class="iconfont icon-member-withdrawals1"></i>
            <span>{{this.fun.initWithdrawal()}}{{$i18n.t("extension.明细")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li @click="toPage('Performance')"
              v-if="is_show_performance">
            <i class="iconfont icon-extension_collect"></i>
            <span>{{$i18n.t("extension.营业额")}}</span>
            <i class="fa fa-angle-right"></i>
          </li>
          <li v-if="is_show_limit">
            <i class="iconfont icon-cord_erdutixian"></i>
            <span>当前提现额度{{amount_num}}</span>
          </li>
        </ul>

        <!-- 权限插件模版 -->
        <div id="power">
          <div class="title">
            <div class="spare"></div>
            <h1>{{$i18n.t("extension.权限")}}</h1>
          </div>

          <!--  模板2 -->
          <div class="plugg"
               v-if="template === '02'">
            <div class="plug-list"
                 v-for="(item,i) in extension"
                 @click="gotoPage(item)" :key='i'>
              <i class="iconfont"
                 :class="item.icon"></i>
              <ul class="left">
                <li class="left_a">{{ item.title }}</li>
                <li class="left_b"
                    v-if="
                  item.level == null ||
                  item.level == '' ||
                  item.level == undefined
                    ? false
                    : true
                ">
                  {{ item.level }}
                </li>
                <li class="left_b"
                    v-if="
                  item.level == null ||
                  item.level == '' ||
                  item.level == undefined
                    ? true
                    : false
                "></li>
                <li class="left_c"><span>{{$i18n.t("money")}}</span>{{ item.value }}</li>
              </ul>
            </div>
          </div>
          <!-- 模板2end -->

          <div class="plugg"
               v-if="template !== '02'">
            <div class="plug-list"
                 v-for="(item,i) in extension"
                 @click="gotoPage(item)"
                 :key='i'>
              <ul class="left">
                <li class="icon">
                  <i class="iconfont"
                     style="font-size: 2.5rem; color: #f15353;"
                     :class="item.icon"></i>
                </li>
                <li class="info">
                  <div class="top">
                    <span class="name">{{ item.title }}</span>
                  </div>
                  <div class="grade">
                    <span v-if="
                      item.level == null ||
                      item.level == '' ||
                      item.level == undefined
                        ? false
                        : true
                    ">{{ item.level }}</span>
                  </div>
                  <div class="money">
                    <small>{{$i18n.t("money")}}</small>
                    {{ item.value }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 更多权限插件模版 -->
        <div id="more-power" v-if="is_show_unable==1">
          <div class="title">
            <div class="spare"></div>
            <h1>{{$i18n.t("extension.更多权限")}}</h1>
          </div>

          <!-- 模板2 -->
          <div class="plugg"
               v-if="template === '02'">
            <div class="plug-list"
                 v-for="(item,i) in unextension"
                 @click="gotoPage(item)"
                 :key='i'>
              <i class="iconfont"
                 :class="item.icon"></i>
              <ul class="left">
                <li class="left_a">{{ item.title }}</li>
                <li class="left_b"></li>
                <li class="left_c"><span>{{$i18n.t("money")}}</span>{{ item.value }}</li>
              </ul>
            </div>
          </div>
          <!-- 模板2end -->

          <div class="plugg"
               v-if="template !== '02'">
            <div class="plug-list"
                 v-for="(item,i) in unextension"
                 @click="gotoPage(item)"
                 :key='i'>
              <ul class="left">
                <li class="icon">
                  <i class="iconfont"
                     style="font-size: 2.5rem; color: #f15353;"
                     :class="item.icon"></i>
                </li>
                <li class="info">
                  <div class="top">
                    <span class="name">{{ item.title }}</span>
                  </div>
                  <div class="money">
                    <small>{{$i18n.t("money")}}</small>
                    {{ item.value }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
      <div style="height: 6.25rem;"></div>
    </div>
    <!--<div class="wait-loader loader-smartphone is-wait-active" data-screen="加载中" v-show="!template"></div>-->
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
