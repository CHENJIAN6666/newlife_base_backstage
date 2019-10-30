 <template>
  <el-container style="height: 800px; border: 1px solid #eee">
  <el-aside width="400px" >
    <div class="custom-tree-container">
  <div class="block">
     <el-input  size="mini"
  placeholder="输入关键字进行过滤"
  v-model="filterText" style="margin-top:10px" >
</el-input>
    <el-tree class="filter-tree" :data="list" show-checkbox 
      node-key="id" default-expand-all :expand-on-click-node="false"
      :render-content="renderContent" :filter-node-method="filterNode"
      ref="tree2">
      
    </el-tree>
    
  </div>
  
</div>
  </el-aside> 
  
  <el-container>
    <el-main>
      <el-form class="small-space" :model="tempModel" label-position="left" label-width="100px"  size="mini"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="上级分类名称" >
          <el-input type="text" :disabled="true" v-model="tempModel.parentClassifyName">
          </el-input>
        </el-form-item>
        <el-form-item label="分类编码" >
          <el-input type="text" v-model="tempModel.classifyCode" >
          </el-input>
        </el-form-item>
        <el-form-item label="分类名称" >
          <el-input type="text" v-model="tempModel.classifyName" >
          </el-input>
        </el-form-item>
        <el-form-item label="顺序" >
          <el-input type="text" v-model="tempModel.orderNumber" >
          </el-input>
        </el-form-item>
         <el-button  type="primary" icon="plus"  @click="save(status)"  size="mini">保存
          </el-button>
      </el-form>
    </el-main>
  </el-container>
</el-container>

</template>


<script>
 
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
      tempModel: {
        feedbackClassifyID:0,
        parentClassifyName:"",
        parentClassifyID:"",
        classifyName: "",
        classifyCode : "",
        classifyIDTreePath:"",
        orderNumber: 0
      } 
    }
  },
  created() {
    this.getList();
  },

  methods: {
    tempModelInit(){
      this.tempModel.feedbackClassifyID = 0
      this.tempModel.parentClassifyName=""
      this.tempModel.parentClassifyID=""
      this.tempModel.classifyName=""
      this.tempModel.classifyCode = ""
      this.tempModel.classifyIDTreePath=""
      this.tempModel.orderNumber= 0
    
    },
    append(data) {
      this.showCreate(data);
    },

    remove(node, data) {
      this.delete(data);
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
        url: "/feedbackClassify/listFeedbackClassify",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        if(data.totalCount>0){
          this.list = data.list;
        }
      });
    },
    createFeedbackClassify(){
     
      this.api({
        url:"/feedbackClassify/addFeedbackClassify",
        method:"post",
        data:this.tempModel
      }).then(result=>{
        let msg = "添加成功";

          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
             
            }
          })
         this.tempModelInit()
          this.getList();
        
      })
    },
    updateFeedbackClassify(){

      this.api({
        url:"/feedbackClassify/updateFeedbackClassify",
        method:"post",
        data:this.tempModel
      }).then(result=>{
        this.tempModelInit()
        this.getList()
        status = "create"

        let msg = "更新成功";
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
            }
          })
          
      })
    },
    showCreate(data) {
       this.status = "create"
       this.tempModel.classifyName = "";
       this.tempModel.classifyCode = "";
       this.tempModel.orderNumber = 0;
       this.tempModel.parentClassifyName  = data.label;
       this.tempModel.parentClassifyID = data.id;
    },
    showEdit(data){
      if(data.pid != null){
         let temp = this.getParent(data.pid);
       
       if(temp != null && temp !=""){
         this.tempModel.parentClassifyName = temp.label;
       }
      }
      
      this.status = "update";
      this.tempModel.classifyName = data.label;
      this.tempModel.orderNumber = data.nodeData.orderNumber;
      this.tempModel.classifyCode = data.nodeData.classifyCode;
      this.tempModel.feedbackClassifyID = data.id;
      
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
          if(this.status == 'create'){
              this.createFeedbackClassify();
          }else{
              this.updateFeedbackClassify();
              this.status = "create"
          }
      },
      delete(data){
         this.$confirm("确定删除此数据?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: true,
        type: "warning"
      }).then(() => {
        this.tempModel.classifyIDTreePath = data.nodeData.classifyIDTreePath; 
        this.api({
        url:"/feedbackClassify/deleteFeedbackClassify",
        method:"post",
        data:this.tempModel
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
