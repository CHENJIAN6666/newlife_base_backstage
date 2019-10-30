<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">


			<el-form-item label="图片编码">
			    <el-input v-model="listQuery.code" placeholder="图片编码"></el-input>
			</el-form-item>


			<el-form-item label="名称">
			    <el-input v-model="listQuery.name" placeholder="名称"></el-input>
			</el-form-item>



       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList();">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('mobileImage:add')">添加
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

				 <el-table-column align="center" prop="code" label="图片编码" width="80"></el-table-column>

				 <el-table-column align="center" prop="image" label="图片路径" width="80"></el-table-column>

				 <el-table-column align="center" prop="link" label="链接" width="60"></el-table-column>

				 <el-table-column align="center" prop="name" label="名称" width="60"></el-table-column>

				 <el-table-column align="center" prop="remark" label="备注" ></el-table-column>



      <el-table-column align="center" label="操作" width="150" v-if="hasPerm('mobileImage:update')">
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


					<el-form-item label="图片编码"  prop="code" >
											<el-input type="text" v-model="tempModel.code">
											</el-input>
										</el-form-item>

					<el-form-item label="图片路径"  prop="image" >
            <newLifeUploadImg :uploadPicData="uploadPicData"
                              v-model="tempModel.image"></newLifeUploadImg>

										</el-form-item>

					<el-form-item label="链接"  prop="link" >
											<el-input type="text" v-model="tempModel.link">
											</el-input>
										</el-form-item>

					<el-form-item label="名称"  prop="name" >
											<el-input type="text" v-model="tempModel.name">
											</el-input>
										</el-form-item>

					<el-form-item label="备注"  prop="remark" >
											<el-input type="text" v-model="tempModel.remark">
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
        uploadPicData:{'category':'mobileImage'},

        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数

				mobileImageID:'',

				code:'',

				image:'',

				link:'',

				name:'',

				remark:'',

				status:''




        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
				mobileImageID:'',
				code:'',
				image:'',
				link:'',
				name:'',
				remark:'',
				status:''

        },
        rules: {
			 mobileImageID:[
		  { required: true, message: '请填写', trigger: 'blur' }],

			 code:[
		  { required: true, message: '请填写图片编码', trigger: 'blur' }],

			 image:[
		  { required: true, message: '请填写图片路径', trigger: 'blur' }],

			 link:[
		  { required: true, message: '请填写链接', trigger: 'blur' }],

			 name:[
		  { required: true, message: '请填写名称', trigger: 'blur' }],

			 remark:[
		  { required: true, message: '请填写备注', trigger: 'blur' }],

			 status:[
		  { required: true, message: '请填写0', trigger: 'blur' }]




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
        //if (!this.hasPerm('mobileImage:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/mobileImage/listMobileImage",
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
					 this.tempModel.mobileImageID = "";
					 this.tempModel.code = "";
					 this.tempModel.image = "";
					 this.tempModel.link = "";
					 this.tempModel.name = "";
					 this.tempModel.remark = "";
					 this.tempModel.status = 0;


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
          url: "/mobileImage/getMobileImage",
          method: "post",
          data: {mobileImageID:this.list[$index].mobileImageID}
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
              url: "/mobileImage/addMobileImage",
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
              url: "/mobileImage/updateMobileImage",
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
            url: "/mobileImage/deleteMobileImage",
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

