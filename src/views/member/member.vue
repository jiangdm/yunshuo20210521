<template>
  <div>
    <div id="member-all" v-show="template" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <!--{{ $i18n.t("home.输入关键词搜索") }}<button @click="switch1">切换</button>-->

      <!--旧装修修改部分 start-->
      <div v-if="!isDecorate">
        <template v-for="(item, index) in designer">
          <component
            :key="index"
            v-if="item.params && member_order.order"
            :is="item.temp"
            :datas="item"
            :isClick="isMemberGrade"
            :Params="item.params"
            :Order="item.data"
            :member_item="member_item"
            :all="designer.length"
            :index="index"
            :member_order="member_order"
            :notShow="notShow"
            @openQrCode="openQrCode"
          >
          </component>
        </template>
      </div>
      <!--旧装修修改部分 end-->

      <!--新装修页面-->
      <div v-if="isDecorate">
        <template v-for="(item, index) in components">
          <component
            :key="index"
            :is="item.component_key"
            :isBottom="isBottom"
            :lastIndex="lastIndex"
            :btnFlag="btnFlag"
            :id="item.id"
            :datas="item.remote_data"
            :index="index"
            :component_key="item.component_key"
            :isClick="isMemberGrade"
            :member_item="member_item"
            :all="components.length"
            :member_order="member_order"
            :page_id="page_id"
            :notShow="notShow"
            @openQrCode="openQrCode"
          >
          </component>
        </template>
      </div>
      <!--新装修页面end-->

      <!--底部版权部分-->
      <section v-show="template == '03'">
        <div class="home" v-if="showDiy">
          <template v-for="(item, index) in showDiy">
            <component :key="index" :is="item.temp" :datas="item" :home="true" :index="index" :all="designer.length - 1" :tag="345"> </component>
          </template>
          <!-- <div style="height: 3.3125rem;"></div> -->
        </div>
        <van-button type="primary" style="margin: 0.875rem auto; width: 90%;" size="large" color="#f15353" @click="outInfo($event)" v-if="myType == 5 || wechat_login_mode"
          >{{ $i18n.t("member.退出登录") }}
        </van-button>
        <!-- 版权图片 -->
        <img :src="copyrightImg" alt="" v-if="!fun.isTextEmpty(copyrightImg)" class="copyrightImg" />
        <!-- 版权图片 end -->
        <div class="copyright">©{{ copyright }}&nbsp;</div>
        <div class="copyright">
          <!--v1.1.042-->
          <template v-if="fun.isApp()">
            <router-link :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })">用户协议</router-link>
            和
            <router-link :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })">隐私政策</router-link>
          </template>
        </div>
        <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
        <div style="height: 1rem; clear: both;"></div>
      </section>
      <!--底部版权部分end-->

      <!--不启用装修的部分-->
      <div id="member" style="position: relative;" v-show="template != '03'">
        <div class="header">
          <div class="header-info">
            <div class="left">
              <img :src="avatar" />
            </div>
            <div class="user-info">
              <div class="user-name" id="name-one">
                <span id="name-a">{{ nickname }}</span>
                <span class="user-other" id="name-b" v-if="level_name && show_member_id != 1">{{ $i18n.t("extension.会员") }}ID:{{ uid }} </span>
              </div>
              <div class="name_invite" v-if="isGeneralize && isshowInvit">
                <input type="hidden" v-model="this.inviteCode" />
                {{ $i18n.t("member.邀请码") }}：{{ inviteCode }}
                <button class="copybtn" v-clipboard:copy="this.inviteCode" v-clipboard:success="onCopy" v-clipboard:error="onError">
                  {{ $i18n.t("member.复制") }}
                </button>
              </div>
              <div class="user-name"></div>
            </div>
            <div class="member-box" @click="gotoMemberGrade" v-if="isMemberGrade" style="z-index: 39;">
              <i class="iconfont icon-member-enter"></i>
              <div class="font">{{ level_name }}</div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
        </div>
        <div id="userinfo">
          <ul>
            <li v-if="member_item.consume_coupon_show && member_item.consume_coupon_show.is_show == 1">
              <router-link :to="fun.getUrl('CardIndex')">
                <span> <small></small>{{ member_item.consume_coupon_show.amount }}</span>
                <br />{{ member_item.consume_coupon_show.text }}
              </router-link>
            </li>
            <li v-if="integral_show && integral_show.is_show == 1">
              <router-link :to="fun.getUrl('Integral_love')">
                <span> <small></small>{{ integral_show.data }}</span>
                <br />{{ integral_show.text }}
              </router-link>
            </li>
            <li v-if="love_obj.unable_love_show == 1">
              <router-link :to="fun.getUrl('love_index')">
                <span> <small></small>{{ love_obj.unable_data }}</span>
                <br />{{ love_obj.unable_text }}
              </router-link>
            </li>
            <li v-if="love_obj.usable_love_show == 1">
              <router-link :to="fun.getUrl('love_index')">
                <span> <small></small>{{ love_obj.usable_data }}</span>
                <br />{{ love_obj.usable_text }}
              </router-link>
            </li>
            <li v-if="credit.is_show == 1">
              <router-link :to="fun.getUrl('balance')">
                <span>
                  <small>{{ $i18n.t("money") }}</small
                  >{{ credit.data }}</span
                >
                <br />{{ credit.text }}
              </router-link>
            </li>
            <li v-if="integral.is_show == 1">
              <router-link :to="fun.getUrl('integral_v2')">
                <span>{{ integral.data }}</span>
                <br />{{ integral.text }}
              </router-link>
            </li>
            <li v-if="coupon">
              <router-link :to="fun.getUrl('extension')">
                <span>
                  <small>{{ $i18n.t("money") }}</small
                  >{{ coupon || "0.00" }}</span
                >
                <br />{{ name_of_withdrawal_text }}
              </router-link>
            </li>
          </ul>
        </div>
        <div id="orderlist">
          <div class="ordertltie">
            <router-link :to="fun.getUrl('orderlist', { status: '0' })">
              <div class="spare"></div>
              <div class="ordername">{{ $i18n.t("member.我的订单") }}</div>
              <div class="">
                <i class="fa fa-angle-right"></i>
              </div>
            </router-link>
          </div>
          <div class="order_all">
            <router-link :to="fun.getUrl('orderlist', { status: '1' })">
              <div class="order_pub">
                <div class="badge" v-if="waitPay != 0">{{ waitPay }}</div>
                <i class="iconfont icon-stay_pay"></i>
                <br />{{ $i18n.t("member.待付款") }}
              </div>
            </router-link>
            <router-link :to="fun.getUrl('orderlist', { status: '2' })">
              <div class="order_pub">
                <div class="badge " v-if="waitSend != 0">{{ waitSend }}</div>
                <i class="iconfont icon-stay_send"></i>
                <br />{{ $i18n.t("member.待发货") }}
              </div>
            </router-link>
            <router-link :to="fun.getUrl('orderlist', { status: '3' })">
              <div class="order_pub">
                <div class="badge " v-if="waitReceive != 0">
                  {{ waitReceive }}
                </div>
                <i class="iconfont icon-stay_receive"></i>
                <br />{{ $i18n.t("member.待收货") }}
              </div>
            </router-link>
            <!--aftersaleslist-->
            <router-link :to="fun.getUrl('aftersaleslist')">
              <div class="order_pub">
                <div class="badge" v-if="waitrRefund != 0">
                  {{ waitrRefund }}
                </div>
                <i class="iconfont icon-stay_refund"></i>
                <br />{{ $i18n.t("member.售后列表") }}
              </div>
            </router-link>
          </div>
        </div>

        <!-- 酒店订单 -->
        <div id="hotel_order" v-if="is_hotel">
          <router-link
            :to="
              fun.getUrl('hotelOrderlist', {
                status: '0',
                orderType: 'hotel'
              })
            "
          >
            <div class="title_box">
              <div class="spare"></div>
              <span>{{ PageNameList.hotels }}{{ $i18n.t("member.订单") }}</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </router-link>
          <ul class="item_box">
            <li>
              <router-link
                :to="
                  fun.getUrl('hotelOrderlist', {
                    status: '1',
                    orderType: 'hotel'
                  })
                "
              >
                <div class="badge-hotel" v-if="hotel_order.waitPay != 0">
                  {{ hotel_order.waitPay }}
                </div>
                <img src="../../assets/images/hotel_a.png" />
                <span>{{ $i18n.t("member.待付款") }}</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="
                  fun.getUrl('hotelOrderlist', {
                    status: '2',
                    orderType: 'hotel'
                  })
                "
              >
                <div class="badge-hotel" v-if="hotel_order.waitSure != 0">
                  {{ hotel_order.waitSure }}
                </div>
                <img src="../../assets/images/hotel_b.png" />
                <span>{{ $i18n.t("member.待确认") }}</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="
                  fun.getUrl('hotelOrderlist', {
                    status: '3',
                    orderType: 'hotel'
                  })
                "
              >
                <div class="badge-hotel" v-if="hotel_order.waitEnter != 0">
                  {{ hotel_order.waitEnter }}
                </div>
                <img src="../../assets/images/hotel_c.png" />
                <span>{{ $i18n.t("member.待入住") }}</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="
                  fun.getUrl('hotelOrderlist', {
                    status: '5',
                    orderType: 'hotel'
                  })
                "
              >
                <div class="badge-hotel" v-if="hotel_order.waitCheckOut != 0">
                  {{ hotel_order.waitCheckOut }}
                </div>
                <img src="../../assets/images/hotel_d.png" />
                <span>{{ $i18n.t("member.待退房") }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 拼团订单 -->
        <div id="orderlist" v-if="is_open_fight_groups">
          <div class="ordertltie">
            <router-link
              :to="
                fun.getUrl('GroupOrderlist', {
                  status: '0',
                  orderType: 'groups'
                })
              "
            >
              <div class="spare"></div>
              <div class="ordername">{{ $i18n.t("member.拼团订单") }}</div>
              <div class="">
                <i class="fa fa-angle-right"></i>
              </div>
            </router-link>
          </div>
          <div class="order_all">
            <router-link
              :to="
                fun.getUrl('GroupOrderlist', {
                  status: '2',
                  orderType: 'groups'
                })
              "
            >
              <div class="order_pub">
                <div class="badge" v-if="groups_order.waitPay != 0">
                  {{ groups_order.waitPay }}
                </div>
                <i class="iconfont icon-stay_pay"></i>
                <br />{{ $i18n.t("member.待付款") }}
              </div>
            </router-link>
            <router-link
              :to="
                fun.getUrl('GroupOrderlist', {
                  status: '3',
                  orderType: 'groups'
                })
              "
            >
              <div class="order_pub">
                <div class="badge " v-if="groups_order.waitSure != 0">
                  {{ groups_order.waitSure }}
                </div>
                <i class="iconfont icon-stay_send"></i>
                <br />{{ $i18n.t("member.待发货") }}
              </div>
            </router-link>
            <router-link
              :to="
                fun.getUrl('GroupOrderlist', {
                  status: '4',
                  orderType: 'groups'
                })
              "
            >
              <div class="order_pub">
                <div class="badge " v-if="groups_order.waitEnter != 0">
                  {{ groups_order.waitEnter }}
                </div>
                <i class="iconfont icon-stay_receive"></i>
                <br />{{ $i18n.t("member.待收货") }}
              </div>
            </router-link>
            <!--aftersaleslist-->
            <router-link :to="fun.getUrl('aftersaleslist', {}, { goodtype: 'groups' })">
              <div class="order_pub">
                <div class="badge" v-if="groups_order.waitCheckOut != 0">
                  {{ groups_order.waitCheckOut }}
                </div>
                <i class="iconfont icon-stay_refund"></i>
                <br />{{ $i18n.t("member.售后列表") }}
              </div>
            </router-link>
          </div>
        </div>

        <!-- 抢团订单 -->
        <div id="orderlist" v-if="is_open_snatch_regiment">
          <div class="ordertltie">
            <router-link
              :to="
                fun.getUrl('orderlist', {
                  status: '0',
                  orderType: 'grabGroup'
                })
              "
            >
              <div class="spare"></div>
              <div class="ordername">抢团订单</div>
              <div class="">
                <i class="fa fa-angle-right"></i>
              </div>
            </router-link>
          </div>
          <div class="order_all">
            <router-link
              :to="
                fun.getUrl('orderlist', {
                  status: '1',
                  orderType: 'grabGroup'
                })
              "
            >
              <div class="order_pub">
                <div class="badge" v-if="grabGroup_order.waitPay != 0">
                  {{ grabGroup_order.waitPay }}
                </div>
                <i class="iconfont icon-stay_pay"></i>
                <br />{{ $i18n.t("member.待付款") }}
              </div>
            </router-link>
            <router-link
              :to="
                fun.getUrl('orderlist', {
                  status: '2',
                  orderType: 'grabGroup'
                })
              "
            >
              <div class="order_pub">
                <div class="badge " v-if="grabGroup_order.waitSure != 0">
                  {{ grabGroup_order.waitSure }}
                </div>
                <i class="iconfont icon-stay_send"></i>
                <br />{{ $i18n.t("member.待发货") }}
              </div>
            </router-link>
            <router-link
              :to="
                fun.getUrl('orderlist', {
                  status: '3',
                  orderType: 'grabGroup'
                })
              "
            >
              <div class="order_pub">
                <div class="badge " v-if="grabGroup_order.waitEnter != 0">
                  {{ grabGroup_order.waitEnter }}
                </div>
                <i class="iconfont icon-stay_receive"></i>
                <br />{{ $i18n.t("member.待收货") }}
              </div>
            </router-link>
            <!--aftersaleslist-->
            <router-link :to="fun.getUrl('aftersaleslist', {}, { goodtype: 'grab' })">
              <div class="order_pub">
                <div class="badge" v-if="grabGroup_order.waitCheckOut != 0">
                  {{ grabGroup_order.waitCheckOut }}
                </div>
                <i class="iconfont icon-stay_refund"></i>
                <br />{{ $i18n.t("member.售后列表") }}
              </div>
            </router-link>
          </div>
        </div>

        <!-- 网约车订单 弃用了 -->
        <div id="hotel_order" v-if="false">
          <router-link
            :to="
              fun.getUrl('onlineCarOrderlist', {
                status: '0',
                orderType: 'onlineCar'
              })
            "
          >
            <div class="title_box">
              <div class="spare"></div>
              <span>{{ $i18n.t("member.网约车订单") }}</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </router-link>
          <ul class="item_box">
            <li>
              <router-link
                :to="
                  fun.getUrl('onlineCarOrderlist', {
                    status: '2',
                    orderType: 'onlineCar'
                  })
                "
              >
                <!-- <div class="badge-hotel" v-if="hotel_order.waitPay != 0">
                    {{ hotel_order.waitPay }}
                  </div> -->
                <img src="../../assets/images/order_card_a.png" />
                <span>{{ $i18n.t("member.待审核") }}</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="
                  fun.getUrl('onlineCarOrderlist', {
                    status: '3',
                    orderType: 'onlineCar'
                  })
                "
              >
                <!-- <div class="badge-hotel" v-if="hotel_order.waitSure != 0">
                    {{ hotel_order.waitSure }}
                  </div> -->
                <img src="../../assets/images/order_card_b.png" />
                <span>{{ $i18n.t("member.待贷款") }}</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="
                  fun.getUrl('onlineCarOrderlist', {
                    status: '4',
                    orderType: 'onlineCar'
                  })
                "
              >
                <!-- <div class="badge-hotel" v-if="hotel_order.waitEnter != 0">
                    {{ hotel_order.waitEnter }}
                  </div> -->
                <img src="../../assets/images/order_card_c.png" />
                <span>{{ $i18n.t("member.待提车") }}</span>
              </router-link>
            </li>
            <li>
              <router-link :to="fun.getUrl('aftersaleslist')">
                <!-- <div class="badge-hotel" v-if="hotel_order.waitCheckOut != 0">
                    {{ hotel_order.waitCheckOut }}
                  </div> -->
                <img src="../../assets/images/order_card_d.png" />
                <span>{{ $i18n.t("member.售后列表") }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 租赁订单 -->
        <div id="hotel_order" v-if="is_open_lease_toy">
          <router-link
            :to="
              fun.getUrl('lease_toyOrderlist', {
                status: '0',
                orderType: 'lease_toy'
              })
            "
          >
            <div class="title_box">
              <div class="spare"></div>
              <span>{{ $i18n.t("member.租赁订单") }}</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </router-link>
          <ul class="item_box">
            <li>
              <router-link
                :to="
                  fun.getUrl('lease_toyOrderlist', {
                    status: '1',
                    orderType: 'lease_toy'
                  })
                "
              >
                <div class="badge-hotel" v-if="lease_order_one.total != 0">
                  {{ lease_order_one.total }}
                </div>
                <img src="../../assets/images/rent_order_a.png" />
                <span>{{ $i18n.t("member.待支付") }}</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="
                  fun.getUrl('lease_toyOrderlist', {
                    status: '2',
                    orderType: 'lease_toy'
                  })
                "
              >
                <div class="badge-hotel" v-if="lease_order_two.total != 0">
                  {{ lease_order_two.total }}
                </div>
                <img src="../../assets/images/rent_order_b.png" />
                <span>{{ $i18n.t("member.待发货") }}</span>
              </router-link>
            </li>
            <li>
              <router-link
                :to="
                  fun.getUrl('lease_toyOrderlist', {
                    status: '3',
                    orderType: 'lease_toy'
                  })
                "
              >
                <div class="badge-hotel" v-if="lease_order_three.total != 0">
                  {{ lease_order_three.total }}
                </div>
                <img src="../../assets/images/rent_order_c.png" />
                <span>{{ $i18n.t("member.待收货") }}</span>
              </router-link>
            </li>
            <!-- <li>
                <router-link
                  :to="
                    fun.getUrl('lease_toyOrderlist', {
                      status: '4',
                      orderType: 'lease_toy'
                    })
                  "
                >

                  <img src="../../assets/images/hotel_d.png" />
                  <span>已完成</span>
                </router-link>
              </li> -->
            <li>
              <router-link
                :to="
                  fun.getUrl('lease_toyOrderlist', {
                    status: '4',
                    orderType: 'lease_toy'
                  })
                "
              >
                <div class="badge-hotel" v-if="lease_order_four.total != 0">
                  {{ lease_order_four.total }}
                </div>
                <img src="../../assets/images/rent_order_d.png" />
                <span>{{ $i18n.t("member.待归还") }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div id="tool">
          <div class="title">
            <div class="spare"></div>
            <h3>{{ $i18n.t("member.实用工具") }}</h3>
          </div>

          <ul class="tool-box">
            <li>
              <router-link :to="fun.getUrl('collection', { selected: '1' })">
                <i class="iconfont icon-fontclass-1"></i>
                <div>{{ $i18n.t("member.收藏") }}</div>
              </router-link>
            </li>
            <li>
              <router-link :to="fun.getUrl('footprint', { selected: '1' })">
                <i class="iconfont icon-fontclass-zuji2"></i>
                <div>{{ $i18n.t("member.足迹") }}</div>
              </router-link>
            </li>
            <li>
              <router-link :to="fun.getUrl('address', { selected: '1' })">
                <i class="iconfont icon-fontclass-dizhi"></i>
                <div>{{ $i18n.t("member.地址管理") }}</div>
              </router-link>
            </li>
            <li>
              <router-link :to="fun.getUrl('info', { item: member_item })">
                <i class="iconfont icon-fontclass-shezhi"></i>
                <div>{{ $i18n.t("member.设置") }}</div>
              </router-link>
            </li>

            <li v-for="(item, i) in pluginsList.tool" :key="i" v-if="pluginsList.tool && notShow.indexOf(item.url) < 0">
              <router-link :to="fun.getUrl(item.url)">
                <!-- <i class="iconfont bankCard" :class="item.class"></i> -->
                <i class="iconfont" :class="item.class"></i>
                <div>{{ item.title }}</div>
              </router-link>
            </li>

            <li v-if="isApp">
              <router-link :to="fun.getUrl('message', { selected: '1' })">
                <i class="iconfont icon-icon"></i>
                <div>{{ $i18n.t("member.消息通知") }}</div>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="carts" v-if="template !== '02'">
          <van-collapse v-model="activeNames">
            <van-collapse-item name="1" v-if="(store_set && store_set.is_open_cashier == 1) || is_stroeWithdraw || (pluginsList.merchant && pluginsList.merchant.length > 0)">
              <div slot="title" class="title">
                <div class="spare"></div>
                <h3>{{ $i18n.t("member.商家管理") }}</h3>
              </div>

              <div class="cart">
                <div class="list1" v-if="pluginsList.merchant && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.merchant" :key="i" @click="pluginGoto(item)">
                  <van-icon slot="icon" class="iconfont" :class="item.class" :size="item.class==='icon-fontclass-yuncang'?'1.2rem':'1.625rem'" color="#f15353" style="margin-right: 0.375rem;"></van-icon>
                  <span slot="text">{{ item.title }}</span>
                  <i class="fa fa-angle-right"></i>
                </div>
              </div>
            </van-collapse-item>
            <van-collapse-item name="2">
              <div slot="title" class="title">
                <div class="spare"></div>
                <h3>{{ $i18n.t("member.营销互动") }}</h3>
              </div>

              <div class="cart">
                <div v-if="relation_switch" @click="openQrCode('block')">
                  <div class="list1">
                    <van-icon slot="icon" class="iconfont icon-member_code" size="1.625rem" color="#f15353" style="margin-right: 0.375rem;"></van-icon>
                    <span slot="text">{{ $i18n.t("member.二维码") }}</span>
                    <i class="fa fa-angle-right"></i>
                  </div>
                </div>

                <router-link :to="fun.getUrl('myEvaluation', { selected: '1' })">
                  <div class="list1">
                    <van-icon slot="icon" class="iconfont icon-member_comment" size="1.625rem" color="#f15353" style="margin-right: 0.375rem;"></van-icon>
                    <span slot="text">{{ $i18n.t("member.评论") }}</span>
                    <i class="fa fa-angle-right"></i>
                  </div>
                </router-link>

                <router-link :to="fun.getUrl('myRelationship', { selected: '1' })">
                  <div class="list1">
                    <van-icon slot="icon" class="iconfont icon-member_relation" size="1.625rem" color="#f15353" style="margin-right: 0.375rem;"></van-icon>
                    <span slot="text">{{ member_agent }}</span>
                    <i class="fa fa-angle-right"></i>
                  </div>
                </router-link>

                <router-link :to="fun.getUrl('coupon', { selected: '1' })">
                  <div class="list1">
                    <van-icon slot="icon" class="iconfont icon-member_quan" size="1.625rem" color="#f15353" style="margin-right: 0.375rem;"></van-icon>
                    <span slot="text">{{ $i18n.t("member.优惠券") }}</span>
                    <i class="fa fa-angle-right"></i>
                  </div>
                </router-link>

                <div>
                  <div class="list1" v-if="pluginsList.market && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.market" :key="i" @click="pluginGoto(item)">
                    <van-icon slot="icon" class="iconfont" :class="item.class" size="1.625rem" color="#f15353" style="margin-right: 0.375rem;"></van-icon>
                    <span slot="text">{{ item.title }}</span>
                    <div class="Badge" v-show="item.total > 0">{{ item.total > 99 ? "99+" : item.total }}</div>
                    <i class="fa fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </van-collapse-item>
            <van-collapse-item name="3">
              <div slot="title" class="title">
                <div class="spare"></div>
                <h3>{{ $i18n.t("member.资产权益") }}</h3>
              </div>

              <div class="cart">
                <div class="list1" v-if="pluginsList.asset_equity && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.asset_equity" :key="i" @click="pluginGoto(item)">
                  <div class="list1">
                    <van-icon slot="icon" class="iconfont" :class="item.class" size="1.625rem" color="#f15353" style="margin-right: 0.375rem;"></van-icon>
                    <span slot="text">{{ item.title }}</span>
                    <i class="fa fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>

        <!-- 模板二 -->
        <div id="templet_box" v-if="template === '02'">
          <!-- 我的推广 -->
          <div class="extension_plate" v-if="(store_set && store_set.is_open_cashier == 1) || is_stroeWithdraw || (pluginsList.merchant && pluginsList.merchant.length > 0)">
            <h1>
              <div class="spare"></div>
              {{ $i18n.t("member.商家管理") }}
            </h1>
            <ul class="box">
              <li v-if="pluginsList.merchant && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.merchant" :key="i" @click="pluginGoto(item)">
                <i class="iconfont" :class="item.class"></i>
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </div>

          <div class="extension_plate">
            <h1>
              <div class="spare"></div>
              {{ $i18n.t("member.营销互动") }}
            </h1>
            <ul class="box">
              <li v-if="relation_switch" @click="openQrCode('block')">
                <i class="iconfont icon-fontclass-erweima" style="width: 1.7rem;"></i>
                <span>{{ $i18n.t("member.二维码") }}</span>
              </li>

              <li>
                <router-link :to="fun.getUrl('myEvaluation', { selected: '1' })">
                  <i class="iconfont icon-fontclass-pinglun" style="width: 1.7rem;"></i>
                  <span>{{ $i18n.t("member.评论") }}</span>
                </router-link>
              </li>
              <li>
                <router-link :to="fun.getUrl('myRelationship', { selected: '1' })">
                  <i class="iconfont icon-fontclass-kehu" style="width: 1.7rem;"></i>
                  <span>{{ member_agent }}</span>
                </router-link>
              </li>
              <!-- <li>
                <router-link :to="fun.getUrl('Bonus', { selected: '1' })">
                     <img src="../../assets/images/extension/extension(55).png" alt="" style="width: 1.7rem;">
                  <span>奖金池</span>
                </router-link>
              </li> -->
              <li>
                <router-link :to="fun.getUrl('coupon', { selected: '1' })">
                  <i class="iconfont icon-fontclass-youhuiquan" style="width: 1.7rem;"></i>
                  <span>{{ $i18n.t("member.优惠券") }}</span>
                </router-link>
              </li>

              <li v-if="pluginsList.market && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.market" :key="i" @click="pluginGoto(item)">
                <i class="iconfont" :class="item.class"></i>
                <span>{{ item.title }}</span>
                <div class="Badge" v-show="item.total > 0">{{ item.total > 99 ? "99+" : item.total }}</div>
              </li>
            </ul>
          </div>

          <div class="extension_plate">
            <h1>
              <div class="spare"></div>
              {{ $i18n.t("member.资产权益") }}
            </h1>
            <ul class="box">
              <li v-if="pluginsList.asset_equity && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.asset_equity" :key="i" @click="pluginGoto(item)">
                <i class="iconfont" :class="item.class"></i>
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </div>
        </div>
        <van-button type="primary" style="margin: 0.875rem auto; width: 90%;" size="large" color="#f15353" @click="outInfo($event)" v-if="myType == 5 || wechat_login_mode"
          >{{ $i18n.t("member.退出登录") }}
        </van-button>
        <!-- 版权图片 -->
        <img :src="copyrightImg" v-if="!fun.isTextEmpty(copyrightImg)" alt="" class="copyrightImg" />
        <!-- 版权图片 end-->
        <div class="copyright">©{{ copyright }}&nbsp;</div>
        <div class="copyright">
          <!--v1.1.042-->
          <template v-if="fun.isApp()">
            <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })">用户协议 </router-link>
            和
            <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })">隐私政策 </router-link>
          </template>
        </div>
        <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
        <div style="height: 1rem; clear: both;"></div>
      </div>
      <!--不启用装修的部分end-->

      <!--海报部分-->
      <!-- 新海报 -->
      <yz-goodsposter v-model="posterShow" :posterData="poster_Data" :defaultImg="poster" :width="`18.875rem`" v-on:finish="uploadImageM"></yz-goodsposter>

      <!-- 旧海报(坐等废弃,插件名:超级海报) -->
      <!-- <div id="ewm" ref="hook" @click="openQrCode('none')" @touchmove.stop>
        <div class="pic" v-if="poster && poster_Data.center_show != 1">
          <img :src="poster" alt="二维码" />
        </div>
        <div
          class="pic"
          v-if="poster && poster_Data.center_show == '1'"
          :style="{ left: !loadingImg ? '50%' : '-100%' }"
        >
          <div class="diy_poster" id="code_box" v-show="loadingImg">
            <img :src="poster_Data.background" alt="" class="ewm_bgImg" />
            <div
              class="diy_poster_child"
              v-for="(item, index) in poster_Data.style_data"
              :key="index"
              :style="{
                width: `${item.width / 32}rem`,
                height: `${item.height / 32}rem`,
                left: `${item.left / 32}rem`,
                top: `${item.top / 32}rem`
              }"
            >
              <img
                :src="item.src"
                alt=""
                :style="{ width: `${item.width / 32}rem`, height: `${item.height / 32}rem` }"
                v-if="item.type == 'head' || item.type == 'qr' || item.type == 'img'"
              />
              <p v-if="item.type == 'nickname'" :style="{ color: `${item.color}`, fontSize: `${item.size / 32}rem` }">
                {{ item.src }}
              </p>
              <canvas :id="`ewmCanvas_${index}`" v-if="item.type == 'qr_shop' || item.type == 'qr_app_share'"></canvas>
            </div>
          </div>
          <div class="diy_poster" v-show="!loadingImg" style="backgroundColor:transparent;">
            <img style="width: 100%;height: 100%" id="thecanvas" />
          </div>
        </div>
        <div class="pic_warn" v-show="loadingImg">
          {{ $i18n.t('member.二维码生成中') }}
        </div>
      </div> -->
      <!--海报部分end-->

      <!--弹窗广告部分-->
      <div class="cover">
        <div class="mask" v-show="advertising.is_default === 1">
          <div
            class="modal-mask"
            v-if="advertising.datas && advertising.datas.background_over && popShow"
            :style="{ backgroundColor: `rgba(0, 0, 0, ${advertising.datas.background_over / 100})` }"
          ></div>
          <div class="mask-blank">
            <div class="pop" v-if="popShow" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
              <div class="pop-image">
                <img :src="advertising.image" @click="turnTo" />
                <div class="minLink" v-if="advertising.url_type == 2" @click.stop v-html="advertising.html"></div>
                <div class="icon_close">
                  <i class="iconfont icon-close11" @click="closePop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--弹窗广告部分end-->
    </div>
  </div>
</template>

<script>
import member from "./membercontroller";

export default member;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/member.scss";

.minLink {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.cover .mask-blank .pop {
  width: 65%;
  position: fixed;
  z-index: 8888;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.cover .mask-blank .pop.pcStyle {
  width: 270px;
}

.cover .mask-blank .pop .pop-image {
  position: relative;
}

.cover .mask-blank .pop .pop-image img {
  width: 100%;
  height: 100%;
}

.cover .mask-blank .pop .pop-image .icon_close {
  top: 0;
  right: 0;
  position: absolute;
  background-color: #333;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -0.75rem;
  margin-right: -0.75rem;
  border-radius: 50%;
}

.cover .mask-blank .pop .pop-image .icon_close {
  color: #fff;
}

.poster-popup-class {
  background-color: transparent !important;
}

.modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
}
</style>
