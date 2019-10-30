<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">
         <el-form-item label="品牌车系" >
           <carSeriesSelect v-model="listQuery.carSeriesID" groupName="query"/>
         </el-form-item>

         <el-form-item label="整车车型"  >
           <carModelSelect v-model="listQuery.carModelID" groupName="query"/>
         </el-form-item>
       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList();">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('rentplan:add')">添加
      </el-button>
      </el-col>
    </el-row>
    </div>
    <el-table size="mini" :data="list"
      v-loading.body="listLoading" element-loading-text="拼命加载中"
      border fit highlight-current-row stripe>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="方案类型">
        <template slot-scope="scope">
          {{scope.row.planType == 1 ? '长租':scope.row.planType == 2 ?'以租代售':''}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="carFullName" label="车型"></el-table-column>
      <el-table-column align="center" prop="periods" label="期数" width="100"></el-table-column>
      <el-table-column align="center" prop="deposit" label="押金" width="140"></el-table-column>
      <el-table-column align="center" prop="firstMonthRental" label="首月租金" width="140"></el-table-column>
      <el-table-column align="center" prop="monthlyRental" label="每月租金" width="140"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="160"></el-table-column>
      <el-table-column align="center" prop="modifyTime" label="修改时间" width="160"></el-table-column>


      <el-table-column align="center" label="操作" width="150" v-if="hasPerm('rentplan:update')">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button size="mini" type="primary" icon="edit" @click="deleteModel(scope.$index)">删除</el-button>
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
    <el-dialog
      fullscreen
      :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form size="mini" class="small-space"
        :model="tempModel" :rules="rules" ref="tempModel" status-icon
        label-position="right" label-width="150px" style='margin-left:50px;'>

			 <el-col :span="24">



         <el-form-item label="车系"  prop="carSeriesID">
           <carSeriesSelect v-model="tempModel.carSeriesID" groupName="update"/>
         </el-form-item>

         <el-form-item label="汽车车型"  prop="carModelID">
           <carModelSelect v-model="tempModel.carModelID" groupName="update"/>
         </el-form-item>

         <el-form-item label="计划类型"  prop="carModelID">
         <el-select v-model="tempModel.planType" clearable>
           <el-option v-for="item in planTypeOptions" :key="item.id" :value="item.id"  :label="item.label"/>
         </el-select>
         </el-form-item>

         <el-form-item label="期数"  prop="periods" >
           <el-input type="text" v-model="tempModel.periods">
           </el-input>
         </el-form-item>

         <el-form-item label="押金"  prop="deposit" >
           <el-input type="text" v-model="tempModel.deposit">
           </el-input>
         </el-form-item>

         <el-form-item label="首月租金"  prop="firstMonthRental" >
           <el-input type="text" v-model="tempModel.firstMonthRental">
           </el-input>
         </el-form-item>

         <el-form-item label="每月租金"  prop="monthlyRental" >
           <el-input type="text" v-model="tempModel.monthlyRental">
           </el-input>
         </el-form-item>

         <el-form-item label="备注"  prop="planRemark" >
           <el-input type="textarea"
                     :rows="2" v-model="tempModel.planRemark">
           </el-input>
         </el-form-item>

			</el-col>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button>
        <el-button size="mini" v-else type="primary" @click="updateModel">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        planTypeOptions: [
          { id: 1, label: "长租" },
          { id: 2, label: "以租代售" }

        ],
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数

				rentOrgPlanID:'',

				carBrandID:'',

				carSeriesID:'',

				carModelID:'',

				periods:'',

				deposit:'',

				firstMonthRental:'',

				monthlyRental:'',

				orgID:'',

				status:'',

				createTime:'',

				createUser:'',

				modifyTime:'',

				modifyUser:'',


          planType:''

        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
				rentOrgPlanID:'',
				carBrandID:'',
				carSeriesID:'',
				carModelID:'',
				periods:'',
				deposit:'',
				firstMonthRental:'',
				monthlyRental:'',
				orgID:'',
				status:'',
				createTime:'',
				createUser:'',
				modifyTime:'',
				modifyUser:'',
          planType:1,
          planRemark:''
        },
        rules: {
			 rentOrgPlanID:[
		  { required: true, message: '请填写ID', trigger: 'blur' }],

			 carBrandID:[
		  { required: true, message: '请填写品牌', trigger: 'blur' }],

			 carSeriesID:[
		  { required: true, message: '请填写车系', trigger: 'blur' }],

			 carModelID:[
		  { required: true, message: '请填写车型', trigger: 'blur' }],

			 periods:[
		  { required: true, message: '请填写期数', trigger: 'blur' }],

			 deposit:[
		  { required: true, message: '请填写按金', trigger: 'blur' }],

			 firstMonthRental:[
		  { required: true, message: '请填写首月租金', trigger: 'blur' }],

			 monthlyRental:[
		  { required: true, message: '请填写每月租金', trigger: 'blur' }],

			 orgID:[
		  { required: true, message: '请填写组织', trigger: 'blur' }],

			 status:[
		  { required: true, message: '请填写数据状态：0-正常，1-删除', trigger: 'blur' }],

			 createTime:[
		  { required: true, message: '请填写创建时间', trigger: 'blur' }],

			 createUser:[
		  { required: true, message: '请填写创建人ID', trigger: 'blur' }],

			 modifyTime:[
		  { required: true, message: '请填写修改时间', trigger: 'blur' }],

			 modifyUser:[
		  { required: true, message: '请填写修改人ID', trigger: 'blur' }]




            //{ required: true, message: '标题', trigger: 'blur' },
            //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        //if (!this.hasPerm('rentplan:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/rentplan/listRentplan",
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
      },
      showCreate() {
        if (this.$refs['tempModel']!==undefined) {
          this.$refs['tempModel'].resetFields();
        }
        //显示新增对话框
					 this.tempModel.rentOrgPlanID = "";
					 this.tempModel.carBrandID = "";
					 this.tempModel.carSeriesID = "";
					 this.tempModel.carModelID = "";
					 this.tempModel.periods = 0;
					 this.tempModel.deposit = "";
					 this.tempModel.firstMonthRental = "";
					 this.tempModel.monthlyRental = "";
					 this.tempModel.orgID = "";
					 this.tempModel.status = 0;
					 this.tempModel.createTime = "";
					 this.tempModel.createUser = "";
					 this.tempModel.modifyTime = "";
					 this.tempModel.modifyUser = "";
        this.tempModel.planType= 1;
        this.tempModel.planRemark='';

        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //这个重置的方法也不能用，它是将表单重置成form第一次打开时的model的值
        //打开修改，关闭，打开新增，就会看到字段的值是被重置成了“打开修改”时的值
        if (this.$refs['tempModel']!==undefined) {
          this.$refs['tempModel'].resetFields();
        }

        this.api({
          url: "/rentplan/getRentplan",
          method: "post",
          data: {rentOrgPlanID:this.list[$index].rentOrgPlanID}
        }).then(data => {
          this.tempModel = data;

          this.dialogStatus = "update"
          this.dialogFormVisible = true
        })

      },
      createModel() {
        this.$refs['tempModel'].validate((valid) => {
          if (valid) {
            //保存新文章
            this.api({
              url: "/rentplan/addRentplan",
              method: "post",
              data: this.tempModel
            }).then(() => {
              this.getList();
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      updateModel() {
        this.$refs['tempModel'].validate((valid) => {
          if (valid) {
            //修改文章
            this.api({
              url: "/rentplan/updateRentplan",
              method: "post",
              data: this.tempModel
            }).then(() => {
                let msg = "修改成功！";
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1 * 1000,
                  onClose: () => {
                    //this.getList();
                  }
                })

              this.getList();
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      deleteModel($index) {
        this.$confirm("您确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          showCancelButton: true,
          type: "warning"
        }).then(() => {
          this.api({
            url: "/rentplan/deleteRentplan",
            method: "post",
            data: this.list[$index]
          }).then(result=>{
            let msg = "删除成功！";
            this.$message({
              message: msg,
              type: 'success',
              duration: 1 * 1000,
              onClose: () => {

              }
            })
            this.getList();

          })
        },() => {
        //取消
        });
      }
    }
  }
</script>

