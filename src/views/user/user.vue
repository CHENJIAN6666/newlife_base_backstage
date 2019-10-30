<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form size="mini" :inline="true"  class="demo-form-inline">
         <el-row > 
        <el-col :span="22">
        	<el-form-item label="用户名">
				<el-input v-model="listQuery.username" placeholder="用户名"></el-input>
			</el-form-item>
      	<el-form-item label="手机号码">
				<el-input v-model="listQuery.mobile" placeholder="手机号码"></el-input>
			</el-form-item>
       <el-form-item label="组织" > 
             <el-input type="text" v-model="listQuery.orgName"  @focus="outVisible = true">
          </el-input>
        </el-form-item>
      </el-col>
		<el-col :span="2"  class="text-right" >
                      <el-button size="mini" type="primary" @click="commonUtil.queryPrepare(listQuery);getList()">查询</el-button>
        </el-col>
         </el-row>
      </el-form>
       <el-row type="flex" justify="end" style="padding-bottom: 5px;">
          <el-button size="mini" type="primary" icon="plus" @click="showCreate" v-if="hasPerm('user:add')">添加
          </el-button>
    </el-row>
    </div>
    <el-table size="mini" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row stripe>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="realName" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="昵称" prop="nickname" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="用户名" prop="username" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="组织" prop="Org_Name" fit></el-table-column>
      <!-- <el-table-column align="center" label="行销管理员" prop="isCellManage" width="110" :formatter="formatIsCellManage"></el-table-column> -->
      <!-- <el-table-column align="center" label="行销区域" min-width="80" filter-placement="bottom-end">
        <template slot-scope="scope">
          <span v-for="item in scope.row.userAreaList">{{item.name}}、</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="创建时间" prop="createTime" width="170"></el-table-column>
      <el-table-column align="center" label="最近修改时间" prop="updateTime" width="170"></el-table-column>
      <el-table-column align="center" label="管理" fixed="right" width="350" v-if="hasPerm('user:update')">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button size="mini" type="primary" icon="edit" :disabled="scope.row.userStatus == '1'" @click="showDisableUser(scope.$index)">禁用</el-button>
          <el-button size="mini" type="danger" icon="delete" v-if="scope.row.userId!=userId "
                     @click="removeUser(scope.$index)">删除
          </el-button>
          <!-- <el-button size="mini" type="success" @click="cellConfig(scope.$index)" >行销区域</el-button> -->
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
  
      <el-dialog title="组织机构" :visible.sync="outVisible" append-to-body>
        <div class="custom-tree-container">
          <div class="block">
           <el-input
               placeholder="输入关键字进行过滤"
               v-model="filterText" style="margin-top:10px" >
           </el-input>
            <el-tree
              class="filter-tree"
              :data="orgList"
              @node-click="selectOutOrg"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree2">
              
            </el-tree>
           </div>
          </div>
        </el-dialog>

        <el-dialog title="行销区域" :visible.sync="cellVisible" append-to-body>
        <div class="custom-tree-container">
          <div class="block">
           <el-input
               placeholder="输入关键字进行过滤"
               v-model="filterText" style="margin-top:10px" >
           </el-input>
            <el-tree
              class="filter-tree"
              :data="cellAllList"
              node-key="id"
              :show-checkbox="true"
              default-expand-all
              :default-checked-keys="cellList"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="cellTree">
              
            </el-tree>
           </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cellVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="updateUserAreaList" size="mini">修 改</el-button>
          </div>
        </el-dialog>
    
    <el-dialog fullscreen :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

       <el-dialog
      title="组织机构"
      :visible.sync="innerVisible"
      append-to-body>

      <div class="custom-tree-container">
          <div class="block">
           <el-input
               placeholder="输入关键字进行过滤"
               v-model="filterText" style="margin-top:10px" >
           </el-input>

    <el-tree
      class="filter-tree"
      :data="orgList"
      @node-click="selectOrg"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      
      :filter-node-method="filterNode"
      ref="tree2">
      
    </el-tree>
    
  </div>
</div>

      </el-dialog>
 
      <el-form  size="mini" class="small-space" :model="tempUser" :rules="rules" ref="tempUser" status-icon label-position="left" label-width="80px"
               style=' margin-left:50px;'>
        <el-col :span="12">
        <el-form-item label="组织" required prop="orgName">
             <el-input type="text" v-model="tempUser.orgName"  @focus="innerVisible = true">
          </el-input>
        </el-form-item>
        <el-form-item label="用户名" required v-if="dialogStatus=='create'" prop="username" >
          <el-input type="text" v-model="tempUser.username" >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="dialogStatus=='create'" required prop="password">
          <el-input type="password" v-model="tempUser.password">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" v-else>
          <el-input type="password" v-model="tempUser.password" placeholder="不填则表示不修改">
          </el-input>
        </el-form-item>
         <el-form-item label="真实姓名" required prop="realName">
          <el-input type="text" v-model="tempUser.realName">
          </el-input>
        </el-form-item>
        <el-form-item label="角色" required prop="roleIdList">
          <el-select  v-model="tempUser.roleIdList" multiple   placeholder="请选择"   >
            <el-option 
              v-for="item in roles" 
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" required prop="nickname">
          <el-input type="text" v-model="tempUser.nickname">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码"  prop="mobile">
          <el-input type="text" v-model="tempUser.mobile">
          </el-input>
        </el-form-item>
        <el-form-item label="性别">
            <el-radio v-model="tempUser.sex" :label="1">男</el-radio>
            <el-radio v-model="tempUser.sex" :label="0">女</el-radio>
        </el-form-item>

        <!-- <el-form-item label="是否行销管理员"  >
            <el-radio v-model="tempUser.isCellManage" :label="1">是</el-radio>
            <el-radio v-model="tempUser.isCellManage" :label="0">否</el-radio>
        </el-form-item> -->

        </el-col>
        <el-col :span="11" style="margin-left:20px">
           
       
        <el-form-item label="用户头像" >
          <newLifeUploadImg :uploadPicData="uploadPicData"
                                  v-model="tempUser.avatar"></newLifeUploadImg>
         
        </el-form-item>
       <el-form-item label="电子邮件" >
          <el-input type="text" v-model="tempUser.email">
          </el-input>
        </el-form-item>
        <el-form-item label="生日" >
          
           <el-date-picker  v-model="tempUser.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
           </el-date-picker>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="tempUser.telphone">
          </el-input>
        </el-form-item>
        <el-form-item label="QQ" >
          <el-input type="text" v-model="tempUser.qq">
          </el-input>
        </el-form-item> 
        <el-form-item label="微信" >
          <el-input type="text" v-model="tempUser.wx">
          </el-input>
        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createUser" size="mini">创 建</el-button>
        <el-button type="primary" v-else @click="updateUser" size="mini">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
   watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  data() {
       var validateUser = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
           //判断用户是否存在
            this.api({
              url: "/user/isExistUser",
              method: "post",
              data: this.tempUser
            }).then(data=> {
                if(data === 1){
                    callback(new Error('用户已存在'));
                }else{
                    callback();
                }
                
            });
            
        }
      }
    return {
      uploadPicData:{'category':'user'},
      rules:{
        orgName:[{required:true,message:'请选择组织',trigger:'blur'}],
        username:[{validator: validateUser,trigger:'blur'}],
        password:[{required:true,message:'密码',trigger:'blur'}],
        roleIdList:[{required:true,message:'角色',trigger:'blur'}],
        nickname:[{required:true,message:'昵称',trigger:'blur'}],
        realName:[{required:true,message:'真实姓名',trigger:'blur'}],
        mobile:[{required:true,message:'手机号码',trigger:'blur'}]

      },
      filterText: "",
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      orgList: [], //组织数据
      cellAllList:[],
      cellList:[],
      listLoading: false, //数据加载等待动画
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10 ,//每页条数
        username:'',
        mobile:'',
        listQueryOrgID:'',
        orgName:''
      },
      roles: [], //角色列表
      dialogStatus: "create",
      dialogFormVisible: false,
      innerVisible:false,
      outVisible:false,
      cellVisible:false,
      textMap: {
        update: "编辑",
        create: "新建用户"
      },
      tempUser: {
        orgId: '',
        orgName:"",
        username: "",
        password: "",
        nickname: "",
        roleIdList: [],
        roleNameList: [],
        userId: "",
        mobile: "",
        telphone: "",
        qq: "",
        wx: "",
        birthday: "",
        sex: 1, 
        avatar: "",
        email: "",
        realName:"",
        isCellManage:0
      },
      tempCell:{
        userID:''
      }
    };
  },
  created() {
    this.getList();
    this.getOrganizationList();
    // this.cellAllConfig();
  },
  computed: {
    ...mapGetters(["userId"])
  },
  methods: {
    getAllRoles() {
      this.api({
        url: "/user/getAllRoles",
        method: "get"
      }).then(data => {
        this.roles = data.list;
      });
    },
    getList() {
      //查询列表
      this.listLoading = true;
      this.api({
        url: "/user/list",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.totalCount;
      });
    },
    cellConfig($index){
      this.cellVisible = true
      let user = this.list[$index];
      this.api({
        url: "/userArea/getUserAreaList",
        method: "get",
        params: {"userID":user.userId}
      }).then(data => {
        if(data.length>0){
          this.cellList = data
        }else{
          this.cellList = []
        }
       this.$refs.cellTree.setCheckedKeys(data);
        this.tempCell.userID = user.userId
      })
    },
    cellAllConfig(){
      var that = this
      that.cityCode = "0760"
      this.api({
        url: "/area/getAreaListZS",
        method: "get",
        params: {"cityCode":that.cityCode}
      }).then(data => {
        this.cellAllList = data
      })
    },
    updateUserAreaList(){
      var list = this.$refs.cellTree.getCheckedNodes()
      this.api({
        url:"/userArea/updateUserAreaList",
        method:"post",
        data: {"userId":this.tempCell.userID,
                 "areaList":list
                }
      }).then(result=>{
        let msg = "修改成功";  
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.getList();
              this.cellVisible = false
            }
          })
      })
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
    handleFilter() {
      //查询事件
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getIndex($index) {
      //表格序号
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1;
    },
    showCreate() {
       this.getOrganizationList();
         if (this.hasPerm("user:add") || this.hasPerm("user:update")) {
      this.getAllRoles();
    }
      if (this.$refs['tempUser']!==undefined) {
          this.$refs['tempUser'].resetFields();
         
      }
      //显示新增对话框
      this.tempUser.orgId ='';
        this.tempUser.orgName = '';
        this.tempUser.username = '';
        this.tempUser.nickname = '';
        this.tempUser.roleIdList = [];
        this.tempUser.roleNameList = [];
        this.tempUser.userId = '';
        this.tempUser.mobile = '';
        this.tempUser.telphone ='';
        this.tempUser.qq = '';
        this.tempUser.wx = '';
        this.tempUser.birthday ='';
        this.tempUser.sex = 1;
        this.tempUser.avatar ='';
        this.tempUser.email = '';
        this.tempUser.deleteStatus = "0";
        this.tempUser.password = "";
   
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    showUpdate($index) {
       this.getOrganizationList();
         if (this.hasPerm("user:add") || this.hasPerm("user:update")) {
      this.getAllRoles();
    }
      //先清空
     if (this.$refs['tempUser']!==undefined) {
          this.$refs['tempUser'].resetFields();
        
      }

       let user = this.list[$index];
       this.api({
        url: "/user/getUser",
        method: "get",
        params: {"userId":user.userId}
      }).then(data => {
        this.tempUser = data;
        this.tempUser.deleteStatus = "0";
        this.tempUser.password = "";
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
      });
     
       
      
    },
    showDisableUser(index){
      this.$confirm('是否禁用该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api({
            url: "/user/disableUser",
            method: "post",
            data: {userId:this.list[index].userId}
          }).then(data => {
            this.list[index].userStatus = 1
            this.$message({
              type: 'success',
              message: '禁用成功!'
            });
          })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          });          
        });
    },
    createUser() {
      this.$refs['tempUser'].validate((valid)=>{
        if(valid){
        
              //添加新用户
      this.api({
        url: "/user/addUser",
        method: "post",
        data: this.tempUser
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
      });
        }else{
          return false;
        }
      });
    
    },
    updateUser() {
       this.$refs['tempUser'].validate((valid)=>{
        if(valid){
            //修改用户信息
      let _vue = this;
      this.api({
        url: "/user/updateUser",
        method: "post",
        data: this.tempUser
      }).then(() => {
        let msg = "修改成功";
        this.dialogFormVisible = false;
        if (this.userId === this.tempUser.userId) {
          msg = "修改成功,部分信息重新登录后生效";
        }
        this.$message({
          message: msg,
          type: "success",
          duration: 1 * 1000,
          onClose: () => {
            _vue.getList();
          }
        });
      });
         }else{
          return false;
        } });
      
    },
    removeUser($index) {
      let _vue = this;
      this.$confirm("确定删除此用户?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: true,
        type: "warning"
      }).then(() => {
        let user = _vue.list[$index];

        user.deleteStatus = "1";
        _vue
          .api({
            url: "/user/deleteUser", 
            method: "post",
            data: user
          })
          .then(() => {
             let msg = "删除成功";
            _vue.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000
          });
             _vue.getList();
          })
          .catch(() => {
            _vue.$message.error("删除失败");
          });
      },() => {
        //取消
        });
    },
    checkRequired(_item, _index) {
      //本方法会在勾选状态改变之后触发
      let roleId = _item.roleId;
      if (this.tempUser.roleId.indexOf(roleId) > -1) {
        //选中事件
        this.makeReuqiredPermissionChecked(_index);
      } else {
        //取消选中事件
        this.noRole(_index);
      }
    },
    makeReuqiredPermissionChecked(_index) {
      //将本菜单必选的权限勾上
      let role = this.roles[_index];
      this.addUnique(role.roleId, this.tempUser.roleId);
    },
    addUnique(val, arr) {
      //数组内防重复地添加元素
      let _index = arr.indexOf(val);
      if (_index < 0) {
        arr.push(val);
      }
    },
    noRole(_index) {
      //全部取消选中
      let role = this.roles[_index];
      let idIndex = this.tempUser.roleId.indexOf(role.roleId);
      if (idIndex > -1) {
        this.tempUser.roleId.splice(idIndex, 1);
      }
    },
    getOrganizationList() {
      //查询列表
      this.listLoading = true;
      this.api({
        url: "/organizations/listOrganizations",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.orgList = data.list;
      });
    },
    handleChange(value) {
      console.log(value);
    },
    selectOrg(a,b,c){
      this.innerVisible = false;
      this.tempUser.orgId = a.id;
      this.tempUser.orgName = a.label;
      console.log(a.label,b,c);
    },
     selectOutOrg(a,b,c){
      this.outVisible = false;
      this.listQuery.listQueryOrgID = a.id;
      this.listQuery.orgName = a.label;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    renderContent(h, { node, data, store }) {
    return (
      <span class="custom-tree-node">
        <span>{node.label}</span>
        <span>
          <el-button
            size="mini"
            type="text"
            on-click={() => this.append(data)}
          >
            添加
          </el-button>

            <el-button
            size="mini"
            type="text"
            on-click={() => this.showEdit(data)}
          >
            修改
          </el-button>

          <el-button
            size="mini"
            type="text"
            on-click={() => this.remove(node, data)}
          >
            删除
          </el-button>
        </span>
      </span>
    );
  },
  formatIsCellManage: function(row, column, cellValue){
			  
    if(cellValue == null){
      return null;
    }
    var type = typeof(cellValue);
    var data = null;
    if(type == "number"){
      data = cellValue;
    }else if(type == "string"){
      data = parseInt(cellValue);
    }
    
    var arrValue = [ "否", "是" ];
    return arrValue.length > data && arrValue[data] != null ? arrValue[data] : null;
  }
  }
};
</script>
