<template>
  <div id="goodsinfo" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text=""></c-title>
    <div style="height: 40px;"></div>
    <!-- 自提点（杨朗）start -->
    <div v-if="is_open_package_deliver && !show_address">
      <van-tabs v-model="selfCarrySelected" v-if="!fun.isTextEmpty(selfCarryType)">
        <template v-for="item in selfCarryType">
          <van-tab :name="item.dispatch_type_id" :key="item.dispatch_type_id">
            <span slot="title" @click="requestByAddress(item.dispatch_type_id)">{{ item.name }}</span>
          </van-tab>
        </template>
      </van-tabs>

      <div>
        <!-- <mt-tab-container v-model="selfCarrySelected"> -->
        <div v-show="selfCarrySelected == 8">
          <!-- <mt-tab-container-item id="8"> -->
          <div class="addr" v-if="!fun.isTextEmpty(defaultSelfCarry)">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              {{ deliverName }}:{{ defaultSelfCarry.deliver_name }} {{ defaultSelfCarry.deliver_mobile }}
              <br/>
              <span>{{ defaultSelfCarry.full_address }}</span>
            </p>
            <span
              style="border: 1px solid #f15353;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  color: #f15353;
"
              @click.stop="replaceZT"
            >更换</span
            >
          </div>
          <div class="addr" v-if="fun.isTextEmpty(defaultSelfCarry)">
            <div v-if="!isQuest_ing">
              抱歉，您所在地区暂无{{ deliverName }}，或<i style="color: #f15353;" @click="replaceZT">手动切换位置</i>
            </div>
            <div v-if="isQuest_ing">正在获取您附近{{ deliverName }}信息 ...</div>
          </div>

          <div style="height: 0.3125rem;"></div>

          <van-field class="van-inp" label="提货人姓名" v-model="distributionUserName" placeholder="请输入提货人姓名" center
                     clearable/>
          <van-field class="van-inp" label="提货人手机" v-model="distributionUserMobile" placeholder="请输入提货人手机" center
                     clearable/>
          <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
          <div style="height: 0.3125rem;"></div>
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="selfCarrySelected == 1">
          <!-- <mt-tab-container-item id="1"> -->
          <div class="addr" @click="showAddress" v-if="!show_address">
            <i class="fa fa-map-marker"></i>
            <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
              收件人:{{ realname }} {{ mobile }}
              <br/>
              <span>{{ address }}</span>
            </p>
            <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
            <i v-show="realname" class="fa fa-angle-right"></i>
          </div>
          <div style="height: 0.3125rem;"></div>
          <!-- </mt-tab-container-item> -->
        </div>
        <!-- </mt-tab-container> -->
      </div>
    </div>
    <!-- 自提点（杨朗 end -->
    <!-- 开启配送站 配送站模块 data.home.globalParameter.is_open_delivery_station == 1 -->
    <!-- 门店商品没有配送站 -->
    <template v-if="isShowDistributionStation && this.DistributionInfo.length < 1">
      <div class="addr">
        <i class="fa fa-map-marker"></i>
        <p>
          正在获取配送站信息...
          <br/>
        </p>
        <i class="fa fa-angle-right"></i>
      </div>
    </template>
    <template v-if="isShowDistributionStation && this.DistributionInfo.length >= 1">
      <div class="addr" @click="showDistribution">
        <i class="fa fa-map-marker"></i>
        <p>
          配送站:{{ DistributionModel.delivery_name }} {{ DistributionModel.has_one_member.mobile }}
          <br/>
          <span>{{ DistributionModel.full_address }} {{ DistributionModel.address }}</span>
        </p>
        <i class="fa fa-angle-right"></i>
      </div>

      <van-radio-group v-model="DistributionSelect" class="DistributionSelect">
        <van-radio
          :name="items.code"
          v-for="(items, i) in DistributionModel.method_name"
          checked-color="#f15353"
          @click="changeDistribution"
          :key="i"
        >{{ items.name }}
        </van-radio
        >
      </van-radio-group>

      <div style="height: 0.3125rem;"></div>

      <div class="addr" @click="showAddress" v-if="this.DistributionSelect == '6'">
        <i class="fa fa-map-marker"></i>
        <p v-show="realname">
          收件人:{{ realname }} {{ mobile }}
          <br/>
          <span>{{ address }}</span>
        </p>
        <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
        <i v-show="realname" class="fa fa-angle-right"></i>
      </div>

      <div v-if="this.DistributionSelect == '5'">
        <van-field class="van-inp" label="提货人姓名" v-model="distributionUserName" placeholder="请输入提货人姓名" center
                   clearable/>
        <van-field class="van-inp" label="提货人手机" v-model="distributionUserMobile" placeholder="请输入提货人手机" center
                   clearable/>
        <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
      </div>
      <div style="height: 0.3125rem;"></div>
    </template>

    <template v-if="this.$route.params.tag == 'POrder'">
      <!-- 挂单商品模块 -->
      <van-tabs v-model="POChooseType">
        <van-tab
          :name="items.code"
          v-for="items in pdOrderType"
          :key="items.id">
          <span slot="title" @click="POChangeType(items.code)">{{ items.name }}</span>
        </van-tab>
      </van-tabs>
      <div>
        <!-- <mt-tab-container v-model="POChooseType"> -->
        <div v-show="POChooseType == 1">
          <!-- <mt-tab-container-item id="1"> -->
          <div class="addr" @click="showAddress" v-if="!show_address">
            <div class="icon">
              <i class="fa fa-map-marker"></i>
              <p v-show="realname">
                收件人:{{ realname }} {{ mobile }}
                <span>{{ address }}</span>
              </p>
              <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
              <i v-show="realname" class="fa fa-angle-right"></i>
            </div>
          </div>
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="POChooseType == 0"></div>
        <!-- <mt-tab-container-item id="0"></mt-tab-container-item> -->
        <!-- </mt-tab-container> -->
      </div>
    </template>
    <div style="margin-top: 0.625rem; background: #fff;" v-if="showMyinfo">
      <van-cell-group :border="false" class="set-address">
        <van-cell :border="false" center>
          <span slot="title" style="font-size: 12px;">姓名</span>
          <span slot="default">{{ myRealname }}</span>
        </van-cell>
        <van-cell :border="false" center>
          <span slot="title" style="font-size: 12px;">身份证号</span>
          <span slot="default">{{ myIdcard }}</span>
        </van-cell>
        <van-cell :border="false" center @click.native="alertMyInfo" is-link>
          <span slot="title" style="font-size: 12px;">修改个人信息</span>
          <span slot="default"></span>
        </van-cell>
      </van-cell-group>
    </div>

    <van-popup v-model="popupSpecs" position="bottom" class="mint-popup-4" closeOnClickModal="true">
      <div class="add-info">
        <ul>
          <li v-for="(item, i) in addressData" :key="i" @click="selectAddress(item)">
            <div class="liia">
              <span class="name" style="">
                {{ item.username + " " + item.mobile }}
              </span>
              <p class="address" style="" v-if="item.street">
                {{ item.province + " " + item.city + " " + item.district + "" + item.street }} {{ item.address }}
              </p>
              <p class="address" style="" v-else>
                {{ item.province + " " + item.city + " " + item.district }} {{ item.address }}
              </p>
            </div>
            <p class="edit_btn" v-if="item.isdefault" @click="editAddress">
              编辑
            </p>
            <!--<i class="fa fa-trash-o"></i>-->
          </li>
        </ul>
      </div>
      <button class="address-plus" type="button" @click="addAddress">
        新增地址
      </button>
    </van-popup>

    <van-popup v-model="popupCouponSpecs" position="bottom" class="mint-popup-4" closeOnClickModal="true">
      <div class="add-info">
        <div class="coupon-list-info" v-for="(coupon, index) in coupons" :key="index">
          <div class="checkList" style="float: left;" v-if="cup_notice" @click.stop="chooseCoupon(index)">
            <div class="right" v-show="good_clicktag == 0">
              <van-checkbox
                v-model="coupon.checked"
                shape="square"
                :disabled="!coupon.valid"
                checked-color="#f15353" :name="coupon"
                @change="selectCoupon($event, coupon)"
              >&nbsp;
              </van-checkbox>
            </div>
            <div class="right" v-show="good_clicktag != 0">
              <!-- <mt-spinner type="triple-bounce"></mt-spinner> -->
              <van-loading/>
            </div>
          </div>
          <div
            :class="{
              coupon_voucher_main: coupon.valid,
              coupon_voucher_gray: !coupon.valid
            }"
          >
            <div class="coupon_voucher_left">
              <div v-if="coupon.belongs_to_coupon.coupon_method == 1">
                <p class="coupon_voucher_amount type_large">
                  {{ coupon.belongs_to_coupon.deduct }}
                </p>
                <p class="coupon_voucher_limit">满{{ coupon.belongs_to_coupon.enough }}立减</p>
              </div>
              <div v-else>
                <p class="coupon_voucher_amount type_large">{{ coupon.belongs_to_coupon.discount }}折</p>
                <p class="coupon_voucher_limit">满{{ coupon.belongs_to_coupon.enough }}立享</p>
              </div>
            </div>
            <div class="coupon_voucher_hr"></div>
            <div class="coupon_voucher_right">
              <p class="coupon_voucher_range">
                {{ coupon.belongs_to_coupon.name }}
              </p>
              <p class="coupon_voucher_period">{{ coupon.time_start }}-{{ coupon.time_end }}</p>
            </div>
          </div>
        </div>
      </div>
      <button class=" sure" type="button" @click="popupCouponSpecs = false">
        确认
      </button>
      <button class="close" type="button" @click="popupCouponSpecs = false">
        取消
      </button>
    </van-popup>

    <transition name="scale">
      <div class="m-dialog" v-if="popAddAddress" :style="isResize ? 'position: absolute' : 'position: fixed'">
        <div>
          <div class="popHeader">
            <i class="iconfont icon-member-left" @click="popAddressClose"></i>
            <p>添加地址</p>
          </div>
          <div style="height: 2.5rem;"></div>
          <div class="address_a">
            <ul>
              <li>
                <span>收件人：</span>
                <input type="text" v-model="form.username" maxlength="20" placeholder="请输入收件人"/>
              </li>
              <li>
                <span>联系电话：</span>
                <input type="tel" v-model="form.mobile" placeholder="请输入联系电话"/>
              </li>
            </ul>
          </div>

          <van-cell-group :border="false" class="set-address">
            <van-cell :border="false" center>
              <span slot="title">设置默认地址：</span>
              <van-switch
                slot="default"
                v-model="form.isDefault"
                active-color="#f15353"
                inactive-color="#fff"
                size="25px"
              />
            </van-cell>
          </van-cell-group>

          <van-cell-group :border="false" class="set-address">
            <van-cell :border="false" center is-link>
              <span slot="title">所在地区：</span>
              <input
                slot="default"
                type="text"
                @click.stop="addressShow = true"
                v-model="addressName"
                readonly
                placeholder="请选择收货地址"
                onfocus="blur();"
              />
            </van-cell>

            <van-cell :border="false" center is-link v-if="strShow">
              <span slot="title">街道：</span>
              <input
                slot="default"
                type="text"
                @click.stop="streetChoose"
                v-model="form.street"
                readonly
                placeholder="请选择街道"
                onfocus="blur();"
              />
            </van-cell>
          </van-cell-group>

          <div class="text_adderss">
            <input
              @focus="isFocus()"
              @blur="isBlur"
              placeholder="请输入详细地址"
              v-model="form.address"
              maxLength="100"
            />
          </div>

          <div class="adderss_btn" v-if="create" @click="appendAddress">
            <button type="button"><i class="fa fa-plus-circle"></i>保存</button>
          </div>
          <div class="adderss_btn" v-if="!create" @click="appendAddress('update')">
            <button type="button">编辑</button>
          </div>
        </div>
      </div>
    </transition>

    <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="district"></yd-cityselect>

    <transition name="move">
      <div class="m-dialog1" v-if="streetShow">
        <van-nav-bar title="选择街道">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333"/>
            </span>
          </template>
        </van-nav-bar>
        <van-cell
          :border="false"
          center
          is-link
          v-for="(item, i) in districtVal"
          :key="i"
          @click.native="streetConfirm(item.areaname)"
          title-style="text-align:left"
        >
          <span slot="title">{{ item.areaname }}</span>
        </van-cell>
      </div>
    </transition>
    <div class="recipients" v-for="(item, index) in order_data" :key="index">
      <div class="top" v-for="(g, i) in item.order_goods" :key="i">
        <div class="img">
          <img :src="g.thumb" alt=""/>
        </div>
        <div class="top_right">
          <div class="titles">{{ g.title | escapeTitle }}</div>
          <div class="specification">规格：{{ g.goods_option_title }} x{{ g.total }}</div>
        </div>
      </div>
      <div class="leaveWords">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          maxlength="50"
          placeholder="买家留言：50字以内（选填）"
          v-model.lazy="note[item.pre_id]"
          @change="noteHandle($event, item, note[item.pre_id])"
        ></textarea>
      </div>
    </div>
    <div class="posbtn set-pc-style">
      <div class="btn " @click="submit">提交订单</div>
    </div>
  </div>
</template>

<script>
import cloudOrder_controller from "./cloudOrder_controller";

export default cloudOrder_controller;
</script>
<style lang="scss" rel="stylesheet/scss">
  #goodsinfo.pcStyle {
    .pc_popup {
      .yd-popup {
        width: 375px !important;
        right: 50%;
        margin-right: -187.5px;
      }
    }

    .m-dialog {
      width: 375px;
      left: 50%;
      margin-left: -187.5px;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  #goodsinfo {
    input {
      border: none;
    }

    .onclast {
      position: relative;
      top: -18.125rem;
    }

    .title {
      line-height: 2.25rem;
      background-color: #f7f7f7;
      color: #f15353;
      text-align: left;
      padding: 0 0.875rem;

      span {
        margin-left: 0.625rem;
      }
    }

    .goods-shop {
      background: #fff;
      line-height: 2.25rem;
      border-bottom: #e8e8e8 solid 0.0625rem;

      p {
        text-align: left;
        margin: 0;
        padding: 0 0 0 0.875rem;
        font-size: 12px;
        color: #555;
      }
    }

    .add-info {
      overflow-y: scroll;
      width: 100%;
      background: #fff;
      max-height: 50vh;
      padding-top: 0.625rem;
    }

    .mint-popup-4 {
      width: 100%;

      .sure {
        background: #f15353;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #fff;
        width: 50%;
        border: 0;
        float: left;
      }

      .close {
        background: #eee;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #333;
        width: 50%;
        border: 0;
        float: left;
      }

      .address-plus {
        background: #f15353;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #fff;
        width: 100%;
        border: 0;
      }

      ul {
        overflow-y: scroll;
      }

      li {
        padding: 0.625rem 0;
        display: flex;
        position: relative;

        .edit_btn {
          margin-top: 8px;
          margin-right: 2rem;
          height: 2rem;
          line-height: 2rem;
          flex: 0 0 3rem;
          background: #f15353;
          color: #fff;
          border-radius: 10px;
        }

        .liia {
          width: 100%;
          padding-right: 1.25rem;
          flex: 1;
          text-align: left;
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;

          .name {
            font-size: 18px;
            color: #222;
            line-height: 2rem;
          }

          .address {
            word-break: break-word;
            width: 100%;
            font-size: 12px;
            color: #666;
            line-height: 1.2rem;
          }
        }

        i {
          flex: 1;
        }
      }
    }

    .distributionContent {
      max-height: 80%;
      overflow: scroll;

      .distributionMain {
        padding: 0.875rem;

        .ss {
          display: flex;
          justify-content: space-around;
          padding: 0;
          padding-bottom: 0.8rem;
          font-size: 12px;

          .rightFlex {
            padding-left: 0.625rem;

            .dis_name,
            .dis_info {
              display: flex;
              padding-bottom: 0.25rem;

              i {
                padding-right: 0.8rem;
              }

              p {
                text-align: left;
                font-size: 14px;
              }
              // justify-content: space-around;
            }

            .dis_name {
              justify-content: space-between;
              padding-bottom: 0.38rem;

              .dis_names {
                color: #000;
                font-size: 16px;
              }

              span {
                display: inline-block;
              }
            }

            .dis_info {
              align-items: center;
            }
          }
        }
      }
    }

    .addr {
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;
      padding: 0.875rem;

      .icon {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        align-items: center;
        background: #fff;

        .fa-map-marker {
          line-height: 1.5rem;
          margin-right: 0.625rem;
          font-size: 22px;
          color: #333;
          padding-right: 0.5rem;
        }

        .fa-angle-right {
          line-height: 1.5rem;
          font-size: 24px;
          color: #c9c9c9;
        }

        p {
          flex: 6;
          text-align: justify;
          font-weight: bold;
          padding-right: 1rem;
          color: #333;
          font-size: 16px;

          span {
            font-weight: normal;
            color: #666;
            display: -webkit-box;
            font-size: 14px;
            margin-top: 0.375rem;
          }
        }
      }
    }

    .goods-detail {
      margin-top: 0.625rem;
    }

    .imgUploaderTitle {
      text-align: left;
      margin-top: 0.8rem;
      height: 2.25rem;
      line-height: 2.25rem;
      padding: 0 0.8rem;
      border-bottom: 1px solid #e0e0e0;
      background: #fff;
      color: #333;
      font-size: 12px;
    }

    .imgUploader {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      background: #fff;
      padding: 0.8rem;

      .photoBox {
        position: relative;
        width: 4.5rem;
        height: 4.5rem;
        border: 1px dashed #c0ccda;
        margin-right: 0.2rem;
        margin-left: 0.2rem;
        margin-bottom: 0.2rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        i {
          width: 1.2rem;
          height: 1.2rem;
          position: absolute;
          top: 0.1rem;
          right: 0.1rem;
          background: url('../../../assets/images/close_iocn.png');
          background-size: 100%;
        }
      }

      .van-uploader,
      .wxchooseImg {
        width: 4.5rem;
        height: 4.5rem;
        overflow: hidden;
        background: #f3f3f3;
        border: 1px dashed #c0ccda;
        margin-left: 0.2rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;

        .van-icon {
          font-size: 24px;
          line-height: 4.5rem;
          color: #666;
        }
      }
    }

    .DistributionSelect {
      background: #fff;
      text-align: left;
      display: flex;
      padding: 0 1.875rem 0.75rem;

      div {
        padding-right: 1.2rem;
      }
    }

    .detail_good {
      background: #fff;
      overflow: hidden;

      .content {
        text-align: left;
        background: #efeded;
        padding: 0.625rem;
        color: #8c6700;
      }

      a {
        color: #000;
      }

      h3 {
        text-align: left;
        margin: 0.5625rem 0;

        i {
          font-size: 20px;
          padding-right: 0.3125rem;
        }
      }

      .goods::after {
        content: '';
        display: block;
        clear: both;
      }

      .goods {
        /* display: -webkit-box;
                                                      display: -ms-flexbox;
                                                      display: flex;
                                                      -webkit-box-align: stretch;
                                                      -ms-flex-align: stretch;
                                                      align-items: stretch;
                                                      -webkit-box-orient: horizontal;
                                                      -webkit-box-direction: normal;
                                                      -ms-flex-flow: row wrap;
                                                      flex-flow: row wrap;
                                                      */
        display: flex;
        padding: 1rem 0.875rem 0 0.875rem;
        width: 100%;
        box-sizing: border-box;

        .img {
          /* flex: 1; */
          width: 30%;
          display: inline-block;

          /* background:blue; */
          img {
            width: 100%;
          }
        }

        .warp {
          width: 70%;
          margin-left: 0.625rem;
          position: relative;

          .inner {
            display: flex;
            justify-content: space-between;

            .red {
              color: #f15353;

              i {
                font-size: 12px;
                color: #ff9500;
              }
            }

            .name {
              font-size: 14px;
              line-height: 1.25rem;
              height: 2.5rem;
              width: 60%;
              text-align: left;
              color: #333;
              margin-bottom: 0.625rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }

          .price {
            display: flex;
            justify-content: space-between;
            color: #333;
            box-sizing: border-box;

            p {
              margin-top: 0;
            }

            .right {
              color: #8c8c8c;
            }
          }

          .diyFormDiv {
            display: flex;
            flex-direction: row-reverse;

            .dfBtn {
              height: 1.5rem;
              line-height: 1.5rem;
              padding: 0 0.875rem;
              // border: 1px solid #e21212;
              font-size: 0.875rem;
              background: #f13232;
              border-top-left-radius: 1rem;
              border-bottom-left-radius: 1rem;
              color: #fff;
            }

            .revise_dy {
              background: #7cbd5b;
            }
          }
        }

        .option {
          color: #8c8c8c;
          font-size: 14px;
        }
      }

      .rent-choice {
        width: 100%;
        // position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        color: #8c8c8c;

        .red {
          color: #f15353;
          margin-right: 0.625rem;
          font-size: 14px;
        }

        li:nth-child(2) {
          position: relative;
          right: 0;
          color: #8c8c8c;
        }
      }

      .note {
        display: flex;
        margin: 1rem 0.5rem 0 0.5rem;

        .left {
          flex: 0 0 4rem;
          font-size: 12px;
          color: #858585;
        }

        .right {
          flex: 1;
          text-align: left;

          input {
            font-size: 12px;
          }
        }
      }
    }

    .nums {
      background: #fff;
      text-align: right;
      margin: 0;
      padding-right: 0.625rem;
      line-height: 2rem;
    }

    .tbs.coupon-list {
      margin-top: 0.625rem;
      // margin-bottom: 0.625rem;
    }

    .coupon.list {
      .left font {
        color: #fff;
        background: #f15353;
        font-size: 12px;
        height: 1.25rem;
        padding: 0 0.3125rem;
        border-radius: 0.1875rem;
        margin-left: 0.3125rem;
      }

      .right font span {
        font-size: 12px;
      }

      .right font i {
        font-size: 12px;
        color: #999;
      }
    }

    .rent-time {
      margin-top: 0.625rem;
      padding: 1rem 0.875rem;
      background-color: #fff; //display: flex;
      .text {
        font-size: 14px;
        text-align: left;
        flex: 16%;
        margin-bottom: 0.625rem;
      }

      .week {
        display: flex;
        flex-wrap: wrap;

        button {
          display: inline-block;
          width: 30.4%;
          border: solid 0.0625rem #e2e2e2;
          background-color: #fff;
          font-size: 12px;
          color: #333;
          border-radius: 0.25rem;
          height: 3.75rem;
          margin: 0.3125rem 1.1%;

          span {
            color: #f15353;
          }
        }

        .yd-btn {
          padding: 0;
        }

        .active {
          border: solid 0.0625rem red;
        }
      }
    }

    .rent-info {
      background-color: #fff;
      padding: 0.625rem 0.875rem;
      font-size: 14px;
      border-bottom: solid 0.0625rem #e2e2e2;

      ul {
        display: flex;
        justify-content: space-between;

        li {
          line-height: 1.5rem;
          font-size: 14px;
        }

        li:first-child {
          color: #8c8c8c;
        }
      }

      .coupon {
        margin-top: 0.625rem;
        margin-bottom: 0.625rem;
        font-size: 14px;
        line-height: 2.25rem;
        display: flex;
        justify-content: space-between;

        i {
          font-size: 24px;
          line-height: 2.25rem;
          color: #c9c9c9;
        }

        .right {
          font-size: 12px;
          background-color: #f15353;
          color: #fff;
          margin-left: 0.625rem;
          padding: 0.125rem 0.25rem;
          border-radius: 0.1875rem;
        }
      }

      .remarks {
        margin-bottom: 0.375rem;
        display: flex;
        justify-content: space-between;

        textarea {
          color: #8c8c8c;
          padding: 0.25rem;
          width: 90%;
          height: 4.25rem;
          border: solid 0.0625rem #e2e2e2;
          background-color: #f9f9f9;
          border-radius: 0.25rem;
        }
      }
    }

    .rent-money {
      padding: 0.625rem 0;
      font-size: 14px;
      background-color: #fff;
      border-bottom: solid 0.0625rem #e2e2e2;

      .list {
        margin: 0 0.875rem;

        ul {
          display: flex;
          justify-content: space-between;

          li {
            line-height: 1.5rem;
          }

          li:first-child {
            color: #8c8c8c;
          }
        }
      }

      .deposit {
        margin: 0.625rem 0.875rem;

        ul {
          display: flex;
          justify-content: space-between;

          li {
            line-height: 1.875rem;
          }
        }
      }

      .agreement {
        margin: 0 0.875rem;
        text-align: left;

        a {
          color: #f15353;
        }

        .checkbox {
          z-index: 88;
          border-radius: 50%;
        }

        .el-checkbox {
          float: none;
        }
      }
    }

    .invoice {
      background: #fff;
      margin-top: 0.625rem;
      height: 2.8125rem;
      line-height: 2.8125rem;
      font-size: 15px;
      display: flex;
      padding: 0 0.875rem;
      border-top: solid 0.0625rem #ebebeb;
      border-bottom: solid 0.0625rem #ebebeb;
      position: relative;

      span {
        margin-right: 1.25rem;

        font {
          color: #f15353;
        }
      }

      .type {
        font-size: 12px;
        color: #8c8c8c;
      }

      i {
        position: absolute;
        right: 0.875rem;
        font-size: 24px;
        color: #c9c9c9;
        line-height: 2.8125rem;
      }
    }

    .popup_box {
      background: #fff;
      min-height: 33.375rem;
      padding-top: 3.125rem;
      padding-bottom: 4.375rem;

      h1 {
        width: 100%;
        position: fixed;
        top: 0;
        background: #fff;
        font-size: 18px;
        height: 3.125rem;
        line-height: 3.125rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.875rem;

        i {
          font-size: 1rem;
          color: #c9c9c9;
        }
      }

      p {
        padding: 0.375rem 0.875rem;
        background: rgb(240, 249, 255);
        border-top: solid 0.0625rem #91d5ff;
        border-bottom: solid 0.0625rem #91d5ff;
        font-size: 14px;
        text-align: left;
        color: #8c8c8c;
        display: flex;

        i {
          font-size: 1.125rem;
          color: #91d5ff;
          margin-right: 0.25rem;
        }
      }

      .type_box {
        margin-top: 0.625rem;

        h2 {
          font-size: 15px;
          height: 2.5rem;
          line-height: 2.5rem;
          text-align: left;
          padding: 0 0.875rem;
        }

        .type {
          display: flex;
          padding: 0 0.875rem;

          button {
            background: #fff;
            border: solid 0.0625rem #ebebeb;
            font-size: 0.875rem;
            width: 6rem;
            height: 1.75rem;
            border-radius: 1rem;
            margin-right: 1.25rem;
            color: #666;
          }

          .cur {
            background: #f15353;
            color: #fff;
            border: none;
          }
        }

        .input_box {
          margin-top: 1.25rem;
          padding: 0 0.875rem;

          /deep/ input {
            padding: 0 0.625rem;
            width: 100%;
            height: 2.25rem;
            background: #f5f5f5;
            border-radius: 1rem;
            margin-bottom: 0.75rem;
          }
        }
      }

      .btn {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 0.625rem 0.875rem;
        background: #fff;

        button {
          width: 100%;
          height: 2.625rem;
          border-radius: 2rem;
          background: #f15353;
          color: #fff;
          font-size: 18px;
          border: none;
        }
      }
    }

    .tbs {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      flex-flow: row wrap;
      padding: 0.625rem 0.875rem;
      line-height: 1.5rem;
      border-bottom: #e8e8e8 solid 0.0625rem;
      font-size: 14px;

      .list {
        width: 100%;
        padding-bottom: 0.625rem;
      }

      .list:nth-last-child(1) {
        padding-bottom: 0;
      }

      .left {
        text-align: left;
        float: left;
        color: #333;

        span {
          font-size: 15px;
        }
      }

      .right {
        text-align: right;
        float: right;
      }

      p {
        text-align: left;
        margin: 0;
        padding-right: 0.625rem;
        line-height: 2rem;
        width: 100%;

        span {
          color: #858585;
          font-size: 12px;
          float: right;
        }
      }

      .remarks {
        width: 100%;

        textarea {
          color: #8c8c8c;
          padding: 0.25rem;
          width: 100%;
          margin-top: 0.375rem;
          height: 4.25rem;
          border: solid 0.0625rem #e2e2e2;
          background-color: #f9f9f9;
          border-radius: 0.25rem;
        }
      }

      .agreement {
        display: flex;
        align-items: center;

        .left {
          margin-left: 0.625rem;

          a {
            color: #f15353;
          }
        }
      }
    }

    .detail_pay {
      z-index: 98;
      font-size: 16px;
      text-align: left;
      height: 3.0625rem;
      width: 100%;
      background: #fff;
      padding: 0 0 0 0.875rem;
      margin-top: 1.875rem;
      border-top: 0.0625rem solid #eaeaea;
      position: fixed;
      bottom: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      .order_delete {
        flex: 1;
        width: auto;
        background: #f15353;
        text-align: center;
        color: #fff;
        line-height: 3.0625rem;
      }

      .total {
        font-size: 14px;
        padding-right: 0.625rem;
        display: flex;
        justify-content: flex-end;
        line-height: 3.0625rem;
        flex: 3;

        .deposit {
          font-size: 12px;
          color: #999;
          margin-right: 0.375rem;
        }
      }
    }

    .span_t {
      color: #f15353;
      font-size: 16px;
    }
  }

  #goodsinfo.pcStyle {
    .detail_pay,
    .mint-popup-4 {
      width: 375px;
    }
  }

  .checkList {
    position: relative;
    top: 1.875rem;
    left: 0.1875rem;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .el-checkbox {
    float: left;
    margin-left: 0.3125rem;
  }

  .coupon-list-info {
    width: 99.5vw;
  }

  .coupon_voucher_main {
    position: relative;
    padding-left: 6.375rem;
    height: 5rem;
    margin-left: 2.25rem;
    margin-right: 0.625rem;
    margin-bottom: 0.625rem;

    .coupon_voucher_left {
      position: absolute;
      top: 0;
      left: 0;
      width: 6.375rem;
      height: 100%;
      color: #fff;
      border-radius: 0.25rem 0 0 0.25rem;
      text-align: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #47c1c4;

      .coupon_voucher_amount.type_large {
        margin: 0;
        font-size: 22px;
      }

      .coupon_voucher_amount {
        position: relative;
        font-size: 36px;
        line-height: 1;
      }

      .coupon_voucher_amount::before {
        content: '\00A5';
        font-size: 16px;
        display: inline-block;
        vertical-align: text-top;
        margin-right: 0.1875rem;
        line-height: 1;
      }

      .coupon_voucher_limit {
        font-size: 12px;
        line-height: 1;
        margin-top: 0.9375rem;
        margin-bottom: 0;
      }
    }

    .coupon_voucher_hr {
      position: absolute;
      top: 0;
      left: 6.0625rem;
      width: 0.375rem;
      overflow: hidden;
      height: 100%;
    }

    .coupon_voucher_hr::after {
      box-sizing: border-box;
      position: absolute;
      top: -0.1875rem;
      right: -0.1875rem;
      bottom: 0;
      content: '• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •';
      line-height: 0.625rem;
      width: 0.4375rem;
      color: #f8fbfb;
      font-size: 18px;
      overflow: hidden;
      z-index: 1;
    }

    .coupon_voucher_right {
      box-sizing: border-box;
      padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
      height: 100%;
      border-radius: 0 0.25rem 0.25rem 0;
      background-color: #e5f3f3;
      color: #666;

      .coupon_voucher_range {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 12px;
        text-align: left;
        margin: 0;
        padding: 0;
        vertical-align: baseline;
      }

      .coupon_voucher_period {
        color: #999;
        font-size: 12px;
        position: absolute;
        bottom: 0;
      }
    }
  }

  .coupon_voucher_gray {
    position: relative;
    padding-left: 6.375rem;
    height: 5rem;
    margin-left: 2.25rem;
    margin-right: 0.625rem;
    margin-bottom: 0.625rem;

    .coupon_voucher_left {
      position: absolute;
      top: 0;
      left: 0;
      width: 6.375rem;
      height: 100%;
      color: #fff;
      border-radius: 0.25rem 0 0 0.25rem;
      text-align: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #ccc;

      .coupon_voucher_amount.type_large {
        margin: 0;
        font-size: 22px;
      }

      .coupon_voucher_amount {
        position: relative;
        font-size: 36px;
        line-height: 1;
      }

      .coupon_voucher_amount::before {
        content: '\00A5';
        font-size: 16px;
        display: inline-block;
        vertical-align: text-top;
        margin-right: 0.1875rem;
        line-height: 1;
      }

      .coupon_voucher_limit {
        font-size: 12px;
        line-height: 1;
        margin-top: 0.9375rem;
        margin-bottom: 0;
      }
    }

    .coupon_voucher_hr {
      position: absolute;
      top: 0;
      left: 6.0625rem;
      width: 0.375rem;
      overflow: hidden;
      height: 100%;
    }

    .coupon_voucher_hr::after {
      box-sizing: border-box;
      position: absolute;
      top: -0.1875rem;
      right: -0.1875rem;
      bottom: 0;
      content: '• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •';
      line-height: 0.625rem;
      width: 0.4375rem;
      color: #f8fbfb;
      font-size: 18px;
      overflow: hidden;
      z-index: 1;
    }

    .coupon_voucher_right {
      box-sizing: border-box;
      padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
      height: 100%;
      border-radius: 0 0.25rem 0.25rem 0;
      background-color: #eee;
      color: #666;

      .coupon_voucher_range {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 12px;
        text-align: left;
        margin: 0;
        padding: 0;
        vertical-align: baseline;
      }

      .coupon_voucher_period {
        color: #999;
        font-size: 12px;
        position: absolute;
        bottom: 0;
      }
    }
  }

  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 0.0625rem solid #e8e8e8;
    background: #fff;
    z-index: 99;
  }

  .is-right a {
    font-size: 12px;
  }

  .scale-enter-active,
  .scale-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .scale-enter,
  .scale-leave-to {
    transform: scale(1.5);
    opacity: 0;
  }

  .move-enter-active,
  .move-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .move-enter,
  .move-leave-to {
    /* transform: translate(10px, 0); */
    opacity: 0;
  }

  .m-dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 150%;
    z-index: 100;
    background: #f5f5f5;
  }

  .m-dialog1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 120%;
    z-index: 100;
    background: #fff;
  }

  .popHeader,
  .DYFpopHeader {
    position: absolute;
    top: 0;
    width: 100%;
    height: 2.5rem;
    background: white;
    display: flex;
    font-size: 16px;
    text-align: center;

    p {
      font-weight: bold;
      flex: 1;
      align-self: center;
    }

    i {
      padding: 0.5rem;
      align-self: center;
      flex: 0 0 1.5rem;
    }
  }

  .DYFpopHeader {
    position: fixed;
    top: 0;
    z-index: 9;
  }

  // 新css
  .address_a,
  .address_b {
    background-color: #fff;
    padding-left: 14px;
    margin-top: 10px;

    li {
      height: 3.125rem;
      line-height: 3.125rem;
      padding-right: 14px;

      /* border-bottom:solid 0.0625rem #ebebeb; */
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    li:last-child {
      border: none;
    }
  }

  .address_b {
    margin-bottom: 0.625rem;

    li {
      justify-content: space-between;
    }
  }

  .text_adderss {
    background-color: #fff;

    input {
      text-wrap: unset;
      padding: 0.625rem 0.875rem;
      font-size: 14px;
      line-height: 1.5rem;
      width: 100%;
      min-height: 3.25rem;
    }
  }

  .adderss_btn {
    margin: 1.25rem auto;

    button {
      width: 18.75rem;
      height: 2.8125rem;
      border-radius: 0.3125rem;
      background: #f15353;
      color: #fff;
      padding: 0;
      border: none;

      i {
        font-size: 1.125rem;
        margin-right: 0.375rem;
      }
    }
  }

  //
  .address_addnav {
    z-index: 10;
    width: 100%;
    padding: 0 3% 0 6% !important;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #f15353 !important;
    color: #fff !important;
    text-align: center;
    height: 2.8125rem !important;
    line-height: 2.8125rem !important;
  }

  .popup-con {
    width: 100%;
  }

  #goodsinfo .popupMemberSpecs {
    top: 0;

    header {
      display: flex;
    }

    .address_addnav {
      display: block;
    }
  }

  #goodsinfo .shipping_ins {
    // margin: 0.625rem 0;
    background: #fff;
    padding: 0 0.625rem;

    .shipping_ins_1 {
      height: 2.75rem;
      line-height: 2.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .shipping_ins_title {
        font-size: 0.875rem;
        color: #333;
      }

      .shipping_ins_total {
        color: #f15353;
      }
    }
  }

  #goodsinfo .animation {
    top: 0;

    header {
      display: flex;
    }

    .address_addnav {
      display: block;
    }
  }

  .dis_warn {
    text-align: left;
    padding: 0.25rem 0.875rem;
    background: #fff;
    color: #f15353;
    font-size: 0.75rem;
    border-top: 0.0625rem solid #ebebeb;
  }

  #AllGood {
    position: fixed;
    top: 200vh;
    height: 100vh;
    overflow: scroll;
    width: 100%;
    background: #eee;
    z-index: 100;
    transition: 0.6s ease-out;
    display: block;

    #appendAddress .mint-field .mint-cell-title {
      text-align: left;
    }

    .address_addnav,
    header {
      display: none;
    }

    .address_addnav span {
      color: #fff;
    }

    .address_addnav i {
      color: #fff;
      font-size: 22px;
      position: absolute;
      top: 50%;
      height: 1.125rem;
      line-height: 1.125rem;
      margin-left: -2.125rem;
      margin-top: -0.5625rem;
    }

    .maleall {
      background: #fff;
      text-align: left;
    }

    #appendAddress .males {
      line-height: 3.125rem;
      display: flex;
      border-top: 0.0625rem solid #d9d9d9;
      margin-left: 0.625rem;
      padding-right: 0.625rem;
      position: relative;

      .address {
        display: inline-block;
        position: relative;
        width: 70%;
        float: right;
        box-sizing: border-box;
        padding-top: 0.5rem;
      }
    }

    .maleall span {
      color: #333;
      font-size: 16px;
      vertical-align: middle;
      width: 6.5625rem;
      -webkit-box-flex: 0;
      -ms-flex: none;
      flex: none;
      display: inline-block;
      line-height: 3.125rem;
    }

    #appendAddress .maleall .males .address {
      position: absolute !important;
      right: 1.25rem !important;
      top: 0;
    }

    .maleall .el-select {
      width: 65%;
      float: right;
      position: relative;
    }

    #address {
      flex: 1;
      line-height: 3.125rem;

      .mint-button--default {
        line-height: 3.125rem;
        text-align: left;
        font-size: 16px;
      }
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>


  .topicon {
    position: absolute;
    top: 55px;
    left: 0.938rem;
    z-index: 10;
  }

  .tabnav {
    margin-top: 40px;
  }

  .recipients {
    width: 100%;
    height: 11rem;
    margin-top: 0.625rem;
    background-color: #fff;
    padding: 0.938rem 0.875rem 0.938rem 0.969rem;

    .top {
      display: flex;
      justify-content: space-between;

      .img {
        width: 4.375rem;
        height: 4.406rem;
        background-color: #666;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .top_right {
        flex: 1;
        margin-left: 0.656rem;

        .titles {
          text-align: left;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-size: 0.875rem;
          color: #333;
        }

        .specification {
          color: #666;
          font-size: 0.75rem;
          text-align: left;
          margin-top: 0.3rem;
        }
      }
    }

    .leaveWords {
      width: 100%;
      height: 3.813rem;
      background-color: #f8f8f8;
      border-radius: 0.313rem;
      margin-top: 0.906rem;

      textarea {
        width: 100%;
        height: 3.813rem;
        background-color: #f8f8f8;
        border-radius: 0.313rem;
        border: none;
      }
    }
  }

  .add-info {
    overflow-y: scroll;
    width: 100%;
    background: #fff;
    max-height: 50vh;
    padding-top: 0.625rem;
  }

  .addr {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    align-items: center;
    background: #fff;
    padding: 0.875rem;

    p {
      flex: 6;
      text-align: justify;
      font-weight: bold;
      padding-right: 1rem;
      color: #333;
      font-size: 16px;
      margin-left: 0.916rem;

      span {
        font-weight: normal;
        color: #666;
        display: -webkit-box;
        font-size: 14px;
        margin-top: 0.375rem;
      }
    }

    i {
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;
      font-size: 22px;

      .fa-map-marker {
        line-height: 1.5rem;
        margin-right: 0.625rem;
        font-size: 22px;
        color: #333;
        padding-right: 0.5rem;
      }

      .fa-angle-right {
        line-height: 1.5rem;
        font-size: 24px;
        color: #c9c9c9;
      }
    }
  }

  .posbtn {
    position: fixed;
    bottom: 1.69rem;
    left: 0;
    width: 100%;
    height: 2.5rem;
    border-radius: 1.25rem;

    .btn {
      margin: 0 2rem;
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 0.938rem;
      color: #fff;
      background-color: #f14e4e;
      border-radius: 1.25rem;
    }
  }

  .set-address {
    .van-cell {
      padding: 10px 12px;

      .van-cell__title {
        flex: none;
        color: #555;
        text-align: left;
      }

      .van-cell__value {
        input {
          color: #555;
          width: 100%;
        }
      }
    }

    /deep/ .van-cell:active {
      background-color: #fff !important;
    }
  }

  .van-inp.van-cell {
    font-size: 16px;

    /deep/ .van-field__label {
      color: #333;
    }

    /deep/ input::placeholder {
      color: #555;
    }
  }
</style>
