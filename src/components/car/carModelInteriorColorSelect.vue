<template id="CarModelInteriorColorSelect">
    <el-select clearable :disabled="disabled"  :value="value" placeholder="请选择" @change="change">
		<el-option
			v-for="item in colorList"
				:key="item.carInteriorColorID"
					:label="item.carInteriorColorName"
						:value="item.carInteriorColorID">
				</el-option>
	</el-select>
</template>

<script>

import eventBus from '@/utils/eventBus';
    export default {

        data:function(){
            return {
                 colorList:[],
            }
        },

        props:['value','groupName','disabled'],
        methods:{
             change: function(val) {
                if(val) this.$emit('input', val);
                else this.$emit("input",'')
            },
            getColorList(carModelID,cb){
                this.api({
                  url: "/carModelInteriorColor/listCarModelInteriorColor",
                  method: "get",
                  params: {'carModelID':carModelID}
                }).then(data => {
                    if(cb){cb(data.list)}
                })

            },
            onCarModelUpdateHandle(carModelID,gn){
                if(this.groupName != gn) return;
                if(carModelID == undefined || carModelID == null || carModelID == ""){
                    this.colorList=[];
                    this.$emit('input', '');
                    return;
                }
                this.getColorList(carModelID,(data)=>{
                    this.colorList = data
                })
            }
        },
        created(){
            // let self=this;
            eventBus.$on("onCarModelUpdate",this.onCarModelUpdateHandle)
        },
        destroyed(){
            eventBus.$off('onCarModelUpdate',this.onCarModelUpdateHandle)
        }
    }
</script>
