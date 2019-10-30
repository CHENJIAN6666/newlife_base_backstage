<template>
  <div class="app-container">
    <div class="filter-container">
		<el-form size="mini" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-row>
       <el-col :span="22">
			
			<!-- <el-form-item label="平台会员ID">
			    <el-input v-model="listQuery.memberID" placeholder="平台会员ID"></el-input>
			</el-form-item> -->


			<!-- <el-form-item label="登录账号">
			    <el-input v-model="listQuery.loginID" placeholder="登录账号"></el-input>
			</el-form-item> -->


			<el-form-item label="手机号码">
			    <el-input v-model="listQuery.mobile" placeholder="手机号码"></el-input>
			</el-form-item>

			<el-form-item label="代理人名称">
			    <el-input v-model="listQuery.memberName" placeholder="代理人名称"></el-input>
			</el-form-item>

			<!-- <el-form-item label="我的团队">
			    <el-input v-model="listQuery.parentMember" placeholder="我的团队"></el-input>
			</el-form-item> -->

			<!-- <el-form-item label="昵称">
			    <el-input v-model="listQuery.nickName" placeholder="昵称"></el-input>
			</el-form-item> -->

			<!-- <el-form-item label="性别">
				 <el-select clearable v-model="listQuery.sex">
             <el-option v-for="item in [{id:1,label:'男'},{id:2,label:'女'}]"
               :key="item.id"
               :label="item.label"
               :value="item.id">
             </el-option>
			    </el-select>
			</el-form-item> -->

			<!-- <el-form-item label="平台会员来源">
			    <el-input v-model="listQuery.memberSource" placeholder="平台会员来源"></el-input>
			</el-form-item> -->

       </el-col>
       <el-col :span="2" class="text-right">
            <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
       </el-col>
		  </el-row>
		</el-form>
    <!-- <el-row  style="padding-bottom: 5px;">
      <el-col :span="24" class="text-right">
      <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('member:add')">添加
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
			<!-- <el-table-column align="center" prop="memberID" label="平台会员ID" width="100"></el-table-column> -->
			<!-- <el-table-column align="center" prop="loginID" label="登录账号" width="80"></el-table-column> -->
			<el-table-column align="center" prop="mobile" label="手机号码" width="120"></el-table-column>
			<!-- <el-table-column align="center" prop="email" label="邮箱" width="60"></el-table-column> -->
			<!-- <el-table-column align="center" prop="password" label="密码" width="60"></el-table-column> -->
			<el-table-column align="center" prop="realName" label="代理人名称" fit></el-table-column>
			<!-- <el-table-column align="center" prop="nickName" label="昵称" fit></el-table-column> -->
			<el-table-column align="center" label="用户头像" fit>
				<template slot-scope="scope">
					<img :src="getAvatarUrl(scope.row.avatar)" class="table-item-img"/>
				</template>
			</el-table-column>
			<el-table-column align="center" label="性别" width="60">
				<template slot-scope="scope">
					<span v-if="scope.row.sex == '1'">男</span>
					<span v-else-if="scope.row.sex == '2'">女</span>
					<span v-else>未知</span>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" prop="birthday" label="生日" width="60"></el-table-column> -->
			<!-- <el-table-column align="center" prop="telphone" label="固定电话" width="80"></el-table-column> -->
			<!-- <el-table-column align="center" prop="memberStatus" label="会员状态：0-正常，1-禁用" width="180"></el-table-column> -->
			<!-- <el-table-column align="center" prop="status" label="数据状态：0-正常，1-删除" width="180"></el-table-column> -->
			<!-- <el-table-column align="center" prop="createTime" label="创建时间" width="80"></el-table-column> -->
			<!-- <el-table-column align="center" prop="createUser" label="创建人ID" width="90"></el-table-column> -->
			<!-- <el-table-column align="center" prop="modifyTime" label="修改时间" width="80"></el-table-column> -->
			<!-- <el-table-column align="center" prop="modifyUser" label="修改人ID" width="90"></el-table-column> -->
			<!-- <el-table-column align="center" prop="memberSource" label="平台会员来源" width="80"></el-table-column> -->
			<!-- <el-table-column align="center" prop="introducer" label="介绍人" width="80"></el-table-column> -->
			<!-- <el-table-column align="center" prop="pID" label="代理推广码，用于发展代理人和结算佣金依据。" width="300"></el-table-column> -->
			<!-- <el-table-column align="center" prop="saleQrCode" label="推广二维码图片地址" width="130"></el-table-column> -->
			<el-table-column align="center" label="首次访问" width="60">
				<template slot-scope="scope">
					<span v-if="scope.row.isFirst == '1'">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" prop="isAgent" label="是否代理人，1：是；0：否" width="220"></el-table-column> -->
			<el-table-column align="center" prop="agentApplyTime" label="申请时间" width="120"></el-table-column>
			<el-table-column align="center" prop="agentTime" label="成为代理人时间" width="120"></el-table-column>
			<el-table-column align="center" prop="agentMoney" label="帐号余额" width="80"></el-table-column>
			<!-- <el-table-column align="center" prop="lockMoney" label="冻结余额" width="130"></el-table-column> -->
			<!-- <el-table-column align="center" prop="agentMoney" label="实时代理佣金" width="150"></el-table-column> -->
			<el-table-column align="center" prop="totalAgentMoney" label="累计代理佣金" width="80"></el-table-column>
			<!-- <el-table-column align="center" prop="lockAgentMoney" label="冻结佣金金额" width="150"></el-table-column> -->
       
        
      <el-table-column align="center" label="操作" width="300" v-if="hasPerm('member/1:update')">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)">查看</el-button>
          <el-button size="mini" type="primary" icon="edit" @click="myTeam(scope.$index)">我的团队</el-button>
          <el-button size="mini" type="primary" icon="edit" @click="myFans(scope.$index)">我的粉丝</el-button>
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
        :model="tempModel" disabled ref="tempModel" status-icon
        label-position="right" label-width="150px" style='margin-left:50px;'>
		
			<el-col :span="12">
							
										<!-- <el-form-item label="平台会员ID"  prop="memberID" >
											<el-input type="text" v-model="tempModel.memberID">
											</el-input>
										</el-form-item> -->
									
<!-- 					
										<el-form-item label="登录账号"  prop="loginID" >
											<el-input type="text" v-model="tempModel.loginID">
											</el-input>
										</el-form-item>	 -->
					
										<el-form-item label="手机号码"  prop="mobile" >
											<el-input type="text" v-model="tempModel.mobile">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="邮箱"  prop="email" >
											<el-input type="text" v-model="tempModel.email">
											</el-input>
										</el-form-item>	
					
										<!-- <el-form-item label="密码"  prop="password" >
											<el-input type="text" v-model="tempModel.password">
											</el-input>
										</el-form-item>	 -->
					
										<el-form-item label="会员名称"  prop="memberName" >
											<el-input type="text" v-model="tempModel.memberName">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="昵称"  prop="nickName" >
											<el-input type="text" v-model="tempModel.nickName">
											</el-input>
										</el-form-item>	
					
										<el-form-item label="用户头像"  prop="avatar" >
											<!-- <el-input type="text" v-model="tempModel.avatar">
											</el-input> -->
											<img :src="tempModel.avatar" class="table-item-img"/>
										</el-form-item>	
					
										<el-form-item label="性别"  prop="sex" >
											<!-- <el-input type="text" v-model="tempModel.sex">
											</el-input> -->
												<span v-if="tempModel.sex == '1'">男</span>
												<span v-else-if="tempModel.sex == '2'">女</span>
												<span v-else>未知</span>
										</el-form-item>	
					
							<el-form-item label="生日"  prop="birthday" >
							<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.birthday" value-format="yyyy-MM-dd"></el-date-picker>
							</el-form-item>
					
										<el-form-item label="固定电话"  prop="telphone" >
											<el-input type="text" v-model="tempModel.telphone">
											</el-input>
										</el-form-item>	
<!-- 					
										<el-form-item label="会员状态：0-正常，1-禁用"  prop="memberStatus" >
											<el-input type="text" v-model="tempModel.memberStatus">
											</el-input>
										</el-form-item>	 -->
					
										<!-- <el-form-item label="数据状态：0-正常，1-删除"  prop="status" >
											<el-input type="text" v-model="tempModel.status">
											</el-input>
										</el-form-item>	 -->
					
							<!-- <el-form-item label="创建时间"  prop="createTime" >
							<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.createTime" value-format="yyyy-MM-dd"></el-date-picker>
							</el-form-item> -->
					
										<!-- <el-form-item label="创建人ID"  prop="createUser" >
											<el-input type="text" v-model="tempModel.createUser">
											</el-input>
										</el-form-item>	 -->

											<el-form-item label="平台会员来源"  prop="memberSource" >
											<el-input type="text" v-model="tempModel.memberSource">
											</el-input>
										</el-form-item>	
					
			</el-col>
			
			<el-col :span="11" style="margin-left:20px">
							<!-- <el-form-item label="修改时间"  prop="modifyTime" >
							<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.modifyTime" value-format="yyyy-MM-dd"></el-date-picker>
							</el-form-item> -->
					
						
										<!-- <el-form-item label="修改人ID"  prop="modifyUser" >
											<el-input type="text" v-model="tempModel.modifyUser">
											</el-input>
										</el-form-item>	
								 -->
					
						
										<el-form-item label="介绍人(平台会员)"  prop="introducer" >
											<el-input type="text" v-model="tempModel.introducer">
											</el-input>
										</el-form-item>	
								
					
						
										<el-form-item label="代理推广码"  prop="pID" >
											<el-input type="text" v-model="tempModel.pID">
											</el-input>
										</el-form-item>	
								
					
						
										<!-- <el-form-item label="推广二维码图片地址"  prop="saleQrCode" >
											<el-input type="text" v-model="tempModel.saleQrCode">
											</el-input>
										</el-form-item>	 -->
								
					
						
										<!-- <el-form-item label="是否首次访问"  prop="isFirst" >
											<el-input type="text" v-model="tempModel.isFirst">
											</el-input>
										</el-form-item>	 -->
								
					
						
										<el-form-item label="代理人状态"  prop="agentStatus" >
											<el-select v-model="tempModel.agentStatus">
												<el-option v-for="item in [{id:0,label:'不是代理人'},{id:1,label:'实习期代理人'},{id:2,label:'正式代理人'}]"
             						  :key="item.id"
             						  :label="item.label"
             						  :value="item.id">
             						</el-option>
											</el-select>
										</el-form-item>	
								
					
							<el-form-item label="成为代理人时间"  prop="agentTime" >
							<el-date-picker type="date" placeholder="选择日期" v-model="tempModel.agentTime" value-format="yyyy-MM-dd"></el-date-picker>
							</el-form-item>
					
						
										<el-form-item label="帐号余额"  prop="accountMoney" >
											<el-input type="text" v-model="tempModel.accountMoney">
											</el-input>
										</el-form-item>	
								
					
						
										<el-form-item label="冻结余额"  prop="lockMoney" >
											<el-input type="text" v-model="tempModel.lockMoney">
											</el-input>
										</el-form-item>	
								
					
						
										<el-form-item label="实时代理佣金"  prop="agentMoney" >
											<el-input type="text" v-model="tempModel.agentMoney">
											</el-input>
										</el-form-item>	
								
					
						
										<el-form-item label="累计代理佣金"  prop="totalAgentMoney" >
											<el-input type="text" v-model="tempModel.totalAgentMoney">
											</el-input>
										</el-form-item>	
								
					
						
										<el-form-item label="冻结佣金金额"  prop="lockAgentMoney" >
											<el-input type="text" v-model="tempModel.lockAgentMoney">
											</el-input>
										</el-form-item>	
								
					
			</el-col>
			
			
			
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button size="mini" v-if="dialogStatus=='create'" type="success" @click="createModel">创 建</el-button> -->
        <!-- <el-button size="mini" v-else type="primary" @click="updateModel">修 改</el-button> -->
      </div>
    </el-dialog>

			<el-dialog title="我的团队" fullscreen :visible.sync="myTeamVisible">
				<!-- <dev> -->
						<el-form size="mini" :inline="true" class="demo-form-inline">
      				<el-row>
								<el-col :span="22">
									<el-form-item label="层级">
							  	  <!-- <el-input v-model="myTeamListQuery.level" placeholder="层级"></el-input> -->
										<el-select clearable v-model="myTeamListQuery.level">
          					   <el-option v-for="item in [{id:1,label:'1'},{id:2,label:'2'},{id:3,label:'3'}]"
          					     :key="item.id"
          					     :label="item.label"
          					     :value="item.id">
          					   </el-option>
			    					</el-select>
									</el-form-item>
								</el-col>
								 <el-col :span="2" class="text-right">
       					    <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(myTeamListQuery);getMyTeamList()">查询</el-button>
       					</el-col>
      				</el-row>
						</el-form>

			  <el-table :data="myTeamList">
					<el-table-column align="center" label="序号" width="50">
      		  <template slot-scope="scope">
      		    <span v-text="getIndex(scope.$index)"> </span>
      		  </template>
      		</el-table-column>
			    <el-table-column property="realName" label="姓名" width="200"></el-table-column>
			    <el-table-column label="头像">
						<template slot-scope="scope">
							<img :src="getAvatarUrl(scope.row.avatar)" class="table-item-img"/>
						</template>
					</el-table-column>
			    <el-table-column property="level" label="层级" width="200"></el-table-column>
			    <el-table-column property="applyTime" label="申请时间" width="200"></el-table-column>
			  </el-table>
				<el-pagination
    		  @current-change="handleMyTeamPageCurrentChange"
    		  :current-page="myTeamListQuery.pageNum"
    		  :page-size="myTeamListQuery.pageRow"
    		  :total="myTeamListTotalCount"
    		  layout="total, sizes, prev, pager, next, jumper">
    		</el-pagination>
				<!-- </dev> -->
			</el-dialog>

			<el-dialog title="我的粉丝" fullscreen :visible.sync="myFansVisible">
				<!-- <dev> -->
						<!-- <el-form size="mini" :inline="true" class="demo-form-inline">
      				<el-row>
								<el-col :span="22">
									<el-form-item label="层级">
										<el-select clearable v-model="myTeamListQuery.level">
          					   <el-option v-for="item in [{id:1,label:'1'},{id:2,label:'2'},{id:3,label:'3'}]"
          					     :key="item.id"
          					     :label="item.label"
          					     :value="item.id">
          					   </el-option>
			    					</el-select>
									</el-form-item>
								</el-col>
								 <el-col :span="2" class="text-right">
       					    <el-button size="mini"  type="primary" @click="commonUtil.queryPrepare(myTeamListQuery);getMyTeamList()">查询</el-button>
       					</el-col>
      				</el-row>
						</el-form> -->

			  <el-table :data="myFansList">
					<el-table-column align="center" label="序号" fit>
      		  <template slot-scope="scope">
      		    <span v-text="getIndex(scope.$index)"> </span>
      		  </template>
      		</el-table-column>
			    <el-table-column property="memberName" label="姓名" fit></el-table-column>
			    <el-table-column label="头像">
						<template slot-scope="scope">
							<img :src="getAvatarUrl(scope.row.avatar)" class="table-item-img"/>
						</template>
					</el-table-column>
					<el-table-column label="关注状态" width="200">
						<template slot-scope="scope">
							<span v-if="scope.row.subscribe == 0">未订阅</span>
							<span v-else-if="scope.row.subscribe == 1">订阅</span>
							<span v-else-if="scope.row.subscribe == 2">取消订阅</span>
						</template>
					</el-table-column>
					<el-table-column property="createTime" label="关注时间" width="200"></el-table-column>
			  </el-table>
				<el-pagination
    		  @current-change="handleMyFansPageCurrentChange"
    		  :current-page="myFanstListQuery.pageNum"
    		  :page-size="myFanstListQuery.pageRow"
    		  :total="myFansListTotalCount"
    		  layout="total, sizes, prev, pager, next, jumper">
    		</el-pagination>
				<!-- </dev> -->
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
          
				memberID:'',
            
				loginID:'',
            
				mobile:'',
            
				email:'',
            
				password:'',
            
				memberName:'',
            
				nickName:'',
            
				avatar:'',
            
				sex:'',
            
				birthday:'',
            
				telphone:'',
            
				memberStatus:'',
            
				status:'',
            
				createTime:'',
            
				createUser:'',
            
				modifyTime:'',
            
				modifyUser:'',
            
				memberSource:'',
            
				introducer:'',
            
				pID:'',
            
				saleQrCode:'',
            
				isFirst:'',
            
				isAgent:this.$route.params.id?this.$route.params.id:'', //代理人为是
            
				agentTime:'',
            
				accountMoney:'',
            
				lockMoney:'',
            
				agentMoney:'',
            
				totalAgentMoney:'',
            
				lockAgentMoney:''
            
           
           
        
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
				myTeamVisible:false,
				myTeamList:[],
				myTeamListTotalCount:0,
				myTeamListQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
					parentMemberID:'',
					level:'',
					agentStatus:0,
				 },
				 myFansVisible:false,
				myFansList:[],
				myFansListTotalCount:0,
				myFanstListQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
					// parentMemberID:'',
					// level:'1'
					agentMemberID:''
				 },
        textMap: {
          update: '查看',
          create: '创建'
        },
        tempModel: {
				memberID:'',
				loginID:'',
				mobile:'',
				email:'',
				password:'',
				memberName:'',
				nickName:'',
				avatar:'',
				sex:'',
				birthday:'',
				telphone:'',
				memberStatus:'',
				status:'',
				createTime:'',
				createUser:'',
				modifyTime:'',
				modifyUser:'',
				memberSource:'',
				introducer:'',
				pID:'',
				saleQrCode:'',
				isFirst:'',
				isAgent:'',
				agentTime:'',
				accountMoney:'',
				lockMoney:'',
				agentMoney:'',
				totalAgentMoney:'',
				lockAgentMoney:''

        },
        rules: {
								 memberID:[
								  { required: true, message: '请填写平台会员ID', trigger: 'blur' }],
		
			 loginID:[
		  { required: true, message: '请填写登录账号', trigger: 'blur' }],
		
			 mobile:[
		  { required: true, message: '请填写手机号码', trigger: 'blur' }],
		
			 email:[
		  { required: true, message: '请填写邮箱', trigger: 'blur' }],
		
			 password:[
		  { required: true, message: '请填写密码', trigger: 'blur' }],
		
			 memberName:[
		  { required: true, message: '请填写会员名称', trigger: 'blur' }],
		
			 nickName:[
		  { required: true, message: '请填写昵称', trigger: 'blur' }],
		
			 avatar:[
		  { required: true, message: '请填写用户头像', trigger: 'blur' }],
		
			 sex:[
		  { required: true, message: '请填写性别', trigger: 'blur' }],
		
			 birthday:[
		  { required: true, message: '请填写生日', trigger: 'blur' }],
		
			 telphone:[
		  { required: true, message: '请填写固定电话', trigger: 'blur' }],
		
			 memberStatus:[
		  { required: true, message: '请填写会员状态：0-正常，1-禁用', trigger: 'blur' }],
		
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
		
			 memberSource:[
		  { required: true, message: '请填写平台会员来源', trigger: 'blur' }],
		
			 introducer:[
		  { required: true, message: '请填写介绍人(平台会员)', trigger: 'blur' }],
		
			 pID:[
		  { required: true, message: '请填写代理推广码，用于发展代理人和结算佣金依据。', trigger: 'blur' }],
		
			 saleQrCode:[
		  { required: true, message: '请填写推广二维码图片地址', trigger: 'blur' }],
		
			 isFirst:[
		  { required: true, message: '请填写是否首次访问,只有首次访问才能建立代理关系，1：是；0：否', trigger: 'blur' }],
		
			 isAgent:[
		  { required: true, message: '请填写是否代理人，1：是；0：否', trigger: 'blur' }],
		
			 agentTime:[
		  { required: true, message: '请填写申请成为代理人的时间', trigger: 'blur' }],
		
			 accountMoney:[
		  { required: true, message: '请填写帐号余额', trigger: 'blur' }],
		
			 lockMoney:[
		  { required: true, message: '请填写冻结余额', trigger: 'blur' }],
		
			 agentMoney:[
		  { required: true, message: '请填写实时代理佣金', trigger: 'blur' }],
		
			 totalAgentMoney:[
		  { required: true, message: '请填写累计代理佣金', trigger: 'blur' }],
		
			 lockAgentMoney:[
		  { required: true, message: '请填写冻结佣金金额', trigger: 'blur' }]
		
            
         
         
            //{ required: true, message: '标题', trigger: 'blur' },
            //{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        }
      }
		},
		watch:{
			'$route'(to){
				this.tempModel.isAgent = to.params.id
			}
		},
    created() {
      this.getList();
    },
    methods: {
			myFans(index){
				let agent = this.list[index]
				// this.myFanstListQuery.parentMemberID = agent.memberID
				// this.myFanstListQuery.level = 1
				this.myFanstListQuery.agentMemberID = agent.memberID
				this.getMyFansList()
				this.myFansVisible = true
			},
			getMyFansList(){
				this.myFansList = []
				// this.api({
				// 	url:'/classifyRelation/listClassifyRelation',
				// 	params:this.myFanstListQuery
				// }).then(data=>{
				// 	if(data.list){
				// 		this.myFansList = data.list
				// 		this.myFansListTotalCount = data.totalCount
				// 	}
				// })
				this.api({
					url:'/promoteDetail/listPromoteDetail',
					params:this.myFanstListQuery
				}).then(data => {
						this.myFansList = data.list
						this.myFansListTotalCount = data.totalCount
				})
			},
			myTeam(index){
				let agent = this.list[index]
				this.myTeamListQuery.parentMemberID = agent.memberID
				this.myTeamListQuery.level = ''
				this.getMyTeamList()
				this.myTeamVisible = true
			},
			getMyTeamList(){
				this.myTeamList = []
				this.api({
					url:'/classifyRelation/listClassifyRelation',
					params:this.myTeamListQuery
				}).then(data=>{
					if(data.list){
						this.myTeamList = data.list
						this.myTeamListTotalCount = data.totalCount
					}
				})
			},
			getAvatarUrl(url){
				if(typeof url === 'string' && url.startsWith('file/')){
					return `http://static.jxnewlife.com/${url}`
				}
				return url
			},
      getList() {
        //查询列表
        //if (!this.hasPerm('member:list')) {
        // return
        //}
        this.listLoading = true;
        this.api({
          url: "/member/listMember",
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
			 handleMyTeamPageCurrentChange(val) {
        //改变页码
        this.myTeamListQuery.pageNum = val
        this.getMyTeamList();
      },
			 handleMyFansPageCurrentChange(val) {
        //改变页码
        this.myFanstListQuery.pageNum = val
        this.getMyFansList();
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
					//  this.tempModel.memberID = "";
					 this.tempModel.loginID = "";
					 this.tempModel.mobile = "";
					 this.tempModel.email = "";
					 this.tempModel.password = "";
					 this.tempModel.memberName = "";
					 this.tempModel.nickName = "";
					 this.tempModel.avatar = "";
					 this.tempModel.sex = 0;
					 this.tempModel.birthday = "";
					 this.tempModel.telphone = "";
					 this.tempModel.memberStatus = 0;
					 this.tempModel.status = 0;
					 this.tempModel.createTime = "";
					 this.tempModel.createUser = "";
					 this.tempModel.modifyTime = "";
					 this.tempModel.modifyUser = "";
					 this.tempModel.memberSource = "";
					 this.tempModel.introducer = "";
					 this.tempModel.pID = "";
					 this.tempModel.saleQrCode = "";
					 this.tempModel.isFirst = "";
					 this.tempModel.isAgent = "";
					 this.tempModel.agentTime = "";
					 this.tempModel.accountMoney = "";
					 this.tempModel.lockMoney = "";
					 this.tempModel.agentMoney = "";
					 this.tempModel.totalAgentMoney = "";
					 this.tempModel.lockAgentMoney = "";
           

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
          url: "/member/getMember",
          method: "post",
          data: {memberID:this.list[$index].memberID}
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
              url: "/member/addMember",
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
              url: "/member/updateMember",
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
            url: "/member/deleteMember",
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

<style>
	.table-item-img {
		width: 50px;
	}
</style>
