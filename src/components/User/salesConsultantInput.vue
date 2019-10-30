<template>
    <div>
        <el-select :style="inputStyle" clearable :value="value" @input="change($event)">
            <el-option v-for="item in tempUserList" 
                :key="item.userId"
                :label="item.nickname"
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
                //  myValue:this.value
            }
        },
     
        props:['value','inputStyle'],
        methods:{
             change: function(val) {
                //  console.log(val)
                this.$emit('input', val);
            },
        },
        mounted(){
            let that = this
            this.api({
                url: "/user/listSaleRole",
                method: "get",
                params:{pageRow:100}
            }).then(data => {
                that.tempUserList = data;
                // console.log(that.tempUserList)
            });
        }
    }
</script>