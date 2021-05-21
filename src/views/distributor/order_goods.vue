<template>
  <div id="distributor_order_goods">
    <div class="search_box">
      <ul class="search">
        <li class="left">
          <i @click="goBack" style="padding-right: 1.5rem;" class="iconfont icon-back"></i>
          <span>订货</span>
        </li>
        <li class="right">
          <input v-model="kwd" type="text" title="搜索" placeholder="搜索商品" />
          <i class="iconfont icon-sousuo" @click="getData"></i>
        </li>
      </ul>
    </div>

    <van-tabs v-model="activeName" @click="getData" sticky>
      <van-tab title="订货活动">
        <ul class="goods-box">
          <li v-for="(item, index) in listOne" :key="index">
            <div class="left">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="right">
              <p class="title">{{ item.title }}</p>
              <div class="spec text-over" @click.stop="showTaochang(item, index)">
                <span class="taochan" v-if="!fun.isTextEmpty(item.activeLevelOptions)"
                  ><em class="tc_namestyle">套餐：{{ item.activeLevelOptions ? item.activeLevelOptions.level_name : "请选择" }}</em> <i class="iconfont icon-member-bottom"></i
                ></span>
              </div>
              <p class="stock">
                进货价:<span class="price">{{ $i18n.t("money") }}{{ item.activeLevelOptions ? item.activeLevelOptions.replenish_price : "" }}</span> 元/{{ item.sku }}
              </p>
              <div class="ticket ">
                <p class="repertory text-over">市场价 {{ $i18n.t("money") }}{{ item.price }} 元/{{ item.sku }}</p>
                <p>{{ item.activeLevelOptions ? item.activeLevelOptions.replenish_number : null }}{{ item.sku }}</p>
                <div v-if="false">
                  <p @click.stop="showPop(item)" class="exchange" v-if="!fun.isTextEmpty(item.has_many_options)">
                    选规格<i v-if="!fun.isTextEmpty(goodsCartsTotal[item.id])">{{ goodsCartsTotal[item.id].total }}</i>
                  </p>
                  <div class="select" v-if="fun.isTextEmpty(item.has_many_options)">
                    <transition name="fade">
                      <i v-if="goodsCarts[item.id]" class="iconfont icon-life-game-sign" @click.stop="numberLeft(item.id)"></i>
                    </transition>
                    <!-- <input type="tel"
                            title="number"
                            v-if="
                          goodsCarts[item.id] && !goodsCarts[item.id].option_str
                        "
                            @click.stop
                            v-model.lazy="goodsCartsTotal[item.id].total"
                            @blur="changeCount(goodsCarts[item.id].id, goodsCartsTotal[item.id].total)" /> -->
                    <input type="tel" title="number" v-if="goodsCarts[item.id] && !goodsCarts[item.id].option_str" @click.stop v-model.lazy="goodsCartsTotal[item.id].total" disabled="true" />
                    <span v-if="goodsCarts[item.id] && goodsCarts[item.id].option_str" @click.stop>{{ goodsCartsTotal[item.id].total }}</span>
                    <i @click.stop="numberRight(item.id)" class="iconfont icon-life-game-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <img v-if="fun.isTextEmpty(listOne)" src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem auto;" />
        </ul>
      </van-tab>
      <van-tab title="普通订货">
        <!-- <div class="classic"><span>一级分类</span><span>二级分类</span><span>三级分类</span></div> -->
        <van-dropdown-menu class="classic">
          <van-dropdown-item v-model="category1" :disabled="category1_disabled" :options="categoryOption1" @change="selectCate1" />
          <van-dropdown-item v-model="category2" :disabled="category2_disabled" :options="categoryOption2" ref="categoryShow2" @change="selectCate2" />
          <van-dropdown-item v-model="category3" :disabled="category3_disabled" :options="categoryOption3" ref="categoryShow3" @change="selectCate3" />
        </van-dropdown-menu>
        <!-- <ul class="goods-box" style="padding-top: 0.5rem">
          <li v-for="(item, index) in listOne" :key="index">
            <div class="left">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="right">
              <p class="title">{{ item.title }}</p>
              <div class="spec text-over" @click.stop="showTaochang(item, index)">
                <span class="taochan" v-if="!fun.isTextEmpty(item.activeLevelOptions)"
                  ><em class="tc_namestyle"
                    >套餐：{{ item.activeLevelOptions ? item.activeLevelOptions.level_name : '请选择' }}</em
                  >
                  <i class="iconfont icon-member-bottom"></i
                ></span>
              </div>
              <p class="stock">
                进货价:<span class="price"
                  >{{ $i18n.t('money')
                  }}{{ item.activeLevelOptions ? item.activeLevelOptions.replenish_price : '' }}</span
                >
                元/{{ item.sku }}
              </p>
              <div class="ticket ">
                <p class="repertory text-over">市场价 {{ $i18n.t('money') }}{{ item.price }} 元/{{ item.sku }}</p>
                <p>{{ item.activeLevelOptions ? item.activeLevelOptions.replenish_number : null }}{{ item.sku }}</p>
                <div v-if="false">
                  <p @click.stop="showPop(item)" class="exchange" v-if="!fun.isTextEmpty(item.has_many_options)">
                    选规格<i v-if="!fun.isTextEmpty(goodsCartsTotal[item.id])">{{ goodsCartsTotal[item.id].total }}</i>
                  </p>
                  <div class="select" v-if="fun.isTextEmpty(item.has_many_options)">
                    <transition name="fade">
                      <i
                        v-if="goodsCarts[item.id]"
                        class="iconfont icon-life-game-sign"
                        @click.stop="numberLeft(item.id)"
                      ></i>
                    </transition>
                    <input
                      type="number"
                      title="number"
                      v-if="goodsCarts[item.id] && !goodsCarts[item.id].option_str"
                      :ref="`ordinaryInputRef${item.id}`"
                      @focus="getActiveOldTotal(item.id)"
                      @keyup="getActiveNewTotal"
                      v-model.lazy="goodsCartsTotal[item.id].total"
                    />
                    <span v-if="goodsCarts[item.id] && goodsCarts[item.id].option_str" @click.stop>{{
                      goodsCartsTotal[item.id].total
                    }}</span>
                    <i @click.stop="numberRight(item.id)" class="iconfont icon-life-game-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <img
            v-if="fun.isTextEmpty(listOne)"
            src="../../assets/images/blank.png"
            alt=""
            style="width:5rem;margin:2rem auto;"
          />
        </ul> -->
        <ul class="goods-box" style="padding-top: 0.5rem;">
          <li v-for="(item, index) in listOne" :key="index">
            <div class="left">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="right">
              <p class="title">{{ item.title }}</p>
              <span class="spec text-over"></span>
              <p class="stock">
                进货价:<span class="price">{{ $i18n.t("money") }}{{ item.show_price }}</span>
              </p>
              <div class="ticket ">
                <p class="repertory text-over">市场价 {{ $i18n.t("money") }}{{ item.price }}</p>
                <p @click.stop="showPop(item)" class="exchange" v-if="!fun.isTextEmpty(item.has_many_options)">
                  选规格<i v-if="!fun.isTextEmpty(goodsCartsTotal[item.id])">{{ goodsCartsTotal[item.id].total }}</i>
                </p>
                <div class="select" v-if="fun.isTextEmpty(item.has_many_options)">
                  <transition name="fade">
                    <i v-if="goodsCarts[item.id] && goodsCartsTotal[item.id].total > 0" class="iconfont icon-life-game-sign" @click.stop="numberLeft(item.id)"></i>
                  </transition>
                  <input
                    type="number"
                    title="number"
                    v-if="goodsCarts[item.id] && !goodsCarts[item.id].option_str && goodsCartsTotal[item.id].total > 0"
                    :ref="`ordinaryInputRef${item.id}`"
                    @focus="getActiveOldTotal(item.id)"
                    @keyup="getActiveNewTotal"
                    v-model.lazy="goodsCartsTotal[item.id].total"
                  />
                  <span v-if="goodsCarts[item.id] && goodsCarts[item.id].option_str" @click.stop>{{ goodsCartsTotal[item.id].total }}</span>
                  <i @click.stop="numberRight(item.id)" class="iconfont icon-life-game-plus"></i>
                </div>
              </div>
            </div>
          </li>
          <img v-if="fun.isTextEmpty(listOne)" src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem auto;" />
        </ul>
      </van-tab>
    </van-tabs>

    <div class="car-btn" @click.stop="gotoCart" v-show="activeName == '1' || isOpenOrder">
      <img src="../../assets/images/kc_buycar@2x.png" alt="" />
    </div>

    <van-popup v-model="showSpec" position="bottom" closeable close-icon="close">
      <!-- <specification-popup :goodsInfos="goodsInfo" v-if="showSpec"></specification-popup> -->
      <template>
        <div id="specificationPopup" v-if="showSpec">
          <div class="topDiv">
            <div class="shopimg">
              <div id="chooser_img">
                <img :src="popThumb == null || popThumb == '' || popThumb == undefined ? goodsInfo.thumb : popThumb" />
              </div>
              <div class="right">
                <template v-if="!diyHeaders">
                  <div class="title">{{ goodsInfo.title }}</div>
                  <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
                  <div class="price">
                    <em style="font-size: 0.625rem;">{{ $i18n.t("money") }}</em
                    ><span id="option_price">{{ popPrice.toFixed(2) }}</span>
                  </div>
                </template>
                <!-- 这是自定义顶部右侧信息 -->
                <slot v-if="diyHeaders"></slot>
              </div>
            </div>
          </div>
          <div class="shopinfo noVantRadio">
            <dl v-for="(specs, i) in goodsInfo.has_many_specs" :key="i">
              <dt>{{ specs.title }}</dt>
              <dd>
                <van-radio-group v-model="specs.description" checked-color="#f15353" @change="selectSpecs">
                  <van-radio :class="{ vantRadioshow: specs.description == specitem }" :disabled="specitem.c" v-for="(specitem, i) in specs.specitem" :name="specitem" :key="i">
                    {{ specitem.title }}
                  </van-radio>
                </van-radio-group>
              </dd>
            </dl>
          </div>
          <div>
            <van-row>
              <van-col :span="12" id="num">
                购买数量：
              </van-col>
              <van-col :span="11" v-show="popNum >= 1">
                <div class="num">
                  <div class="leftnav" @click="changeCount(popCard.id, popNum - 1, -1)">
                    -
                  </div>
                  <input type="number" class="shownum" v-model.lazy="popNum" disabled="true" />
                  <div class="rightnav" @click="changeCount(popCard.id, popNum + 1, 1)">
                    +
                  </div>
                </div>
              </van-col>
              <van-col :span="11" v-show="popNum < 1" class="bottomBox">
                <span class="btn" @click="submitAction">加入购物车</span>
              </van-col>
            </van-row>
          </div>
        </div>
      </template>
    </van-popup>

    <van-popup v-model="showTaochangPopup" position="bottom" closeable close-icon="close" @closed="closedTaochangPopup">
      <template>
        <div id="specificationPopup" v-if="showTaochangPopup">
          <div class="topDiv">
            <div class="shopimg">
              <div id="chooser_img">
                <img :src="popThumb == null || popThumb == '' || popThumb == undefined ? goodsInfo.thumb : popThumb" />
              </div>
              <div class="right">
                <!-- <div class="title">{{goodsInfo.title}}</div> -->
                <div class="price">
                  <em style="font-size: 0.625rem;">{{ $i18n.t("money") }}</em
                  ><span id="option_price">{{ tc_replenish_price * tc_replenish_number ? (tc_replenish_price * tc_replenish_number).toFixed(2) : "" }}</span>
                </div>
                <div class="option">进货价: {{ tc_replenish_price }} 元 / {{ goodsInfo.sku }}</div>
                <div class="option">市场价: {{ goodsInfo.price }} 元 / {{ goodsInfo.sku }}</div>
                <div class="option" style="color: #000;">库存：{{ popStock }}{{ goodsInfo.sku }} / 订货数量:{{ tc_replenish_number }}</div>
              </div>
            </div>
          </div>
          <div class="shopinfo noVantRadio">
            <dl>
              <dt>套餐</dt>
              <dd>
                <van-radio-group v-model="tc_specitem" checked-color="#f15353" @change="selectSpecs_tc">
                  <van-radio :class="{ vantRadioshow: tc_specitem == specitem }" v-for="(specitem, i) in goodsInfo.level_options" :name="specitem" :key="i">
                    {{ specitem.level_name }}
                  </van-radio>
                </van-radio-group>
              </dd>
            </dl>
          </div>
          <div>
            <van-row type="flex" justify="space-around">
              <van-col :span="12" id="num">
                购买数量：
              </van-col>
              <van-col :span="11" v-show="popNum >= 1">
                <div class="num">
                  <div class="leftnav" @click="changeCount(popCard.id, popNum - 1, -1)">
                    -
                  </div>
                  <input type="number" class="shownum" ref="tcInput" v-model.lazy="popNum" @focus="getActiveOldTotal_1(popCard.id)" @keyup="getActiveNewTotal" />
                  <div class="rightnav" @click="changeCount(popCard.id, popNum + 1, 1)">
                    +
                  </div>
                </div>
                <!-- <van-stepper
                  v-model="popNum"
                  @focus="getActiveOldTotal_1(popCard.id)"
                  @change="getActiveNewTotal"
                  :min="tc_replenish_number"
                  @minus="changeCount(popCard.id, popNum - 1, -1)"
                  @plus="changeCount(popCard.id, popNum + 1, 1)"
                  style="display: flex;justify-content: flex-end;"
                /> -->
              </van-col>
              <van-col :span="11" v-show="popNum < 1" class="bottomBox">
                <span class="btn" @click="submitAction_tc">加入购物车</span>
              </van-col>
            </van-row>

            <van-button @click="buyOrder" :disabled="popNum > 0 ? false : true" type="primary" size="large" color="linear-gradient(to right, #ff6034, #ee0a24)">立即购买</van-button>
          </div>
        </div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import order_goods_controller from "./order_goods_controller";

export default order_goods_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search_box {
  .search {
    height: 2.75rem;
    line-height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.875rem;
    background-color: #fff;

    .left {
      font-size: 16px;
      display: flex;
      font-weight: bold;

      i {
        color: #333;
        font-size: 1rem;
      }

      span {
        display: block;
        margin: 0 0.25rem;
        max-width: 5.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }

      i:last-child {
        font-size: 1.125rem;
      }
    }

    .right {
      width: 12.375rem;
      height: 1.875rem;
      background: #f8f8f8;
      display: flex;
      line-height: 1.875rem;
      border-radius: 1rem;
      padding: 0 0.625rem;
      font-size: 14px;
      color: #c9c9c9;

      i {
        font-size: 1.125rem;
        margin-right: 0.375rem;
      }

      input {
        border: none;
        width: 100%;
      }

      input::-webkit-input-placeholder,
      textarea::-webkit-input-placeholder {
        color: #c9c9c9;
      }
    }
  }
}

.text-over {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.classic {
  background: #fff;
  display: flex;
  // padding: 0.5rem 0;
  span {
    flex: 1;
    color: #999;
  }
}

.goods-box {
  background: #fff;
  padding: 1rem;
  min-height: 100vh;

  li {
    padding-bottom: 0.5rem;
    display: flex;

    .left {
      flex: 0 0 8rem;

      img {
        width: 8rem;
        height: 8rem;
        border-radius: 0.313rem;
      }
    }

    .right {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      margin: 0.5rem 0 0.5rem 0.5rem;
      font-size: 12px;
      width: 13rem;
    }

    .title {
      font-weight: bold;
      font-size: 15px;
      height: 2.5rem;
      line-height: 1.25rem;
      margin-bottom: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .spec {
      color: #9f9f9f;
      display: flex;

      .taochan {
        display: block;
        padding: 0 0.25rem;
        border: 1px solid #9f9f9f;
        border-radius: 6px;
      }

      .tc_namestyle {
        max-width: 8rem;
        display: inline-block;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }

    .stock {
      margin-top: 1rem;
      margin-bottom: 0.3rem;
    }

    .price {
      color: #f01818;
      font-size: 15px;
    }

    .repertory {
      color: #9f9f9f;
      flex: 1;
      align-self: center;
    }

    .ticket {
      display: flex;
    }

    .exchange {
      background-color: #ffae00;
      border-radius: 15px;
      color: #fff;
      padding: 2px 0.5rem;
      line-height: 1rem;
      position: relative;

      i {
        // width: 1rem;
        padding: 0 0.25rem;
        height: 1rem;
        line-height: 1rem;
        font-size: 12px;
        position: absolute;
        top: -8px;
        right: -5px;
        background-color: #ff5d5c !important;
        text-align: center;
        border-radius: 0.75rem;
        color: #fff;
      }
    }
  }
}

.car-btn {
  position: fixed;
  bottom: 5rem;
  right: 0.5rem;

  img {
    width: 3.5rem;
    height: 3.5rem;
  }
}

.bottomBox {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;

  .btn {
    display: inline-block;
    width: 5.875rem;
    height: 1.875rem;
    line-height: 1.875rem;
    background-color: #f01818;
    border-radius: 1.234rem;
    color: #fff;
    font-size: 0.875rem;
    font-weight: bold;
  }
}

.select {
  display: flex;

  span {
    outline: none;
    border: none;
    display: inline-block;
    width: 2.5rem;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 14px;
    text-align: center;
  }

  input {
    outline: none;
    border: none;
    display: inline-block;
    width: 2.5rem;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 14px;
    text-align: center;
  }

  i:first-child {
    background-color: #ccc;
  }

  i:last-child {
    background-color: #f15353;
  }

  i {
    width: 1.25rem;
    height: 1.25rem;
    text-align: center;
    line-height: 1.25rem;
    border-radius: 0.75rem;
    color: #fff;
    font-size: 12px;
  }
}

.noVantRadio {
  .van-radio-group {
    display: flex;
    flex-wrap: wrap;

    .van-radio {
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      background: #fff;
      border: 1px solid #efefef;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0.25rem;
    }

    .vantRadioshow {
      background-color: rgb(241, 83, 83);
      border-color: rgb(241, 83, 83);
      box-shadow: rgb(241, 83, 83) -1px 0 0 0;
    }

    .van-radio__label {
      color: #000;
    }
  }
}

#specificationPopup {
  position: relative;
  width: 100%;

  .topDiv {
    padding: 0.625rem 0.75rem;

    .shopimg {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.625rem;
      border-bottom: 0.0625rem solid #efefef;

      #chooser_img {
        height: 4.625rem;
        width: 4.625rem;

        img {
          width: 100%;
          border-radius: 0.1875rem;
          border: 0.0625rem solid #efefef;
        }
      }

      .right {
        flex: 1;
        text-align: left;
        padding-left: 0.875rem;

        .title {
          font-size: 0.875rem;
          line-height: 1.25rem;
          height: 2.5rem;
          color: #000;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .price {
          color: #f15353;
          font-size: 1rem;
          line-height: 1.25rem;
          height: 1.25rem;
          overflow: hidden;

          span {
            font-size: 1rem;
          }
        }

        .option {
          color: #999;
          font-size: 0.625rem;
          line-height: 1rem;
          height: 1rem;
          overflow: hidden;
        }
      }
    }
  }

  .shopinfo {
    text-align: left;
    padding-left: 0.625rem;
    margin: 1rem 0 1rem 0;
    max-height: 50vh;
    overflow: scroll;

    dl {
      dt {
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #000;
      }

      dd {
        margin-bottom: 0.3125rem;
      }
    }
  }

  .van-row {
    margin: 0.875rem;
    padding: 0 0 1rem 0;
    font-size: 14px;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    #num {
      height: 1.875rem;
      line-height: 1.875rem;
      text-align: left;
    }

    .num {
      // margin-top: 1rem;
      float: right;
      background-color: #fff;
      border: 0.0625rem solid #ccc;
      border-radius: 0.875rem;
      overflow: hidden;

      .leftnav {
        height: 1.75rem;
        width: 1.75rem;
        float: left;
        background-color: #fff;
        color: #000;
        text-align: center;
        border-radius: 0.1875rem;
        line-height: 1.75rem;
        font-size: 24px;
        font-weight: bold;
      }

      .shownum {
        height: 1.75rem;
        width: 2.25rem;
        float: left;
        border: 0;
        margin: 0;
        padding: 0;
        text-align: center;
        color: #000;
        border-left: 0.0625rem solid #ccc;
        border-right: 0.0625rem solid #ccc;
      }

      .rightnav {
        height: 1.75rem;
        width: 1.75rem;
        float: right;
        background-color: #fff;
        color: #000;
        text-align: center;
        border-radius: 0.1875rem;
        line-height: 1.75rem;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
}
</style>
