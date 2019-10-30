<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">
	


			<el-form-item label="客户">
			    <el-input v-model="listQuery.company" placeholder="客户"></el-input>
			</el-form-item>

   
        <el-form-item label="行销人员">
            <el-input v-model="listQuery.realName" placeholder="客户"></el-input>
        </el-form-item>





       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="getList">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <!-- <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('follow:add')">添加
      </el-button>
      </el-col>
    </el-row> -->
    </div>
    <el-table size="mini" :data="list" 
      v-loading.body="listLoading" element-loading-text="拼命加载中" 
      border fit highlight-current-row stripe>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
			
				<el-table-column align="center" prop="company" label="客户" ></el-table-column>
        <el-table-column align="center" prop="realName" label="跟进人" width="70"></el-table-column>
         <el-table-column align="center" prop="visitStatus" label="跟进状态" width="70"></el-table-column>
				<el-table-column align="center" label="创建时间" width="140">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}</span>
					</template>
				</el-table-column>
        		
        <el-table-column align="center" prop="isValid" label="是否有效" width="80">
          <template slot-scope="scope">
           	   <span v-if="scope.row.isValid == 0">无效</span>
							 <span v-if="scope.row.isValid == 1">有效</span>
          </template>
        </el-table-column>
				<el-table-column align="center" prop="intentionLevel" label="意向等级" width="80"></el-table-column>

			
			
		
			
       
        
      <el-table-column align="center" label="操作" width="150" v-if="hasPerm('follow:update')" fixed="right">
         <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button size="mini" type="primary" icon="edit" @click="deleteModel(scope.$index)">删除</el-button> -->
          <el-button size="mini" type="primary" icon="edit" @click="followDetail(scope.row.customerID)">查看跟进详情</el-button>
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
					<el-form-item label="客户跟进ID"  prop="followID" >
											<el-input type="text" v-model="tempModel.followID">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="客户ID"  prop="customerID" >
											<el-input type="text" v-model="tempModel.customerID">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="数据状态：0-正常，1-删除"  prop="status" >
											<el-input type="text" v-model="tempModel.status">
											</el-input>
										</el-form-item>	
			
					 <el-form-item label="创建时间"  prop="createTime" >
						<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.createTime" value-format="yyyy-MM-dd"></el-date-picker>
					 </el-form-item>
			
					<el-form-item label="创建人ID"  prop="createUser" >
											<el-input type="text" v-model="tempModel.createUser">
											</el-input>
										</el-form-item>	
			
					 <el-form-item label="修改时间"  prop="modifyTime" >
						<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.modifyTime" value-format="yyyy-MM-dd"></el-date-picker>
					 </el-form-item>
			
					<el-form-item label="修改人ID"  prop="modifyUser" >
											<el-input type="text" v-model="tempModel.modifyUser">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="意向等级"  prop="intentionLevel" >
											<el-input type="text" v-model="tempModel.intentionLevel">
											</el-input>
										</el-form-item>	
			
					 <el-form-item label="下次跟进时间"  prop="nextVisitTime" >
						<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.nextVisitTime" value-format="yyyy-MM-dd"></el-date-picker>
					 </el-form-item>
			
					<el-form-item label="备注"  prop="remark" >
											<el-input type="text" v-model="tempModel.remark">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="跟进人"  prop="userID" >
											<el-input type="text" v-model="tempModel.userID">
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
    <followDetail :show-dialog="showDialog" :customerID="customerID" @closeDialog="closeDialog"></followDetail>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        customerID:'',
        showDialog:false,
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          realName:'',
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          
				followID:'',
            
				customerID:'',
            
				status:'',
            
				createTime:'',
            
				createUser:'',
            
				modifyTime:'',
            
				modifyUser:'',
            
				intentionLevel:'',
            
				nextVisitTime:'',
            
				remark:'',
            
				userID:''
            
           
           
        
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
        salesOrgID:'',
        isValid:1,
        realName:'',
				followID:'',
				customerID:'',
				status:'',
				createTime:'',
				createUser:'',
				modifyTime:'',
				modifyUser:'',
				intentionLevel:'',
				nextVisitTime:'',
				remark:'',
				userID:''

        },
        rules: {
			 followID:[
		  { required: true, message: '请填写客户跟进ID', trigger: 'blur' }],
		
			 customerID:[
		  { required: true, message: '请填写客户ID', trigger: 'blur' }],
		
			 status:[
		  { required: true, message: '请填写数据状态：0-正常，1-删除', trigger: 'blur' }],
		
			 createTime:[
		  { required: true, message: '请填写创建时间', trigger: 'blur' }],
		
			 createUser:[
		  { required: true, message: '请填写创建人ID', trigger: 'blur' }],
		
			 modifyTime:[
		  { required: true, message: '请填写修改时间', trigger: 'blur' }],
		
			 modifyUser:[
		  { required: true, message: '请填写修改人ID', trigger: 'blur' }],
		
			 intentionLevel:[
		  { required: true, message: '请填写意向等级', trigger: 'blur' }],
		
			 nextVisitTime:[
		  { required: true, message: '请填写下次跟进时间', trigger: 'blur' }],
		
			 remark:[
		  { required: true, message: '请填写备注', trigger: 'blur' }],
		
			 userID:[
		  { required: true, message: '请填写跟进人', trigger: 'blur' }]
		
            
         
         
            //{ required: true, message: '标题', trigger: 'blur' },
            //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      closeDialog(){
        this.showDialog = false
       
      },
      followDetail(id){
        console.log(id)
        this.customerID = id
        this.showDialog = true
      },
      getList() {
        //查询列表
        //if (!this.hasPerm('follow:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/follow/listFollow2",
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
					 this.tempModel.followID = "";
					 this.tempModel.customerID = "";
					 this.tempModel.status = 0;
					 this.tempModel.createTime = "";
					 this.tempModel.createUser = "";
					 this.tempModel.modifyTime = "";
					 this.tempModel.modifyUser = "";
					 this.tempModel.intentionLevel = 0;
					 this.tempModel.nextVisitTime = "";
					 this.tempModel.remark = "";
					 this.tempModel.userID = 0;
           

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
          url: "/follow/getFollow",
          method: "post",
          data: {followID:this.list[$index].followID}
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
              url: "/follow/addFollow",
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
              url: "/follow/updateFollow",
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
            url: "/follow/deleteFollow",
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

