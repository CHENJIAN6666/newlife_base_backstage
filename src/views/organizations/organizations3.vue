<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="组织名称">
          <el-input v-model="listQuery.Org_Name" placeholder="组织名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end" style="padding-bottom: 5px;">
          <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('organizations:add')">添加
          </el-button>
      </el-row>
    </div>

    <el-table size="mini" :data="list" 
      v-loading.body="listLoading" element-loading-text="拼命加载中" 
      
      border fit highlight-current-row stripe>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="label" label="组织名称"></el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)" v-if="hasPerm('organizations:update')">修改</el-button>
          <el-button size="mini" type="danger" icon="delete" @click="removeOrganization(scope.$index)" v-if="hasPerm('organizations:delete')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
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

      <el-form
        size="mini"
        class="small-space" :model="tempOrganization" label-position="right" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="组织名称">
              <el-input type="text" v-model="tempOrganization.Org_Name">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input type="text" v-model="tempOrganization.Create_User">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="tempOrganization.Create_Time" style="width: 100%;"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker type="fixed-time" placeholder="选择时间"  style="width: 100%;"></el-time-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">

          </el-col>
          <el-col :span="8">

          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>

        <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createOrganization">创 建</el-button>
        <el-button size="mini" type="primary" v-else @click="updateOrganization">修 改</el-button>
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
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建文章'
        },
        tempOrganization: {
          id: "",
          Org_Name: "",
          Create_User:"",
          Create_Time:""
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        if (!this.hasPerm('organizations:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/Organizations/listOrganizations",
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
        // this.handleFilter();
        this.getList();
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
        //显示新增对话框
        this.tempOrganization.Org_Name = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempOrganization.id = this.list[$index].id;
        this.tempOrganization.Org_Name = this.list[$index].Org_Name;
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createOrganization() {
        //保存新文章
        this.api({
          url: "/Organizations/addOrganizations",
          method: "post",
          data: this.tempOrganization
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateOrganization() {
        //修改文章
        this.api({
          url: "/Organizations/updateOrganizations",
          method: "post",
          data: this.tempOrganization
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      removeOrganization($index) {
        let _vue = this;
        this.$confirm('确定删除此组织?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          let org = _vue.list[$index];
          org.status = '1';
          _vue.api({
            url: "/Organizations/deleteOrganizations",
            method: "post",
            data: org
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
    }
    // ,filters: {    //时间格式处理，格式化为YYYY-MM-DD
    //   Moment : function(value, formatString){
    //     formatString = formatString || 'YYYY-MM-DD';
    //     return moment(value).format(formatString);
    //   }
    // }
  }
</script>
