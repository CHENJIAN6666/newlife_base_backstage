<template>
         <el-select :style="inputStyle" :disabled="disabled" clearable :multiple="multiple"
          v-model="localValue"
          filterable placeholder="请选择" @change="selectChange($event)">
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
                dictDataList : [],
                localValue : this.value
            }
        },

     
        props:['value','dictTypeCode','disabled','inputStyle','multiple'],
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
            selectChange:function(val) {
                 this.$emit('input', this.localValue);
            }
        },
        watch:{
            value(val){
                this.localValue = val
            }
        }
    }
</script>