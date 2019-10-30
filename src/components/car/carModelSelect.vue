<template id="carSeriesSelect">
            <el-select clearable  v-model="tempValue"  :disabled="disabled"   placeholder="请选择" @change="change" >
				<el-option
					v-for="item in carModelList"
						:key="item.carModelID"
							:label="item.carModelName"
								:value="item.carModelID">
						</el-option>
			</el-select>



</template>

<script>

import eventBus from '@/utils/eventBus';
    export default {

        data:function(){
            return {
                 carModelList:[],
                 tempValue:this.value
            }
        },

        props:['value','groupName','disabled'],
        methods:{
             change: function(val) {
                this.$emit('input', val);
                this.tempValue = val
                eventBus.$emit("onCarModelUpdate",val,this.groupName)
            },
            loadCarModelEvent(seriesID,gn){
                if(this.groupName!=gn) return;
                if(undefined == seriesID || seriesID == ""){
                    this.tempValue='';
                    this.carModelList=[];
                    eventBus.$emit("onCarModelUpdate",'',this.groupName)
                    // this.$emit('input', '');
                    return;
                }

                                            //车型
				this.api({
					url: "/carModel/listCarModel",
						method: "get",
						params: {'carSeriesID':seriesID}
				}).then(data => {
                    this.carModelList  = data.list;
                    this.tempValue = this.value;
                    eventBus.$emit("onCarModelUpdate",this.value,this.groupName)
				})
            }
        },
        // created(){

        // },
        created(){
            // let self=this;

            eventBus.$on("loadCarModel",this.loadCarModelEvent)
        },
        beforedestroy(){
        },
        destroyed(){
            // console.log("carModelSelect destory")
            eventBus.$off('loadCarModel', this.loadCarModelEvent)
        }
    }
</script>
