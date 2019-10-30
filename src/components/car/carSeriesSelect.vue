<template id="carSeriesSelect">
        <el-cascader clearable ref="cascader" :disabled="disabled"
                     :options="carSerieslist"
            :show-all-levels="true"
            :props="carSeriesProp" :change-on-select="false"
             v-model="carSeriesNo" @change="change">
            </el-cascader>
</template>

<script>

import eventBus from '@/utils/eventBus';
    export default {

        data:function(){
            return {
                 carSeriesNo:[],
                 carSerieslist:[],
                 carSeriesProp:{value:'id'},
            }
        },

        props:['value','groupName','disabled'],
        methods:{
             change: function(val) {
                 console.log(val)
                 if(undefined != this.carSeriesNo && null!=this.carSeriesNo && this.carSeriesNo.length>2)
                {
                    eventBus.$emit("loadCarModel",this.carSeriesNo[2],this.groupName)
                    this.$emit('input', this.carSeriesNo[2]);
                }else{
                    eventBus.$emit("loadCarModel",'',this.groupName)
                    this.$emit('input','')
                }

            },
            findTreePath(list,nodeID){
                for(let i=0;i<list.length;i++){
                    let item = list[i]
                    if(item.id == nodeID){
                        return [item.id];
                    }else if(item.children){
                        let childPath = this.findTreePath(item.children,nodeID);
                        if(childPath && childPath.length){
                            return [item.id].concat(childPath)
                        }
                    }
                }
                return []
            }
        },
        created(){
            // console.log("create")
                      //查询树形车系 包含品牌 厂商
                this.listLoading = true;
                this.api({
                    url: "/carSeries/getCarSeriesTree",
                    method: "POST",
                    params: this.listQuery
                }).then(data => {
                    this.listLoading = false;
                    this.carSerieslist = data.list;
                    if(this.value){
                        this.carSeriesNo = this.findTreePath(this.carSerieslist,this.value)
                        // console.log("emit" +this.groupName + " loadCarModel")
                        eventBus.$emit("loadCarModel",this.value,this.groupName)
                    } else{
                         this.carSeriesNo = []
                         eventBus.$emit("loadCarModel",'',this.groupName)
                    }
                });

        },
        mounted(){
            // var self=this;
            // eventBus.$on("loadUserList",function(orgId,gn){
            //     if(self.groupName!=gn) return;
            //     if(orgId==""){
            //         self.tempUserList=[];
            //         return;
            //     }
            //     this.api({
            //             url: "/user/list",
            //             method: "get",
            //             params: {'listQueryOrgID':orgId}
            //             }).then(data => {
            //                 self.tempUserList = data.list;
            //             });
            // })
        },
        watch:{
            value:{
                 immediate:true,
                 handler(newval,oldval){
                    // console.log("newval:"+newval+",oldval:"+oldval);
                    if(newval){
                        // console.log("1newval:'"+newval+"'")
                        this.carSeriesNo = this.findTreePath(this.carSerieslist,newval);
                         eventBus.$emit("loadCarModel",newval,this.groupName)
                    }else{
                        // console.log("2newval:'"+newval+"'")
                        this.carSeriesNo =[];
                         eventBus.$emit("loadCarModel",'',this.groupName)
                    }
                }

            }
        }
        // beforeDestroy(){
        //     eventBus.$emit("loadCarModel",this.value,this.groupName)
        // },
        // destroy(){
            // eventBus.$off('loadCarModel', ()=>{})
        // }

    }
</script>
