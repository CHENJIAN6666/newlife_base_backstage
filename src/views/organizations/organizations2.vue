<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="组织名称">
          <el-input v-model="listQuery.Org_Name" placeholder="组织名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('organizations:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="Org_Name" label="组织名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)" v-if="hasPerm('organizations:update')">修改</el-button>
          <el-button type="danger" icon="delete" @click="removeOrganization(scope.$index)" v-if="hasPerm('organizations:delete')">删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempOrganization" label-position="left" label-width="60px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="组织名称">
          <el-input type="text" v-model="tempOrganization.Org_Name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createOrganization">创 建</el-button>
        <el-button type="primary" v-else @click="updateOrganization">修 改</el-button>
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
          pageRow: 50,//每页条数
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
          Org_Name: ""
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
  }
</script>
