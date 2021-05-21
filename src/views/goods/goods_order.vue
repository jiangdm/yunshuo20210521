<template>
  <div id="goodsinfo" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text="商品订单详情"></c-title>
    <div style="height: 40px;"></div>
    <!-- 配送方式 start -->
    <template v-if="dispatch.length > 0 && !show_address">
      <van-tabs v-model="selected" @click="requestByAddress">
        <van-tab v-show="dispatch.length > 0" v-for="item in dispatch" :name="item.dispatch_type_id" :key="item.dispatch_type_id" :title="item.name"></van-tab>
      </van-tabs>
    </template>
    <template v-if="is_cps && cpsType == '1'">
      <div style="background: #fff; height: 3rem;">
        <input type="text" v-model="cpsTxt" :name="cpsTxt" placeholder="请输入帐号" style="width: 100%; height: 100%; text-indent: 15px;" id="cpsinp" />
      </div>
    </template>
    <!-- 快递 -->
    <div class="addr" @click="showAddressFun" v-if="selected == '0' && !show_address">
      <i class="fa fa-map-marker"></i>
      <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
        收件人:{{ realname }} {{ mobile }}
        <br />
        <span>{{ address }}</span>
      </p>
      <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
      <i v-show="realname" class="fa fa-angle-right"></i>
    </div>
    <div>
      <div v-show="selected == item.dispatch_type_id" v-for="item in dispatch" :key="item.dispatch_type_id">
        <!-- <mt-tab-container-item :id="item.dispatch_type_id" v-for="item in dispatch" :key="item.dispatch_type_id"> -->
        <template v-if="selected == '1'">
          <!-- 快递 -->
          <div class="addr" @click="showAddressFun" v-if="!show_address">
            <i class="fa fa-map-marker"></i>
            <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
              收件人:{{ realname }} {{ mobile }}
              <br />
              <span>{{ address }}</span>
            </p>
            <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
            <i v-show="realname" class="fa fa-angle-right"></i>
          </div>
        </template>
        <template v-if="selected == '2'">
          <!-- 门店自提 -->
          <div class="addr">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              自提地点:{{ store_info.store_name }} {{ store_info.store_mobile }}
              <br />
              <span>{{ store_info.store_address }}</span>
            </p>
          </div>

          <div style="height: 0.3125rem;"></div>
          <div v-if="store_info.delivery_information == null || store_info.delivery_information == 1">
            <van-field class="inp-field" v-model="linkinfo.name" :label="recipient_name" :placeholder="`请输入${recipient_name}`" center clearable />
            <van-field class="inp-field" v-model="linkinfo.mobile" :label="recipient_mobile" :placeholder="`请输入${recipient_mobile}`" center clearable />
            <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
          </div>
        </template>
        <template v-if="selected == '3'">
          <!-- 门店配送（送货上门） -->
          <div class="addr" @click="showAddressFun" v-if="!show_address">
            <i class="fa fa-map-marker"></i>
            <p v-show="realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">
              收件人:{{ realname }} {{ mobile }}
              <br />
              <span>{{ address }}</span>
            </p>
            <p v-show="!realname" style="flex: 1; text-align: left; padding: 0 0.625rem;">请点击选择地址</p>
            <i v-show="realname" class="fa fa-angle-right"></i>
          </div>
          <div style="height: 0.3125rem;"></div>
          <div class="addr">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              自提地点:{{ store_info.store_name }} {{ store_info.store_mobile }}
              <br />
              <span>{{ store_info.store_address }}</span>
            </p>
          </div>
          <div style="height: 0.3125rem;"></div>
          <!-- 配送说明 -->
          <div class="addr" v-if="is_open_store_delivery" style="text-align: left;">
            <div class="detail-item" style="width: 100%;">
              <p class="detail-title">配送范围</p>
              <!-- 配送说明 -->
              <p v-html="delivery_note" style="margin: 1rem 0;"></p>
              <!-- 配送范围地图 -->
              <div style="display: flex; justify-content: flex-end;">
                <div @click="showDeliveryMap" style="text-align: center; width: 5rem; border-radius: 2rem; border: 1px solid rgb(204, 204, 204); padding: 0.25rem;">
                  配送范围
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="selected == '8'">
          <!-- 自提点（杨朗） -->
          <div class="addr" v-if="!fun.isTextEmpty(defaultSelfCarry)">
            <i class="fa fa-map-marker"></i>
            <p style="flex: 1; text-align: left; padding: 0 0.625rem;">
              {{ deliverName }}:{{ defaultSelfCarry.deliver_name }} {{ defaultSelfCarry.deliver_mobile }}
              <br />
              <span>{{ defaultSelfCarry.full_address }}</span>
            </p>
            <span style="border: 1px solid #f15353; padding: 0 0.25rem; border-radius: 0.25rem; color: #f15353;" @click.stop="replaceZT()" v-if="$route.query.tag != 'communityBuy'">更换</span>
          </div>
          <div class="addr" v-if="fun.isTextEmpty(defaultSelfCarry)">
            <div v-if="!isQuest_ing">抱歉，您所在地区暂无{{ deliverName }}，或<i style="color: #f15353;" @click="replaceZT('noLocation')">手动切换位置</i></div>
            <div v-if="isQuest_ing">正在获取您附近{{ deliverName }}信息 ...</div>
          </div>

          <div style="height: 0.3125rem;"></div>
          <van-field class="inp-field" v-model="distributionUserName" label="提货人姓名" placeholder="请输入提货人姓名" center clearable />
          <van-field class="inp-field" v-model="distributionUserMobile" label="提货人手机" placeholder="请输入提货人手机" center clearable />
          <p class="dis_warn">友情提示：请核对手机号码无误后再提交订单！</p>
        </template>
        <div style="height: 0.3125rem;"></div>
        <!-- </mt-tab-container-item> -->
      </div>
    </div>

    <div class="prepaid-recharge" v-if="show_recharge_mobile">
      <!-- 话费慢充-->
      <van-cell-group>
        <van-field v-model="recharge_mobile" type="tel" label="" placeholder="请输入充值手机号码" clearable />
      </van-cell-group>
      <div class="tips" v-html="recharge_tips"></div>
    </div>

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

    <!-- 上传相册模块（备注：相册模块适用于商城商品和供应商商品） start ============   -->
    <template v-if="isPhoto">
      <p class="imgUploaderTitle">
        上传图片<i style="color: #7d7d7d;">(选择不低于{{ min_count }}张，不高于{{ max_count }}张)</i>
      </p>
      <div class="imgUploader ">
        <template v-for="(val, index) in fileList1">
          <div class="photoBox" :key="index">
            <img :src="val" style="width: 100%;" @click="showimg(index)" />
            <i @click="removeImg(index)"></i>
          </div>
        </template>
        <div @click="chooseImage" v-if="checkedImg && fileList1.length < max_count" class="wxchooseImg">
          <van-icon name="photograph" />
        </div>
        <van-image-preview v-model="show" :images="fileList1" :start-position="imgIndex"> </van-image-preview>
        <template v-if="!checkedImg && fileList1.length < max_count">
          <van-uploader :after-read="multipleMethod_1" multiple>
            <van-icon name="photograph" />
          </van-uploader>
        </template>
      </div>
    </template>
    <p class="imgUploaderTitle" v-if="isPhoto && storeNo_photo" style="color: #999;"><i style="color: #f15353;">**</i>( 如需上传相册，请选择单个商品下单结算 )</p>
    <!-- 上传相册模块 end ===========-->

    <div class="goods-detail">
      <div class="title" v-if="isRent && !(rent_deposit_free == 0 && rent_free == 0)">
        <i class="iconfont icon-tishi" style="font-size: 1.125rem; color: #f15353;" color="#f15353"></i>
        <span>您还可以免费租{{ rent_free }}件商品!</span>
      </div>
      <div v-for="(item, index) in order_data" :key="index">
        <div class="goods-shop">
          <p>店铺名称：{{ item.shop_name }}</p>
        </div>
        <!--添加租赁信息-->

        <div class="detail_good">
          <div class="goods" v-for="(g, i) in item.order_goods" :key="i">
            <div class="img">
              <img :src="g.thumb" />
            </div>
            <!-- 租赁商品显示 -->
            <div class="warp" v-if="isRent">
              <ul class="inner">
                <li class="name" style="-webkit-box-orient: vertical;">
                  {{ g.title | escapeTitle }}
                </li>
                <br />
                <li class="red">
                  <i class="iconfont icon-rent" style="font-size: 0.75rem; color: #ff9500;" v-if="!(rent_deposit_free == 0 && rent_free == 0)"></i>
                  {{ $i18n.t("money") }}{{ (g.goods_price / g.total).toFixed(2) }}{{ $i18n.t("元") }}/天<span>×{{ g.total }}</span>
                </li>
                <!-- <li>×{{g.total}}</li> -->
              </ul>
              <div class="right">
                <ul class="price">
                  <li class="option">规格: {{ g.goods_option_title }}</li>
                  <br />
                  <li class="right">押金：{{ $i18n.t("money") }}{{ g.has_one_lease_goods.goods_deposit }}</li>
                  <!-- <li>{{$i18n.t('money')}}{{(g.goods_price/g.total)}}</li> -->
                </ul>
                <ul class="rent-choice">
                  <li class="left">
                    <span class="red">租金：{{ $i18n.t("money") }}{{ g.price }}</span
                    >{{ $i18n.t("money") }}{{ g.order_lease_goods[0].lease_price }}{{ $i18n.t("元") }}/天
                  </li>
                </ul>
              </div>
              <div class="diyFormDiv" v-if="g.diy_form">
                <div class="dfBtn" v-if="!g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, null)">
                  填写表单
                </div>
                <div class="dfBtn revise_dy" v-if="g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, g.diy_form.diyform_data_id)">
                  修改表单
                </div>
              </div>
            </div>

            <!-- 租赁商品显示结束 -->

            <!-- 普通商品显示 -->
            <div class="warp" v-if="!isRent">
              <div class="inner">
                <div class="name" style="-webkit-box-orient: vertical;">
                  {{ g.title | escapeTitle }}
                </div>
                <div class="option">规格: {{ g.goods_option_title }}</div>
              </div>
              <div class="price">
                <p>{{ $i18n.t("money") }}{{ (g.price / g.total).toFixed(2) }}</p>
                <p>×{{ g.total }}</p>
              </div>
              <div class="diyFormDiv" v-if="g.diy_form">
                <div class="dfBtn" v-if="!g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, null)">
                  填写表单
                </div>
                <div class="dfBtn revise_dy" v-if="g.diy_form.diyform_data_id" @click="getGoodDFData(g.goods_id, g.diy_form.form_id, g.diy_form.diyform_data_id)">
                  修改表单
                </div>
              </div>
            </div>

            <!-- 普通商品显示结束 -->
          </div>

          <div class="note">
            <div class="left">买家留言:</div>
            <div class="right">
              <input placeholder="50字以内（选填）" v-model.lazy="note[item.pre_id]" @change="noteHandle($event, item, note[item.pre_id])" maxlength="50" type="text" title="" />
            </div>
          </div>
        </div>

        <div class="tbs">
          <div class="num list" v-if="isRent">
            <div v-if="!(rent_deposit_free == 0 && rent_free == 0)">
              <div class="left">会员权益</div>
              <div class="right">
                <van-switch v-model="isOpenRight" active-color="#f15353" inactive-color="#fff" size="23" @change="rentSelect" />
              </div>
            </div>
          </div>
          <div class="num list">
            <div class="left">{{ isRent ? "租金" : "商品金额" }}</div>
            <div class="right">
              <font color="#E84E40">{{ $i18n.t("money") }}{{ item.order_goods_price }}</font>
            </div>
          </div>
          <div class="freight-num list">
            <div class="left">运费:</div>
            <div class="right">
              <font color="#E84E40"> <span> &nbsp;</span>{{ $i18n.t("money") }}{{ item.dispatch_price }} </font>
            </div>
          </div>
          <div class="freight-num list" v-for="(item, i) in item.order_fees" :key="i">
            <div class="left">{{ item.name }}:</div>
            <div class="right">
              <font color="#E84E40"> <span> &nbsp;</span>{{ $i18n.t("money") }}{{ item.amount }} </font>
            </div>
          </div>

          <div class="score list" v-if="item.order_deductions">
            <div v-for="(d, i) in item.order_deductions" :key="i" style="width: 100%; display: block; clear: both; margin-bottom: 2.1875rem;">
              <div class="left ">
                可用{{ parseFloat(d.coin).toFixed(2) }}{{ d.name == "积分" ? integral : d.name }}
                <span>抵扣{{ d.amount }}{{ $i18n.t("元") }}</span>
              </div>
              <div class="right" v-show="good_clicktag == 0">
                <van-switch v-model="d.checked" active-color="#f15353" inactive-color="#fff" size="23" @change="discountHandle(item, d, 'discount')" />
              </div>
              <div class="right" v-show="good_clicktag != 0">
                <!-- <mt-spinner type="triple-bounce"></mt-spinner> -->
                <van-loading />
              </div>
            </div>
          </div>

          <div class="score list" v-if="item.order_coin_exchanges">
            <template v-for="(d, i) in item.order_coin_exchanges">
              <div :key="i" v-if="!d.no_show" style="width: 100%; display: block; clear: both; margin-bottom: 2.1875rem;">
                <div class="left ">
                  {{ parseFloat(d.coin).toFixed(2) }}{{ d.name == "积分" ? integral : d.name }}
                  <span>抵扣{{ d.amount }}{{ $i18n.t("元") }}</span>
                </div>
                <div class="right"></div>
              </div>
            </template>
          </div>
        </div>
        <!-- 服务费、运费说明 start @change="discountHandle(item, fees, 'serviceFee')"-->
        <van-checkbox-group v-model="service_fee[item.pre_id]" @change="discountHandle(item, fees, 'serviceFee')">
          <div class="shipping_ins" v-for="(fees, i) in item.order_service_fees" :key="i.code">
            <div class="shipping_ins_1">
              <div class="shipping_ins_title">是否需要{{ fees.name }}</div>
              <van-checkbox checked-color="#f15353" :name="fees.code" v-show="good_clicktag == 0"></van-checkbox>
              <!-- <mt-spinner type="triple-bounce" v-show="good_clicktag != 0"></mt-spinner> -->
              <van-loading v-show="good_clicktag != 0" />
            </div>
            <div class="shipping_ins_1" v-show="fees.show">
              <div class="shipping_ins_title">{{ fees.name }}为</div>
              <div class="shipping_ins_total">{{ $i18n.t("money") }} {{ fees.amount }}</div>
            </div>
            <div v-show="fees.code == 'liveInstall' && fees.show">
              <div class="shipping_ins_1">
                <div class="shipping_ins_title">预约安装时间</div>
                <div class="shipping_ins_date" @click.stop="showInstallPop = true">
                  {{ installDate ? installDate.Format("yyyy-MM-dd hh:mm:ss") : "" }}<i v-if="!installDate" class="iconfont icon-fontclass-rili"></i><i class="fa fa-angle-right"></i>
                </div>
              </div>
              <van-field class="cell-textarea-style" v-model="install_comment" rows="2" autosize type="textarea" maxlength="120" placeholder="请输入留言" show-word-limit />
              <div class="shipping_ins_1">
                <div class="shipping_ins_title">地理位置<em style="color: #f86e6e;">*</em></div>
                <div class="shipping_ins_address">
                  <div class="addressDiv" style="text-align: right;">{{ location.address ? location.address : "定位中..." }}</div>
                  <i class="iconfont icon-dingwei" style="color: #f86e6e; padding-right: 0.25rem;"></i>
                  <div @click.stop="showLocationPop">{{ location.address ? "切换" : "自动定位中" }}</div>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
        <!-- 服务费、运费说明 end -->
      </div>
      <div class="rent-time" v-if="isRent && isRightChoose">
        <div class="text"><span>租期：</span></div>
        <div class="week">
          <van-button type="default" v-for="(item, index) in rentTime" :key="index" @click.native="rentTimeChoose(item, index)" :class="{ active: index == currentIndex }">
            {{ item.term_name }}<br /><span class="text">优惠{{ item.term_discount }}% </span></van-button
          >
          <van-button type="default" @click.native="rentSelfChoose">自定义<br /><span></span></van-button>
        </div>
      </div>
    </div>
    <!--商品订单结束-->
    <div class="tbs coupon-list" @click="showCoupon" v-if="isShowCoupon">
      <div class="list">
        <div class="left ">
          优惠券
          <font>{{ coupon_size }}张可用</font>
        </div>
        <div class="right">
          <font color="#E84E40">
            <span>{{ use_coupon_size == 0 ? "未使用" : "已使用" + use_coupon_size + "张" }}</span>
          </font>
        </div>
      </div>
    </div>

    <!--应用市场下单-->
    <div class="tbs coupon-list" @click="toSite" v-if="show_domain">
      <div class="list">
        <div class="left ">
          我的站点
        </div>
        <div class="right">
          <span style="color: #e84e40;">{{ shop_domain ? shop_domain : "新增/绑定站点" }}</span>
        </div>
      </div>
    </div>

    <!-- 发票 -->
    <div class="invoice" @click="show1 = true" v-if="isShowInvoice">
      <span>发票</span>
      <span class="type">
        <font>{{ invoicename }}</font
        >（{{ companyname }}—{{ showInvoiceTitle }}）
      </span>
      <i class="fa fa-angle-right"></i>
    </div>

    <!-- 自定义表单 -->
    <div class="invoice" @click="gotoDiyform" v-if="isShowDiyForm">
      <span><em style="color: #e84e40;">*</em> {{ diyTitle }}<em v-if="!fun.isTextEmpty(form_data_id)" style="color: #e84e40;">(已填写)</em></span>
      <i class="fa fa-angle-right"></i>
    </div>
    <!-- 弹窗 -->
    <van-popup v-model="show1" position="bottom" :style="{ height: '80%' }" class="pc_popup">
      <div class="popup_box">
        <h1>发票<i class="iconfont icon-close11" @click="closePopup"></i></h1>
        <p>
          <i class="iconfont icon-tishi1"></i>
          <span>发票须知：启用电子普通发票，订单完成后24小时内开具，点击“我的订单“可查看和下载</span>
        </p>
        <div class="type_box">
          <h2>发票类型</h2>
          <div class="type">
            <button :class="{ cur: iscur_c }" v-if="electron_status" @click="invoice_type">电子发票</button>
            <button :class="{ cur: iscur_d }" v-if="papery_status" @click="invoice_type">纸质发票2</button>
          </div>
        </div>
        <div class="type_box">
          <h2>发票抬头</h2>
          <div class="type">
            <button type="button" :class="{ cur: iscur }" @click="invoice_title">
              个人
            </button>
            <button type="button" :class="{ cur: iscur_b }" @click="invoice_title">
              单位
            </button>
          </div>
          <div class="input_box" v-if="person_status">
            <van-field placeholder="请输入发票抬头" v-model="invoice_list.call" class="inp-info" :border="false" />
            <van-field placeholder="请输入邮箱（非必填）" v-model="invoice_list.email" class="inp-info" :border="false" />
          </div>
          <div class="input_box" v-if="unit_status">
            <van-field placeholder="请填写单位名称" v-model="invoice_list.call" class="inp-info" :border="false" />
            <van-field placeholder="请添加纳税人识别号" v-model="invoice_list.company_number" class="inp-info" :border="false" />
            <van-field placeholder="请输入邮箱（非必填）" v-model="invoice_list.email" class="inp-info" :border="false" />
          </div>
        </div>
        <div class="btn">
          <button type="button" @click="Subinvoice">确定</button>
        </div>
      </div>
    </van-popup>
    <!--  -->

    <div class="tbs" style="margin-top: 0.625rem;">
      <div class="price list" v-for="item in total_items" :key="item.code">
        <div class="left ">{{ item.name }}</div>
        <div class="right">
          <font color="#E84E40"><span v-if="item.code == 'total_deduction_price'">-</span>{{ $i18n.t("money") }}{{ item.amount }}</font>
        </div>
      </div>

      <div class="price list" v-for="item in discount_amount_items" :key="item.code" v-show="!item.no_show">
        <div class="left ">{{ item.name }}</div>
        <div class="right">
          <span style="color: #e84e40;">-{{ $i18n.t("money") }}{{ item.amount }}</span>
        </div>
      </div>
      <div class="price list" v-for="(item, i) in service" :key="i">
        <div class="left ">{{ item.name }}</div>
        <div class="right">
          <div class="right">
            <font color="#E84E40">{{ $i18n.t("money") }}{{ item.amount }}</font>
          </div>
        </div>
      </div>

      <div class="price list" v-for="(item, i) in service_fee_items" :key="i">
        <div class="left ">{{ item.name }}</div>
        <div class="right">
          <div class="right">
            <font color="#E84E40">{{ $i18n.t("money") }}{{ item.amount }}</font>
          </div>
        </div>
      </div>

      <div class="price list" v-if="isRent">
        <div class="left ">押金（可退还）</div>
        <div class="right">
          <div class="right">
            <font color="#E84E40">{{ $i18n.t("money") }}{{ goodsInfo.total_deposit }}</font>
          </div>
        </div>
      </div>
      <div>
        <div class="agreement" v-if="isRent">
          <div class="right">
            <van-checkbox v-model="agreement" checked-color="#f15353" shape="square"></van-checkbox>
          </div>
          <div class="left "><span>我已认真阅读并同意该</span><span @click="showAgreement" style="color: red;">《租赁协议》</span></div>
        </div>

        <div class="agreement" v-if="AgreementPay && !isRent">
          <div class="right">
            <van-checkbox v-model="agreementPay" checked-color="#f15353" shape="square"></van-checkbox>
          </div>
          <div class="left">
            <span style="color: red; line-height: 1.7rem;" @click="showPay">《支付协议》 </span>
          </div>
        </div>
      </div>
    </div>

    <div class="diy-other-btn" v-if="storeSearchBtn.is_open_but">
      <!-- 门店 href需为开头需要带协议-->
      <a :href="storeSearchBtn.web_url" class="diy-other-btn-url">{{ storeSearchBtn.but_title }} <i class="fa fa-angle-right "></i></a>
    </div>

    <div style="height: 3.125rem;"></div>
    <div class="detail_pay">
      <ul class="total">
        <li class="deposit">
          <small v-if="isRent">(押金{{ $i18n.t("money") }}{{ goodsInfo.total_deposit }}可退)</small>
        </li>
        <li>
          合计：<font style="color: #f15353;"
            >{{ $i18n.t("money") }}<span class="span_t">{{ price }}</span></font
          >
        </li>
      </ul>
      <div class="order_delete" @click="submit">提交订单</div>
    </div>

    <div id="AllGood" :class="{ popupMemberSpecs }">
      <div class="add-info">
        <c-title :hide="false" text="我的信息"></c-title>
        <div style="height: 1.875rem;"></div>
        <van-field class="inp-field" v-model="member_name" label="真实姓名" placeholder="请输入真实姓名" center clearable />
        <van-field class="inp-field" v-model="member_card" label="身份证号码" placeholder="请输入身份证号码" center clearable />

        <div class="address_addnav1" @click="saveInfo">
          <span>确认修改</span>
        </div>

        <div class="address_addnav2" @click="open"><i class="fa fa-info-circle red"></i><span style="font-size: 14px;">使用说明</span></div>
      </div>
    </div>

    <!-- <template v-if="dyFormPopup"> -->
    <van-popup v-model="dyFormPopup" position="bottom" class="mint-popup-4" :style="{ width: '100%', height: '100%', overflow: 'auto', display: 'flex' }">
      <div class="DYFpopHeader">
        <i class="iconfont icon-member-left" @click="dyFormPopup = false"></i>
        <p>{{ dyTiitle }}</p>
      </div>
      <c-dyPopup
        style="height: 100%; overflow: auto;"
        v-on:submitsave="dfsave"
        :datas="dfData"
        :form_data_id="activeFormDataID"
        :form_id="goodDYDormID"
        :description="dyDescription"
        :status="true"
        :thumb="dyThumb"
      ></c-dyPopup>
    </van-popup>
    <!-- </template> -->

    <van-popup v-model="popupCouponSpecs" :style="{ overflow: 'visible' }" position="bottom" class="mint-popup-4" closeOnClickModal="true">
      <div class="add-info">
        <div class="coupon-list-info" v-for="(coupon, index) in coupons" :key="index">
          <div class="checkList" style="float: left;" v-if="cup_notice" @click.stop="chooseCoupon(index, coupon.valid)">
            <div class="right" v-show="good_clicktag == 0">
              <van-checkbox v-model="coupon.checked" shape="square" :disabled="!coupon.valid" checked-color="#f15353" :name="coupon" @change="selectCoupon($event, coupon)"> </van-checkbox>
            </div>
            <div class="right" v-if="good_clicktag != 0">
              <!-- <mt-spinner type="triple-bounce"></mt-spinner> -->
              <van-loading />
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
              <div class="coupon-stepper" style="" v-if="is_coupon_SELE && coupon.checked && coupons_temp[coupon.coupon_id]">
                <div class="coupon-stepper-num">{{ coupon.has_conpon_id.length }}张</div>
                <div v-if="good_clicktag == 0 && stepper_show == 0">
                  <!-- :max="coupon.valid_num" -->
                  <van-stepper
                    :class="[coupons_temp[coupon.coupon_id].num >= coupon.valid_num ? 'maxDisabled' : '']"
                    :value="coupons_temp[coupon.coupon_id].num"
                    async-change
                    theme="round"
                    button-size="20"
                    integer
                    min="1"
                    :name="coupon"
                    @change="changeConpon"
                  />
                </div>
                <div v-show="good_clicktag != 0 || stepper_show != 0">
                  <!-- <mt-spinner type="triple-bounce"></mt-spinner> -->
                  <van-loading />
                </div>
              </div>
              <p class="coupon_voucher_period" v-if="!is_coupon_SELE">{{ coupon.time_start }}-{{ coupon.time_end }}</p>
            </div>
          </div>
        </div>
      </div>
      <button class=" sure" type="button" @click="popupCouponSpecs = false">
        {{ isCueCoupon ? "确定使用" : "确认" }}
      </button>
      <button class="close" type="button" @click="popupCouponSpecs = false">
        {{ isCueCoupon && use_coupon_size == 0 ? "不用优惠" : "取消" }}
      </button>
    </van-popup>

    <!-- 租赁协议 -->
    <template v-if="agreementShow">
      <van-popup v-model="agreementShow" position="right" style="width: 100%; height: 100%;">
        <van-nav-bar title="租赁协议">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="agreementShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
        <div>
          <p style="text-align: center; margin-top: 0.625rem; font-size: 16px;">
            {{ agreeCon.pact_title }}
          </p>
          <p v-html="agreeCon.lease_toy_pact"></p>
        </div>
      </van-popup>
    </template>

    <!-- 支付协议 -->
    <template v-if="agreementPayShow">
      <van-popup v-model="agreementPayShow" position="right" style="width: 100%; height: 100%;">
        <van-nav-bar title="支付协议" class="pcStyle_ydT">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="agreementPayShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
        <div>
          <p v-html="AgreementPay"></p>
        </div>
      </van-popup>
    </template>

    <!-- 配送范围 -->
    <template v-if="deliveryScopeShow">
      <van-popup v-model="deliveryScopeShow" position="right" style="width: 100%; height: 100%;">
        <van-nav-bar title="配送范围">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="deliveryScopeShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
        <div style="width: 100%; height: calc(100vh - 2.5rem);">
          <delivery-map :center_path="locations" :path_list="delivery_area"></delivery-map>
        </div>
      </van-popup>
    </template>

    <van-popup v-model="showPop" closeable position="bottom" :style="{ height: '40%' }">
      <div style="display: flex; align-items: center; justify-content: center; height: 4rem;">请输入租期</div>
      <div style="margin-top: 1rem;">
        <input type="text" v-model="popCode" style="outline: none; border: solid 1px #ccc; height: 2rem; text-indent: 1rem;" />
      </div>
      <van-button @click="activation" class="van-sure">确定</van-button>
    </van-popup>
    <!-- 快递地址选择器 -->
    <yz-address-list v-model="showAddress" v-on:confirm="confirmSelectAddress" :options="yzAddressListOptions"></yz-address-list>
    <!-- 快递地址选择器 end -->
    <van-popup v-model="showInstallPop" position="bottom">
      <van-datetime-picker v-model="installDate" type="datetime" @cancel="showInstallPop = false" @confirm="showInstallPop = false" title="选择完整时间" :min-date="minDate" />
    </van-popup>
    <!-- 地图选择器 -->
    <location v-model="showLocation" v-on:confirm="confirmLocation"></location>
  </div>
</template>

<script>
import goods_order_controller from "./goods_order_controller";

export default goods_order_controller;
</script>

<style lang="scss" rel="stylesheet/scss">
.van-sure {
  color: #fff;
  background-color: #f15353;
  border-color: #f15353;
  width: 80%;
  height: 2.5rem;
  line-height: 2.5rem;
  margin: 1.25rem 0;
  padding: 0;
  font-size: 16px;
}

#goodsinfo {
  .distributionMain {
    .ss {
      .yd-radio-text {
        flex: 1;
      }
    }
  }
}

#goodsinfo.pcStyle {
  .pc_popup {
    .yd-popup {
      width: 375px !important;
      right: 50%;
      margin-right: -187.5px;
    }
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#cpsinp {
  padding-top: 1rem;
  box-sizing: border-box;
}

#cpsinp::-webkit-input-placeholder {
  font-size: 1rem;
} /* 使用webkit内核的浏览器 */

#cpsinp:-moz-placeholder {
  font-size: 1rem;
} /* Firefox版本4-18 */

#cpsinp::-moz-placeholder {
  font-size: 1rem;
} /* Firefox版本19+ */

#cpsinp:-ms-input-placeholder {
  font-size: 1rem;
} /* IE浏览器 */

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

    .address_addnav1 {
      width: 90%;
      margin: 1.25rem auto;
      background: #f15353 !important;
      color: #fff !important;
      text-align: center;
      height: 2.8125rem !important;
      line-height: 2.8125rem !important;
      border-radius: 0.375rem;
      font-size: 16px;
    }

    .address_addnav2 {
      margin: 1rem 0;
    }

    /* ul { */

    /* overflow-y: scroll; */

    /* max-height: 50vh; */

    /* } */
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

    /* ul { */

    /* overflow-y: scroll; */

    /* } */

    li {
      padding: 0.625rem 0;
      display: flex;
      position: relative;

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
        background: url("../../assets/images/close_iocn.png");
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
      content: "";
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

        .text {
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

        /deep/input {
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
  width: 99.5%;
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
      content: "\00A5";
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
    content: "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •";
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
    position: relative;

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

    .coupon-stepper {
      position: absolute;
      width: 95%;
      bottom: 4px;
      right: 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .coupon-stepper-num {
        border-radius: 0.875rem;
        overflow: hidden;
        padding: 0 0.5rem;
        color: #999;
        border: 1px solid #999;
        height: 1rem;
        font-size: 0.75rem;
        line-height: 1rem;
      }

      /deep/.van-stepper--round .van-stepper__minus {
        color: #47c1c4;
        border: 1px solid #47c1c4;
      }

      /deep/.van-stepper--round .van-stepper__plus {
        background-color: #47c1c4;
      }

      /deep/.maxDisabled .van-stepper__plus {
        background-color: #999;
      }
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
      content: "\00A5";
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
    content: "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •";
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
    position: relative;

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

.address_addnav {
  z-index: 10;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0 3% 0 6% !important;
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
    height: 2.125rem;
    line-height: 2.125rem;
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

    .fa-angle-right {
      font-size: 20px;
      margin-left: 10px;
    }

    .shipping_ins_date {
      .icon-fontclass-rili {
        font-size: 20px;
        color: #666;
      }
    }

    .shipping_ins_address {
      flex: 1;
      padding-left: 12px;
      display: flex;
      align-items: center;
      font-size: 10px;
      overflow: hidden;

      .addressDiv {
        flex: 1;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }
  }

  .cell-textarea-style {
    background: #fbfbfb;
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

  /deep/.van-cell:active {
    background-color: #fff !important;
  }
}

.longitude {
  padding: 10px 13px !important;
}

.inp-info {
  padding: 0;

  /deep/input {
    padding: 0 0.625rem;
    width: 100%;
    height: 2.25rem;
    background: #f5f5f5;
    border-radius: 1rem;
    color: #333;
  }

  /deep/input::placeholder {
    color: #555;
  }
}

.diy-other-btn {
  height: 2rem;
  line-height: 2rem;
  background: #f7e7e7;
  text-align: center;
  margin-top: 0.875rem;
  color: #e84e40;
}

#goodsinfo.pcStyle .DYFpopHeader {
  width: 375px;
}

#goodsinfo.pcStyle .van-popup--top {
  top: 0;
  right: 50% !important;
  left: unset;
  margin-right: -187.5px;
  width: 100%;
}

/deep/.inp-field.van-cell {
  padding: 10px 10px 10px 21px;

  /deep/.van-field__label {
    flex: none;
    white-space: nowrap;
    width: 4.5rem;
    margin-right: 20px;
    color: #333;
    text-align: center;
    font-size: 16px;
  }

  input::placeholder {
    color: #555;
    font-size: 16px;
  }
}

.prepaid-recharge {
  background-color: white;
  text-align: left;

  /deep/.van-cell {
    font-size: 22px;
  }

  /deep/.van-cell::after,
  [class*="van-hairline"]::after {
    border-bottom: none;
  }

  .tips {
    margin-top: 15px;
    border-top: #e8e8e8 solid 0.0625rem;
    padding: 10px;
    line-height: 22px;
    color: #ff2424;
    font-size: 14px;

    /deep/img {
      max-width: 100%;
    }
  }
}
</style>
