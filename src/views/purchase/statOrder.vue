<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">


			<el-form-item label="采购单批次单号">
			    <el-input v-model="listQuery.purchaseOrderBatch" placeholder="采购单批次单号"></el-input>
			</el-form-item>
         <el-form-item   label="开始日期" prop="startTime">
           <el-date-picker v-model="startTime" value-format="yyyy-MM-dd 00:00:00" type="date"
                           placeholder="开始日期"></el-date-picker>
         </el-form-item>
         <el-form-item  label="结束日期" prop="endTime">
           <el-date-picker v-model="endTime" value-format="yyyy-MM-dd 23:59:59" type="date"
                           placeholder="结束日期"></el-date-picker>
         </el-form-item>

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList();">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
      <el-row  style="padding-bottom: 5px;">
        <el-col :span="24" class="text-right">
          <el-button size="mini" type="primary" icon="plus" @click="createOrder" v-if="hasPerm('intentionMain:add')">生成汇总
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

				 <el-table-column align="center" prop="carFullName" label="整车车型"></el-table-column>

				 <el-table-column align="center" prop="carInteriorColorName" label="车系内饰颜色" width="120"></el-table-column>

				 <el-table-column align="center" prop="carColorName" label="车系颜色" width="100"></el-table-column>

				 <el-table-column align="center" prop="purchaseNum" label="采购数量" width="80"></el-table-column>

				 <el-table-column align="center" prop="purchaseOrderBatch" label="采购单批次单号" ></el-table-column>

				 <el-table-column align="center" prop="realName" label="操作人" width="120"></el-table-column>

				<el-table-column align="center" label="操作时间" width="140">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}</span>
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
					<el-form-item label="ID"  prop="purchaseOrderStatID" >
											<el-input type="text" v-model="tempModel.purchaseOrderStatID">
											</el-input>
										</el-form-item>

					<el-form-item label="整车车型ID"  prop="carModelID" >
											<el-input type="text" v-model="tempModel.carModelID">
											</el-input>
										</el-form-item>

					<el-form-item label="车系内饰颜色ID"  prop="carInteriorColorID" >
											<el-input type="text" v-model="tempModel.carInteriorColorID">
											</el-input>
										</el-form-item>

					<el-form-item label="车系颜色ID"  prop="carColorID" >
											<el-input type="text" v-model="tempModel.carColorID">
											</el-input>
										</el-form-item>

					<el-form-item label="采购数量"  prop="purchaseNum" >
											<el-input type="text" v-model="tempModel.purchaseNum">
											</el-input>
										</el-form-item>

					<el-form-item label="采购单批次单号"  prop="purchaseOrderBatch" >
											<el-input type="text" v-model="tempModel.purchaseOrderBatch">
											</el-input>
										</el-form-item>

					<el-form-item label="操作人ID"  prop="userID" >
											<el-input type="text" v-model="tempModel.userID">
											</el-input>
										</el-form-item>

					 <el-form-item label="操作时间"  prop="createTime" >
						<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.createTime" value-format="yyyy-MM-dd"></el-date-picker>
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
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        startTime:'',
        endTime:'',
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数

				purchaseOrderStatID:'',

				carModelID:'',

				carInteriorColorID:'',

				carColorID:'',

				purchaseNum:'',

				purchaseOrderBatch:'',

				userID:'',

				createTime:'',
        realName:''



        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
        carColorName:'',
        carInteriorColorName:'',
				purchaseOrderStatID:'',
				carModelID:'',
				carInteriorColorID:'',
				carColorID:'',
				purchaseNum:'',
				purchaseOrderBatch:'',
				userID:'',
				createTime:''

        },
        rules: {
			 purchaseOrderStatID:[
		  { required: true, message: '请填写ID', trigger: 'blur' }],

			 carModelID:[
		  { required: true, message: '请填写整车车型ID', trigger: 'blur' }],

			 carInteriorColorID:[
		  { required: true, message: '请填写车系内饰颜色ID', trigger: 'blur' }],

			 carColorID:[
		  { required: true, message: '请填写车系颜色ID', trigger: 'blur' }],

			 purchaseNum:[
		  { required: true, message: '请填写采购数量', trigger: 'blur' }],

			 purchaseOrderBatch:[
		  { required: true, message: '请填写采购单批次单号', trigger: 'blur' }],

			 userID:[
		  { required: true, message: '请填写操作人ID', trigger: 'blur' }],

			 createTime:[
		  { required: true, message: '请填写操作时间', trigger: 'blur' }]




            //{ required: true, message: '标题', trigger: 'blur' },
            //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      createOrder(){
        const _this = this;
        this.api({
          url: "/statOrder/createStatOrder",
          method: "post",
          data: {
            startTime: _this.startTime,
            endTime: _this.endTime
          }
        }).then(data => {
           _this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          });
          _this.getList();
        })


      },
      getList() {
        //查询列表
        //if (!this.hasPerm('statOrder:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/statOrder/listStatOrder",
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
					 this.tempModel.purchaseOrderStatID = "";
					 this.tempModel.carModelID = "";
					 this.tempModel.carInteriorColorID = "";
					 this.tempModel.carColorID = "";
					 this.tempModel.purchaseNum = 0;
					 this.tempModel.purchaseOrderBatch = "";
					 this.tempModel.userID = "";
					 this.tempModel.createTime = "";


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
          url: "/statOrder/getStatOrder",
          method: "post",
          data: {purchaseOrderStatID:this.list[$index].purchaseOrderStatID}
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
              url: "/statOrder/addStatOrder",
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
              url: "/statOrder/updateStatOrder",
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
            url: "/statOrder/deleteStatOrder",
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

