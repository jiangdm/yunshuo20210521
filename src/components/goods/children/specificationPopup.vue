<!-- 商品规格弹窗 -->
<!-- 这个考虑不足，本来想把规格弹窗抽离出来，没考虑到无规格是直接添加不需要弹窗（参考分类页无规格添加），所以有点多此一举。。。 -->
<template>
  <div id="specificationPopup" v-if="load">
    <div class="topDiv" >
      <div class="shopimg">
        <div id="chooser_img">
          <img
            :src="
              popThumb == null || popThumb == '' || popThumb == undefined
                ? goodsInfo.thumb
                : popThumb
            "
          />
        </div>
        <div class="right">
          <template v-if="!diyHeaders">
            <div class="title">{{goodsInfo.title}}</div>
            <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
            <div class="price"><em style="font-size: 0.625rem;">{{$i18n.t('money')}}</em><span id="option_price">{{ popPrice }}</span></div>
          </template>
          <!-- 这是自定义顶部右侧信息 -->
          <slot v-if="diyHeaders"></slot>
        </div>
      </div>
    </div>
    <div class="shopinfo noVantRadio">
      <dl v-for="(specs,i) in goodsInfo.has_many_specs" :key='i'>
        <dt>{{ specs.title }}</dt>
        <dd>
          <van-radio-group
            v-model="specs.description"
            checked-color="#f15353"
            @change="selectSpecs"
          >
            <van-radio
              :class="{ vantRadioshow: specs.description == specitem }"
              :disabled="specitem.c"
              v-for="(specitem,i) in specs.specitem"
              :name="specitem" :key='i'
            >
              {{ specitem.title }}
            </van-radio>
          </van-radio-group>
        </dd>
      </dl>
    </div>
    <div v-if="!isRents">
      <van-row>
        <van-col :span="12" id="num">
          购买数量：
        </van-col>
        <van-col :span="11">
          <div class="num">
            <div class="leftnav" @click="reduceGoods">-</div>
            <input
              type="number"
              class="shownum"
              v-model.lazy="goodsCount" disabled="true"
            />
            <div class="rightnav" @click="addGoods">+</div>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import specificationPopup_controller from "./specificationPopup_controller";
export default specificationPopup_controller;
</script>
<style lang='scss' scoped>
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
    padding: 0;
    font-size: 14px;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    #num {
      height: 3.75rem;
      line-height: 3.75rem;
      text-align: left;
    }

    .num {
      margin-top: 1rem;
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
