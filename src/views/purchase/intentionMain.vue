<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">
			<el-form-item label="编号">
			    <el-input v-model="listQuery.orderNo" placeholder="编号"></el-input>
			</el-form-item>

			<el-form-item label="预定支付状态">
					<el-select clearable v-model="listQuery.prePayStatus">
             <el-option v-for="item in [{id:1,label:'已支付'},{id:0,label:'未支付'}]"
               :key="item.id"
               :label="item.label"
               :value="item.id">
             </el-option>
           </el-select>

			</el-form-item>

			<el-form-item label="预定支付类型">
					<el-select clearable v-model="listQuery.prePayType">
             <el-option v-for="item in [{id:1,label:'订金支付'},{id:2,label:'全款支付'}]"
               :key="item.id"
               :label="item.label"
               :value="item.id">
             </el-option>
           </el-select>
			</el-form-item>
			<el-form-item label="审批状态">
				<el-select clearable v-model="listQuery.approvalStatus">
            <el-option v-for="item in [{id:0,label:'未审批'},{id:1,label:'已审批'},{id:2,label:'已退回'},{id:3,label:'已汇总'}]"
               :key="item.id"
               :label="item.label"
               :value="item.id">
             </el-option>
          </el-select>
			</el-form-item>

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="getList">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    </div>
    <el-table size="mini" :data="list"
      v-loading.body="listLoading" element-loading-text="拼命加载中"
      border fit highlight-current-row stripe>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

				 <el-table-column align="center" prop="orderNo" label="主单编号" width="170"></el-table-column>

				 <el-table-column align="center" prop="orgName" label="组织" width="150"></el-table-column>

				<el-table-column align="center" label="期望到货日期" width="140">
					<template slot-scope="scope">
						<span>{{scope.row.expectedArrivalDate}}</span>
					</template>
				</el-table-column>

				 <el-table-column align="center" prop="purchaseNum" label="采购总数量" width="90"></el-table-column>

				 <el-table-column align="center" prop="prePayStatus" label="预定支付状态" width="100">
					  <template slot-scope="scope">
              <span v-if="scope.row.prePayStatus==1">已支付</span>
              <span v-if="scope.row.approvalStatus==0">未支付</span>
            </template>
				 </el-table-column>

				 <el-table-column align="center" prop="prePayType" label="预定支付类型" width="100">
					   <template slot-scope="scope">
              <span v-if="scope.row.prePayType==1">订金支付</span>
              <span v-if="scope.row.prePayType==2">全款支付</span>
            </template>
				 </el-table-column>

				 <el-table-column align="center" prop="prePayMoney" label="预支付金额" width="90"></el-table-column>

				 <el-table-column align="center" prop="realName" label="申请人" width="70"></el-table-column>

				<el-table-column align="center" label="操作时间" width="140">
					<template slot-scope="scope">
						<span>{{scope.row.createTime}}</span>
					</template>
				</el-table-column>

				 <el-table-column align="center" prop="approvalStatus" label="审批状态" width="80">
					 <template slot-scope="scope">
              <span v-if="scope.row.approvalStatus==0">未审批</span>
              <span v-if="scope.row.approvalStatus==1">已审批</span>
							 <span v-if="scope.row.approvalStatus==2">已退回</span>
             <span v-if="scope.row.approvalStatus==3">已汇总</span>
            </template>
				 </el-table-column>

				 <el-table-column align="center" prop="approvalDesc" label="审批原因" width="160"></el-table-column>


      <el-table-column align="center" fixed="right" label="操作" width="150" >
        <template slot-scope="scope">
          <el-button size="mini" type="primary"  v-if="scope.row.approvalStatus==0 && hasPerm('intentionMain:update')" icon="edit" @click="showUpdate(scope.$index)">审批</el-button>
          <el-button size="mini" type="primary" icon="edit" @click="detail(scope.row.purchaseIntentionMainID)">详情</el-button>
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

      :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form size="mini" class="small-space"
        :model="tempModel" :rules="rules" ref="tempModel" status-icon
        label-position="right" label-width="150px" style='margin-left:50px;'>

			 <el-col :span="24">



					<el-form-item label="预定支付状态"  prop="prePayStatus" >
										<el-select clearable v-model="tempModel.prePayStatus">
											<el-option v-for="item in [{id:1,label:'已支付'},{id:0,label:'未支付'}]"
												:key="item.id"
												:label="item.label"
												:value="item.id">
											</el-option>
										</el-select>

										</el-form-item>

					<el-form-item label="预定支付类型"  prop="prePayType" >
									<el-select clearable v-model="tempModel.prePayType">
										<el-option v-for="item in [{id:1,label:'订金支付'},{id:2,label:'全款支付'}]"
											:key="item.id"
											:label="item.label"
											:value="item.id">
										</el-option>
									</el-select>

								</el-form-item>

					<el-form-item label="预支付金额"  prop="prePayMoney" >
											<el-input type="text" v-model="tempModel.prePayMoney">
											</el-input>
										</el-form-item>



					<el-form-item label="审批状态"  prop="approvalStatus" >
							<el-select clearable v-model="tempModel.approvalStatus">
								<el-option v-for="item in [{id:0,label:'未审批'},{id:1,label:'已审批'},{id:2,label:'已退回'},{id:3,label:'已汇总'}]"
									:key="item.id"
									:label="item.label"
									:value="item.id">
								</el-option>
							</el-select>

										</el-form-item>

					<el-form-item label="审批原因"  >
											<el-input type="text" v-model="tempModel.approvalDesc">
											</el-input>
										</el-form-item>




			</el-col>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button>
        <el-button size="mini" v-else type="primary" @click="updateModel">审 批</el-button>
      </div>
    </el-dialog>
    <el-dialog  fullscreen
      :title="textMap[dialogStatus2]" :visible.sync="dialogFormVisible2">
          <el-table size="mini" :data="list2"
        v-loading.body="listLoading" element-loading-text="拼命加载中"
        border fit highlight-current-row stripe>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
         <el-table-column align="center" prop="carFullName" label="名称" ></el-table-column>
         <el-table-column align="center" prop="carColorName" label="外观颜色" ></el-table-column>
        <el-table-column align="center" prop="carInteriorColorName" label="内饰颜色" ></el-table-column>
         <el-table-column align="center" prop="purchaseNum" label="数量" ></el-table-column>

          </el-table>
      </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        list2: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数

				purchaseIntentionMainID:'',

				orderNo:'',

				orgID:'',

				expectedArrivalDate:'',

				purchaseNum:'',

				prePayStatus:'',

				prePayType:'',

				prePayMoney:'',

				remarks:'',

				userID:'',

				createTime:'',

				approvalStatus:'',

				approvalDesc:'',

				approvalUser:'',

				approvalTime:''




        },
        dialogStatus: 'create',
        dialogStatus2: 'detail',
        dialogFormVisible: false,
        dialogFormVisible2: false,
        textMap: {
          update: '审批',
          create: '创建',
          detail: '详情'
        },
        tempModel: {
				purchaseIntentionMainID:'',
				orderNo:'',
				orgID:'',
				orgName:'',
				realName:'',
				expectedArrivalDate:'',
				purchaseNum:'',
				prePayStatus:'',
				prePayType:'',
				prePayMoney:'',
				remarks:'',
				userID:'',
				createTime:'',
				approvalStatus:'',
				approvalDesc:'',
				approvalUser:'',
				approvalTime:''

        },
        rules: {
			 purchaseIntentionMainID:[
		  { required: true, message: '请填写', trigger: 'blur' }],

			 orderNo:[
		  { required: true, message: '请填写主单编号:yyyyMM+当前时间戳', trigger: 'blur' }],

			 orgID:[
		  { required: true, message: '请填写所属组织ID:即二级店', trigger: 'blur' }],

			 expectedArrivalDate:[
		  { required: true, message: '请填写期望到货日期', trigger: 'blur' }],

			 purchaseNum:[
		  { required: true, message: '请填写采购总数量:采购意向单数量之和', trigger: 'blur' }],

			 prePayStatus:[
		  { required: true, message: '请填写预定支付状态，1：已支付；0：未支付；', trigger: 'blur' }],

			 prePayType:[
		  { required: true, message: '请填写预定支付类型，1：订金支付；2：全款支付', trigger: 'blur' }],

			 prePayMoney:[
		  { required: true, message: '请填写预支付金额', trigger: 'blur' }],

			 remarks:[
		  { required: true, message: '请填写备注说明', trigger: 'blur' }],

			 userID:[
		  { required: true, message: '请填写操作人ID', trigger: 'blur' }],

			 createTime:[
		  { required: true, message: '请填写操作时间', trigger: 'blur' }],

			 approvalStatus:[
		  { required: true, message: '请填写审批状态：0未审批;1已审批;2已退回', trigger: 'blur' }],

			 approvalDesc:[
		  { required: true, message: '请填写审批原因:内容描述或备注', trigger: 'blur' }],

			 approvalUser:[
		  { required: true, message: '请填写审批人ID', trigger: 'blur' }],

			 approvalTime:[
		  { required: true, message: '请填写审批时间', trigger: 'blur' }]




            //{ required: true, message: '标题', trigger: 'blur' },
            //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
        detail(id){
        this.api({
          url: "/intentionMain/intentionOrderDetail",
          method: "get",
          params: {"mainID":id}
        }).then(data => {
          this.listLoading = false;
          this.list2 = data;
        })
        this.dialogFormVisible2  = true
      },
      getList() {
        //查询列表
        //if (!this.hasPerm('intentionMain:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/intentionMain/listIntentionMainByLeftJoin",
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
					 this.tempModel.purchaseIntentionMainID = "";
					 this.tempModel.orderNo = "";
					 this.tempModel.orgID = "";
					 this.tempModel.expectedArrivalDate = "";
					 this.tempModel.purchaseNum = 0;
					 this.tempModel.prePayStatus = "";
					 this.tempModel.prePayType = "";
					 this.tempModel.prePayMoney = "";
					 this.tempModel.remarks = "";
					 this.tempModel.userID = "";
					 this.tempModel.createTime = "";
					 this.tempModel.approvalStatus = "";
					 this.tempModel.approvalDesc = "";
					 this.tempModel.approvalUser = "";
					 this.tempModel.approvalTime = "";


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
          url: "/intentionMain/getIntentionMain",
          method: "post",
          data: {purchaseIntentionMainID:this.list[$index].purchaseIntentionMainID}
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
              url: "/intentionMain/addIntentionMain",
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
              url: "/intentionMain/updateIntentionMain",
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
            url: "/intentionMain/deleteIntentionMain",
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

