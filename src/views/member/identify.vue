<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">
			
			<el-form-item label="会员名称">
			    <el-input clearable v-model="listQuery.memberName" placeholder="会员名称"></el-input>
			</el-form-item>

			<el-form-item label="审核状态">
			    <!-- <el-input v-model="listQuery.auditState" placeholder="审核状态 0 未审核  1 已审核 2 驳回"></el-input> -->
          <el-select clearable v-model="listQuery.auditState">
            <el-option v-for="item in auditStateOptions" :key="item.id" :value="item.id" :label="item.label"/>
          </el-select>
			</el-form-item>

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList();">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <!-- <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('identify:add')">添加
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

				 <el-table-column align="center" prop="memberName" label="会员名称" width="100"></el-table-column>
			
				 <el-table-column align="center" label="手持身份证" fit>
           <img :style="{width: '200px',height:'150px'}" slot-scope="scope" :src="scope.row.identityCardHandImg" />
         </el-table-column>
			
				 <el-table-column align="center" label="手持驾驶证" fit>
           <img :style="{width: '200px',height:'150px'}" slot-scope="scope" :src="scope.row.drivingLicenseHandImg" />
         </el-table-column>
			
				 <!-- <el-table-column align="center" prop="identityCardImg" label="身份证" width="70"></el-table-column> -->
			<el-table-column align="center" prop="createTime" label="申请时间" width="120"></el-table-column>
			
				 <el-table-column align="center" label="审核状态" width="80">
          <template slot-scope="scope">
           <p v-if="scope.row.auditState == 0">未审核</p>
           <p v-else-if="scope.row.auditState == 1">通过</p>
           <p v-else-if="scope.row.auditState == 2">驳回</p>
           <p v-else></p>
          </template>
         </el-table-column>
			<el-table-column align="center" prop="auditRemark" label="审核备注" width="120"></el-table-column>
        
      <el-table-column align="center" label="操作" width="150" v-if="hasPerm('identify:update')">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.auditState != 0" size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)">审核</el-button>
          <!-- <el-button size="mini" type="primary" icon="edit" @click="deleteModel(scope.$index)">删除</el-button> -->
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
										
					<el-form-item label="会员名称">
						<!-- <el-input type="text" v-model="tempModel.memberID">
						</el-input> -->
            {{tempModel.memberName}}
					</el-form-item>	
			
					<el-form-item label="手持身份证">
						<!-- <el-input type="text" v-model="tempModel.identityCardHandImg">
						</el-input> -->
            <img :style="{width: '600px',height:'400px'}" :src="tempModel.identityCardHandImg"/>
					</el-form-item>	
			
					<el-form-item label="手持驾驶证">
						<!-- <el-input type="text" v-model="tempModel.drivingLicenseHandImg">
						</el-input> -->
            <img :style="{width: '600px',height:'400px'}" :src="tempModel.drivingLicenseHandImg"/>
					</el-form-item>	
			
          <el-form-item label="申请时间"  prop="modifyTime" >
							<el-date-picker disabled type="date" placeholder="选择日期" v-model="tempModel.createTime" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
			</el-col>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="success" @click="audit(1)">通 过</el-button>
        <el-button size="mini" type="success" @click="reject()">驳 回</el-button>
        <!-- <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button> -->
        <!-- <el-button size="mini" v-else type="primary" @click="updateModel">修 改</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      auditStateOptions:[{id:0,label:'未审核'},{id:1,label:'通过'},{id:2,label:'驳回'}],
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      listLoading: false, //数据加载等待动画
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数

        identifyID: "",

        memberID: "",
        memberName: '',
        identityCardHandImg: "",

        drivingLicenseHandImg: "",

        identityCardImg: "",

        auditState: 0
      },
      dialogStatus: "create",
      dialogFormVisible: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tempModel: {
        identifyID: "",
        memberID: "",
        identityCardHandImg: "",
        drivingLicenseHandImg: "",
        identityCardImg: "",
        auditState: "",
        auditRemark: '',
      },
      rules: {
        // identifyID: [{ required: true, message: "请填写", trigger: "blur" }],

        // memberID: [
        //   { required: true, message: "请填写会员ID", trigger: "blur" }
        // ],

        identityCardHandImg: [
          { required: true, message: "请填写手持身份证", trigger: "blur" }
        ],

        drivingLicenseHandImg: [
          { required: true, message: "请填写手持驾驶证", trigger: "blur" }
        ],

        // identityCardImg: [
        //   { required: true, message: "请填写身份证", trigger: "blur" }
        // ],

        auditState: [
          {
            required: true,
            message: "请填写审核状态",
            trigger: "blur"
          }
        ],

        // status: [{ required: true, message: "请填写", trigger: "blur" }],

        // createTime: [{ required: true, message: "请填写", trigger: "blur" }],

        // createUser: [{ required: true, message: "请填写", trigger: "blur" }],

        // modifyTime: [{ required: true, message: "请填写", trigger: "blur" }],

        // modifyUser: [{ required: true, message: "请填写", trigger: "blur" }]

        //{ required: true, message: '标题', trigger: 'blur' },
        //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    reject(){
      this.$confirm(`<div><strong>确定驳回该申请？</strong></div> 
                     驳回理由： <input type="text" id="auditRemark"/>`, '确认信息', {
        dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '返回'
        }).then(() => {
            this.tempModel.auditRemark = document.getElementById('auditRemark').value
            document.getElementById('auditRemark').value = ''
            this.audit(2)
        })
    },
    audit(auditState){
      const model = {
              identifyID: this.tempModel.identifyID,
              auditState
            }
      if(auditState == 2){
        model.auditRemark = this.tempModel.auditRemark
      }
      this.api({
            url: "/identify/audit",
            method: "post",
            data: model
          }).then(() => {
            let msg = "审核成功！";
            this.$message({
              message: msg,
              type: "success",
              duration: 1 * 1000,
              onClose: () => {
                //this.getList();
              }
            });
            this.getList();
            this.dialogFormVisible = false;
          })
    },
    getAuditStateText(v){
      for (const i in this.auditStateOptions) {
        if( this.auditStateOptions[i].id == v){
          return this.auditStateOptions[i].lable
        }
      }
      return '未知状态'
    },
    getList() {
      //查询列表
      //if (!this.hasPerm('identify:list')) {
      // return
      //}
      this.listLoading = true;
      this.api({
        url: "/identify/listIdentify",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.totalCount;
      });
    },
    handleSizeChange(val) {
      //改变每页数量
      this.listQuery.pageRow = val;
      this.handleFilter();
    },
    handleCurrentChange(val) {
      //改变页码
      this.listQuery.pageNum = val;
      this.getList();
    },
    getIndex($index) {
      //表格序号
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1;
    },
    showCreate() {
      if (this.$refs["tempModel"] !== undefined) {
        this.$refs["tempModel"].resetFields();
      }
      //显示新增对话框
      this.tempModel.identifyID = "";
      this.tempModel.memberID = "";
      this.tempModel.identityCardHandImg = "";
      this.tempModel.drivingLicenseHandImg = "";
      this.tempModel.identityCardImg = "";
      this.tempModel.auditState = "";

      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    showUpdate($index) {
      //这个重置的方法也不能用，它是将表单重置成form第一次打开时的model的值
      //打开修改，关闭，打开新增，就会看到字段的值是被重置成了“打开修改”时的值
      if (this.$refs["tempModel"] !== undefined) {
        this.$refs["tempModel"].resetFields();
      }

      this.api({
        url: "/identify/getIdentify",
        method: "post",
        data: { identifyID: this.list[$index].identifyID }
      }).then(data => {
        this.tempModel = data;

        this.dialogStatus = "update";
        this.dialogFormVisible = true;
      });
    },
    createModel() {
      this.$refs["tempModel"].validate(valid => {
        if (valid) {
          //保存新文章
          this.api({
            url: "/identify/addIdentify",
            method: "post",
            data: this.tempModel
          }).then(() => {
            this.getList();
            this.dialogFormVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateModel() {
      this.$refs["tempModel"].validate(valid => {
        if (valid) {
          //修改文章
          this.api({
            url: "/identify/updateIdentify",
            method: "post",
            data: this.tempModel
          }).then(() => {
            let msg = "修改成功！";
            this.$message({
              message: msg,
              type: "success",
              duration: 1 * 1000,
              onClose: () => {
                //this.getList();
              }
            });

            this.getList();
            this.dialogFormVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteModel($index) {
      this.$confirm("您确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: true,
        type: "warning"
      }).then(
        () => {
          this.api({
            url: "/identify/deleteIdentify",
            method: "post",
            data: this.list[$index]
          }).then(result => {
            let msg = "删除成功！";
            this.$message({
              message: msg,
              type: "success",
              duration: 1 * 1000,
              onClose: () => {}
            });
            this.getList();
          });
        },
        () => {
          //取消
        }
      );
    }
  }
};
</script>

