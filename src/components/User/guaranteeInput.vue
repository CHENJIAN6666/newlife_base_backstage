<template>
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

    export default {

        data:function(){
            return {
                 tempUserList:[],
            }
        },
     
        props:['value','inputStyle','disabled'],
        methods:{
             change: function(val) {
                this.$emit('input', val);
            },
        },
        mounted(){
        
            this.api({
                url: "/user/listGuarantee",
                method: "get",
                params: {pageNum:1,pageRow:100}
            }).then(data => {
                this.tempUserList = data;
            });
        }
    }
</script>