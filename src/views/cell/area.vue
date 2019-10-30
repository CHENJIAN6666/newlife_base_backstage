<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">
			
			<el-form-item label="区域ID">
			    <el-input v-model="listQuery.areaID" placeholder="区域ID"></el-input>
			</el-form-item>


			<el-form-item label="父ID">
			    <el-input v-model="listQuery.parentAreaID" placeholder="父ID"></el-input>
			</el-form-item>


			<el-form-item label="级别">
			    <el-input v-model="listQuery.levelType" placeholder="级别"></el-input>
			</el-form-item>


			<el-form-item label="全称">
			    <el-input v-model="listQuery.name" placeholder="全称"></el-input>
			</el-form-item>


			<el-form-item label="数据状态：0-正常，1-删除">
			    <el-input v-model="listQuery.status" placeholder="数据状态：0-正常，1-删除"></el-input>
			</el-form-item>


			<el-form-item label="创建时间">
			    <el-input v-model="listQuery.createTime" placeholder="创建时间"></el-input>
			</el-form-item>


			<el-form-item label="创建人ID">
			    <el-input v-model="listQuery.createUser" placeholder="创建人ID"></el-input>
			</el-form-item>


			<el-form-item label="修改时间">
			    <el-input v-model="listQuery.modifyTime" placeholder="修改时间"></el-input>
			</el-form-item>


			<el-form-item label="修改人ID">
			    <el-input v-model="listQuery.modifyUser" placeholder="修改人ID"></el-input>
			</el-form-item>

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="getList">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('area:add')">添加
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
				 <el-table-column align="center" prop="areaID" label="区域ID" width="80"></el-table-column>
			
				 <el-table-column align="center" prop="parentAreaID" label="父ID" width="70"></el-table-column>
			
				 <el-table-column align="center" prop="levelType" label="级别" width="60"></el-table-column>
			
				 <el-table-column align="center" prop="name" label="全称" width="60"></el-table-column>
			
				 <el-table-column align="center" prop="status" label="数据状态：0-正常，1-删除" width="180"></el-table-column>
			
				<el-table-column align="center" label="创建时间" width="140">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}</span>
					</template>
				</el-table-column>
			
				 <el-table-column align="center" prop="createUser" label="创建人ID" width="90"></el-table-column>
			
				<el-table-column align="center" label="修改时间" width="140">
					<template slot-scope="scope">
						<span>{{scope.row.modifyTime}}</span>
					</template>
				</el-table-column>
			
				 <el-table-column align="center" prop="modifyUser" label="修改人ID" width="90"></el-table-column>
			
       
        
      <el-table-column align="center" label="操作" width="150" v-if="hasPerm('area:update')">
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
					<el-form-item label="区域ID"  prop="areaID" >
											<el-input type="text" v-model="tempModel.areaID">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="父ID"  prop="parentAreaID" >
											<el-input type="text" v-model="tempModel.parentAreaID">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="级别"  prop="levelType" >
											<el-input type="text" v-model="tempModel.levelType">
											</el-input>
										</el-form-item>	
			
					<el-form-item label="全称"  prop="name" >
											<el-input type="text" v-model="tempModel.name">
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
          
				areaID:'',
            
				parentAreaID:'',
            
				levelType:'',
            
				name:'',
            
				status:'',
            
				createTime:'',
            
				createUser:'',
            
				modifyTime:'',
            
				modifyUser:''
            
           
           
        
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
				areaID:'',
				parentAreaID:'',
				levelType:'',
				name:'',
				status:'',
				createTime:'',
				createUser:'',
				modifyTime:'',
				modifyUser:''

        },
        rules: {
			 areaID:[
		  { required: true, message: '请填写区域ID', trigger: 'blur' }],
		
			 parentAreaID:[
		  { required: true, message: '请填写父ID', trigger: 'blur' }],
		
			 levelType:[
		  { required: true, message: '请填写级别', trigger: 'blur' }],
		
			 name:[
		  { required: true, message: '请填写全称', trigger: 'blur' }],
		
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
        //if (!this.hasPerm('area:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/area/listArea",
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
					 this.tempModel.areaID = "";
					 this.tempModel.parentAreaID = "";
					 this.tempModel.levelType = 0;
					 this.tempModel.name = "";
					 this.tempModel.status = 0;
					 this.tempModel.createTime = "";
					 this.tempModel.createUser = "";
					 this.tempModel.modifyTime = "";
					 this.tempModel.modifyUser = "";
           

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
          url: "/area/getArea",
          method: "post",
          data: {areaID:this.list[$index].areaID}
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
              url: "/area/addArea",
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
              url: "/area/updateArea",
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
            url: "/area/deleteArea",
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

