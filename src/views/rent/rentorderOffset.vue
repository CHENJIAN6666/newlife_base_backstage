<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">

			<!-- <el-form-item label="订单ID">
			    <el-input v-model="listQuery.rentOrderID" placeholder="订单ID"></el-input>
			</el-form-item> -->
      <el-form-item label="订单编号">
			    <el-input clearable v-model="listQuery.rentOrderNumber" placeholder="订单编号"></el-input>
			</el-form-item>

      <el-form-item label="客户名称">
			    <el-input clearable v-model="listQuery.customerName" placeholder="客户名称"></el-input>
			</el-form-item>

			<el-form-item label="车牌">
			    <el-input clearable v-model="listQuery.plateNumber" placeholder="车牌"></el-input>
			</el-form-item>

			<el-form-item label="是否完成">
          <el-select clearable v-model="listQuery.isFinish">
            <el-option v-for="item in finishStateOptions" :key="item.id" :value="item.id" :label="item.label" />
          </el-select>
			</el-form-item>

			<el-form-item label="应交租金时间">
        <el-date-picker clearable @clear="listQuery.payDateStart=''"
          v-model="listQuery.payDateStart"  type="month" value-format="yyyy-MM-dd" placeholder="选择月">
        </el-date-picker>
			</el-form-item>

      	<el-form-item label="-">
           <el-date-picker clearable @clear="listQuery.payDateEnd=''"
            v-model="listQuery.payDateEnd"  type="month" value-format="yyyy-MM-dd" placeholder="选择月">
          </el-date-picker>
			</el-form-item>

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList();">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <!-- <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('rentorderOffset:add')">添加
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
			<el-table-column align="center" prop="rentOrderNumber" label="订单编号" fit></el-table-column>
			<el-table-column align="center" prop="customerName" label="客户名称" fit></el-table-column>
			<el-table-column align="center" prop="contactName" label="联系人" fit></el-table-column>
			<el-table-column align="center" prop="contactMobile" label="联系人手机" fit></el-table-column>
			<el-table-column align="center" prop="carModelName" label="车型名称" fit></el-table-column>
			<el-table-column align="center" prop="plateNumber" label="车牌" width="100"></el-table-column>
			<el-table-column align="center" prop="renal" label="租金" width="80"></el-table-column>
			<el-table-column align="center" prop="period" label="期数" width="60"></el-table-column>
			<el-table-column align="center" prop="unpayRenal" label="未缴租金" width="60"></el-table-column>
			<el-table-column align="center" prop="unpayPeriods" label="未缴期数" width="60"></el-table-column>
			<el-table-column align="center" label="是否完成" width="80">
        <span slot-scope="scope">{{getFinishStateText(scope.row.isFinish)}}</span>
      </el-table-column>
			<el-table-column align="center" prop="payDate" label="应交租金时间" width="100"></el-table-column>
			<el-table-column align="center" prop="paidDate" label="支付租金时间" width="100"></el-table-column>
			<el-table-column align="center" prop="smsNoticeTime" label="短信通知时间" width="100"></el-table-column>
			<!-- <el-table-column align="center" prop="remark" label="备注" width="360"></el-table-column> -->

      <el-table-column fixed="right" align="center" label="操作" width="350" v-if="hasPerm('rentorderOffset:update')">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index,'view')">查看</el-button>
          <el-button :disabled="scope.row.isFinish == 1" size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index,'modifyRenal')">修改租金</el-button>
          <el-button :disabled="scope.row.isFinish == 1" size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index,'payRenal')">交租</el-button>
          <el-button v-if="scope.row.isFinish == 0 && formatDateMonth(scope.row.payDate) == getCurrentDateMonth()" size="mini" type="primary" icon="edit" @click=" rentSmsReminder(scope.$index)">短信提醒</el-button>
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
		<el-row>
			 <el-col :offset="4" :span="12">

					<el-form-item label="订单编号"  prop="rentOrderID" >
						<el-input disabled type="text" v-model="tempModel.rentOrderNumber">
						</el-input>
					</el-form-item>

          <el-form-item label="客户名称">
						<el-input disabled type="text" v-model="tempModel.customerName">
						</el-input>
					</el-form-item>

					<el-form-item label="车型名称"  prop="rentOrderCarID" >
						<el-input disabled type="text" v-model="tempModel.carModelName">
						</el-input>
					</el-form-item>

					<el-form-item label="租金"  prop="renal" >
						<el-input :disabled="dialogStatus != 'modifyRenal'" type="text" v-model="tempModel.renal">
						</el-input>
					</el-form-item>

					<el-form-item label="期数"  prop="period" >
						<el-input disabled type="text" v-model="tempModel.period">
						</el-input>
					</el-form-item>

					<el-form-item label="是否完成"  prop="isFinish" >
						<el-input disabled type="text" :value="tempModel.isFinish == 1? '是': '否'">
						</el-input>
					</el-form-item>

					 <el-form-item label="应交租金时间"  prop="payDate" >
						<el-date-picker disabled type="date" placeholder="选择日期" v-model="tempModel.payDate" value-format="yyyy-MM-dd"></el-date-picker>
					 </el-form-item>

					 <el-form-item v-if="dialogStatus == 'view' && tempModel.isFinish == 1" label="支付租金时间"  prop="paidDate" >
						<el-date-picker disabled type="date" placeholder="选择日期" v-model="tempModel.paidDate" value-format="yyyy-MM-dd"></el-date-picker>
					 </el-form-item>

					<el-form-item label="修改租金备注">
						<el-input  placeholder="修改租金备注" :disabled="dialogStatus != 'modifyRenal'" type="textarea" :rows="3" v-model="tempModel.modifyRemark">
						</el-input>
					</el-form-item>

          <el-form-item label="交租备注" prop="remark" >
						<el-input placeholder="交租备注" :disabled="dialogStatus != 'payRenal'" type="textarea" :rows="3" v-model="tempModel.remark">
						</el-input>
					</el-form-item>

			</el-col>
		</el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button> -->
        <el-button v-if="dialogStatus == 'modifyRenal'" size="mini" type="primary" @click="modifyRenal">修改租金</el-button>
        <el-button v-if="dialogStatus == 'payRenal'" size="mini" type="primary" @click="confirmPayRenal">交租</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date.js";
export default {
  data() {
    return {
      finishStateOptions: [
        { id: 0, label: "未完成" },
        { id: 1, label: "已完成" },
      ],
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      listLoading: false, //数据加载等待动画
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数

        rentOrderOffsetID: "",

        rentOrderID: "",

        rentOrderCarID: "",

        renal: "",

        period: "",

        isFinish: 0,

        payDateStart: "",
        payDateEnd: "",

        paidDate: "",

        remark: "",
        rentOrderOffsetNumber: "",
        plateNumber:'',
        customerName: '',
        rentOrderNumber: '',
        offsetState: 0
      },
      dialogStatus: "create",
      dialogFormVisible: false,
      textMap: {
        update: "编辑",
        create: "创建",
        modifyRenal: "修改租金",
        payRenal: "交租",
        view: "查看"
      },
      tempModel: {
        rentOrderOffsetID: "",
        rentOrderID: "",
        rentOrderCarID: "",
        renal: "",
        period: "",
        isFinish: "",
        payDate: "",
        paidDate: "",
        remark: "",
        rentOrderOffsetNumber: "",
        paidType: "",
        modifyRemark: ""
      },
      rules: {
        rentOrderOffsetID: [
          { required: true, message: "请填写", trigger: "blur" }
        ],

        rentOrderID: [
          { required: true, message: "请填写订单ID", trigger: "blur" }
        ],

        rentOrderCarID: [
          { required: true, message: "请填写订单车辆ID", trigger: "blur" }
        ],

        renal: [{ required: true, message: "请填写租金", trigger: "blur" }],

        period: [{ required: true, message: "请填写期数", trigger: "blur" }],

        isFinish: [
          {
            required: true,
            message: "请填写是否完成(0 已完成 1未完成)",
            trigger: "blur"
          }
        ],

        payDate: [
          { required: true, message: "请填写应交租金时间", trigger: "blur" }
        ],

        paidDate: [
          { required: true, message: "请填写支付租金时间", trigger: "blur" }
        ],

        remark: [{ required: true, message: "请填写备注", trigger: "blur" }]

        //  status:[
        // { required: true, message: '请填写数据状态：0-正常，1-删除', trigger: 'blur' }],

        //  createTime:[
        // { required: true, message: '请填写创建时间', trigger: 'blur' }],

        //  createUser:[
        // { required: true, message: '请填写创建人ID', trigger: 'blur' }],

        //  modifyTime:[
        // { required: true, message: '请填写修改时间', trigger: 'blur' }],

        //  modifyUser:[
        // { required: true, message: '请填写修改人ID', trigger: 'blur' }]

        //{ required: true, message: '标题', trigger: 'blur' },
        //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
      }
    };
  },
  created() {
    var now = new Date();
    if (now.getMonth() == 11) {
        this.listQuery.payDateEnd = `${now.getFullYear() + 1}-01-01`
    } else {
        this.listQuery.payDateEnd = `${now.getFullYear()}-${now.getMonth()+2}-01`
    }
    this.listQuery.payDateEnd
    this.getList();
  },
  methods: {
    formatDateMonth(time) {
        var date = new Date(time);
        return formatDate(date, "yyyy-MM");
    },
    getCurrentDateMonth(){
      return formatDate(new Date(), "yyyy-MM")
    },
    rentSmsReminder(index){
      this.$confirm('确认短信通知?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.api({
            url: "/rentorderOffset/rentReminder",
            method: "get",
            params: {
              rentOrderOffsetID: this.list[index].rentOrderOffsetID 
            }
          }).then(() => {
            let msg = "短信通知成功！";
            this.$message({
              message: msg,
              type: "success",
              duration: 1 * 1000,
              onClose: () => {}
            });
          });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消短信通知'
          // });          
        });
    },
    getFinishStateText(v) {
      for (let index = 0; index < this.finishStateOptions.length; index++) {
        const element = this.finishStateOptions[index];
        if (element.id == v) {
          return element.label;
        }
      }
      return "未知状态";
    },
    getList() {
      //查询列表
      //if (!this.hasPerm('rentorderOffset:list')) {
      // return
      //}
      this.listLoading = true;
      this.api({
        url: "/rentorderOffset/listRentorderOffset",
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
      this.tempModel.rentOrderOffsetID = "";
      this.tempModel.rentOrderID = "";
      this.tempModel.rentOrderCarID = "";
      this.tempModel.renal = "";
      this.tempModel.period = "";
      this.tempModel.isFinish = 0;
      this.tempModel.payDate = "";
      this.tempModel.paidDate = "";
      this.tempModel.remark = "";
      this.tempModel.rentOrderOffsetNumber = "";

      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    showUpdate($index, dialogStatus) {
      //这个重置的方法也不能用，它是将表单重置成form第一次打开时的model的值
      //打开修改，关闭，打开新增，就会看到字段的值是被重置成了“打开修改”时的值
      if (this.$refs["tempModel"] !== undefined) {
        this.$refs["tempModel"].resetFields();
      }

      this.api({
        url: "/rentorderOffset/getRentorderOffset",
        method: "post",
        data: { rentOrderOffsetID: this.list[$index].rentOrderOffsetID }
      }).then(data => {
        this.tempModel = data;

        this.dialogStatus = dialogStatus;
        this.dialogFormVisible = true;
      });
    },
    createModel() {
      this.$refs["tempModel"].validate(valid => {
        if (valid) {
          //保存新文章
          this.api({
            url: "/rentorderOffset/addRentorderOffset",
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
            url: "/rentorderOffset/updateRentorderOffset",
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
    confirmPayRenal(){
      this.$confirm('确认交租?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.payRenal()
          // this.$message({
          //   type: 'success',
          //   message: '交租成功!'
          // });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消交租'
          });          
        });
    },
    payRenal() {
        this.api({
        url: "/rentorderOffset/payRenal",
        method: "post",
        data: {
          // rentOrderOffsetID: this.tempModel.rentOrderOffsetID
          rentOrderCarID: this.tempModel.rentOrderCarID,
          period: this.tempModel.period,
          paidType: 1,
          remark: this.tempModel.remark,
        }
      }).then(() => {
        let msg = "交租成功！";
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
    },
    modifyRenal() {
      this.api({
        url: "/rentorderOffset/updateRenal",
        method: "post",
        data: {
          rentOrderOffsetID: this.tempModel.rentOrderOffsetID,
          rentOrderCarID: this.tempModel.rentOrderCarID,
          renal: this.tempModel.renal,
          modifyRemark: this.tempModel.modifyRemark
        }
      }).then(() => {
        let msg = "修改租金成功！";
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
    },
    deleteModel($index) {
      this.$confirm("您确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: true,
        type: "warning"
      }).then(
        () => {
          this.api({
            url: "/rentorderOffset/deleteRentorderOffset",
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

