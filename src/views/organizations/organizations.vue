 <template>
  <el-container style="height: 800px; border: 1px solid #eee">
  <el-aside width="400px" >
    <div class="custom-tree-container">
  <div class="block">
     <el-input  size="mini"
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
      <el-form class="small-space" :model="organization" label-position="left" label-width="100px"  size="mini"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="上级组织机构">
          <el-input type="text" :disabled="true" v-model="organization.ParentOrgName"></el-input>
        </el-form-item>
        <el-form-item label="组织机构编码" >
          <el-input type="text" v-model="organization.Org_Code" >
          </el-input>
        </el-form-item>
        <el-form-item label="组织机构名称" >
          <el-input type="text" v-model="organization.Org_Name" >
          </el-input>
        </el-form-item>
        <el-form-item label="组织机构全称" >
          <el-input type="text" v-model="organization.Org_FullName">
          </el-input>
        </el-form-item>

        <el-form-item label="组织Logo" >
          <!-- <el-input type="text" v-model="organization.Org_Logo"> -->
          <!-- </el-input> -->
          <newLifeUploadImg :uploadPicData="uploadPicData"
                                  v-model="organization.Org_Logo"></newLifeUploadImg>
        </el-form-item>
        <el-form-item label="经度" >
          <el-input type="text" v-model="organization.Longitude">
          </el-input>
        </el-form-item>
        <el-form-item label="纬度" >
          <el-input type="text" v-model="organization.Latitude">
          </el-input>
        </el-form-item>
        <el-form-item label="地址" >
          <el-input type="text" v-model="organization.Address">
          </el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="organization.Telephone">
          </el-input>
        </el-form-item>
        <el-form-item label="电话(售后)">
          <el-input type="text" v-model="organization.telephoneAfterSale">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="status === 'update'" 
            @click="createQRCode()" type="success">
            创建二维码</el-button>
        </el-form-item>

        <el-form-item v-if="hasLogo">
          <img :src="organization.Org_QRCode"/>
        </el-form-item>

        <el-row v-if="hasLogo">
          <el-col :span="12">
           <el-button size="mini" @click="downloadQRCode(1280)" type="success">
            下载二维码(1280)
          </el-button>
          </el-col>
          <el-col :span="12">
          <el-button size="mini" @click="downloadQRCode(430)" type="success">
            下载二维码(430)
          </el-button>
          </el-col>
        </el-row>

      
         <el-button :disabled="organization.Org_Id == this.$store.state.user.userOrgId"  type="primary" icon="plus"  @click="save(status)"  size="mini">保存
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
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item)
      }
    }
  };
</script>

<script>
let id = 1000;

export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  data() {
    const data = [
      {
        id: 1,
        label: "一级 1"
      }
    ];
    return {
      uploadPicData:{'category':'org'},
      status:"create",
      list: [],
      filterText: "",
      data4: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: "children",
        label: "label"
      },
      organization: {
        Org_Id: "",
        Org_Name: "",
        Org_Code: "",
        Org_FullName: "",
        Org_ID_Tree_Path:"",
        Status:"",
        ParentOrgName:null,
        Parent_Org_ID:null,
        Org_Logo : '',
        Longitude : '',
        Latitude : '',
        Address : '',
        Telephone : '',
        Org_QRCode : '',
        telephoneAfterSale:'',
      }
    };
  },
  created() {
    this.getList();
  },
  computed:{
    hasLogo(){
      if(this.organization.Org_QRCode && this.organization.Org_QRCode.length>0){
        return true
      }
      return false
    }
  },
  methods: {
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
      //不允许修改和删除自己
      if(data.id == this.$store.state.user.userOrgId)
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

              <el-button disabled
                size="medium"
                type="text"
                icon="el-icon-circle-close-outline"
                on-click={() => this.remove(node, data)}
              >
              </el-button>
            </span>
          </span>
        );
      else
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
                icon="el-icon-circle-close-outline"
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
        url: "/organizations/listOrganizations",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
      });
    },
    createOrganization(){
     
      this.api({
        url:"/organizations/addOrganizations",
        method:"post",
        data:this.organization
      }).then(result=>{
        let msg = "添加成功";
        
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.organization.Org_Id = "";
              this.organization.Org_Name = "";
              this.organization.Org_Code = "";
              this.organization.Org_FullName = "";
              this.organization.Org_Logo = "";
              this.organization.Longitude = "";
              this.organization.Latitude = "";
              this.organization.Address = "";
              this.organization.Telephone = "";
              this.organization.telephoneAfterSale = ''
              this.getList();
            }
          })

        
      })
    },
    updateOrganization(){
       this.api({
        url:"/organizations/updateOrganizations",
        method:"post",
        data:this.organization
      }).then(result=>{
        let msg = "更新成功";
        
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.organization.Org_Id = "";
              this.organization.Org_Name = "";
              this.organization.Org_Code = "";
              this.organization.Org_FullName = "";
              this.organization.Org_Logo = "";
              this.organization.Longitude = "";
              this.organization.Latitude = "";
              this.organization.Address = "";
              this.organization.Telephone = "";
              this.organization.telephoneAfterSale = '';
              this.getList();
            }
          })

        
      })
    },
     showCreate(data) {
         this.status = "create";
         this.organization.Org_Id = "";
         this.organization.Org_Name = "";
         this.organization.Org_Code = "";
         this.organization.Org_FullName = "";
         this.organization.ParentOrgName  = data.label;
        this.organization.ParentOrgName = data.label;
         this.organization.Parent_Org_ID = data.id;
        this.organization.Org_Logo = "";
        this.organization.Longitude = "";
        this.organization.Latitude = "";
        this.organization.Address = "";
        this.organization.Telephone = "";
        this.organization.telephoneAfterSale = '';
        this.organization.Org_QRCode = '';
      },
      showEdit(data){
        let temp = null
        this.organization.ParentOrgName = "";
        if(data.pid != null){
           temp = this.getParent(data.pid);
         
         if(temp != null && temp !=""){
           this.organization.ParentOrgName = temp.label;
         }
        }
        
        this.status = "update";
        this.organization.Org_Name = data.label;
        this.organization.Org_Code = data.nodeData.orgCode;
        this.organization.Org_FullName = data.nodeData.orgFullName;
        this.organization.Org_Id = data.id;
        this.organization.Org_Logo = data.nodeData.orgLogo;
        this.organization.Longitude = data.nodeData.longitude;
        this.organization.Latitude = data.nodeData.latitude;
        this.organization.Address = data.nodeData.address;
        this.organization.Telephone = data.nodeData.telephone;
        this.organization.Org_QRCode = data.nodeData.orgQRCode;
        this.organization.telephoneAfterSale = data.nodeData.telephoneAfterSale;
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
          }else{
            ok = true;
          }
      }
     
      },
      createQRCode(){
        if(this.organization.Org_Id && this.organization.Org_Logo){
          this.api({
            url:"/organizations/createQRCode",
            method:"post",
            data:{Org_Id: this.organization.Org_Id,
                  Org_Logo:this.organization.Org_Logo}
          }).then(result=>{
            console.log(result)
              this.$message({
                message: "创建成功",
                type: 'success',
                duration: 1 * 1000,
                onClose: () => {
                  this.organization.Org_QRCode = result.orgQRCode
                }
              })
          })
        }else{
          this.$message({
                message: "没有Logo图片创建不了",
                type: 'warning',
                duration: 1 * 1000
              })
        }
      },
      downloadQRCode(size){
        if(this.organization.Org_Id && this.organization.Org_Logo){
          let url = `/api/organizations/downloadQRCode?Org_Id=${this.organization.Org_Id}&Org_Logo=${this.organization.Org_Logo}&Logo_Size=${size}`
          window.open(url)
          return
        }
        this.$message({
          message: "没有Logo图片创建不了",
          type: 'warning',
          duration: 1 * 1000
        })
      },
      save(type){
          
          if(type=='create'){
              this.createOrganization();
          }else{
              this.updateOrganization();
          }
      },
      delete(data){
         this.$confirm("确定删除此数据?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: true,
        type: "warning"
      }).then(() => {
           this.organization.Org_ID_Tree_Path = data.nodeData.orgIdTreePath; 
        this.organization.Status = 1;
        this.api({
        url:"/organizations/deleteOrganizations",
        method:"post",
        data:this.organization
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
 