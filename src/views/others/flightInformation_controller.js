import cTitle from "components/title";
import { Toast } from "vant";
// import { scrollMixin } from "utils/mixin";
import cDyPopup from "../goods/diyFormPopup";

export default {
  // mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false, //说明显示
      columnsShow: false, //picke显示
      columns: [], //pick数据
      start_name: "", //始发地名称
      destination_name: "", //到达地名称
      flight_name: "", //航班名称
      info: [], //主数据
      banner_one: "", //轮播图
      banner_two: "", //轮播图
      banner_three: "", //轮播图
      dfData: [], //表单数据
      goodDYDormID: "", //表单id
      dyFormPopup: false, //表单显示
      start_id: "", //始发地id
      destination_id: "", //到达地id
      flight_id: "", //航班id
      form_data_id: "", //编辑id
      startTime: "",
      endTime: "",
      nowDate: Date.parse(new Date()),
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    initData() {},
    onConfirm(e) {
      let detail = this.$refs.selectItem.getValues();
      this.start_name = detail[0].start_name;
      this.destination_name = detail[1].destination_name;
      this.flight_name = detail[2].flight_name;
      this.start_id = detail[0].start_id;
      this.destination_id = detail[1].destination_id;
      this.flight_id = detail[2].flight_id;
      this.columnsShow = false;
    },
    linkUrl(url){
      window.location.href=url;
    },
    onCancel(e) {
      console.log(e);
    },
    getData() {
      let that = this;
      $http
        .get("plugin.flight-collect.frontend.index", {}, " ")
        .then(
          (response) => {
            if (response.result === 1) {
              this.columns = response.data.flight;
              this.info = response.data;
              this.banner_one = response.data.banner_one;
              this.banner_two = response.data.banner_two;
              this.banner_three = response.data.banner_three;
              this.goodDYDormID = response.data.diyform;
              this.dfData = response.data.form_data;
              this.startTime = this.info.hours_start;
              this.endTime = this.info.hours_end;
              if (this.info.is_submit) {
                // 指定时间限制
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let start_Min = Date.parse(
                  `${year}/${month}/${day} ${this.startTime}:00`
                );
                let end_Min = Date.parse(
                  `${year}/${month}/${day} ${this.endTime}:00`
                );
                console.log(start_Min, end_Min, this.nowDate);
                if (this.nowDate >= start_Min && this.nowDate <= end_Min) {
                  this.info.is_submit = 1;
                } else {
                  this.info.is_submit = 0;
                }
              }
              if (response.data.form_data) {
                // 已填回显处理
                if (response.data.form_data.form_data_id) {
                  this.form_data_id = response.data.form_data.form_data_id;
                }
                if (
                  response.data.form_data.start_id &&
                  response.data.form_data.destination_id &&
                  response.data.form_data.flight_id
                ) {
                  let start_id = response.data.form_data.start_id;
                  let destination_id = response.data.form_data.destination_id;
                  let flight_id = response.data.form_data.flight_id;
                  this.start_id = start_id;
                  this.destination_id = destination_id;
                  this.flight_id = flight_id;
                  let columnsArr = this.columns;
                  // 回显已经填写过的航班信息
                  for (let i = 0; i < columnsArr.length; i++) {
                    if (columnsArr[i].start_id == start_id) {
                      this.start_name = columnsArr[i].text;
                      for (let j = 0; j < columnsArr[i].children.length; j++) {
                        if (
                          columnsArr[i].children[j].destination_id ==
                          destination_id
                        ) {
                          this.destination_name =
                            columnsArr[i].children[j].text;
                        }
                        for (
                          let k = 0;
                          k < columnsArr[i].children[j].children.length;
                          k++
                        ) {
                          if (
                            columnsArr[i].children[j].children[k].flight_id ==
                            flight_id
                          ) {
                            this.flight_name =
                              columnsArr[i].children[j].children[k].text;
                          }
                        }
                      }
                    }
                  }
                }
              }
              that.dyFormPopup = true;
            } else {
              Toast(response.msg);
            }
          },
          (response) => {
            Toast(response);
          }
        )
        .catch((err) => {
          console.error(err);
        });
    },
    dfsave(e) {
      let arr = e;
      console.log(e);
      let json = {
        start_id: this.start_id,
        destination_id: this.destination_id,
        flight_id: this.flight_id,
        form_id: this.goodDYDormID,
        form_data: JSON.stringify(arr),
        form_data_id: this.form_data_id ? this.form_data_id : "",
      };
      $http
        .get(
          "plugin.flight-collect.frontend.index.save-diy-form-data",
          json,
          " "
        )
        .then((response) => {
          if (response.result === 1) {
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    gofunarr(e) {
      if (this.info.is_submit) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let start_Min = Date.parse(
          `${year}/${month}/${day} ${this.startTime}:00`
        );
        let end_Min = Date.parse(`${year}/${month}/${day} ${this.endTime}:00`);
        console.log(start_Min, end_Min, this.nowDate);
        if (this.nowDate >= start_Min && this.nowDate <= end_Min) {
          this.info.is_submit = 1;
          this.$refs.gofunarr.submit();
        } else {
          this.info.is_submit = 0;
          return;
        }
      }
    },
  },
  components: { cTitle, cDyPopup },
};
