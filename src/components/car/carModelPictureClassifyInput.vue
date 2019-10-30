<template id="CarModelPictureClassifyInput">
    <div>
        <el-input clearable @clear="clearHandle" type="text" :value="classifyName"  @focus="outVisible = true"  :validateEvent="false" ></el-input>
            <el-dialog
                title="相册分类" 
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
                            :data="pictureClassifyList"
                            @node-click="selectOutOrg"
                            node-key="id"
                            default-expand-all
                            :props="pictureClassifyProp"
                            :expand-on-click-node="false"
                            v-model="classifyNo"
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
import ElInput from '@/components/element-ui/input';
    export default {                
        components:{
                    "el-input":ElInput
                },
        data:function(){
            return {

                outVisible:false,
                // orgList: [], //组织数据
                filterText: "",
                classifyName:'',
                classifyNo:this.value,
                pictureClassifyList:[],
                pictureClassifyProp:{value:'id'},
            }
        },
         props:['value'],
         created(){
           this.api({
               url: "/carModelPictureClassify/listCarModelPictureClassify",
               method: "get"
           }).then(data => {
               this.pictureClassifyList = data.list;         
           }); 
        },
        watch:{
            value:{
                immediate:true,
                handler:function(newval,oldval){
                    if(newval!=''&&newval!==oldval)
                        {
                          
                            this.api({
                                url: "/carModelPictureClassify/getCarModelPictureClassify",
                                method: "post",
                                // data: {'carModelPictureClassifyID':newval[newval.length-1]}
                                data: {'carModelPictureClassifyID':newval}
                            }).then(data => {
                                this.classifyName = data.classifyName;
                            });
                        }else{
                            this.classifyName="";
                        }
                  }
                }
        },
        methods:{
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            selectOutOrg(val1,val2,val3){ 
                    this.$emit('input', val2.data.id);
                    this.classifyName = val2.label;
                    // eventBus.$emit("loadUserList",val2.data.id,this.groupName)
                    // this.$emit('input', val2.data.id);
                    this.outVisible = false;
              
            },
            clearHandle(){
                this.$emit('input', '');
            }
        },

        mounted(){},
        computed: {}
    }
</script>