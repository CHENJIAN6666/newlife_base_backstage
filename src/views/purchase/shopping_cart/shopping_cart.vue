<!--购物车管理-->
<template>
  <div>
    <div style="position: fixed;z-index: 99999;bottom: 50px; right: -5px;cursor:pointer">
      <img style="width:90px;height:90px;" src="../../../assets/icon_zsxq_gwc@3x.png"
           @click="cartDialog()"/>
      <el-badge :value="cardCount" class="item"> </el-badge>
    </div>
  <el-dialog width="70%" title="购物车管理" append-to-body :close-on-click-modal="false" :visible.sync="cartVisible">

    <el-table show-summary :summary-method="getSummaries" :data="shoppringList" style="width: 100%">Purchase_Type
      <el-table-column prop="purchaseType" label="采购类型" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.purchaseType==1">意向预订</el-tag>
          <el-tag type="success" v-if="scope.row.purchaseType==0">现车采购</el-tag>
        </template>

      </el-table-column>
      <el-table-column prop="carModelName" label="车型" width="250"></el-table-column>
      <el-table-column prop="carColorName" label="颜色" width="120"></el-table-column>
      <el-table-column prop="carInteriorColorName" label="内饰颜色" width="120"></el-table-column>
      <el-table-column label="数量" width="150" align="center" prop="purchaseNum">
        <template slot-scope="scope">
          <el-input-number size="mini" :min="1" :value="scope.row.purchaseNum" v-on:input="handleBlur"
                           @change="handleChange( scope.row )"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="dialogVisibleTrue( scope.row )">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span>期望到货日期：</span>
          <el-date-picker v-model="expectedArrivalDate" size="mini" value-format="yyyy-MM-dd" type="date"
                          placeholder="期望到货日期"></el-date-picker>
        </div>

      </el-col>

    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="8" :offset="4">
        <el-button type="danger" :disabled="shoppringList<=0" size="medium" icon="el-icon-delete"
                   @click="dialogDeleteAll">清空购物车
        </el-button>
      </el-col>
      <el-col :span="8" :offset="4">
        <el-button type="primary" :disabled="shoppringList<=0" size="medium" icon="el-icon-delete"
                   @click="setDialogOrderVisible">确认下单
        </el-button>
      </el-col>
    </el-row>

    <el-dialog title="注意" append-to-body :visible.sync="dialogClearVisible" width="20%">
      <span>要清空购物车吗?</span>
      <span slot="footer" class="dialog-footer">
		    	<el-button @click="dialogClearVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="dialogClearSure">确 定</el-button>
		  	</span>
    </el-dialog>


    <el-dialog title="注意" append-to-body :visible.sync="dialogVisible" width="20%">
      <span>确定要删除这个商品吗?</span>
      <span slot="footer" class="dialog-footer">
		    	<el-button @click="dialogVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="dialogSure">确 定</el-button>
		  	</span>
    </el-dialog>

    <el-dialog title="注意" append-to-body :visible.sync="dialogOrderSureVisible" width="20%">
      <span>确定要下单吗?</span>
      <span slot="footer" class="dialog-footer">
		    	<el-button @click="dialogOrderSureVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="dialogOrderSure">确 定</el-button>
		  	</span>
    </el-dialog>

  </el-dialog>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex'


  export default {
    name: 'cart',
    data() {
      return {
        cardCount:0,
        dialogClearVisible: false,
        cartVisible: false,
        dialogVisible: false,
        expectedArrivalDate: '',
        dialogOrderSureVisible: false,
        result: null,
        input_number_value: 1,
        shoppringList: []
      }
    },
    computed: {
      ...mapGetters([
        'cartProducts', 'totalNum'
      ])
    },
    mounted(){
      this.init();
    },
    methods: {
      cartDialog() {
        this.cartVisible = true;

      },

      init() {
          this.queryShoppringList();
      },

      ...mapActions(['delProduct', 'numChange', 'clearAllCart']),
      /**
       * 删除单个
       * @param data
       */
      dialogVisibleTrue(data) {
        this.dialogVisible = true;
        this.result = data;
      },
      //确认删除单个产品
      dialogSure() {
        this.delProduct(this.result);
        this.dialogVisible = false;
      },

      dialogDeleteAll(data) {
        this.dialogClearVisible = true;
      },
      /**
       * 确认清空购物车
       */
      dialogClearSure() {
        this.delProductAll();
        this.dialogClearVisible = false;
      },
      setDialogOrderVisible() {
        //是否有意向采购，有则需要填写期望到货日期
        var hasIntention = false;
        this.shoppringList.forEach(function (item, index) {
          if (item.purchaseType == 1) {
            hasIntention = true;
          }

        });
        if (hasIntention && (this.expectedArrivalDate == "" || this.expectedArrivalDate == null || this.expectedArrivalDate == undefined)) {
          this.$message({
            message: '请填写期望到货日期',
            type: 'error',
            duration: 1500
          });
          return;
        }

        this.dialogOrderSureVisible = true;
      },
      delProduct(selectObj) {
        const that = this;
        this.api({
          url: "/carStock/clearCart",
          method: "post",
          data: {
            orderID: selectObj.orderID
          }
        }).then(data => {
          that.queryShoppringList();
        })

      },
      delProductAll() {
        const that = this;
        var ids = new Array();
        that.shoppringList.forEach(function (item, index) {
          ids.push(item.orderID);
        });
        this.api({
          url: "/carStock/clearCartALL",
          method: "post",
          data: {
            orderIDs: ids
          }
        }).then(data => {
          that.queryShoppringList();
        })

      },
      handleBlur(value) {
        this.input_number_value = value
      },
      handleChange(data) {
        //   debugger
        data.purchaseNum = this.input_number_value;
        //更新订单：先清除再新增
        this.changeCartNumber(data);
      },
      queryShoppringList() {
        //获取购物车
        this.api({
          url: "/carStock/listCart",
          method: "get"
        }).then(data => {
          this.shoppringList = data.list;
          this.cardCount=this.shoppringList.length;
        })
      },
      /**
       * 确认下单
       */
      dialogOrderSure() {

        //是否有意向采购，有则需要填写期望到货日期
        var hasIntention = false;
        this.shoppringList.forEach(function (item, index) {
          if (item.purchaseType == 1) {
            hasIntention = true;
          }
        });
        if (hasIntention && (this.expectedArrivalDate == "" || this.expectedArrivalDate == null || this.expectedArrivalDate == undefined)) {
          this.$message({
            message: '请填写期望到货日期',
            type: 'error',
            duration: 1500
          });
          return;
        }
        //提交订单
        this.api({
          url: "/carStock/submitCart",
          method: "post",
          data: {
            expectedArrivalDate: this.expectedArrivalDate
          }
        }).then(data => {
          // this.shoppringList = data.list;
          this.dialogOrderSureVisible = false;
          this.queryShoppringList();
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          });
        })
      },
      queryStoreCount(carModelID, carInteriorColorID, carColorID) {
        //查询剩余库存
        if (carInteriorColorID == undefined || carColorID == undefined || carInteriorColorID <= 0 || carColorID <= 0) {
          return;
        }
        // debugger
        const _this = this;
        this.api({
          url: "/carStock/listCarStockByCarModel",
          method: "post",
          data: {
            carModelID: carModelID,
            carColorID: carColorID,
            carInteriorColorID: carInteriorColorID
          }
        }).then(data => {
          var stockCount = data.total;
        })
      },
      /**
       * 更改数量
       */
      changeCartNumber(item) {
        const _this = this;
        this.api({
          url: "/carStock/updateCart",
          method: "post",
          data: item
        }).then(data => {
          this.queryShoppringList();
        });

      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总数';
            return;
          }
          if (column.property != "purchaseNum") {

            return sums[index] = '';
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 辆';
          } else {
            sums[index] = '——';
          }
        });

        return sums;
      }
    }
  }
</script>

<style scoped>
  .el-table th > .cell {
    text-align: center;
  }

  .el-table td > .cell {
    text-align: center;
  }
  .item {
    position: absolute;
    top: 5px;
    right: 20px;
  }
</style>
