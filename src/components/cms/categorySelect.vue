<template id="categorySelect">
    <div>
        <el-input type="hidden" :value="value==null?'':value+''"  style="display:none"></el-input>
         <el-input type="text" :value="categoryName" @focus="outVisible = true"  :validateEvent="false" ></el-input>
         

            <el-dialog
                title="分类" 
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
                        :data="categoryList"
                        @node-click="selectCategory"
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
                },
                value:{
                    immediate:true,
                    handler:function(newval,oldval){
                        if(newval!= null && newval!=''&&newval!==oldval)
                        {
                           
                                this.api({
                                url: "/articleCategory/getArticleCategory",
                                method: "post",
                                data: {articleCategoryID:newval}
                                }).then(data => {
                        
                                this.categoryName = data.categoryName;

                                });
                        }else{

                        }
                    }
                },
                channelID(val){
                    if(!val) {
                        this.categoryName = '';
                        // this.categoryList = [];
                        // return;
                        // val=""
                    }
                    this.api({
                        url: "/articleCategory/listArticleCategory",
                        method: "get",
                        params:{channelID:val}
                    }).then(data => {
                        this.listLoading = false;
                        this.categoryList = data.list;
                    }); 

                }
            },
        data:function(){
            return {
                outVisible:false,
                categoryList: [], //组织数据
                filterText: "",
                categoryName:"",
                tempUserList :this.userList,
                test:[]
            }
        },
        tempOrgID:'',
        tempUserList:[],
        props:['value','userList','channelID'],
         created(){
                    this.api({
                        url: "/articleCategory/listArticleCategory",
                        method: "get"
                    }).then(data => {
                        this.listLoading = false;
                        this.categoryList = data.list;
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
            selectCategory(val1,val2,val3){ 
                  
                    this.$emit('input', val2.key);
                     this.$emit('listenEvent', val2);
               
                        
                    this.categoryName = val2.label;
                    // console.log(this.tempOrgID);
                    // this.tempOrgID = val2.data.id;
                   
                    this.outVisible = false;
              
            }
        },
        mounted(){
        },
        computed: {
        }
    }
</script>