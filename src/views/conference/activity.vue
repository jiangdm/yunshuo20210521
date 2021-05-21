<template>
  <div id="all">
    <c-title :hide="false" :text="conference.title"></c-title>
    <div style="height: 40px;"></div>

    <div id="member">
      <div id="tool">
        <div v-if="thumb" class="thumb" style="width: 100%; height: 7.25rem;">
          <img :src="thumb"/>
        </div>
      </div>
      <div style="height: 0.625rem; clear: both;"></div>
      <van-cell-group :border="false" class="active-detail">
        <van-cell :border="false" is-link @click.native="showIntro" center>
          <span slot="title"> 活动介绍</span>
          <span slot="default">查看详情</span>
        </van-cell>
      </van-cell-group>

      <div style="height: 0.625rem; clear: both;"></div>
      <van-popup v-model="intro" position="right" style="width: 100%; height: 100%;">
        <van-nav-bar title="活动详情" class="pcStyle_ydT">
          <template #right>
            <span>
              <van-icon name="cross" size="18" @click="intro = false" color="#333"/>
            </span>
          </template>
        </van-nav-bar>
        <div class="intro">
          <div v-html="conference.content"
               style="text-align: left;"></div>
        </div>
      </van-popup>
      <!-- 组件部分 -->
      <div class="diyform">
        <template v-for="(item, index) in diydata">
          <template v-if="item.type == 'diyinput'">
            <van-cell-group :border="false" class="active-detail" :key="index">
              <van-cell :border="false" center title-style="flex:none">
                <van-field style="height: 30px;" :class="[item.value ? 'vant-sure-class': 'vant-no-sure-class']"
                           v-model.trim="item.value" v-if="item.data.tp_must == 1"
                           :label="item.data.tp_name === '' ? '输入框：' : `${item.data.tp_name}：`"
                           clearable
                           :right-icon="item.value ? 'checked' : 'warning'"
                           :placeholder="item.data.placeholder"
                />
                <van-field style="height: 30px;" v-if="item.data.tp_must == 0"
                           v-model.trim="item.value"
                           :label="item.data.tp_name === '' ? '输入框：' : `${item.data.tp_name}：`"
                           clearable
                           :placeholder="item.data.placeholder"
                />

                <!--<span slot="title">{{ item.data.tp_name }}：</span>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 1"-->
                <!--required-->
                <!--slot="default"-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--&gt;</yd-input>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 0"-->
                <!--slot="default"-->
                <!--v-model="item.value"-->
                <!--v-bind:placeholder="item.data.placeholder"-->
                <!--&gt;</yd-input>-->
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diytextarea'">
            <van-cell-group :border="false" class="more-text" :key="index">
              <van-field
                v-model="item.value"
                rows="3"
                autosize
                type="textarea"
                maxlength="100"
                :placeholder="item.data.placeholder"
                show-word-limit
              />
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diycheckbox'">
            <van-checkbox-group v-model="item.value" checked-color="#4cd864" :key="index">
              <van-cell-group :border="false">
                <van-cell
                  title-class="checkbox-text"
                  v-for="(ck, i) in item.data.tp_text"
                  :key="i"
                  clickable
                  :title="ck"
                  @click="toggle(i)"
                  :border="false"
                >
                  <template #right-icon>
                    <van-checkbox :name="ck" ref="checkboxes"/>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </template>

          <template v-if="item.type == 'diyselect'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link>
                <span slot="title">{{ item.data.tp_name }}：</span>
                <select slot="default" v-model="item.value">
                  <option value="">请选择{{ item.data.tp_name }}</option>
                  <option :value="sitem" v-for="(sitem, i) in item.data.tp_text" :key="i">{{ sitem }}</option>
                </select>
              </van-cell>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diyradio'">
            <van-radio-group v-model="item.value" :key="index">
              <van-cell-group :border="false" class="active-detail" :title="item.data.tp_name">
                <van-cell
                  clickable
                  v-for="(ritem, i) in item.data.tp_text"
                  :key="i"
                  @click="item.value = ritem"
                  center
                  :border="false"
                  title-style="text-align:left"
                >
                  <span slot="title">{{ ritem }}</span>
                  <template #right-icon>
                    <van-radio :name="ritem.toString()">
                      <template #icon="props">
                        <i
                          class="iconfont check-icon "
                          :class="props.checked ? 'icon-record_go' : ''"
                          style=" color: #09bb07; font-size: 25px;"
                        ></i>
                      </template>
                    </van-radio>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </template>

          <template v-if="item.type == 'diycity'">
            <van-cell-group :border="false" class="city-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" is-link>
                <span slot="title">{{ item.data.tp_name }}：</span>
                <input
                  slot="default"
                  type="text"
                  @click.stop="showCity = true"
                  @click="openCity(item.name)"
                  v-model="item.value"
                  readonly
                />
              </van-cell>
            </van-cell-group>
          </template>
          <template v-if="item.type == 'diyimg'">
            <van-cell-group :title="item.data.tp_name" :border="false" :key="index">
              <div
                class="clearfloat"
                style="width: 100%; text-align: left; padding: 0.5rem; border: 1px solid rgb(204, 204, 204); border-radius: 4px;"
              >
                <template v-for="(val, index) in item[item.name + 'Value2']">
                  <div class="photobox" style="float: left; max-width: 25%;" :key="index">
                    <img :src="val.url" style="max-width: 5rem;"/>
                    <van-icon
                      @click="removeImg_1(item, index)"
                      name="close"
                      style="width: 1.2rem; height: 1.2rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;"
                    />
                  </div>
                </template>
                <div @click="chooseUpload(item.name)">
                  <van-uploader
                    :disabled="item[item.name + 'Length'].length >= item.data.tp_max"
                    :after-read="onRead_2"
                  >
                    <div
                      style="padding-left: 1rem; padding-top: 1rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;"
                    >
                      <img :src="require('../../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar"/>
                    </div>
                  </van-uploader>
                </div>
              </div>
            </van-cell-group>
          </template>

          <template v-if="item.type == 'diydate'">
            <van-cell-group :border="false" :key="index">
              <van-cell @click.native="openPicker(item.name)" title-style="text-align:left" :border="false">
                <span slot="title">{{ item.data.tp_name }}</span>
                <span slot="default" style="color: #555;">{{ item.value }}</span>
              </van-cell>
            </van-cell-group>
          </template>
        </template>
      </div>

      <van-popup v-model="pickerShow" position="bottom">
        <van-datetime-picker
          type="date"
          title="选择年月日"
          v-model="pickerValue"
          @cancel="pickerShow = false"
          @confirm="setDate"
        />
      </van-popup>

      <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>

      <div style="height: 0.625rem; clear: both;"></div>
      <div style="width: 90%; margin: 0 auto;">
        <van-button size="large" style="height: 45px;" @click.native="submit" type="primary" v-if="!is_enrol"
        >提交
        </van-button
        >
        <van-button size="large" style="height: 45px;" @click.native="onActivityInfo()" type="primary" v-if="is_enrol"
        >已报名，查看报名信息
        </van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import activity from "./activity_controller";

export default activity;
</script>
<style lang="stylus"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  /* @import '../../assets/css/member.scss'; */

  #tool {
    width: 100% !important;

    /* padding-left: 0.75rem !important; */
    img {
      width: 100%;
      height: 100%;
    }
  }

  .yd-cell-title {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
  }

  .yd-cell-box {
    margin-bottom: 0 !important;
  }

  #member /deep/ .diyform .yd-cell-box .yd-cell .yd-cell-item .yd-cell-left {
    white-space: pre-wrap;
  }

  .yd-btn-block {
    margin-top: 0.1875rem;
  }

  .introTitle {
    border-top: 0.0625rem solid #dedddd;
  }

  .yd-checkbox {
    padding-bottom: 0.625rem;
  }

  .intro {
    padding: 1.25rem;
  }

  .checkbox {
    background: #fff;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    border-bottom: 0.0625rem solid #ece9e9;
    text-align: left;
    padding-left: 0.75rem;
  }

  .diyform {
    // padding: 0 0.5rem;
    background: #fff;
  }

  /* 清除浮动代码 */
  .clearfloat::after {
    display: block;
    clear: both;
    content: '';
    visibility: hidden;
    height: 0;
  }

  .clearfloat {
    zoom: 1;
  }

  .photobox {
    position: relative;
    width: 5rem;
    height: 5rem;
    border: 1px dashed #c0ccda;

    /* float: left; */
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    margin-bottom: 0.2rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  #all {
    .van-cell {
      padding: 10px 12px;
      color: #555;
    }
    // .van-radio-group {
    .van-cell-group__title {
      padding: 5px 12px;
      text-align: left;
    }
    // }

    .active-detail {
      .van-cell {
        height: 50px;
        padding: 0 8px 0 12px;
        color: #555;

        .van-cell__title {
          text-align: left;
        }

        .van-cell__value {
          color: #555;
        }
      }

      .left-title {
        text-align: left;
        width: auto;
        flex: none;
      }

      .right-value > .van-cell {
        padding: 0;

        /deep/ .van-field__body {
          padding-right: 10px;
        }
      }

      .tig-icon {
        color: #f43530;
      }

      .tig-active {
        padding-right: 2px;
        color: #09bb07;
      }

      .bule-icon {
        color: #10aeff;
      }
    }

    .more-text {
      .van-cell {
        padding: 0 12px;

        /deep/ textarea::placeholder {
          color: #666;
        }
      }

      .van-field {
        // padding: 0;
      }
    }

    .checkbox-text {
      text-align: left;
      color: #555;
    }

    .city-text {
      /deep/ .van-cell__title {
        text-align: left;
        flex: none;
        width: auto;
        margin-right: 0;
      }

      input {
        width: 100%;
        border: none;
        color: #333;
      }

      select {
        width: 100%;
        border: none;
        color: #555;
      }
    }

    /deep/ .van-cell--clickable:active {
      background-color: #fff;
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .vant-sure-class {
    .van-field__right-icon {
      color: green;
    }
  }

  .vant-no-sure-class {
    .van-field__right-icon {
      color: red;
    }
  }
</style>
