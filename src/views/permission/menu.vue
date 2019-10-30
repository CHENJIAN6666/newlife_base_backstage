<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="400px" >
      <div class="custom-tree-container">
        <div class="block">
          <el-input size="mini"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText" style="margin-top:10px" >
          </el-input>
          <el-tree
            class="filter-tree"
            :data="list"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
            :filter-node-method="filterNode"
            ref="tree2">

          </el-tree>

        </div>

      </div>
    </el-aside>

    <el-container>


      <el-main>
        <el-form class="small-space" :model="menu" label-position="left" label-width="100px" size="mini"
                 style='width: 500px; margin-left:50px;'>
          <el-form-item label="上级菜单">
            <el-input type="text" :disabled="true" v-model="menu.ParentMenuName"></el-input>
          </el-form-item>
          <el-form-item label="菜单编码" >
            <el-input type="text" v-model="menu.Menu_Code" >
            </el-input>
          </el-form-item>
          <el-form-item label="菜单名称" >
            <el-input type="text" v-model="menu.Menu_Name" >
            </el-input>
          </el-form-item>
          <el-form-item label="菜单全称" >
            <el-input type="text" v-model="menu.Menu_FullName">
            </el-input>
          </el-form-item>
          <el-form-item label="操作" >
            <el-checkbox-group v-model="menu.menuOpList">
              <el-checkbox v-for="item in menuOperationList"
                           :key="item.operationID" :label="item.operationID">
                {{item.operationName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-button size="mini" type="primary" icon="plus"  @click="save(status)">保存
          </el-button>

        </el-form>
      </el-main>
    </el-container>
  </el-container>

</template>


<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<script>
  import {asyncRouterMap} from '@/router/index'
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {
        status:"create",
        list: [],
        filterText: "",
        defaultProps: {
          children: "children",
          label: "label"
        },
        menu: {
          Menu_Id: "",
          Menu_Name: "",
          Menu_Code: "",
          Menu_FullName: "",
          Menu_Id_Tree_Path:"",
          Status:"",
          ParentMenuName:null,
          Parent_Menu_ID:null,
          menuOpList:[]
        },
        menuOperationList:[],
        menuOperationIDList:[]
      };
    },
    created() {
      this.getList();
    },

    methods: {
      //获取操作列表
      getMenuOperationList(){
        this.api({
          url: "/permission/listMenuOperations",
          method: "get"
        }).then(data => {
          this.menuOperationList = data;
          this.menuOperationIDList = data.map(item=>{return item.operationID})
        })
      },
      append(data) {
        this.showCreate(data);

      },

      remove(node, data) {
        this.delete(data);
        /* const parent = node.parent;
         const children = parent.data.children || parent.data;
         const index = children.findIndex(d => d.id === data.id);
         children.splice(index, 1);*/
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
        <span>
        <el-button
        size="medium"
        type="text"
        icon="el-icon-circle-plus-outline"
        on-click={() => this.append(data)}
      >

      </el-button>

        <el-button
        size="medium"
        type="text"
        icon="el-icon-edit"
        on-click={() => this.showEdit(data)}
      >

      </el-button>

        <el-button
        size="medium"
        type="text"
        icon="el-icon-circle-close"
        on-click={() => this.remove(node, data)}
      >

      </el-button>
        </span>
        </span>
      );
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },

      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/permission/listMenus",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
        });
        this.getMenuOperationList();
      },
      createmenu(){
        // let code = this.menu.Menu_Code;
        // let isExist = false;
        // let that = this;
        // let helper = function isExistMenuCode(list){
        //    list.forEach(item=>{
        //       if(item.nodeData.menuCode == code){
        //         isExist = true;
        //          that.$message({
        //           message: code+'已经存在。',
        //           type: 'error',
        //           duration: 1 * 1000,
        //           onClose: () => {
        //             that.menu.Menu_Name = "";
        //             that.menu.Menu_FullName = "";
        //           }
        //         })
        //       }
        //     if(item.children) isExistMenuCode(item.children)
        //   })
        // }
        // helper(this.list)

        // if(isExist) return;

        this.api({
          url:"/permission/addMenu",
          method:"post",
          data:this.menu
        }).then(result=>{
          let msg = "添加成功";

          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.menu.Menu_Id = "";
              this.menu.Menu_Name = "";
              this.menu.Menu_Code = "";
              this.menu.Menu_FullName = "";
              this.menu.menuOpList = this.menuOperationIDList.slice();;
              this.getList();
            }
          })


        })
      },
      updatemenu(){
        this.api({
          url:"/permission/updateMenu",
          method:"post",
          data:this.menu
        }).then(result=>{
          let msg = "更新成功";

          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.menu.Menu_Id = "";
              this.menu.Menu_Name = "";
              this.menu.Menu_Code = "";
              this.menu.Menu_FullName = "";
              this.menu.menuOpList = [];
              this.getList();
            }
          })


        })
      },
      showCreate(data) {
        this.status = "create";
        this.menu.Menu_Id = "";
        this.menu.Menu_Name = "";
        this.menu.Menu_Code = "";
        this.menu.Menu_FullName = "";
        this.menu.ParentMenuName = data.label;
        this.menu.Parent_Menu_ID = data.id;
        this.menu.menuOpList = this.menuOperationIDList.slice();
      },
      showEdit(data){
        this.status = "update";
        this.menu.ParentMenuName = "";
        if(data.pid != null){
          let temp = this.getParent(data.pid);

          if(temp != null && temp !=""){
            this.menu.ParentMenuName = temp.label;
          }
        }

        this.menu.Menu_Name = data.label;
        this.menu.Menu_Code = data.nodeData.menuCode;
        this.menu.Menu_FullName = data.nodeData.menuFullName;
        this.menu.Menu_Id = data.id;

        if(data.nodeData.operations){
          this.menu.menuOpList =  data.nodeData.operations.map((item)=>{
            if(item.operationId)
              return item.operationId
          })
        }else{
          this.menu.menuOpList = []
        }


      },
      getParent(id){
        // 广度优先遍历
        // data 就是ElementUI的Tree组件里那个data
        let node = JSON.parse(JSON.stringify(this.list));
        let ok = false;
        let result ;// 包含你说的那个子节点的父节点
        while (!ok) {
          let item = node.shift();
          if (item.id == id) {
            result = item;
            ok = true;
            return result;
          } else if (item.children && item.children.length > 0) {
            node = node.concat(item.children);
          }
        }

      },
      save(type){

        if(type=='create'){
          this.createmenu();
        }else{
          this.updatemenu();
        }
      },
      delete(data){
        this.$confirm("确定删除此数据?", "提示", {
          confirmButtonText: "确定",
          showCancelButton: true,
          type: "warning"
        }).then(() => {

          this.menu.Menu_ID_Tree_Path = data.nodeData.menuIdTreePath;
          this.menu.Status = 1;
          this.api({
            url:"/permission/deleteMenu",
            method:"post",
            data:this.menu
          }).then(result=>{
            let msg = "删除成功";

            this.$message({
              message: msg,
              type: 'success',
              duration: 1 * 1000,
              onClose: () => {

                this.getList();
              }
            })


          })
        });

      }
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

<style>
  .el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
