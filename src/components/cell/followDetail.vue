<template>
    <div>
        <el-dialog
      :title="textImportMap[dialogImportStatus]" :visible.sync="showDialog" :show-close=false >
      		
      <el-table size="mini" :data="list"  
      v-loading.body="listLoading" element-loading-text="拼命加载中" 
      border  highlight-current-row >

       <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="scope.$index+1"> </span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="company" label="公司名称" width="180"></el-table-column>
      <el-table-column align="center" prop="realName" label="跟进人" width="80"></el-table-column>
      <el-table-column align="center" prop="nextVisitTime" label="下次跟进时间" width="140"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注" ></el-table-column>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        customerID: String ,
        showDialog: {
            type: Boolean,
            default: false
        }
    },
    watch: {
      customerID(){
        this.getList()
      }
    },
    data(){
        return{
              list:[],
              listLoading: false,//数据加载等待动画
            	textImportMap: {
                import: '跟进详情'
                },
              dialogImportStatus:'import',
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

                }
        }
    },
    methods: {
      closeDialog(){
        this.$emit('closeDialog',null)
      },
      getList(){
            this.listLoading = true;
            this.api({
              url: "/follow/listFollowCustomer",
              method: "get",
              params: {"customerID":this.customerID}
            }).then(data => {
              this.listLoading = false;
              console.log(data)
              this.list = data;
            })
      }
    },
    created() {
      this.getList();
    }
}
</script>
