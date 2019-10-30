<template id="orgSelect">
    <div>
            <el-select :style="inputStyle" :disabled="disabled" clearable :value="value" @input="change($event)">
                <el-option 
                    v-for="item in tempUserList" 
                    :key="item.userId"
                    :label="item.realName"
                    :value="item.userId">
                </el-option>
            </el-select>
    </div>
</template>

<script>

import eventBus from '@/utils/eventBus';
    export default {

        data:function(){
            return {
                 tempUserList:[],
            }
        },
     
        props:['value','groupName','inputStyle','disabled'],
        methods:{
             change: function(val) {
                this.$emit('input', val);
            },
        },
        mounted(){
          if(this.groupName){

            var self=this;
            eventBus.$on("loadUserList",function(orgId,gn){
                if(self.groupName!=gn) return;
                if(orgId==""){
                    self.tempUserList=[];
                    return;
                }
                this.api({
                        url: "/user/list",
                        method: "get",
                        params: {listQueryOrgID:orgId,pageNum:1,pageRow:100}
                        }).then(data => {
                            self.tempUserList = data.list;
                    });
            })
            }else{
                this.api({
                    url: "/user/list",
                    method: "get",
                    params: {pageNum:1,pageRow:100}
                }).then(data => {
                    this.tempUserList = data.list;
                });
            }
        }
    }
</script>