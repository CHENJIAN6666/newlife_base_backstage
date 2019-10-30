<template id="orgSelect">
    <div>
        <el-input type="text" :value="value==null?'':value+''"  @focus="outVisible = true"  ></el-input>
        <el-input type="text" :value="orgName"  @focus="outVisible = true">
        </el-input>

            <el-dialog
                title="组织机构" 
                :visible.sync="outVisible"
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

    </div>

</template>

<script>
    export default {
          watch: {
                filterText(val) {
                this.$refs.tree2.filter(val);
                },
                userList(val){
                    this.tempUserList =val;
                },
                tempUserList(val){
              
                     this.$emit("on-result-change",val);
                }
            },
        data:function(){
            return {
                outVisible:false,
                orgList: [], //组织数据
                filterText: "",
                orgName:"",
                tempUserList :this.userList,
                test:[]
            }
        },
        tempOrgID:'',
        tempUserList:[],
        props:['value','userList'],
         created(){
                    this.api({
                        url: "/organizations/listOrganizations",
                        method: "get"
                    }).then(data => {
                        this.listLoading = false;
                        this.orgList = data.list;
                    }); 

                   

                },
        methods:{
            change: function(val) {
                this.$emit('input', val);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            selectOutOrg(val1,val2,val3){ 
                 
                    this.$emit('input', val2.label);
                     this.$emit('listenEvent', val2);
               

                    this.orgName = val2.label;
                    // console.log(this.tempOrgID);
                    // this.tempOrgID = val2.data.id;
                       this.api({
                        url: "/user/list",
                        method: "get",
                        params: {'listQueryOrgID':val2.data.id}
                        }).then(data => {
                         this.tempUserList = data.list;
                        console.log(data.list);
                        console.log(this.tempUserList);
                        });
                    this.outVisible = false;
              
            }
        },
        mounted(){
        },
        computed: {
        }
    }
</script>