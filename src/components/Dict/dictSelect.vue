<template id="dictSelect">
         <el-select :style="inputStyle" :disabled="disabled" clearable
          :value="value==null?'':value+''" 
          filterable  
           placeholder="请选择"
             @input="change($event)"
              @change="selectChange($event)">
              <el-option   
                v-for="item in dictDataList" 
                :key="item.dictDataCode"
                :label="item.dictDataText"
                :value="item.dictDataCode">
              </el-option>
        </el-select>

</template>
<script>
    export default {
        data:function(){
            return {
                dictDataList:[]
            }
        },

     
        props:['value','dictTypeCode' ,'disabled','inputStyle'],
         created(){
                    //排量
                    this.api({
                    url: "/dict/listDictDatas",
                    method: "get",
                    params: {'dictTypeCode':this.dictTypeCode,'pageRow':50}
                    }).then(data => {
                        this.dictDataList = data.list;
                    })
                },
        methods:{
            change: function(val) {
                this.$emit('input', val);
            },
            selectChange:function(val) {
                this.$emit('selectChange', val);
            }
        },
        mounted(){
        },
        computed: {
        }
    }
</script>