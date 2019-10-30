<template>
  <div>
    <el-button type="primary" @click="handleBtnClick" :disabled="disabled">
      <slot> 选择客户 </slot>
      </el-button>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      
      <el-tabs v-model="activeName">
        <el-tab-pane label="客户查询" name="1">
          <el-row>
            <el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline"> 
              <el-col :span="22">

              <el-form-item label="客户名称">
			        	<el-input v-model="listQuery.customerName" placeholder="客户名称"></el-input>
			        </el-form-item>

              	<el-form-item label="固定电话">
			        	<el-input v-model="listQuery.telephone" placeholder="固定电话"></el-input>
			        </el-form-item>

              	<el-form-item label="移动电话">
			        	<el-input v-model="listQuery.mobile" placeholder="移动电话"></el-input>
			        </el-form-item>

              <el-form-item label="负责人">
			        	<el-input v-model="listQuery.personInCharge" placeholder="负责人"></el-input>
			        </el-form-item>

		        </el-col>
          	<el-col :span="2"  class="text-right" >
                 <el-button size="mini" type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
             </el-col>
	        	</el-form>
        </el-row>
        <el-table size="mini" :data="list"  v-loading.body="listLoading"
         element-loading-text="拼命加载中" border fit highlight-current-row stripe>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
             <span v-text="getIndex(scope.$index)"> </span>
           </template>
        </el-table-column>
        <el-table-column align="center" prop="customerName" label="客户名称" fit></el-table-column>
        <el-table-column align="center" prop="telephone" label="固定电话" width="120"></el-table-column>
        <el-table-column align="center" prop="mobile" label="移动电话" width="120"></el-table-column>
        <el-table-column align="center" prop="personInCharge" label="负责人" width="120"></el-table-column>
      
      <el-table-column align="center"  label="操作"  fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="chooseCustomer(scope.$index)">选 择</el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
   </el-tab-pane>
        <el-tab-pane label="添加客户" name="'2'">

    
      <el-form size="mini" class="small-space" :model="tempModel" :rules="rules"
       ref="tempModel" status-icon label-position="left" 
       label-width="120px" style=' margin-left:50px;'>
         <el-form-item label="客户名称" prop="customerName">
          <el-input type="text" v-model="tempModel.customerName" >
          </el-input>
        </el-form-item>

        <el-form-item label="客户电话" prop="firstVisitDay">
         <el-input type="text" v-model="tempModel.customerMobile" >
          </el-input>
        </el-form-item>

        <el-form-item label="送货地址">
          <el-input type="text" v-model="tempModel.deliveryAddress">
          </el-input>
        </el-form-item>

         <el-form-item label="联系人名称" prop="firstVisitDay">
         <el-input type="text" v-model="tempModel.contactName" >
          </el-input>
        </el-form-item>

        <el-form-item label="联系人电话">
          <el-input type="text" v-model="tempModel.contactMobile">
          </el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="createCustomer">创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
      </el-form>

        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    salesOrgID: {
      type: [Number, String],
      required: false
    },
    salesCommissioner: {
      type: [Number, String],
      required: false
    },
    value:{
      required: true
    },
    disabled: Boolean,
  },
  data() {
    return {
      dialogVisible: false,
      activeName: "1",
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数

        customerName: "",
        telephone: "",
        mobile: "",
        personInCharge: "",

        salesOrgID: this.salesOrgID,
        salesCommissioner: this.salesCommissioner
      },
      listLoading: false,
      totalCount: 0, 
      list: [],
      tempModel: {
        customerID: "",
        customerName: "",
        deliveryAddress: "",
        customerMobile: "",
        contactName: "",
        contactMobile: ""
      },
      rules: {
        customerCategoryID: [
          { required: true, message: "请填写客户类别", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
     handleSizeChange(val) {
      //改变每页数量
      this.listQuery.pageRow = val;
      this.handleFilter();
    },
    handleCurrentChange(val) {
      //改变页码
      this.listQuery.pageNum = val;
      this.getList();
    },
    chooseCustomer(index) {
      const customer = {}
      customer.customerID =  this.list[index].customerID
      customer.customerName = this.list[index].customerName
      customer.deliveryAddress = this.list[index].deliveryAddress
      customer.contactName = ""
      customer.contactMobile = ""
      //查询客户的联系人
      this.api({
         url: "/customerContact/listCustomerContact",
         method: "get",
         params: {
            pageNum: 1,
            pageRow: 1, 
            customerID: this.list[index].customerID,
            isMain: 1
         }
       }).then((data) => {
         let contact = {}
         if(data.totalCount > 0){
           contact = data.list[0];
           customer.contactName = contact.contactName
           customer.contactMobile = contact.mobile
         }
         this.$emit("input",customer.customerID)
         this.$emit('handleCustomerChange',customer)
         this.dialogVisible = false
       })
    },
    createCustomer() {
       this.api({
         url: "/customer/addCustomerAndContact",
         method: "post",
         data: this.tempModel
       }).then((data) => {
          this.$emit("input",data.customerID)
          this.$emit('handleCustomerChange',data)
          this.dialogVisible = false
       })
          

    },
    handleCreateCustomerCancel() {
      this.dialogVisible = false;
    },
    handleBtnClick() {
      this.getList();
      this.dialogVisible = true;
    },
    getIndex($index) {
      //表格序号
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1;
    },
    getList() {
      this.listLoading = true;
      this.api({
        url: "/customer/listCustomer",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.totalCount;
      });
    }
  }
};
</script>

