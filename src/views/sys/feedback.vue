<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">
				
			<el-form-item label="反馈类型">
       <!--  <feedbackClassifyInput 
          v-model="listQuery.feedbackClassifyID" 
          :list="feedbackClassifyTree"
          :mprops="{value:'id',label:'label',children:'children'}" 
          :title="'反馈类型'">
        </feedbackClassifyInput> -->
			<!-- <el-input v-model="listQuery.feedbackTitle" placeholder="反馈标题"></el-input> -->
			 <el-cascader clearable @clear="feedbackClassifyIDPath=[]" :props="{value:'id',label:'label',children:'children'}"
          :options="feedbackClassifyTree"
          v-model="queryFeedbackClassifyIDPath">
        </el-cascader>
      </el-form-item> 

			<el-form-item label="是否答复">
			<!-- <el-input v-model="listQuery.hasReply" placeholder="是否答复：1是；0否"></el-input> -->
			  <el-select clearable v-model="listQuery.hasReply" placeholder="请选择">
        <el-option
            v-for="item in [{value:1,label:'是'},{value:0,label:'否'}]"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
       </el-select>
      </el-form-item> 

			<el-form-item label="是否公开">
			<!-- <el-input v-model="listQuery.isPublic" placeholder="是否公开：1是；0否"></el-input> -->
			 <el-select clearable v-model="listQuery.isPublic" placeholder="请选择">
        <el-option
            v-for="item in [{value:1,label:'是'},{value:0,label:'否'}]"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
       </el-select>
      </el-form-item> 

			<el-form-item label="反馈人">
      <el-input v-model="listQuery.replyContent" placeholder="答复内容"></el-input>
      </el-form-item> 

      <el-form-item label="答复人">
			<el-input v-model="listQuery.replyContent" placeholder="答复内容"></el-input>
			</el-form-item> 
	
	
       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
   <!--  <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('feedback:add')">添加
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
			
		 <el-table-column align="center" prop="feedbackClassifyID" label="反馈类型" width="100"></el-table-column>
		 <el-table-column align="center" prop="feedbackTitle" label="反馈标题" fit></el-table-column>
		 <el-table-column align="center" prop="feedbackContent" label="反馈内容" width="80"></el-table-column>
		 <el-table-column align="center" prop="hasReply" label="是否答复" width="80"></el-table-column>
		 <el-table-column align="center" prop="isPublic" label="是否公开" width="80"></el-table-column>
		 <el-table-column align="center" prop="replyContent" label="答复内容" width="80"></el-table-column>
     <el-table-column align="center" prop="feedbackPersonNickName" label="反馈人" width="80"></el-table-column>
     <el-table-column align="center" prop="feedbackTime" label="反馈时间" fit></el-table-column>
     <el-table-column align="center" prop="replyPersonNickName" label="答复人" fit></el-table-column>
     <el-table-column align="center" prop="replyTime" label="答复时间" fit></el-table-column>
			
      <el-table-column align="center" label="操作" width="220" v-if="hasPerm('feedback/member/1:update,feedback/user/2:update')" 
>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="answerFeedback(scope.$index)">答复</el-button>
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
			
				<el-form-item label="意见反馈分类"  prop="feedbackClassifyID" >
				<!-- 	<el-input :disabled="true" type="text" value="默认分类">
					</el-input> -->
           <el-cascader :props="{value:'id',label:'label',children:'children'}"
              :options="feedbackClassifyTree"
              v-model="modelFeedbackClassifyIDPath">
            </el-cascader>
				</el-form-item>

				<el-form-item label="反馈标题"  prop="feedbackTitle" >
					<el-input :disabled="dialogStatus=='answer'" type="text" v-model="tempModel.feedbackTitle">
					</el-input>
				</el-form-item>
			
				<el-form-item label="反馈内容"  prop="feedbackContent" >
					<el-input :disabled="dialogStatus=='answer'" type="text" v-model="tempModel.feedbackContent">
					</el-input>
				</el-form-item>
			
			
				<el-form-item label="是否答复"  prop="hasReply" >
					<el-radio :disabled="dialogStatus=='answer'" v-model="tempModel.hasReply" :label="1">是</el-radio>
					<el-radio :disabled="dialogStatus=='answer'" v-model="tempModel.hasReply" :label="0">否</el-radio>

				</el-form-item>
			
				<el-form-item label="是否公开"  prop="isPublic" >
					<el-radio :disabled="dialogStatus=='answer'" v-model="tempModel.isPublic" :label="1">是</el-radio>
					<el-radio :disabled="dialogStatus=='answer'" v-model="tempModel.isPublic" :label="0">否</el-radio>
				</el-form-item>
	

      <el-form-item label="答复内容"  prop="replyContent" >
        <el-input type="text" v-model="tempModel.replyContent">
        </el-input>
      </el-form-item>   

			</el-col>
			
		<!-- 	<el-col :span="11" style="margin-left:20px">
							
				
					
			</el-col> -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button>
        <el-button size="mini" v-else-if="dialogStatus=='answer'" type="success" @click="answerModel">答 复</el-button>
        <el-button size="mini" v-else type="primary" @click="updateModel">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import feedbackClassifyInput from '@/components/sys'
  export default {
     // components:{
     //        "feedbackClassifyInput":feedbackClassifyInput
     //    },
    data() {
      return {
        // userType:$route.params.id,
        feedbackClassifyTree:[],
        queryFeedbackClassifyIDPath:[],
        modelFeedbackClassifyIDPath:[],
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
			    feedbackClassifyID:'',
			    feedbackPerson:'',
			    feedbackMarker:'',
			    hasReply:'',
			    isPublic:'',
			    replyPerson:'',
          feedbackMarker:''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建',
          answer: '答复'
        },
        tempModel: {
			     feedbackClassifyID:'',
			     feedbackTitle:'',
			     feedbackContent:'',
			     feedbackPerson:'',
			     feedbackMarker:'',
			     feedbackTime:'',
			     hasReply:'',
			     isPublic:'',
			     replyContent:''
        },
        rules: {

        	feedbackClassifyID:[
			 { required: true, message: '请填写意见反馈分类', trigger: 'blur' }],
		
			feedbackTitle:[
			 { required: true, message: '请填写反馈标题', trigger: 'blur' }],
	
			feedbackContent:[
			 { required: true, message: '请填写反馈内容', trigger: 'blur' }],
	
	
			hasReply:[
			 { required: true, message: '请填写是否答复：1是；0否', trigger: 'blur' }],
	
			isPublic:[
			 { required: true, message: '请填写是否公开：1是；0否', trigger: 'blur' }],
	
			replyContent:[
			 { required: true, message: '请填写答复内容', trigger: 'blur' }],
	
            //{ required: true, message: '标题', trigger: 'blur' },
            //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        }
      }
    },
    created() {
      this.getList();
      this.getFeedbackClassifyTree()
    },
    watch:{
      "$route.params.id":function(val){
        this.getList()
      }
    },
    methods: {
    	tempModeInit(){
    		this.tempModel.feedbackID = "";
		 	  this.tempModel.feedbackClassifyID = 1;
		 	  this.tempModel.feedbackTitle = "";
		 	  this.tempModel.feedbackContent = "";
		 	  this.tempModel.hasReply = 0;
		 	  this.tempModel.isPublic = 0;
		 	  this.tempModel.replyContent = "";
		 	  this.tempModel.replyPerson = "";
    	},
      getFeedbackClassifyTree(){
        this.api({
          url: "/feedbackClassify/getFeedbackClassifyTree",
          method: "get"
        }).then(data => {
          this.feedbackClassifyTree = data
          // console.warn(this.feedbackClassifyTree);
        })
      },
      getList() {
        // console.log(this.$route.params.id);
        //查询列表
        // if (!this.hasPerm('feedback:list')) {
        //   return
        // }
        this.listLoading = true;
        this.listQuery.feedbackMarker = this.$route.params.id
        let path = this.queryFeedbackClassifyIDPath
        let length = (path==null ? 0 : path.length)
        if( length>0){
          this.listQuery.feedbackClassifyID=path[length-1]
        }else{
          this.listQuery.feedbackClassifyID = ''
        }
        this.api({
          url: "/feedback/listFeedback",
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
        this.tempModeInit();

        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
       answerFeedback($index) {
        //这个重置的方法也不能用，它是将表单重置成form第一次打开时的model的值
        //打开修改，关闭，打开新增，就会看到字段的值是被重置成了“打开修改”时的值
        if (this.$refs['tempModel']!==undefined) {
          this.$refs['tempModel'].resetFields();
        }
        this.getFeedbackClassifyTree()
        this.api({
          url: "/feedback/getFeedback",
          method: "post",
          data: {feedbackID:this.list[$index].feedbackID}
        }).then(data => {
          this.tempModel = data;
          let path = (data.classifyIDTreePath==null?'':data.classifyIDTreePath);
          let length = path.length;
          this.modelFeedbackClassifyIDPath = path.substring(1,length-1).split('.')
            .map(function(item) {
              return parseInt(item, 10);
            });
          this.dialogStatus = "answer"
          this.dialogFormVisible = true
        })
        
      },
      showUpdate($index) {
        //这个重置的方法也不能用，它是将表单重置成form第一次打开时的model的值
        //打开修改，关闭，打开新增，就会看到字段的值是被重置成了“打开修改”时的值
        if (this.$refs['tempModel']!==undefined) {
          this.$refs['tempModel'].resetFields();
        }

        this.api({
          url: "/feedback/getFeedback",
          method: "post",
          data: {feedbackID:this.list[$index].feedbackID}
        }).then(data => {
          this.tempModel = data;
          let path = data.classifyIDTreePath;
          let length = path.length;
          this.modelFeedbackClassifyIDPath = path.substring(1,length-1).split('.')
            .map(function(item) {
              return parseInt(item, 10);
            });
          this.dialogStatus = "update"
          this.dialogFormVisible = true
        })
        
      },
      createModel() {
        this.$refs['tempModel'].validate((valid) => {
          if (valid) {
            //保存新文章
            this.api({
              url: "/feedback/addFeedback",
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
      answerModel() {
        this.$refs['tempModel'].validate((valid) => {
          if (valid) {
            let path = this.modelFeedbackClassifyIDPath;
            if(path && path.length>0){
              this.tempModel.feedbackClassifyID = path[path.length-1];
            }
            this.api({
              url: "/feedback/answerFeedback",
              method: "post",
              data: this.tempModel
            }).then(() => {
                let msg = "答复成功！";
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
       updateModel() {
        this.$refs['tempModel'].validate((valid) => {
          if (valid) {
            //修改文章
            let path = this.modelFeedbackClassifyIDPath;
            if(path && path.length>0){
              this.tempModel.feedbackClassifyID = path[path.length-1];
            }
            this.api({
              url: "/feedback/updateFeedback",
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
            url: "/feedback/deleteFeedback",
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

