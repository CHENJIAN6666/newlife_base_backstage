<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">



			<el-form-item label="单号">
			    <el-input clearable v-model="listQuery.rentOrderNumber" placeholder="单号"></el-input>
			</el-form-item>


			<el-form-item label="联系人姓名">
			    <el-input clearable v-model="listQuery.rentContactName" placeholder="联系人姓名"></el-input>
			</el-form-item>


			<el-form-item label="联系人电话">
			    <el-input clearable v-model="listQuery.rentContactPhone" placeholder="联系人电话"></el-input>
			</el-form-item>

			<!-- <el-form-item label="车型">
			    <el-input v-model="listQuery.carModelID" placeholder="车型ID"></el-input>
			</el-form-item> -->


			<el-form-item label="客户名称">
			    <el-input clearable v-model="listQuery.customerName" placeholder="客户名称"></el-input>
			</el-form-item>

         <el-form-item label="车牌号">
           <el-input clearable v-model="listQuery.plateNumber" placeholder="车牌号"></el-input>
         </el-form-item>

         <el-form-item label="VIN码">
           <el-input clearable v-model="listQuery.vINCode" placeholder="VIN码"></el-input>
         </el-form-item>

         <!-- <el-form-item label="租车时间">
                   <el-input v-model="listQuery.rentTime" placeholder="租车时间"></el-input>
               </el-form-item> -->


			<el-form-item label="订单状态">
			    <!-- <el-input v-model="listQuery.orderState" placeholder="订单状态"></el-input> -->
          <el-select v-model="listQuery.orderState" clearable>
            <el-option v-for="item in orderStateOptions" :key="item.id" :value="item.id"  :label="item.label"/>
          </el-select>
			</el-form-item>


			<el-form-item label="订单类型">
			    <!-- <el-input v-model="listQuery.orderType" placeholder="订单类型"></el-input> -->
          <el-select v-model="listQuery.orderType" clearable>
            <el-option v-for="item in orderTypeOptions" :key="item.id" :value="item.id"  :label="item.label"/>
          </el-select>
			</el-form-item>

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList();">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>

    <el-row  style="padding-bottom: 5px;">
      <el-col :span="12" class="text-left">
        <el-button  size="mini" type="primary" icon="plus"  @click="showImport"  >导入租车订单
        </el-button>
      </el-col>
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('rentorder:add')">添加
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
			<el-table-column align="center" prop="rentOrderNumber" label="单号" width="150"></el-table-column>
			<el-table-column align="center" prop="rentCustomerName" label="客户名称" width="100"></el-table-column>
			<el-table-column align="center" prop="rentContactName" label="联系人姓名" width="90"></el-table-column>
			<el-table-column align="center" prop="rentContactPhone" label="联系人电话" width="100"></el-table-column>
			<el-table-column align="center" prop="rentContactAddress" label="联系人地址" width="150"></el-table-column>
			<el-table-column align="center" prop="periods" label="期数" width="60"></el-table-column>
			<!-- <el-table-column align="center" prop="orgID" label="组织ID" width="80"></el-table-column> -->
			<el-table-column align="center" prop="carModelName" label="车型名称" width="80"></el-table-column>
			<el-table-column align="center" prop="quantity" label="租车数量" width="80"></el-table-column>
			<el-table-column align="center" prop="rentTime" label="租车时间" width="120"></el-table-column>
			<el-table-column align="center" label="订单状态" width="80">
        <span slot-scope="scope">{{getOrderStateText(scope.row.orderState)}}
        </span>
      </el-table-column>
			<el-table-column align="center" label="订单类型" width="80">
        <span slot-scope="scope">{{getOrderTypeText(scope.row.orderType)}}</span>
      </el-table-column>


      <el-table-column fixed="right" align="center" label="操作" width="220" v-if="hasPerm('rentorder:update')">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index,'view')">查看</el-button>
          <!-- <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index,'update')">修改</el-button> -->
          <el-button :disabled="scope.row.orderState != 'P'" size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index,'delivery')">交车</el-button>
          <el-button v-if="scope.row.orderState ==  'D'" size="mini" type="primary" icon="edit" @click="showReturn(scope.$index,'return')">还车</el-button>

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
      	<el-row slot="title">
          <el-col :span="2">
						<span class="el-dialog__title">{{textMap[dialogStatus]}}</span>
					</el-col>
      <el-col :span="2" :offset="18">
							<el-button v-if="this.dialogStatus == 'view' && this.tempModel.orderState == 'D'" size="mini" type="primary" @click="getCustomerCarRentContract()">下载合同</el-button>
					</el-col>
      	</el-row>
      <el-form size="mini" class="small-space"
        :model="tempModel" :rules="rules" ref="tempModel" status-icon
        label-position="right" label-width="150px" style='margin-left:50px;'>

				<el-collapse v-model="collapseActiveNames">
					<el-collapse-item title="订单" name="1">
            <el-row>
              <el-col :span="7">

					<el-form-item v-if="dialogStatus != 'create'" label="单号">
						<el-input disabled type="text" v-model="tempModel.rentOrderNumber">
						</el-input>
          </el-form-item>



                <el-form-item label="开始租车时间"  prop="rentTime" >
					<el-date-picker :disabled="dialogStatus != 'create'" type="date" placeholder="选择日期" v-model="tempModel.rentTime" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>

				<el-form-item v-if="dialogStatus != 'create'" label="结束租车时间"  prop="rentEndTime" >
					<el-date-picker disabled type="date" placeholder="选择日期" v-model="tempModel.rentEndTime" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>


			<el-form-item v-if="dialogStatus != 'create'" label="订单状态">
				<el-input disabled type="text" :value="getOrderStateText(tempModel.orderState)">
				</el-input>
      </el-form-item>

      <el-form-item v-if="dialogStatus != 'create'" label="交车时间">
					<el-date-picker disabled type="date" placeholder="选择日期" v-model="tempModel.deliveryTime"></el-date-picker>
      </el-form-item>


            <el-form-item v-if="dialogStatus != 'create'" label="订单类型">
				<el-input disabled type="text" :value="getOrderTypeText(tempModel.orderType)">
				</el-input>
            </el-form-item>

        <el-form-item label="是否送车上门" prop="isSendingTohouse">
          <el-select :disabled="dialogStatus != 'create'" v-model="tempModel.isSendingTohouse">
              <el-option v-for="item in [{id:0,label:'否'},{id:1,label:'是'}]" :key="item.id" :value="item.id" :label="item.label"/>
          </el-select>
        </el-form-item>

              </el-col>
            </el-row>
  </el-collapse-item>

  <el-collapse-item title="客户" name="2">
    <el-row>
 <el-col :span="7">
	  <el-form-item >
      <customerTab :disabled="dialogStatus != 'create'" v-model="tempModel.customerID"
       :salesOrgID="this.$store.state.user.userOrgId" @handleCustomerChange="customerChange">
      选择档案
      </customerTab>
	  </el-form-item>

		<el-form-item label="客户名称"  prop="rentCustomerName" >
					<el-input disabled type="text" v-model="tempModel.rentCustomerName">
					</el-input>
				</el-form-item>

        <el-form-item label="客户地址" prop="rentContactAddress" >
					<el-input :disabled="dialogStatus != 'create'" type="text" v-model="tempModel.rentContactAddress">
					</el-input>
				</el-form-item>

				<el-form-item label="联系人姓名"  prop="rentContactName" >
					<el-input disabled type="text" v-model="tempModel.rentContactName">
					</el-input>
				</el-form-item>

				<el-form-item label="联系人电话"  prop="rentContactPhone" >
					<el-input disabled type="text" v-model="tempModel.rentContactPhone">
					</el-input>
				</el-form-item>
 </el-col>
    </el-row>

 </el-collapse-item>

  <el-collapse-item title="车辆档案" name="3">

		<el-row>
        <el-col :span="7">
          	<el-form-item label="租车类型" prop="rentType">
            <el-select :disabled="dialogStatus != 'create'" v-model="tempModel.rentType" clearable>
               <el-option v-for="item in rentTypeOptions" :key="item.id" :value="item.id"  :label="item.label"/>
             </el-select>
	          </el-form-item>

					<el-form-item label="品牌车系" prop="carModelID">
							<carSeriesSelect :disabled="dialogStatus != 'create'" v-model="tempModel.carSeriesID" groupName="query"/>
						</el-form-item>

						<el-form-item label="整车车型" prop="carModelID">
							<carModelSelect :disabled="dialogStatus != 'create'" v-model="tempModel.carModelID" groupName="query"/>
						</el-form-item>

         <el-form-item label="期数"  prop="periods" >
              <el-select :disabled="dialogStatus != 'create'"  v-model="tempModel.periods">
                <el-option v-for="item in periodsOptions" :key="item.carRentalPlanID" :value="item.periods" :label="item.periods"/>
              </el-select>
            </el-form-item>

          <el-form-item v-if="dialogStatus == 'delivery'">
				  	<customerCarMulitTable :isRentCar="true" :orgID="this.$store.state.user.userOrgId" :carModelID="tempModel.carModelID"  :listQueryParam="{notOrgID:'',customerCarType:2}"
				  	@updateCustomerCar="handleUpdateCustomerCar" v-model="selectedCustomerCarList">
				  		选择车辆
            </customerCarMulitTable>
          </el-form-item>

          <el-form-item label="租车数量"  prop="quantity">
            <el-input :disabled="dialogStatus != 'create'" type="number" v-model.number="tempModel.quantity" />
          </el-form-item>
        </el-col>

         <el-col :span="7">
          <el-form-item> &nbsp; </el-form-item>
          <el-form-item>
            <el-form-item>
            <el-input v-show="false" v-model.number="this.monthlyRental"/>
            </el-form-item>
          </el-form-item>

          <el-form-item label="每辆车优惠金额">
            <el-input :disabled="dialogStatus != 'create'" type="number" v-model.number="tempModel.couponAmount"/>
          </el-form-item>
         </el-col>

        <el-col :span="7">
          <el-form-item> &nbsp; </el-form-item>
          <el-form-item> &nbsp; </el-form-item>
          <el-form-item label="租金 (每/车/月)">
            <el-input disabled type="text" v-model.number="this.tempModel.rental"/>
          </el-form-item>

        <el-form-item label="单台车押金">
            <el-input :disabled="dialogStatus != 'create'" type="text" v-model.number="this.tempModel.deposit"/>
          </el-form-item>
        </el-col>
		</el-row>

    <el-row>


			<el-table v-if="dialogStatus != 'create'" size="mini" :data="selectedCustomerCarList"
       border fit highlight-current-row stripe>
			<el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
			<el-table-column align="center" prop="carModelName" label="整车车型" width="200"></el-table-column>
			 <el-table-column align="center" prop="plateNumber" label="车牌号" fit></el-table-column>
			 <el-table-column align="center" prop="engineNumber" label="发动机号" width="150"></el-table-column>
			 <el-table-column align="center" prop="vINCode" label="VIN号" fit></el-table-column>

			 <el-table-column align="center" prop="totalRental" label="总租金" fit></el-table-column>
			 <el-table-column align="center" prop="paidPeriod" label="已缴期数" fit></el-table-column>
			 <el-table-column align="center" prop="amountBalance" label="未缴租金" fit></el-table-column>
			 <el-table-column align="center" prop="paidAmount" label="已缴租金" fit></el-table-column>
			 <el-table-column align="center" prop="lastPaidDate" label="最后一次交租日期" fit></el-table-column>
        <el-table-column align="center" prop="returnRemarks" label="还车备注" fit></el-table-column>
        <el-table-column align="center" prop="remark" label="备注" fit></el-table-column>

        <el-table-column align="center" label="操作" width="150" v-if="hasPerm('rentorder:update')">
          <template slot-scope="scope">
            <el-button  v-if = "scope.row.rentState =='D' " size="mini" type="primary" icon="edit" @click="returnModel(scope.row)">{{scope.row.periods > scope.row.paidPeriod ? '提前还车':'还 车'}}</el-button>
            <el-button  v-if = "scope.row.rentState =='R' " size="mini" type="primary" icon="edit" @click="finishModel(scope.row)">完 成</el-button>
            <el-button   size="mini" type="primary" icon="edit" @click="updateCarModel(scope.row)">修改备注</el-button>

          </template>
        </el-table-column>
    </el-table>

      <br>

      <el-form-item v-if="dialogStatus != 'create'" label="交车备注">
        <el-input  :disabled="dialogStatus != 'delivery'" type="textarea" :rows="3" v-model="tempModel.deliveryRemarks"/>
      </el-form-item>
		</el-row>

  </el-collapse-item>
<!--
			 <el-collapse-item title="租车详情" name="4">
			<el-col :span="24" >
        <el-table size="mini" :data="customerCarRentOffsetList"
      border fit highlight-current-row stripe>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
       <el-table-column align="center" prop="period" label="期数" width="50"></el-table-column>
			<el-table-column align="center" prop="customerCarRentNumber" label="订单号" fit></el-table-column>
			<el-table-column align="center" prop="renal" label="租金" width="120"></el-table-column>
			<el-table-column align="center" prop="payDate" label="交租日期" fit></el-table-column>
			<el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.offsetState == 0?(scope.row.isFinish == 0?'已完成':'未完成'):'已失效'}}</span>
        </template>
      </el-table-column>
			<el-table-column align="center" prop="paidDate" label="支付租金日期" fit></el-table-column>
    </el-table>
      <br>
			</el-col>

  </el-collapse-item> -->


      </el-collapse>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button>
        <el-button size="mini" v-else-if="dialogStatus == 'delivery'" type="primary" @click="deliveryCar">交 车</el-button>
        <!-- <el-button size="mini" v-else type="primary" @click="updateModel">修 改</el-button> -->
      </div>
    </el-dialog>


    <el-dialog
         :title="textMap[dialogStatus]" :visible.sync="returnCarDialogVisiable">
      <el-form size="mini" class="small-space"
                 status-icon
               label-position="right" label-width="150px" style='margin-left:50px;'>
        <el-row>
          <el-col  :span="24">

            <el-form-item label="还车备注" prop="remark" >
              <el-input placeholder="还车备注"  type="textarea" :rows="3" v-model="returnTempModel.returnRemarks">
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  size="mini" type="primary"  @click="returnCarRemote">还车</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="textMap[dialogStatus]" :visible.sync="updateCarDialogVisiable">
      <el-form size="mini" class="small-space"
               status-icon
               label-position="right" label-width="150px" style='margin-left:50px;'>
        <el-row>
          <el-col  :span="24">

            <el-form-item label="备注" prop="remark" >
              <el-input placeholder="备注"  type="textarea" :rows="3" v-model="updateCarTempModel.remark">
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  size="mini" type="primary"  @click="updateCarRemote">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="textMap[dialogStatus]" :visible.sync="finishDialogVisiable">
      <el-form size="mini" class="small-space"
               status-icon
               label-position="right" label-width="150px" style='margin-left:50px;'>
        <el-row>
          <el-col  :span="24">
            <el-form-item label="备注" prop="remark" >
              <el-input placeholder="备注"  type="textarea" :rows="3" v-model="finishTempModel.remarks">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  size="mini" type="primary"  @click="finishCarRemote">完成</el-button>
      </div>
    </el-dialog>

  <el-dialog
    :title="textImportMap[dialogImportStatus]" :visible.sync="dialogImportVisible">
    <el-form size="mini" class="small-space" a
             :model="tempImportModel" :rules="rules" ref="tempImportModel" status-icon
             label-position="right" label-width="150px" style='margin-left:50px;'>

      <el-collapse v-model="collapseActiveNames">

        <el-collapse-item name="1">
          <template slot="title">
            <i class="header-icon el-icon-info"></i>
          </template>
          <el-row>
            <el-col :span="12">

              <!--<el-form-item label="模板">-->
                <!--<el-button size="mini" type="danger" @click="downloadFrame">下载模板</el-button>-->
              <!--</el-form-item>-->

              <el-form-item label="Excel文件"  prop="excelUrl" >
                <newLifeUploadFile :uploadFileData="{'category':'excel'}"
                                   v-model="tempImportModel.excelUrl"></newLifeUploadFile>
              </el-form-item>

              <el-form-item label="年份"  prop="excelUrl" >
                <el-select   v-model="tempImportModel.year">
                  <el-option v-for="item in yearOptions"
                             :key="item.id" :value="item.id" :label="item.label"/>
                </el-select>

              </el-form-item>
              <div v-if="showValidMessage" style="color:red">
                <span>上传失败，原因如下:</span><br>
                <div v-html="importValidMessage"></div>
              </div>
            </el-col>

          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogImportVisible = false">取 消</el-button>
      <el-button size="mini" v-if="dialogImportStatus=='import'" type="success" @click="importModel">保 存</el-button>

    </div>
  </el-dialog>
  <iframe id="downloadFrame" name="downloadFrame" style="position:'absolute';top:-1000px;left:-1000px;height;1px;width:1px;" src="about:blank" frameborder="0"></iframe>
  </div>
</template>
<script>
import customerTab from '@/components/customer/customerTab.vue'

export default {
  components:{
    customerTab,
  },
  data() {
    return {

      updateCarTempModel:{
        remark:''
      },
      updateCarDialogVisiable:false,

      finishTempModel:{
        remark:''
      },
      finishDialogVisiable:false,
      importValidMessage:"",
      showValidMessage:false,
      yearOptions:[
        {
          id:2018,label:"2018年"},{
          id:2019,label:"2019年"
        }
      ],
      rentTypeOptions: [
          { id: 1, label: "长租" },
          { id: 2, label: "以租代售" }

        ],
      collapseActiveNames: ["1", "2", "3"],

      textImportMap: {
        import: '导入'
      },
      dialogImportStatus:'import',
      dialogImportVisible:false,
      tempImportModel:{
        excelUrl:'',
        year:'2019'
      },
      returnTempModel:{
        returnRemarks:''
      },
      returnCarDialogVisiable:false,
      returnLabel:'还 车',
      periodsOptions: [],
      customerCarRentOffsetList: [],
      collapseActiveNames: ["1", "2", "3", "4", "5"],
      orderStateOptions: [
        { id: "C", label: "创建" },
        { id: "P", label: "支付" },
        // { id: "F", label: "取消" },
        { id: "A", label: "申请退款" },
        { id: "R", label: "已退款" },
        { id: "D", label: "交车" },
        { id: "E", label: "异常" },
        { id: "S", label: "完成" },
        { id: "G", label: "取消订单" },
      ],
      orderTypeOptions: [
        {id: 0,label: '线下'},
        {id: 1,label: '线上'},
      ],
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      listLoading: false, //数据加载等待动画
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数

        rentOrderID: "",

        rentOrderNumber: "",

        rentContactName: "",

        rentContactPhone: "",

        rentContactAddress: "",

        periods: "",

        orgID: "",

        carModelID: "",

        quantity: "",

        customerID: "",

        customerName: "",

        rentTime: "",

        // rentEndTime: "",

        orderState: "",

        orderType: "",

        plateNumber:"",

        vINCode:""
      },
      dialogStatus: "create",
      dialogFormVisible: false,
      textMap: {
        update: "编辑",
        create: "创建",
        delivery: "交车",
        view: "查看",
        reutrnCar:"还车"
      },
      plan: {
        deposit: 0,
        monthlyRental: 0,
        firstMonthRental: 0,
      },
      tempModel: {
        rentOrderID: "",
        rentOrderNumber: "",
        rentCustomerName: '',
        rentContactName: "",
        rentContactPhone: "",
        rentContactAddress: "",
        periods: "",
        orgID: "",
        carSeriesID:"",
        carModelID: "",
        quantity: "",
        customerID: "",
        rentTime: "",
        rentEndTime: "",
        orderState: "",
        orderType: "",
        rentorderCar: [],
        deliveryRemarks: '',
        couponAmount: 0,
        deliveryTime: '',
        rental: '',
        baseMonthlyRental: 0,
        deposit: 0,
        isSendingTohouse:'',
        rentType: '',
      },
      selectedCustomerCarList: [],
      rules: {
        isSendingTohouse: [{ required: true, message: "请填写是否送车上门", trigger: "blur" }],

        rentOrderNumber: [
          { required: true, message: "请填写单号", trigger: "blur" }
        ],

        rentContactName: [
          { required: true, message: "请填写联系人姓名", trigger: "blur" }
        ],

        rentContactPhone: [
          { required: true, message: "请填写联系人电话", trigger: "blur" }
        ],

        rentContactAddress: [
          { required: true, message: "请填写联系人地址", trigger: "blur" }
        ],

        periods: [{ required: true, message: "请填写期数", trigger: "blur" }],

        orgID: [{ required: true, message: "请填写组织ID", trigger: "blur" }],

        carModelID: [
          { required: true, message: "请填写车型ID", trigger: "blur" }
        ],

        quantity: [
          { required: true, message: "请填写租车数量", trigger: "blur" }
        ],

        customerID: [
          { required: true, message: "请填写客户ID", trigger: "blur" }
        ],

        rentTime: [
          { required: true, message: "请填写开始租车时间", trigger: "blur" }
        ],

        // rentEndTime: [
        //   { required: true, message: "请填写结束租车时间", trigger: "blur" }
        // ],

        orderState: [
          {
            required: true,
            message: "请填写订单状态",
            trigger: "blur"
          }
        ],

        orderType: [
          {
            required: true,
            message: "请填写订单类型",
            trigger: "blur"
          }
        ],
         rentType: [
          {
            required: true,
            message: "请填写租车类型",
            trigger: "blur"
          }
         ]
      }
    };
  },
  created() {
    this.getList();
  },
  computed:{
    monthlyRental(){
      if(this.dialogStatus == 'create'){
        this.tempModel.rental = this.plan.monthlyRental - this.tempModel.couponAmount
      }
    }
  },
  watch: {
    "tempModel.rentType": function(v) {
      if(this.dialogStatus == 'create'){
        this.tempModel.periods = ''
        if (v && this.tempModel.carModelID) {
          this.getCarModelRentplanOptions(this.tempModel.carModelID,v);
        }
      }
    },
    "tempModel.carModelID": function(v) {
      if(this.dialogStatus == 'create'){
        this.tempModel.periods = ''
        if (v && this.tempModel.rentType) {
          this.getCarModelRentplanOptions(v,this.tempModel.rentType);
        }
      }
    },
    "tempModel.periods": function(v) {
       this.changePeriods(v)
    }
  },
  methods: {
    downloadFrame(){

    },
    showImport() {
      if (this.$refs['tempImportModel']!==undefined) {
        this.$refs['tempImportModel'].resetFields();
      }
      //显示导入对话框
      this.dialogImportStatus = "import"
      this.dialogImportVisible = true
      this.dialogFormVisible = false
    },
    importModel(){
      this.$refs['tempImportModel'].validate((valid) => {
        if (valid) {
          this.api({
            url: "/rentorder/uploadTemplate",
            method: "post",
            data: this.tempImportModel
          }).then(data => {
            console.log(data);
            if(typeof data  =='string') {

              this.showValidMessage = true;
              this.importValidMessage = data;

            } else {

              this.$message({
                message: '导入成功',
                type: 'success',
                duration: 1 * 1000,
              })
              this.getList();
              this.dialogImportVisible = false

            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    changePeriods(v){
       if(!v){
        return
      }
      for (let i = 0; i < this.periodsOptions.length; i++) {
        if (v == this.periodsOptions[i].periods) {
          this.tempModel.deposit = this.periodsOptions[i].deposit;
          this.tempModel.rental = this.periodsOptions[i].monthlyRental;
          this.plan.firstMonthRental = this.periodsOptions[i].firstMonthRental;
          this.plan.monthlyRental = this.periodsOptions[i].monthlyRental;
          break;
        }
      }
    },
    updateCarRemote(){
      this.updateCar(this.updateCarTempModel);
      this.updateCarDialogVisiable = false;
    },

    finishCarRemote(){
      this.finishCar(this.finishTempModel);
      this.finishDialogVisiable = false;
    },
    returnCarRemote(){
      this.returnCar(this.returnTempModel);
      this.returnCarDialogVisiable = false;

    },
    getCustomerCarRentContract(){
      let url = `/api/rentorder/getRentOrderContract?rentOrderID=${this.tempModel.rentOrderID}`
      window.open(url)
    },
    updateCarModel(model) {
      //未完成交租

          this.dialogStatus = "updateCar";
          this.updateCarDialogVisiable =true;
          this.updateCarTempModel = model;

    },
    finishModel(model) {
      //未完成交租
        this.$confirm("您确定完成吗?", "提示", {
          confirmButtonText: "确定",
          showCancelButton: true,
          type: "warning"
        }).then(
          () => {
            this.dialogStatus = "finishCar";
            this.finishDialogVisiable =true;
            this.finishTempModel = model;
            //this.returnCar(model);
          },
          () => {
            return
            //取消
          }
        );
    },
    updateCar(model){
      this.api({
        url: "/rentorderCar/updateCar",
        method: "post",
        data: model
      }).then(() => {
        let msg = "已完成！";
        this.$message({
          message: msg,
          type: "success",
          duration: 1 * 1000,
          onClose: () => {
          }
        });

        this.getList();
        this.updateCarDialogVisiable = false;
      });
    },
    finishCar(model){
      this.api({
        url: "/rentorderCar/finishCar",
        method: "post",
        data: model
      }).then(() => {
        let msg = "已完成！";
        this.$message({
          message: msg,
          type: "success",
          duration: 1 * 1000,
          onClose: () => {
          }
        });

        this.getList();
        this.finishDialogVisiable = false;
      });
    },

    returnModel(model) {
      //未完成交租
      if( model.periods > model.paidPeriod ) {
        this.$confirm("租车计划未完成，您确定要还车吗?", "提示", {
          confirmButtonText: "确定",
          showCancelButton: true,
          type: "warning"
        }).then(
          () => {
            this.dialogStatus = "reutrnCar";
            this.returnCarDialogVisiable =true;
            this.returnTempModel = model;
            //this.returnCar(model);
          },
          () => {
            return
            //取消
          }
        );
      } else {
        this.dialogStatus = "reutrnCar";
        this.returnCarDialogVisiable =true;
        this.returnTempModel = model;
      }
    },
    returnCar(model){
      this.api({
        url: "/rentorderCar/returnCar",
        method: "post",
        data: model
      }).then(() => {
        let msg = "还车成功！";
        this.$message({
          message: msg,
          type: "success",
          duration: 1 * 1000,
          onClose: () => {
          }
        });

        this.getList();
        this.returnCarDialogVisiable = false;

      });
    } ,    getOrderStateText(v){
      if(v){
        const states = this.orderStateOptions
        for (const index in states) {
          if (states[index].id == v) {
            return states[index].label
          }
        }
      }
      return "未知状态"
    },
    getOrderTypeText(v){
     return v == 0 ? '线下':'线上'
    },
    customerChange(v){
      this.tempModel.rentCustomerName = v.customerName
      this.tempModel.rentContactAddress = v.deliveryAddress
      this.tempModel.rentContactName = v.contactName
      this.tempModel.rentContactPhone = v.contactMobile
    },
    handleUpdateCustomerCar(carList) {
      // this.tempModel.customerCar = val
      this.tempModel.quantity = carList.length
    },
    getCarModelRentplanOptions(carModelID,planType) {
      this.api({
        url: "/rentplan/listRentplan",
        method: "get",
        params: {
          pageNum: 1,
          pageRow: 100,
          carModelID: carModelID,
          planType
        }
      }).then(data => {
        this.periodsOptions = data.list;
      });
    },
    getList() {
      //查询列表
      //if (!this.hasPerm('rentorder:list')) {
      // return
      //}
      this.listLoading = true;
      this.api({
        url: "/rentorder/listRentorder",
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
      this.tempModel.rentOrderID = "";
      this.tempModel.rentOrderNumber = "";
      this.tempModel.rentContactName = "";
      this.tempModel.rentContactPhone = "";
      this.tempModel.rentContactAddress = "";
      this.tempModel.rentCustomerName = ''
      this.tempModel.periods = "";
      this.tempModel.orgID = this.$store.state.user.userOrgId;
      this.tempModel.carSeriesID = "";
      this.tempModel.carModelID = "";
      this.tempModel.quantity = 1;
      this.tempModel.customerID = "";
      this.tempModel.rentTime = "";
      this.tempModel.orderState = "";
      this.tempModel.orderType = 0;
      this.tempModel.status = 0;
      this.tempModel.createTime = "";
      this.tempModel.createUser = "";
      this.tempModel.modifyTime = "";
      this.tempModel.modifyUser = "";
      this.tempModel.deliveryRemarks = '';
      this.selectedCustomerCarList = [];
      this.tempModel.couponAmount = 0;
      this.tempModel.baseMonthlyRental = 0;
      this.tempModel.deposit = 0;
      this.tempModel.rental = 0;
      this.tempModel.deliveryTime = '';
      this.tempModel.isSendingTohouse = '';
      this.tempModel.rentType = '';
      this.tempModel.rentEndTime = "";

      this.plan.deposit = 0;
      this.plan.monthlyRental = 0;
      this.plan.firstMonthRental = 0;

      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    showUpdate($index,dialogStatus) {
      //这个重置的方法也不能用，它是将表单重置成form第一次打开时的model的值
      //打开修改，关闭，打开新增，就会看到字段的值是被重置成了“打开修改”时的值
      if (this.$refs["tempModel"] !== undefined) {
        this.$refs["tempModel"].resetFields();
      }
      if(dialogStatus == 'delivery'){
        this.tempModel.deliveryRemarks = ''
        this.selectedCustomerCarList = []
      }
      this.tempModel.periods = ""
      this.tempModel.carModelID = ''
      this.api({
        url: "/rentorder/getRentorder",
        method: "post",
        data: { rentOrderID: this.list[$index].rentOrderID }
      }).then(data => {
        this.$set(this,'tempModel',data)

        this.dialogStatus = dialogStatus;
        if(dialogStatus == 'view'){
          this.getOrderCarsListByOrderID()
        }
        this.dialogFormVisible = true;
      });
    },
    showReturn($index,dialogStatus) {
      //这个重置的方法也不能用，它是将表单重置成form第一次打开时的model的值
      //打开修改，关闭，打开新增，就会看到字段的值是被重置成了“打开修改”时的值
      if (this.$refs["tempModel"] !== undefined) {
        this.$refs["tempModel"].resetFields();
      }
      if(dialogStatus == 'return'){
        this.tempModel.deliveryRemarks = ''
        this.selectedCustomerCarList = []
      }

      this.api({
        url: "/rentorder/getRentorder",
        method: "post",
        data: { rentOrderID: this.list[$index].rentOrderID }
      }).then(data => {
        this.tempModel = data;

        this.dialogStatus = dialogStatus;
          this.getOrderCarsListByOrderID()

        this.dialogFormVisible = true;
      });
    },
    getOrderCarsListByOrderID(rentOrderID){
       this.api({
        url: "/rentorderCar/listRentorderCar",
        method: "get",
        params: {
          pageNum:1,
          pageRow:100,
          rentOrderID:this.tempModel.rentOrderID
        }
      }).then(data => {
        this.selectedCustomerCarList = data.list;
      });
    },
    createModel() {
      this.$refs["tempModel"].validate(valid => {
        if (valid) {
          //保存新文章
          this.api({
            url: "/rentorder/addRentorder",
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
    deliveryCar(){
      if(this.tempModel.quantity != this.selectedCustomerCarList.length){
        this.$message.error('订单数量和选择车辆数量不一致')
        return
      }
      const cars = {}
      cars.rentOrderID = this.tempModel.rentOrderID
      cars.deliveryRemarks = this.tempModel.deliveryRemarks
      // cars.rentorderCar = []
      cars.rentorderCar = this.selectedCustomerCarList.map(item => {
        const totalRental = this.tempModel.periods * this.tempModel.rental
        const car = {
          customerCarID: item.customerCarID,
          rentTime: this.tempModel.rentTime,
          periods: this.tempModel.periods,
          deposit: this.tempModel.deposit,
          // firstMonthRental: this.monthlyRental,
          // monthlyRental: this.monthlyRental,
          firstMonthRental: this.tempModel.rental,
          monthlyRental: this.tempModel.rental,
          lastPaidDate: this.tempModel.rentTime,
          totalRental,
          amountBalance: totalRental,
          paidPeriod: 0,
          remark: '',

        }
        return car
      })

       this.api({
            url: "/rentorder/deliveryCar",
            method: "post",
            data: cars
          }).then(() => {
            let msg = "交车成功";
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
    updateModel() {
      this.$refs["tempModel"].validate(valid => {
        if (valid) {
          //修改文章
          this.api({
            url: "/rentorder/updateRentorder",
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
            url: "/rentorder/deleteRentorder",
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

