<template id="orgSelect">
    <div>
        <!-- <el-input type="hidden" :value="value==null?'':value+''"  style="display:none"></el-input> -->
        <el-input :disabled="disabled" :style="inputStyle" :clearable="!disabled" @clear="clearHandle" type="text" :value="orgName" @focus="outVisible = true"  :validateEvent="false" ></el-input>
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
import eventBus from '@/utils/eventBus';
// import elinput from '@/components/element-ui/input';
import ElInput from '@/components/element-ui/input';

    export default {
        components:{
            "el-input":ElInput
        },
          watch: {
              filterText(val) {
                  this.$refs.tree2.filter(val);
                },
                value:{
                immediate:true,
                handler:function(newval,oldval){
                    if(newval!=''&&newval!==oldval)
                        {
                            this.api({
                                url: "/organizations/getOrganizations",
                                method: "get",
                                params: {'orgID':newval}
                                }).then(data => {
                                this.orgName = data.orgName;
                                eventBus.$emit("loadUserList",newval,this.groupName)

                                });
                        }else{
                            this.orgName="";
                            eventBus.$emit("loadUserList",'',this.groupName)

                        }
                  }
                }

            },
        data:function(){
            return {
                outVisible:false,
                orgList: [], //组织数据
                filterText: "",
                orgName:'',
            }
        },
        tempValue:'',
        tempOrgID:'',
        props:['value','groupName','disabled','inputStyle'],
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
                 
                    this.$emit('input', val2.data.id);
                    let path = val2.data.nodeData.orgIdTreePath
                    let length = path.length
                    let orgIdTreePath = path.substring(1,length-1).split('.')
                    // console.log(orgIdTreePath);
                    this.$emit('orgIdPath', orgIdTreePath);
                    this.orgName = val2.label;
                    eventBus.$emit("loadUserList",val2.data.id,this.groupName)
                    this.outVisible = false;
              
            },
            clearHandle(){
                // console.log("4444444444");
                this.$emit('input', '');
            }
        },
        mounted(){
        },
        computed: {

        }
    }
</script>