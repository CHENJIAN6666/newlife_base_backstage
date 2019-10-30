<template id="listSelect">
         <el-select :disabled="disabled" clearable :style="inputStyle"
          :value="value" 
          filterable 
           placeholder="请选择"
              @change="selectChange">
              <el-option   
                v-for="item in list" 
                :key="item[keyName]"
                :label="item[labelName]"
                :value="item[keyName]">
              </el-option>
        </el-select>

</template>
<script>
    export default {
        data:function(){
            return {
                list:[],
            }
        },

     
        props:['value','name','keyName','labelName','disabled','inputStyle'],
        created(){
            let Name = this.name.charAt(0).toUpperCase()+this.name.substring(1)
            let url = "/"+this.name+"/list"+Name
            this.api({
              url:url,
                    method:'get'}).then(data => {
                this.list = data.list;
            })
        },
        methods:{
            selectChange(val) {
                this.$emit('input', val);
                this.$emit('selectChange', val);
            }
        },
    }
</script>