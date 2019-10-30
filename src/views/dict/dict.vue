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
  

    
    
    <el-main>
      <div v-if="showStatus=='dictData'">
          <div class="filter-container">
      <el-form size="mini">
         <el-form-item label="所属分类">
          <el-input type="text" :disabled="true" v-model="dictData.dictTypeName"  style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
        
          <el-button size="mini" type="primary" icon="plus" v-if="hasPerm('user:add')" @click="showDictDataCreate">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
           <el-table :data="dictDataList" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row stripe>
               <el-table-column align="center" label="序号" width="80">
                  <template slot-scope="scope">
                     <span v-text="scope.$index+1"> </span>
               </template>
           </el-table-column>  
            <el-table-column align="center" label="数据编码" prop="dictDataCode" width="150"></el-table-column>
            <el-table-column align="center" label="数据文本" prop="dictDataText" width="150"></el-table-column>
            <el-table-column align="center" label="管理" width="220" v-if="hasPerm('user:update')">
            <template slot-scope="scope">
           <el-button type="primary" size="mini" icon="edit" @click="showDictDataUpdate(scope.$index)">修改</el-button>
            <el-button type="danger" size="mini" icon="delete" 
                     @click="removeDictData(scope.$index)">删除
           </el-button>
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
      </div>
      
      <el-form size="mini" v-if="showStatus=='dictType'"  class="small-space" :model="dictType" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'  >
        <el-form-item label="上级分类">
          <el-input type="text" :disabled="true" v-model="dictType.parentDictTypeName"></el-input>
        </el-form-item>
        <el-form-item label="分类编码" >
          <el-input type="text" v-model="dictType.dictTypeCode" >
          </el-input>
        </el-form-item>
        <el-form-item label="分类名称" >
          <el-input type="text" v-model="dictType.dictTypeText" > 
          </el-input>
        </el-form-item>
       
      
         <el-button size="mini"  type="primary" icon="plus"  @click="save(status)">保存
          </el-button>
         
      </el-form>
    </el-main>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
       <el-form size="mini" class="small-space" :model="dictData" label-position="left" label-width="80px"
               style='width: 300px; margin-left:50px;' >
            <el-form-item label="数据编码" required>
             <el-input type="text" v-model="dictData.dictDataCode"  @focus="innerVisible = true">
          </el-input>
            </el-form-item>
            <el-form-item label="数据文本" required>
             <el-input type="text" v-model="dictData.dictDataText"  @focus="innerVisible = true">
          </el-input>
        </el-form-item>
         <el-form-item label="顺序" >
          <el-input type="text" v-model="dictData.orderNumber" > 
          </el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createDictData" size="mini">创 建</el-button>
        <el-button type="primary" v-else @click="updateDictData" size="mini">修 改</el-button>
      </div>
    </el-dialog>
  
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
       textMap: {
        update: "编辑",
        create: "新建数据"
      },
      dialogFormVisible: false,
      dialogStatus: "create",
      showStatus:'dictType',
      status:"create",
      list: [],
      dictDataList:[],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      dictType: {
        dictTypeId: "",
        dictTypeText: "",
        dictTypeCode: "",
        dictTypeIdTreePath:"",
        status:"",
        parentDictTypeName:null,
        parentDictTypeId:null
       
      },
      dictData:{
        dictDataId:"",
        dictTypeCode:"",
        dictTypeName:"",
        dictDataCode:"",
        dictDataText:"",
        orderNumber:0
      },
      listQuery: {
        pageNum: 1, //页码
        pageRow: 50, //每页条数
        dictTypeCode:""
      },
      totalCount: 0, //分页组件--数据总条数
    };
  },
  created() {
    this.getList();
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

             <el-button
              size="mini"
              type="text"
              on-click={() => this.getDictDataList(data)}
            >
              项目
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
        url: "/dict/listDictTypes",
        method: "get",
        params: this.listQuery
      }).then(data => {
        this.listLoading = false;
        this.list = data.list;
      });
    },
    getDictDataList(data){
      if(data != null){
          this.dictData.dictTypeName = data.label;
          this.dictData.dictTypeCode = data.nodeData.dictTypeCode;
          this.listQuery.dictTypeCode = data.nodeData.dictTypeCode;
      }
    
      this.showStatus = "dictData";
      this.listLoading = true;
      this.api({
        url:"dict/listDictDatas",
        method:"get",
        params:this.listQuery
      }).then(data =>{
        this.listLoading = false;
        this.dictDataList = data.list;
         this.totalCount = data.totalCount;
      }

      );
    },
    createdictType(){
     
      this.api({
        url:"/dict/addDictType",
        method:"post",
        data:this.dictType
      }).then(result=>{
        let msg = "添加成功";
        
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.dictType.dictTypeId = "";
              this.dictType.dictTypeText = "";
              this.dictType.dictTypeCode = "";
              this.getList();
            }
          })

        
      })
    },
    updatedictType(){
       this.api({
        url:"/dict/updateDictType",
        method:"post",
        data:this.dictType
      }).then(result=>{
        let msg = "更新成功";
        
          this.$message({
            message: msg,
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.dictType.dictTypeId = "";
              this.dictType.dictTypeText = "";
              this.dictType.dictTypeCode = "";
              this.getList();
            }
          })

        
      })
    },
    showDictDataCreate(){
      this.dictData.dictDataCode = "",
      this.dictData.dictDataText = "",
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
     showCreate(data) {
         this.showStatus = "dictType";
         this.status = "create";
         this.dictType.dictTypeId = "";
         this.dictType.dictTypeText = "";
         this.dictType.dictTypeCode = "";
         this.dictType.parentDictTypeName = data.label;
         this.dictType.parentDictTypeId = data.id;
       
      },
      showEdit(data){
        this.showStatus = "dictType";
           this.dictType.parentDictTypeName  = null;
          if(data.pid != null && data.pid !=''){
              var result = this.getParent(data);
              if(result != undefined){
                  this.dictType.parentDictTypeName =result.label;
              }
              
          }

          this.status = "update";
          
          this.dictType.parentDictTypeId = null;
          this.dictType.dictTypeText = data.label;
          this.dictType.dictTypeCode = data.nodeData.dictTypeCode;
          this.dictType.dictTypeId = data.id;
           

      },//获取父节点
      getParent(data){
        let temp = data;
        var  obj=JSON.parse(JSON.stringify(this.list));
        let node = obj;
        let ok = false;
        let result; // 包含你说的那个子节点的父节点
        while (!ok) {
            let item = node.shift();
            if(item != null){
                  if (item.id == temp.pid) {
                result = item;
                ok = true;
            } else if (item.children && item.children.length > 0) {
                node = node.concat(item.children);
            }
            }else{
                ok = true;
            }
          
        }
      return result;
       
    }
      ,
      save(type){
          
          if(type=='create'){
              this.createdictType();
          }else{
              this.updatedictType();
          }
      },
      delete(data){
        this.$confirm("确定删除此数据?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: true,
        type: "warning"
      }).then(() => {
         this.dictType.dictTypeIdTreePath = data.nodeData.dictTypeIdTreePath;
        this.dictType.status = 1;
        this.api({
        url:"/dict/deleteDictType",
        method:"post",
        data:this.dictType
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
       
      },
    handleSizeChange(val) {
      //改变每页数量
      this.listQuery.pageRow = val;
      this.handleFilter();
    },
    handleCurrentChange(val) {
      //改变页码
      this.listQuery.pageNum = val;
     
    },
    createDictData() {
      //添加数据
      this.api({
        url: "/dict/addDictData",
        method: "post",
        data: this.dictData
      }).then(() => {
        this.getDictDataList(null);
        this.dialogFormVisible = false;
      });
    },
    showDictDataUpdate($index){
      

      let temp = this.dictDataList[$index];
      this.api({
        url: "/dict/queryDictData",
        method: "get",
        params: {'dictDataID': temp.dictDataId}
      }).then(data => {
          this.dictData = data;
       this.dialogStatus = "update";
      this.dialogFormVisible = true;
      });
      
    },
    updateDictData(){
       //修改数据信息
      let _vue = this;
      this.api({
        url: "/dict/updateDictData",
        method: "post",
        data: this.dictData
      }).then(() => {
        let msg = "修改成功";
        this.dialogFormVisible = false;
      
        this.$message({
          message: msg,
          type: "success",
          duration: 1 * 1000,
          onClose: () => {
            _vue.getDictDataList();
          }
        });
      });
    },
    removeDictData($index) {
     
      let _vue = this;
      
      this.$confirm("确定删除此数据?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning"
      }).then(() => {
         console.log( _vue.dictDataList);
        let del = _vue.dictDataList[$index];
       
        _vue
          .api({
            url: "/dict/deleteDictData",
            method: "post",
            data: del
          })
          .then(() => {
            _vue.getDictDataList(null);
          })
          .catch(() => {
            _vue.$message.error("删除失败");
          });
      });
    },
    handleFilter() {
      //查询事件
      this.listQuery.pageNum = 1;
      this.getDictDataList(null);
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
 