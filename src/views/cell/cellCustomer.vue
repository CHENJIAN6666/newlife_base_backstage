<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">

			<el-form-item label="公司名称">
			    <el-input v-model="listQuery.company" placeholder="公司名称"></el-input>
			</el-form-item>


		


			<el-form-item label="意向等级">
					  <el-select  v-model="listQuery.intentionLevel"    placeholder="请选择"  clearable >
            <el-option 
              v-for="item in levelList" 
              :key="item.levelID"
              :label="item.levelName"
              :value="item.levelID">
            </el-option>
          </el-select>
			</el-form-item>



       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="getList">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
				   <el-button size="mini" type="primary" icon="plus" @click="assignTask" >下发任务
      </el-button>
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('cellCustomer:add')">添加
      </el-button>
			<el-button size="mini" type="primary" icon="plus"  @click="dialogImportVisible = true" v-if="hasPerm('cellCustomer:add')">导入 
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
				
			
				 <el-table-column align="center" prop="company" label="公司名称" width="240"></el-table-column>
			
				 <el-table-column align="center" prop="legalRepresentative" label="法定代表人" width="90"></el-table-column>

				 <el-table-column align="center" prop="contact" label="联系人" width="70"></el-table-column>

				 <el-table-column align="center" prop="phone1" label="联系电话" width="80"></el-table-column>

				 <el-table-column align="center" prop="phone2" label="联系电话2" width="90"></el-table-column>
<!-- 
				 <el-table-column align="center" prop="userID" label="跟进人" width="70"></el-table-column> -->

				 <el-table-column align="center" prop="pic" label="公司照片" width="74">
					 <template slot-scope="scope">
						  <img width="20" height="20" v-bind:src="scope.row.pic" />
					 </template>
				 </el-table-column>

				 <el-table-column align="center" prop="isValid" label="是否有效" width="74">
					 <template slot-scope="scope">
						   <span v-if="scope.row.isValid == 0">无效</span>
							 <span v-if="scope.row.isValid == 1">有效</span>
					 </template>
				 </el-table-column>

				 <el-table-column align="center" prop="address" label="地址" width="240" :show-overflow-tooltip="true"></el-table-column>
			
				 <el-table-column align="center" prop="registeredCapital" label="注册资本" width="80"></el-table-column>
			
				<el-table-column align="center" label="成立日期" width="140">
					<template slot-scope="scope">
						<span>{{scope.row.registerDate}}</span>
					</template>
				</el-table-column>
			
				 <el-table-column align="center" prop="managementStatus" label="经营状态" width="80"></el-table-column>
			
				 <el-table-column align="center" prop="province" label="所属省份" width="80"></el-table-column>
			
				 <el-table-column align="center" prop="city" label="所属市区" width="80"></el-table-column>
			
				 <el-table-column align="center" prop="county" label="所属区县" width="80"></el-table-column>
			
				 <el-table-column align="center" prop="companyType" label="公司类型" width="80"></el-table-column>
			
				 <el-table-column align="center" prop="unifiedCreditCode" label="统一社会信用代码" width="120"></el-table-column>
			
				
			
				
			
				 
			
				 <el-table-column align="center" prop="url" label="网址" width="60" :show-overflow-tooltip="true"></el-table-column>
			
				 <el-table-column align="center" prop="email" label="邮箱" width="60"></el-table-column>
			
				 <el-table-column align="center" prop="businessScope" label="经营范围" width="80" :show-overflow-tooltip="true"></el-table-column>
			

			
					<!-- 
						<el-table-column align="center" label="创建时间" width="140">
							<template slot-scope="scope">
								<span>{{scope.row.createTime}}</span>
							</template>
						</el-table-column>
					  -->
			

			
				 
			
				 <el-table-column align="center" prop="intentionLevel" label="意向等级" width="80"></el-table-column>
			
			
			
			
			
				
			
       
        
      <el-table-column align="center" label="操作" width="150" v-if="hasPerm('cellCustomer:update')" fixed="right">
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
		
			<el-col :span="12">
									
					
										<el-form-item label="公司名称"  prop="company" >
											<el-input type="text" v-model="tempModel.company">
											</el-input>
										</el-form-item>	

										
										<el-form-item label="地址"  prop="address" >
											<el-input type="text" v-model="tempModel.address">
											</el-input>
										</el-form-item>	

										<el-form-item label="新地址"   >
											<el-input type="text" v-model="tempModel.newAddress">
											</el-input>
										</el-form-item>	

												<el-form-item label="统一社会信用代码"  prop="unifiedCreditCode" >
											<el-input type="text" v-model="tempModel.unifiedCreditCode">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="法定代表人"   >
											<el-input type="text" v-model="tempModel.legalRepresentative">
											</el-input>
										</el-form-item>	

											<el-form-item label="联系人"   >
											<el-input type="text" v-model="tempModel.contact">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="注册资本"   >
											<el-input type="text" v-model="tempModel.registeredCapital">
											</el-input>
										</el-form-item>	
					
							<el-form-item label="成立日期"   >
							<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.registerDate" value-format="yyyy-MM-dd"></el-date-picker>
							</el-form-item>
					
										<el-form-item label="经营状态"   >
											<el-input type="text" v-model="tempModel.managementStatus">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="所属省份"   >
											<el-input type="text" v-model="tempModel.province">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="所属市区"  >
											<el-input type="text" v-model="tempModel.city">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="所属区县"   >
											<el-input type="text" v-model="tempModel.county">
											</el-input>
										</el-form-item>	

											<el-form-item label="经度"   >
											<el-input type="text" v-model="tempModel.lng">
											</el-input>
										</el-form-item>	

											<el-form-item label="纬度"   >
											<el-input type="text" v-model="tempModel.lat">
											</el-input>
										</el-form-item>	
					
									
					
								
					
										
					
					
			</el-col>
			
			<el-col :span="11" style="margin-left:20px">

										<el-form-item label="公司类型"  >
											<el-input type="text" v-model="tempModel.companyType">
											</el-input>
										</el-form-item>	
										<el-form-item label="联系电话"  >
											<el-input type="text" v-model="tempModel.phone1">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="联系电话2"   >
											<el-input type="text" v-model="tempModel.phone2">
											</el-input>
										</el-form-item>	
						
										<el-form-item label="网址"   >
											<el-input type="text" v-model="tempModel.url">
											</el-input>
										</el-form-item>	
								
					
						
										<el-form-item label="邮箱"   >
											<el-input type="text" v-model="tempModel.email">
											</el-input>
										</el-form-item>	
								
					
						
										<el-form-item label="经营范围"   >
											<el-input  v-model="tempModel.businessScope" type="textarea" :rows="3" >
											</el-input>
										</el-form-item>	
								
	
						
										<el-form-item label="是否有效"   >
											<el-radio v-model="tempModel.isValid" :label="1">有效</el-radio>
											<el-radio v-model="tempModel.isValid" :label="0">无效</el-radio>
										</el-form-item>	
								
					
						
										<el-form-item label="意向等级"  >
											   <el-select  v-model="tempModel.intentionLevel"   placeholder="请选择"   >
													<el-option 
														v-for="item in levelList" 
														:key="item.levelID"
														:label="item.levelName"
														:value="item.levelID">
													</el-option>
												</el-select>
								
											
										</el-form-item>	
								

					
						
										<el-form-item label="照片"   >
											<newLifeUploadImg :uploadPicData="{'category':'cellCustomer'}"
               				 v-model="tempModel.pic"></newLifeUploadImg>
										
										</el-form-item>	
								
					
						
									
								
					
			</el-col>
			
			
			
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button>
        <el-button size="mini" v-else type="primary" @click="updateModel">修 改</el-button>
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

                <!-- <el-form-item label="模板">
                  <el-button size="mini" type="danger" @click="downloadFrame">下载模板</el-button>
                </el-form-item> -->

                <el-form-item label="Excel文件"  prop="excelUrl" >
                  <newLifeUploadFile :uploadFileData="{'category':'excel'}"
                                     v-model="tempImportModel.excelUrl"></newLifeUploadFile>
                </el-form-item>
								{{tempImportModel.excelUrl}}

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
  </div>
</template>
<script>
  export default {
    data() {
      return {
				levelList:[],
				collapseActiveNames: ["1", "2", "3"],
				textImportMap: {
          import: '导入'
        },
				showValidMessage:false,
				dialogImportStatus:'import',
				dialogImportVisible:false,
				tempImportModel:{
          excelUrl:''
				},
			
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          
				customerID:'',
            
				company:'',
            
				legalRepresentative:'',
            
				registeredCapital:'',
            
				registerDate:'',
            
				managementStatus:'',
            
				province:'',
            
				city:'',
            
				county:'',
            
				companyType:'',
            
				unifiedCreditCode:'',
            
				phone1:'',
            
				phone2:'',
            
				address:'',
            
				url:'',
            
				email:'',
            
				businessScope:'',
            
				status:'',
            
				createTime:'',
            
				createUser:'',
            
				modifyTime:'',
            
				modifyUser:'',
            
				isValid:'',
            
				intentionLevel:'',
            
				userID:'',
            
				pic:'',
            
				contact:''
            
           
           
        
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempModel: {
				newAddress:'',
				lng:'',
				lat:'',	
				customerID:'',
				company:'',
				legalRepresentative:'',
				registeredCapital:'',
				registerDate:'',
				managementStatus:'',
				province:'',
				city:'',
				county:'',
				companyType:'',
				unifiedCreditCode:'',
				phone1:'',
				phone2:'',
				address:'',
				url:'',
				email:'',
				businessScope:'',
				status:'',
				createTime:'',
				createUser:'',
				modifyTime:'',
				modifyUser:'',
				isValid:'',
				intentionLevel:'',
				userID:'',
				pic:'',
				contact:''

        },
        rules: {
			 customerID:[
		  { required: true, message: '请填写客户ID', trigger: 'blur' }],
		
			 company:[
		  { required: true, message: '请填写公司名称', trigger: 'blur' }],
		
			 legalRepresentative:[
		  { required: true, message: '请填写法定代表人', trigger: 'blur' }],
		
			 registeredCapital:[
		  { required: true, message: '请填写注册资本', trigger: 'blur' }],
		
			 registerDate:[
		  { required: true, message: '请填写成立日期', trigger: 'blur' }],
		
			 managementStatus:[
		  { required: true, message: '请填写经营状态', trigger: 'blur' }],
		
			 province:[
		  { required: true, message: '请填写所属省份', trigger: 'blur' }],
		
			 city:[
		  { required: true, message: '请填写所属市区', trigger: 'blur' }],
		
			 county:[
		  { required: true, message: '请填写所属区县', trigger: 'blur' }],
		
			 companyType:[
		  { required: true, message: '请填写公司类型', trigger: 'blur' }],
		
			 unifiedCreditCode:[
		  { required: true, message: '请填写统一社会信用代码', trigger: 'blur' }],
		
			 phone1:[
		  { required: true, message: '请填写联系电话', trigger: 'blur' }],
		
			 phone2:[
		  { required: true, message: '请填写联系电话2', trigger: 'blur' }],
		
			 address:[
		  { required: true, message: '请填写地址', trigger: 'blur' }],
		
			 url:[
		  { required: true, message: '请填写网址', trigger: 'blur' }],
		
			 email:[
		  { required: true, message: '请填写邮箱', trigger: 'blur' }],
		
			 businessScope:[
		  { required: true, message: '请填写经营范围', trigger: 'blur' }],
		
			 status:[
		  { required: true, message: '请填写数据状态：0-正常，1-删除', trigger: 'blur' }],
		
								 createTime:[
								  { required: true, message: '请填写创建时间', trigger: 'blur' }],
		
			 createUser:[
		  { required: true, message: '请填写创建人ID', trigger: 'blur' }],
		
			 modifyTime:[
		  { required: true, message: '请填写修改时间', trigger: 'blur' }],
		
			 modifyUser:[
		  { required: true, message: '请填写修改人ID', trigger: 'blur' }],
		
			 isValid:[
		  { required: true, message: '请填写是否有效：0-无效，1-有效（默认为1）', trigger: 'blur' }],
		
			 intentionLevel:[
		  { required: true, message: '请填写意向等级', trigger: 'blur' }],
		
			 userID:[
		  { required: true, message: '请填写跟进人', trigger: 'blur' }],
		
			 pic:[
		  { required: true, message: '请填写照片', trigger: 'blur' }],
		
			 contact:[
		  { required: true, message: '请填写联系人', trigger: 'blur' }]
		
            
         
         
            //{ required: true, message: '标题', trigger: 'blur' },
            //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        }
      }
    },
    created() {
      this.getList();
			this.getLevelList()
    },
    methods: {
			assignTask(){
					this.api({ url: "/cellCustomer/assignTask",
              method: "post",
							 data: {}
          }).then(data=>{
						this.levelList = data
					})
			},
			getLevelList(){
					this.api({ url: "/cellCustomer/getLevelList",
              method: "post",
							 data: {}
          }).then(data=>{
						this.levelList = data
					})
			},
			importModel(){
        this.showValidMessage = false;
        this.importValidMessage = "";

        this.$refs['tempImportModel'].validate((valid) => {
          if (valid) {
            this.api({
              url: "/cellCustomer/uploadTemplate",
              method: "post",
              data: this.tempImportModel
            },{timeout: 120000}).then(data => {
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
      getList() {
        //查询列表
        //if (!this.hasPerm('cellCustomer:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/cellCustomer/listCellCustomer",
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
					 this.tempModel.customerID = "";
					 this.tempModel.company = "";
					 this.tempModel.legalRepresentative = "";
					 this.tempModel.registeredCapital = "";
					 this.tempModel.registerDate = "";
					 this.tempModel.managementStatus = 0;
					 this.tempModel.province = "";
					 this.tempModel.city = "";
					 this.tempModel.county = "";
					 this.tempModel.companyType = 0;
					 this.tempModel.unifiedCreditCode = "";
					 this.tempModel.phone1 = "";
					 this.tempModel.phone2 = "";
					 this.tempModel.address = "";
					 this.tempModel.url = "";
					 this.tempModel.email = "";
					 this.tempModel.businessScope = "";
					 this.tempModel.status = 0;
					 this.tempModel.createTime = "";
					 this.tempModel.createUser = "";
					 this.tempModel.modifyTime = "";
					 this.tempModel.modifyUser = "";
					 this.tempModel.isValid = 0;
					 this.tempModel.intentionLevel = 0;
					 this.tempModel.userID = 0;
					 this.tempModel.pic = "";
					 this.tempModel.contact = "";
           

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
          url: "/cellCustomer/getCellCustomer",
          method: "post",
          data: {customerID:this.list[$index].customerID}
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
              url: "/cellCustomer/addCellCustomer",
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
              url: "/cellCustomer/updateCellCustomer",
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
            url: "/cellCustomer/deleteCellCustomer",
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

