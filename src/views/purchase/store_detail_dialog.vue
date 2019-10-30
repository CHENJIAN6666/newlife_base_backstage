<template>
  <el-dialog fullscreen title="车辆详细" :close-on-click-modal="false" :visible.sync="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-row>
        <el-col :span="6">
          <img :src="dataForm.carModelPicture" class="image">
        </el-col>
        <el-col :span="12" :offset="1">
          <el-row>
            <el-col :span="24">
              <h3>{{dataForm.carBrandName}}—{{dataForm.carSeriesName}}—{{dataForm.carModelName}}</h3>
            </el-col>
          </el-row>

          <el-form-item label="指导价" prop="guidePrice">
            <label style="color: #F56C6C;font-size: 18px;line-height: 18px">{{dataForm.guidePrice}}</label>
          </el-form-item>
          <el-form-item label="车系颜色" prop="carColorID">
            <el-radio-group v-model="dataForm.carColorID" @change="modelColorHandler" size="small">
              <el-radio-button v-for="item in dataForm.modelColorlist" :label="item.carColorID"
                               :key="item.carColorID">
                {{item.carColorName}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内饰颜色" prop="carInteriorColorID">
            <el-radio-group v-model="dataForm.carInteriorColorID" @change="interiorColorHandler" size="small">
              <el-radio-button v-for="item in dataForm.interiorColorList" :label="item.carInteriorColorID"
                               :key="item.carInteriorColorID">{{item.carInteriorColorName}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="数量" prop="guidePrice">
            <el-input-number size="small" style="width: 90px;" v-model="dataForm.purchaseCount"
                             controls-position="right" @change="handleChange" :min="1"
                             :max="dataForm.stockCount>0?dataForm.stockCount:50">
            </el-input-number>
            <label style="color: #B2B2B2;margin-left: 10px">库存数量:{{dataForm.stockCount}}辆</label>
          </el-form-item>
          <el-form-item v-if="dataForm.stockCount<=0" label="到货日期" prop="expectedArrivalDate">
            <el-date-picker v-model="dataForm.expectedArrivalDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="期望到货日期"></el-date-picker>
          </el-form-item>

          <el-button type="primary" v-if="dataForm.stockCount>0" @click="dataFormSubmit(1)">立即下单</el-button>
          <el-button type="primary" v-if="dataForm.stockCount<=0" @click="dataFormSubmit(2)">立即预订</el-button>

          <el-button type="primary" @click="addCart()">加入购物车</el-button>

        </el-col>
      </el-row>

      <el-row>
        <el-col><span v-html="dataForm.carModelIntroduce"></span></el-col>
      </el-row>

    </el-form>


  </el-dialog>

</template>

<script>

  export default {
    data() {
      return {

        visible: false,
        stockCount1: 1,
        dataForm: {
          carModelID: 0,
          stockCount: 0,
          expectedArrivalDate: '',
          purchaseCount: 1,
          carBrandName: '',
          carSeriesName: '',
          purchaseType: 0,
          carColorID: 0,
          carInteriorColorID: 0,
          carModelName: '',
          carModelPicture: '',
          modelColorlist: [],
          interiorColorList: []
        },

        dataRule: {
          paramKey: [
            {required: true, message: '参数名不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {},
    methods: {
      /**
       * 初始化
       * @param id
       */
      init(carModelID) {
        this.dataForm.carModelID = carModelID || 0;
        this.visible = true
        const _this = this;

        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.carModelID == 0) {
            return;
          }
          this.api({
            url: "/purchaseStore/getCarModel",
            method: "get",
            params: {
              carModelID: this.dataForm.carModelID
            }
          }).then(data => {
            _this.dataForm = data;

            if (this.dataForm.modelColorlist != null) {

              _this.$set(_this.dataForm, "carColorID", this.dataForm.modelColorlist[0].carColorID);
            }
            if (this.dataForm.interiorColorList != null) {
              _this.$set(_this.dataForm, "carInteriorColorID", this.dataForm.interiorColorList[0].carInteriorColorID);
            }

            _this.$set(_this.dataForm, "stockCount", 0);
            _this.$set(_this.dataForm, "purchaseCount", 1);

            setTimeout(function () {
              _this.queryStoreCount();
            }, 100);
          })

        })
      },
      handleChange(value) {
        console.log(value);
      },
      modelColorHandler(selectLabelId) {
        console.log("selectLabelId:" + selectLabelId);
        this.$set(this.dataForm, "carColorID", selectLabelId);
        this.queryStoreCount();

      },
      interiorColorHandler(selectLabelId) {
        console.log("carInteriorColorID:" + selectLabelId);
        this.$set(this.dataForm, "carInteriorColorID", selectLabelId);
        this.queryStoreCount();

      },
      queryStoreCount() {
        //查询剩余库存
        if (this.dataForm.carInteriorColorID == undefined || this.dataForm.carColorID == undefined || this.dataForm.carInteriorColorID <= 0 || this.dataForm.carColorID <= 0) {
          return;
        }
        // debugger
        const _this = this;
        this.api({
          url: "/carStock/listCarStockByCarModel",
          method: "post",
          data: {
            carModelID: _this.dataForm.carModelID,
            carColorID: _this.dataForm.carColorID,
            carInteriorColorID: _this.dataForm.carInteriorColorID
          }
        }).then(data => {
          _this.$set(_this.dataForm, "stockCount", data.total);
          if (data.total > 0) {
            _this.purchaseType = 0;
          } else {
            _this.purchaseType = 1;
          }

        })


      },
      // 表单提交
      /**
       * cmd:1现车下单；2：预约
       * @param cmd
       */
      dataFormSubmit(cmd) {
        const _this = this;
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            //验证失败
            return;
          }
          var url = "/carStock/orderNow";
          if (cmd == 2) {
            url = "/carStock/orderIntentionNow";
            if (_this.dataForm.expectedArrivalDate == "" || _this.dataForm.expectedArrivalDate == null || _this.dataForm.expectedArrivalDate == undefined) {
              _this.$message({
                message: '请填写期望到货日期',
                type: 'error',
                duration: 1500
              });
              return;
            }
          }

          this.api({
            url: url,
            method: "post",
            data: {
              carModelID: _this.dataForm.carModelID,
              carColorID: _this.dataForm.carColorID,
              carInteriorColorID: _this.dataForm.carInteriorColorID,
              total: _this.dataForm.purchaseCount,
              expectedArrivalDate: _this.dataForm.expectedArrivalDate,
              purchaseNum: _this.dataForm.purchaseCount
            }
          }).then(data => {
            _this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                _this.visible = false
                _this.$emit('refreshDataList')
              }
            })
          })

        })
      },

      addCart() {
        const _this = this;
        this.api({
          url: "/carStock/addCart",
          method: "post",
          data: {
            carModelID: _this.dataForm.carModelID,
            carColorID: _this.dataForm.carColorID,
            carInteriorColorID: _this.dataForm.carInteriorColorID,
            purchaseType: _this.purchaseType,
            total: _this.dataForm.purchaseCount,
            purchaseNum: _this.dataForm.purchaseCount
          }
        }).then(data => {
          this.queryStoreCount();
          _this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          });
          //更新购物车状态
          _this.$emit('refreshCartStatus')
        })


      }
    }
  }
</script>
<style>
  .image {
    width: 100%;
    display: block;
    margin-top: 10px;
  }
</style>
