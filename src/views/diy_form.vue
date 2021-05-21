<template>
  <div id="all" v-show="loading">
    <c-title :hide="false" :text="diyform.title"></c-title>
    <div style="height: 40px;"></div>
    <div id="member">
      <div id="tool" style="">
        <dt v-if="thumb">
          <img :src="thumb" style="width: 100%; height: 9.675rem;"/>
        </dt>
      </div>
      <div style="height: 0.005rem; clear: both;"></div>
      <div class="diyform" v-if="status === 0">
        <template v-for="(item,index) in diydata">
          <template v-if="item.type == 'diyinput'">
            <van-cell-group class="diy-style" :border="false" :key="index">
              <van-cell :border="false" center>
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
                <!--slot="default"-->
                <!--required-->
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

          <template v-if="item.type == 'diyusername'">
            <van-cell-group class="diy-style" :border="false" :key="index">
              <van-cell :border="false" center>
                <van-field style="height: 30px;" :class="[item.value ? 'vant-sure-class': 'vant-no-sure-class']"
                           v-model.trim="item.value" v-if="item.data.tp_must == 1"
                           :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                           clearable
                           :right-icon="item.value ? 'checked' : 'warning'"
                           :placeholder="item.data.placeholder"
                />
                <van-field style="height: 30px;" v-if="item.data.tp_must == 0"
                           v-model.trim="item.value"
                           :label="item.data.tp_name === '' ? '账号:' : `${item.data.tp_name}：`"
                           clearable
                           :placeholder="item.data.placeholder"
                />
                <!--<span slot="title">{{ item.data.tp_name }}：</span>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 1"-->
                <!--slot="default"-->
                <!--required-->
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

          <template v-if="item.type == 'diypwd'">
            <van-cell-group class="diy-style" :border="false" :key="index">
              <van-cell :border="false" center>
                <van-field style="height: 30px;" :class="[item.value ? 'vant-sure-class': 'vant-no-sure-class']"
                           v-model.trim="item.value" v-if="item.data.tp_must == 1"
                           :label="item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`"
                           clearable type="password"
                           :right-icon="item.value ? 'checked' : 'warning'"
                           :placeholder="item.data.placeholder"
                />
                <van-field style="height: 30px;" v-if="item.data.tp_must == 0"
                           v-model.trim="item.value"
                           :label="item.data.tp_name === '' ? '密码:' : `${item.data.tp_name}：`"
                           clearable type="password"
                           :placeholder="item.data.placeholder"
                />
                <!--<span slot="title">{{ item.data.tp_name }}：</span>-->
                <!--<yd-input-->
                <!--v-if="item.data.tp_must == 1"-->
                <!--slot="default"-->
                <!--required-->
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
            <van-cell-group :border="false" :title="item.data.tp_name" style="margin-bottom: 10px;" :key="index">
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
              <van-cell-group :border="false" :title="item.data.tp_name">
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

          <template v-if="item.type == 'diyimg'">
            <van-cell-group :title="item.data.tp_name" :border="false" :key="index">
              <div class="clearfloat" style="width: 100%; text-align: left; line-height: 5rem;">
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
                      <img :src="require('../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar"/>
                    </div>
                  </van-uploader>
                </div>
              </div>
            </van-cell-group>
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

          <template v-if="item.type == 'diydate'">
            <van-cell-group :border="false" class="data-text" :key="index">
              <van-cell title-style="text-align:left" center :border="false" @click.native="openPicker(item.name)">
                <span slot="title">{{ item.data.tp_name }}:</span>
                <span slot="default">{{ item.value }}</span>
              </van-cell>
            </van-cell-group>
          </template>
        </template>
      </div>

      <div class="diyform" v-if="status === 1">
        <van-cell-group
          class="bgNone already-group"
          :border="false"
          v-for="(item, j) in datas"
          :key="j"
          :title="item.data_type != '1' && item.data_type != '5' ? '' : item.title"
        >
          <van-cell :border="false" center v-if="item.data_type != '1' && item.data_type != '5'">
            <span slot="title">{{ item.title }}</span>
            <span slot="default">{{ item.value }}</span>
          </van-cell>

          <van-cell class="already-img diyform-textarea" :border="false" v-if="item.data_type == '1'">
            <van-field v-model="item.value" rows="3" autosize type="textarea" readonly show-word-limit/>
          </van-cell>

          <van-cell class="already-sub" v-if="item.data_type == '5'">
            <template slot="default" style="width: 100%; text-align: right;" v-for="(item1,ind) in item.value">
              <div class="photobox" style="float: right; max-width: 25%; margin-top: 0.5rem;" :key="ind">
                <img :src="item1" style="max-width: 5rem;"/>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
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

      <yd-cityselect v-model="showCity" :callback="setCity" :items="district" id="yd-cityselect"></yd-cityselect>

      <div style="height: 0.625rem; clear: both;"></div>
      <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;">
        <van-button style="height: 40px;" size="large" @click.native="submit" type="primary" v-if="status === 0"
        >提交
        </van-button>
        <van-button style="height: 40px;" size="large" type="danger" v-if="status === 1">已提交</van-button>
      </div>
      <div style="width: 100%; padding: 0.5rem 0.5rem 5rem 0.5rem; background-color: #fff;">
        <div v-html="description"></div>
      </div>
    </div>
  </div>
</template>

<script>
import diyform from "./diy_form_controller";

export default diyform;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>

  #tool ul li {
    width: 100% !important;
    padding-left: 0.75rem !important;
  }

  .yd-cell-title {
    height: 2.5rem !important;
    line-height: 2.5rem !important;
  }

  .yd-cell-box {
    margin-bottom: 0 !important;
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

  #member {
    .van-cell-group__title {
      text-align: left;
      padding: 2.5px 12px 5px;
    }

    /deep/ textarea::placeholder {
      color: #555;
    }

    .city-text {
      margin-top: 10px;
      margin-bottom: 10px;

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

      .van-cell {
        height: 50px;
        padding: 0 12px;
        color: #555;
      }
    }

    .data-text {
      .van-cell {
        height: 50px;
        padding: 0 12px;
        color: #555;
      }
    }

    .checkbox-text {
      text-align: left;
      color: #555;
    }

    .data-text {
      .van-cell {
        height: 50px;
        padding: 0 12px;
        color: #555;
      }

      .van-cell__value {
        span {
          color: #555;
        }
      }
    }

    .diyform {
      .van-cell__title {
        text-align: left;
        color: #555;
      }

      .diyform-textarea {
        .van-field {
          padding: 10px 0;

          /deep/ textarea {
            color: #555;
          }
        }
      }
    }

    /deep/ .van-cell--clickable:active {
      background-color: #fff;
    }
  }

  .diy-style {
    .van-cell {
      padding: 0 12px;
      height: 50px;

      .van-cell__title {
        flex: none;
        width: auto;
        white-space: nowrap;
      }

      /deep/ .yd-input > input {
        color: #555;
      }
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
