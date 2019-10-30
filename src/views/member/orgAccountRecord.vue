<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">

			<el-form-item label="用户名称">
			    <el-input v-model="listQuery.memberName" placeholder="用户名称"></el-input>
			</el-form-item>


			<el-form-item label="4S店铺名称">
			    <el-input v-model="listQuery.orgName" placeholder="4S店铺名称"></el-input>
			</el-form-item>

      <el-form-item label="交易类型">
          <el-select clearable v-model="listQuery.tradeType" placeholder="请选择">
  							  <el-option
  							    v-for="item in [{value:1,label:'充值'},{value:2,label:'消费'},{value:3,label:'赠送'}]"
  							    :key="item.value"
  							    :label="item.label"
  							    :value="item.value">
  							  </el-option>
  							</el-select>
			</el-form-item>

      <el-form-item label="交易时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.tradeTime" value-format="yyyy-MM-dd"></el-date-picker>
	    </el-form-item>

			

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="getList">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('orgAccountRecord:add')">添加
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
      <el-table-column align="center" prop="memberName" label="用户名称" ></el-table-column>
			<el-table-column align="center" prop="orgName" label="4S店铺名称" ></el-table-column>
			<el-table-column align="center" prop="tradeType" label="交易类型" >
        <template slot-scope="scope">
				  <span v-if="scope.row.tradeType==1">充值</span>
          <span v-if="scope.row.tradeType==2">消费</span>
			  	<span v-if="scope.row.tradeType==3">赠送</span>
			  </template>
      </el-table-column>
			<el-table-column align="center" prop="tradeDesc" label="交易说明" ></el-table-column>
			<el-table-column align="center" prop="tradeTime" label="交易时间" ></el-table-column>
			<el-table-column align="center" prop="tradeMoney" label="交易金额" ></el-table-column>
			<el-table-column align="center" prop="realName" label="操作人" ></el-table-column>
			<el-table-column align="center" prop="createTime" label="操作时间" ></el-table-column>
       
        
      <!-- <el-table-column align="center" label="操作" width="150" v-if="hasPerm('orgAccountRecord:update')">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button size="mini" type="primary" icon="edit" @click="deleteModel(scope.$index)">删除</el-button>
        </template>
      </el-table-column> -->
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
					<el-form-item label="ID "  prop="iD" >
											<el-input type="text" v-model="tempModel.iD">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="平台用户ID"  prop="memberID" >
											<el-input type="text" v-model="tempModel.memberID">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="4S店铺ID"  prop="orgID" >
											<el-input type="text" v-model="tempModel.orgID">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="交易类型"  prop="tradeType" >
											<el-input type="text" v-model="tempModel.tradeType">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="交易说明"  prop="tradeDesc" >
											<el-input type="text" v-model="tempModel.tradeDesc">
											</el-input>
										</el-form-item>	
			
					 <el-form-item label="交易时间"  prop="tradeTime" >
						<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.tradeTime" value-format="yyyy-MM-dd"></el-date-picker>
					 </el-form-item>
			
					<el-form-item label="交易金额"  prop="tradeMoney" >
											<el-input type="text" v-model="tempModel.tradeMoney">
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
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          
				iD:'',
            
				memberID:'',
            
				orgID:'',
            
				tradeType:'',
            
				tradeDesc:'',
            
				tradeTime:'',
            
				tradeMoney:'',
            
				userID:'',
            
        createTime:'',
        
            memberName:'',
            orgName:''
           
           
        
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
				iD:'',
				memberID:'',
				orgID:'',
				tradeType:'',
				tradeDesc:'',
				tradeTime:'',
				tradeMoney:'',
				userID:'',
				createTime:''

        },
        rules: {
			 iD:[
		  { required: true, message: '请填写ID ', trigger: 'blur' }],
		
			 memberID:[
		  { required: true, message: '请填写平台用户ID', trigger: 'blur' }],
		
			 orgID:[
		  { required: true, message: '请填写4S店铺ID', trigger: 'blur' }],
		
			 tradeType:[
		  { required: true, message: '请填写交易类型，1：充值 2：消费3：赠送', trigger: 'blur' }],
		
			 tradeDesc:[
		  { required: true, message: '请填写交易说明', trigger: 'blur' }],
		
			 tradeTime:[
		  { required: true, message: '请填写交易时间', trigger: 'blur' }],
		
			 tradeMoney:[
		  { required: true, message: '请填写交易金额', trigger: 'blur' }],
		
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
      getList() {
        //查询列表
        //if (!this.hasPerm('orgAccountRecord:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/orgAccountRecord/getOrgAccountRecordList",
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
					 this.tempModel.iD = "";
					 this.tempModel.memberID = "";
					 this.tempModel.orgID = "";
					 this.tempModel.tradeType = "";
					 this.tempModel.tradeDesc = "";
					 this.tempModel.tradeTime = "";
					 this.tempModel.tradeMoney = "";
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
          url: "/orgAccountRecord/getOrgAccountRecord4m",
          method: "post",
          data: {iD:this.list[$index].iD}
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
              url: "/orgAccountRecord/addOrgAccountRecord",
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
              url: "/orgAccountRecord/updateOrgAccountRecord",
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
            url: "/orgAccountRecord/deleteOrgAccountRecord",
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

