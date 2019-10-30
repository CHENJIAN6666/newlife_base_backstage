<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      {{ $route.params.id }}
      ,{{ $route.params.type }}
			<el-form-item label="标题">
				<el-input v-model="listQuery.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item label="文章内容">
				<el-input v-model="listQuery.content" placeholder="文章内容"></el-input>
			</el-form-item>
			<el-form-item label="浏览量">
				<el-input v-model="listQuery.pageView" placeholder="浏览量"></el-input>
			</el-form-item>
			<el-form-item label="是否有效  0.有效  1无效">
				<el-input v-model="listQuery.status" placeholder="是否有效  0.有效  1无效"></el-input>
			</el-form-item>
			<el-form-item label="创建时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime_from" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="创建时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime_to" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="创建人ID">
				<el-input v-model="listQuery.createUser" placeholder="创建人ID"></el-input>
			</el-form-item>
			<el-form-item label="修改时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.modifyTime_from" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="修改时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.modifyTime_to" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="修改人ID">
				<el-input v-model="listQuery.modifyUser" placeholder="修改人ID"></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
			</el-form-item>
		</el-form>
    <el-row type="flex" justify="end" style="padding-bottom: 5px;">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加
      </el-button>
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
        <el-table-column align="center" prop="title" label="标题" width="60"></el-table-column>
        <el-table-column align="center" prop="content" label="文章内容" width="60"></el-table-column>
        <el-table-column align="center" prop="pageView" label="浏览量" width="60"></el-table-column>
        <el-table-column align="center" prop="status" label="是否有效  0.有效  1无效" width="60"></el-table-column>
        <el-table-column align="center" label="创建时间" width="60">
            <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="createUser" label="创建人ID" width="60"></el-table-column>
        <el-table-column align="center" label="修改时间" width="60">
            <template slot-scope="scope">
            <span>{{scope.row.modifyTime}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="modifyUser" label="修改人ID" width="60"></el-table-column>
      <el-table-column align="center"  label="操作"  fixed="right" width="200" v-if="hasPerm('article:update')">
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
        label-position="left" label-width="60px" style='width: 300px; margin-left:50px;'>
        
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="tempModel.title">
          </el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input type="text" v-model="tempModel.content">
          </el-input>
        </el-form-item>
        <el-form-item label="浏览量" prop="pageView">
          <el-input type="text" v-model="tempModel.pageView">
          </el-input>
        </el-form-item>

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
          
            
            title: ''
            ,
            content: ''
            ,
            pageView: ''
            ,
            status: ''
            ,
            createTime_from: ''
            ,createTime_to: ''
            ,
            createUser: ''
            ,
            modifyTime_from: ''
            ,modifyTime_to: ''
            ,
            modifyUser: ''
        
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
        
            id: ''
            ,title: ''
            ,content: ''
            ,pageView: ''

        },
        rules: {
        
            
          title: [
            { required: true, message: '请填写标题', trigger: 'blur' }
          ]
            ,
          content: [
            { required: true, message: '请填写文章内容', trigger: 'blur' }
          ]
            ,
          pageView: [
            { required: true, message: '请填写浏览量', trigger: 'blur' }
          ]
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
        if (!this.hasPerm('article:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/article/listArticle",
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
            this.tempModel.title = "";
            this.tempModel.content = "";
            this.tempModel.pageView = "";
            this.tempModel.status = "";
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
          url: "/article/getArticle",
          method: "post",
          data: {id:this.list[$index].id}
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
              url: "/article/addArticle",
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
              url: "/article/updateArticle",
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
            url: "/article/deleteArticle",
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

