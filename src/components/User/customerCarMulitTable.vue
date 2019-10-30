<template>
  <div>
		<el-button type="primary" @click="handleBtnClick" :disabled="disabled">
			<slot>车辆档案</slot>
		</el-button>
   <el-dialog title="车辆档案" :visible.sync="dialogVisible" fullscreen append-to-body>
		 <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">

						<!-- <el-form-item label="品牌车系" >
							<carSeriesSelect v-model="listQuery.carSeriesID" groupName="listQuery"/>
						</el-form-item>

						<el-form-item label="整车车型"  >
							<carModelSelect v-model="listQuery.carModelID" groupName="listQuery"/>
						</el-form-item> -->

						<el-form-item label="车牌号">
						<el-input v-model="listQuery.plateNumber" placeholder="车牌号"></el-input>
						</el-form-item>

							<el-form-item label="VIN号">
						<el-input v-model="listQuery.vINCode" placeholder="VIN号"></el-input>
						</el-form-item>

							<el-form-item label="发动机号">
						<el-input v-model="listQuery.engineNumber" placeholder="发动机号"></el-input>
						</el-form-item>

							<el-form-item label="客户">
						<el-input v-model="listQuery.customerName" placeholder="客户"></el-input>
						</el-form-item>


       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    </div>

     <el-table size="mini" :data="list"
      v-loading.body="listLoading" element-loading-text="拼命加载中"
      border fit highlight-current-row stripe @selection-change="handleSelectionChange">
			 <el-table-column fixed="left"  type="selection" width="55" />
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

				 <el-table-column align="center" prop="plateNumber" label="车牌号" width="70"></el-table-column>
					 <el-table-column align="center" prop="vINCode" label="VIN号" width="80"></el-table-column>
			 <el-table-column align="center" prop="engineNumber" label="发动机号" width="80"></el-table-column>
			<el-table-column align="center" prop="carFullName" label="整车车型" width="100"></el-table-column>
			 <el-table-column align="center" prop="customerName" label="客户" width="100"></el-table-column>
		<el-table-column align="center" prop="salesCommissioner" label="客户专员" width="100"></el-table-column>
		<el-table-column align="center" prop="telephone" label="固定电话" width="100"></el-table-column>
		<el-table-column align="center" prop="mobile" label="移动电话" width="100"></el-table-column>
		<el-table-column align="center" label="购买日期" width="100">
					<template slot-scope="scope">
						<span>{{formatDate(scope.row.purchaseDate)}}</span>
					</template>
				</el-table-column>
			<el-table-column align="center" label="首保日期" width="100">
					<template slot-scope="scope">
						<span>{{formatDate(scope.row.firstMaintenanceDate)}}</span>
					</template>
				</el-table-column>
	  <el-table-column align="center" label="最近保养日" width="100">
					<template slot-scope="scope">
						<span>{{formatDate(scope.row.recentMaintenanceDate)}}</span>
					</template>
				</el-table-column>
					<el-table-column align="center" label="下次保养日" width="100">
					<template slot-scope="scope">
						<span>{{formatDate(scope.row.nextMaintenanceDate)}}</span>
					</template>
				</el-table-column>
    <el-table-column align="center" label="商业险到期日" width="100">
					<template slot-scope="scope">
						<span>{{formatDate(scope.row.businessInsuranceDueDate)}}</span>
					</template>
				</el-table-column>
						<el-table-column align="center" label="交强险到期日" width="100">
					<template slot-scope="scope">
						<span>{{formatDate(scope.row.compulsoryInsuranceDueDate)}}</span>
					</template>
				</el-table-column>
	<el-table-column align="center" label="出厂日期" width="100">
					<template slot-scope="scope">
						<span>{{formatDate(scope.row.productionDate)}}</span>
					</template>
				</el-table-column>
						 <el-table-column align="center" prop="orgName" label="部门" width="100"></el-table-column>
				 <el-table-column align="center" prop="businessInsuranceCompany" label="商业保险公司" width="100"></el-table-column>

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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleBtnSelectedCar">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
	props: {
		orgID:{
			type: [String, Number],
			required:true,
		},
		carModelID:{
			type: [String, Number],
			required:true,
		}, 
		value:{
			type: Array,
			required: true,
		}, 
		isRentCar:{
			type: Boolean,
			required: false,
			default: false,
		}, 
		listQueryParam: {
			type: Object,
			required: false
		}, 
		disabled: Boolean,
		},
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      listQuery: {
        pageNum: 1, //页码
        pageRow: 100, //每页条数
        // carSeriesID: "",
        carModelID: this.carModelID,
        customerName: "",
        vINCode: "",
        plateNumber: "",
        engineNumber: "",
        isRentCar: this.isRentCar
      },
      list: [],
			totalCount: 0,
			multipleSelection: [],
    };
  },
	watch:{
		carModelID(v){
			this.listQuery.carModelID = v
		}
	},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
		},
		handleBtnSelectedCar(){
			this.$emit("updateCustomerCar", this.multipleSelection);
      // this.$emit("input",this.multipleSelection);
      this.value.splice(0,this.value.length)
      for (const customerCar in this.multipleSelection) {
        this.value.push(this.multipleSelection[customerCar])
      }
			this.dialogVisible = false
		},
    handleBtnClick() {
      this.getList();
      this.dialogVisible = true;
    },
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
    getIndex($index) {
      //表格序号
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1;
    },
    getList() {
      this.listLoading = true;
      let p = this.listQueryParam
        ? Object.assign(this.listQuery, this.listQueryParam)
        : this.listQuery;

      this.listQuery.orgID = this.orgID;
      this.api({
        url: "/customerCar/listCustomerCar",
        method: "get",
        params: p
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.totalCount;
      });
    },

    formatDate(ds) {
      if (ds && ds.length && ds.length > 10) return ds.substring(0, 10);
      return ds;
    }
  }
};
</script>

