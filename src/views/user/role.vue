<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form size="mini">
        <el-form-item>
          <el-button type="success" icon="plus" v-if="hasPerm('user:add')" @click="showCreate">添加角色
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table size="mini" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row stripe>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" prop="roleName" ></el-table-column>
      <!-- <el-table-column align="center" label="用户">
        <template slot-scope="scope">
          <div v-for="user in scope.row.users">
            <div v-text="user.nickname" style="display: inline-block;vertical-align: middle;"></div>
          </div>
        </template>
      </el-table-column>
     <el-table-column align="center" label="菜单&权限" width="420">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleName==adminName" type="success">全部</el-tag>
          <div v-else>
            <div v-for="menu in scope.row.menus" style="text-align: left">
              <span style="width: 100px;display: inline-block;text-align: right ">{{menu.menuName}}</span>
              <el-tag v-for="perm in menu.permissions" :key="perm.permissionName" v-text="perm.permissionName"
                      style="margin-right: 3px;"
                      type="primary"></el-tag>
            </div>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="管理" width="220" v-if="hasPerm('role:update') ||hasPerm('role:delete') ">
        <template slot-scope="scope">
          <div v-if="scope.row.roleName!='管理员'">
            <el-button size="mini" type="primary" icon="edit" @click="showUpdate(scope.$index)" v-if="hasPerm('role:update')">修改
            </el-button>
            <el-button size="mini" v-if=" scope.row.users && scope.row.users.length===0 && hasPerm('role:delete')" type="danger"
                       icon="delete"
                       @click="removeRole(scope.$index)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog 
      fullscreen
      :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form class="small-space" :model="tempRole" label-position="left" label-width="100px"
               style='width: 800px; margin-left:50px;'>
        <el-form-item label="角色名称" required>
          <el-input type="text" v-model="tempRole.roleName" style="width: 250px;">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单&权限" required>
  
        </el-form-item> 
         
  

          <div v-for=" (menu,_index) in allPermission" :key="menu.menuName">
            <span style="width: 140px;display: inline-block;" v-bind:style="{ 'margin-left': (menu.menuLevel * 10) +'px' }">
              <el-button :type="isMenuNone(_index)?'':(isMenuAll(_index)?'success':'primary')" size="mini"
                         style="width:120px;text-align:left"
                         @click="checkAll(_index,menu.menuId)">{{menu.menuName}}</el-button>
            </span>
            <div style="display: inline-block;margin-left:20px;">
               <div class="custom-tree-container">
               
              <el-checkbox-group v-model="tempRole.permissions">
                 <template>
                     <el-checkbox v-for="perm in menu.permissions" :label="perm.menuOperationId" @change="checkRequired(perm,_index)"
                             :key="perm.menuOperationId">
                  <span :class="{requiredPerm:perm.requiredPerm===1}">{{perm.permissionName}}</span>
                </el-checkbox>
                  
                </template>
               
              </el-checkbox-group>
            </div>
          </div>
          </div>
          <p style="color:#848484;">说明:红色权限为对应菜单内的必选权限</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createRole" size="mini">创 建</el-button>
        <el-button type="primary" v-else @click="updateRole" size="mini">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {asyncRouterMap} from '@/router/index'
export default {
  data() {
    return {
      list: [], //表格的数据
      menusList: [], //菜单的数据
      allPermission: [],
      listLoading: false, //数据加载等待动画
      dialogStatus: "create",
      dialogFormVisible: false,
      textMap: {
        update: "编辑",
        create: "新建角色"
      },
      tempRole: {
        roleName: "",
        roleId: "",
        menuId: "",
        permissions: []
      
      },
      adminName: "管理员"
    };
  },
  created() {
    this.getList();
    this.getMenus();
    this.getAllPermisson();
  },
  methods: {
    getAllPermisson() {
      //查询所有权限
      this.api({
        url: "/user/listAllPermission",
        method: "get"
      }).then(data => {
        let orderList = this.getRouterList()
        let list = []
        orderList.forEach((item)=>{
        //   // console.log(item);
          let finded = false
          data.list.forEach((item2)=>{
            // if(orderList.indexOf(item2.menuCode)){
            if(!finded && item == item2.menuCode){
              list.push(item2);
              finded = true;
            }
          })
        })
        // this.allPermission = data.list;
        this.allPermission = list;
      });
    },
    getRouterList(){
      let list = []
      let helper = function map2list(m){
        m.forEach((item)=>{
          if(item.menu){
            list.push(item.menu)
          }else if(item.path){
            let name = item.path
            name = name.substr(name.lastIndexOf('/')+1)
            if(name){
              list.push(name)
            }
          }
          if(item.children){
            map2list(item.children)
          }
        })
      }(asyncRouterMap)
      return list
    },
    getMenus() {
      //查询菜单列表
      this.listLoading = true;
      this.api({
        url: "/permission/listMenus",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.menusList = data.list;
      });
    },
    getList() {
      //查询列表
      this.listLoading = true;
      this.api({
        url: "/user/listRole",
        method: "get"
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
      });
    },
    getIndex($index) {
      //表格序号
      return $index + 1;
    },
    showCreate() {
      //显示新增对话框
      this.tempRole.roleName = "";
      this.tempRole.roleId = "";
      this.tempRole.permissions = [];
     
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    showUpdate($index) {
      let role = this.list[$index];
      this.tempRole.roleName = role.roleName;
      this.tempRole.roleId = role.roleId;
      this.tempRole.permissions = [];
   
      for (let i = 0; i < role.permissionIds.length; i++) {
        this.tempRole.permissions.push(role.permissionIds[i].menuOperationId);
      }
      
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    createRole() {
      if (!this.checkRoleNameUnique()) {
        return;
      }
      if (!this.checkPermissionNum()) {
        return;
      }
     
      //添加新角色
      this.api({
        url: "/user/addRole",
        method: "post",
        data: this.tempRole
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    updateRole() {
      if (!this.checkRoleNameUnique(this.tempRole.roleId)) {
        return;
      }
      if (!this.checkPermissionNum()) {
        return;
      }
      //修改角色
      this.api({
        url: "/user/updateRole",
        method: "post",
        data: this.tempRole
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    checkPermissionNum() {
      //校验至少有一种权限
      if (this.tempRole.permissions.length === 0) {
        this.$message.error("请至少选择一种权限");
        return false;
      }
      return true;
    },
    checkRoleNameUnique(roleId) {
      //校验名称重复
      let roleName = this.tempRole.roleName;
      if (!roleName) {
        this.$message.error("请填写角色名称");
        return false;
      }
      let roles = this.list;
      let result = true;
      for (let j = 0; j < roles.length; j++) {
        if (
          roles[j].roleName === roleName &&
          (!roleId || roles[j].roleId !== roleId)
        ) {
          this.$message.error("角色名称已存在");
          result = false;
          break;
        }
      }
      return result;
    },
    removeRole($index) {
      let _vue = this;
      this.$confirm("确定删除此角色?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
        let role = _vue.list[$index];
        _vue
          .api({
            url: "/user/deleteRole",
            method: "post",
            data: {
              permissionId: role.menus.permissionId,
              roleId: role.roleId 
            }
          })
          .then(() => {
            _vue.getList();
          })
          .catch(e => {});
      });
    },
    isMenuNone(_index) {
      //判断本级菜单内的权限是否一个都没选
      let menu = this.allPermission[_index].permissions;
      let result = true;
      for (let j = 0; j < menu.length; j++) {
        if (this.tempRole.permissions.indexOf(menu[j].id) > -1) {
          result = false;
          break;
        }
      }
      return result;
    },
    isMenuAll(_index) {
      //判断本级菜单内的权限是否全选了
      let menu = this.allPermission[_index].permissions;
      let result = true;
      for (let j = 0; j < menu.length; j++) {
        if (this.tempRole.permissions.indexOf(menu[j].menuOperationId) < 0) {
          result = false;
          break;
        }
      }
      return result;
    },
    checkAll(_index,menuId) {
      //点击菜单   相当于全选按钮
      let v = this;
      if (v.isMenuAll(_index)) {
        //如果已经全选了,则全部取消
        v.noPerm(_index);
      } else {
        //如果尚未全选,则全选
        v.allPerm(_index);
      }
    },
    allPerm(_index) {
      //全部选中
      let menu = this.allPermission[_index].permissions;
      for (let j = 0; j < menu.length; j++) {
        this.addUnique(menu[j].menuOperationId, this.tempRole.permissions);
      }
    },
    noPerm(_index) {
      //全部取消选中
      let menu = this.allPermission[_index].permissions;
      for (let j = 0; j < menu.length; j++) {
        let idIndex = this.tempRole.permissions.indexOf(menu[j].menuOperationId);
        if (idIndex > -1) {
          this.tempRole.permissions.splice(idIndex, 1);
         
        }
      }
    },
    addUnique(val, arr,menuId) {
      //数组内防重复地添加元素
      
      let _index = arr.indexOf(val);
   
      if (_index < 0) {
        arr.push(val);
      
      }
    },
    checkRequired(_perm, _index) {
      
      //本方法会在勾选状态改变之后触发
      let permId = _perm.menuOperationId;
     
      if (this.tempRole.permissions.indexOf(permId) > -1) {
     
        //选中事件
        //如果之前未勾选本权限,现在勾选完之后,tempRole里就会包含本id
        //那么就要将必选的权限勾上
        this.makeReuqiredPermissionChecked(_index);
      } else {
     
        //取消选中事件
        if (_perm.requiredPerm === 1) {
          //如果是必勾权限,就把本菜单的权限全部移出
          //(其实也可以提示用户本权限是菜单里的必选,请先取消勾选另外几个权限,交互太麻烦,此处就直接全部取消选中了)
          this.noPerm(_index);
        }
      }
    },
    makeReuqiredPermissionChecked(_index) {
      //将本菜单必选的权限勾上
      let menu = this.allPermission[_index].permissions;
      for (let j = 0; j < menu.length; j++) {
        let perm = menu[j];
       
        if (perm.requiredPerm === 1) {
          //找到本菜单的必选权限,将其勾上
       
          this.addUnique(perm.menuOperationId, this.tempRole.permissions);
          
        }
      }
    },
    renderContent(h, { node, data, store }) {
      return h("div", { node }, [h("span", node.label), h("", "aa")]);
    }
  }
};
</script>
<style scoped>
.requiredPerm {
  color: #ff0e13;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
