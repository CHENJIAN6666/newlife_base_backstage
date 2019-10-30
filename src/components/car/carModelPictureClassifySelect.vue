<template id="CarModelPictureClassifySelect">
    <el-cascader
    placeholder="请选择"
    :options="pictureClassifyList"
    :show-all-levels="true"  
    :props="pictureClassifyProp"
    :change-on-select="false" 
    v-model="classifyNo" 
    @change="change"
    >
</el-cascader>
</template>

<script>

import eventBus from '@/utils/eventBus';
export default {
    data:function(){
        return {
           // classifyNo:this.value,
           classifyNo:this.classifyIDTreePath,
           pictureClassifyList:[],
           pictureClassifyProp:{value:'id'},
       }
   },

   props:['value','classifyIDTreePath'],
   methods:{
       change: function(val) {
            this.$emit('input', val[val.length-1]);
        },
        getData(){
            this.api({
                url: "/carModelPictureClassify/listCarModelPictureClassify",
                method: "Get"
            }).then(data => {
                this.pictureClassifyList = data.list;
            });
        }
    },
    watch:{
        classifyIDTreePath(nv,ov){
            this.classifyNo= this.classifyIDTreePath
        }
    },
    created(){
        this.listLoading = true;
        this.getData()
    }
}
</script>