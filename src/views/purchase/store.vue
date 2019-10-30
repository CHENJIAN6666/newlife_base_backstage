<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-row>
          <el-col :span="20">
            <el-form-item label="品牌车系" class="carSeriesWidth">
              <carSeriesSelect style="width:100%" v-model="listQuery.carSeriesID" groupName="query"/>
            </el-form-item>
            <el-form-item label="车型">
              <carModelSelect v-model="listQuery.carModelID" groupName="query"/>
            </el-form-item>

          </el-col>
          <el-col :span="2" class="text-right">
            <el-button size="mini" type="primary" @click="commonUtil.queryPrepare(listQuery);getList();">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row style="padding-bottom: 5px;">
        <el-col :span="24" class="text-right">
          <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('carOrder:add')">添加
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="6" v-for="(obj, index) in list" :key="obj.id">
        <el-card shadow="hover" :body-style="{ padding: '5px' }">
          <img :src="obj.carModelPicture" class="image">
          <div style="padding: 5px;">
            <div class="card_show-overflow-tooltip">{{obj.carBrandName}}—{{obj.carSeriesName}}</div>
            <el-tooltip effect="dark" :content="obj.carModelName" placement="top-start">
              <div class="card_show-overflow-tooltip">{{obj.carModelName}}</div>
            </el-tooltip>
            <div class="bottom clearfix2">
              <label style="line-height: 25px;font-size:16px;color:#B2B2B2">库存数：{{obj.stockCount}}</label>
              <el-button type="success" size="mini" round class="button" @click="detailDialogHandle(obj)">下单</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row type="flex" justify="center" v-if="list.length<=0">
      <el-col :span="2"><label>查无数据！</label></el-col>
    </el-row>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[12, 24, 48, 96]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <store-detail-dialog v-if="detailDialogVisible" ref="storeDetailDialog" @refreshCartStatus="refreshCartStatus"
                         @refreshDataList="getList"></store-detail-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <shopping-cart ref="shoppingCartDialog"></shopping-cart>


  </div>
</template>
<script>
  import StoreDetailDialog from './store_detail_dialog'

  import ShoppingCart from './shopping_cart/shopping_cart'

  export default {
    data() {
      return {
        detailDialogVisible: false,
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 12,//每页条数
          isSale: 1,
          carSeriesID: null,
          carModelID: null
        }
      }
    },
    components: {
      StoreDetailDialog,
      ShoppingCart
    },
    created() {
      this.getList();
    },
    methods: {
      // 新增 / 修改
      detailDialogHandle(obj) {
        debugger
        var id = obj.carModelID;
        this.detailDialogVisible = true
        this.$nextTick(() => {
          this.$refs.storeDetailDialog.init(id)
        })
      },
      refreshCartStatus(){
        this.$refs.shoppingCartDialog.init();
      },
      getList() {
        this.listLoading = true;
        this.api({
          url: "/purchaseStore/listStore",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      }
    }
  }
</script>
<style>
  .image {
    width: 100%;
    display: block;
  }

  .bottom {
    margin-top: 8px;
    line-height: 20px;
  }

  .clearfix2:before,
  .clearfix2:after {
    display: table;
    content: "";
  }

  .button {
    padding: 0;
    float: right;
  }

  .clearfix2:after {
    clear: both
  }

  .carSeriesWidth .el-form-item__content {
    width: 300px;
  }

  .card_show-overflow-tooltip {
    white-space: nowrap;
    min-width: 50px;
    margin: 3px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
