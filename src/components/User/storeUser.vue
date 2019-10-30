<template>
    <div>
        <el-select :style="inputStyle" clearable :value="value" @input="change($event)" :multiple="multiple">
            <el-option v-for="item in tempUserList" 
                :key="item.userId"
                :label="item.nickname"
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
                //  myValue:this.value
            }
        },
     
        props:['value','roleID','inputStyle','multiple'],
        methods:{
             change: function(val) {
                //  console.log(val)
                this.$emit('input', val);
                //this.$emit('changeHandle', val);

                if(this.multiple){
                 let sitem = [];
                 this.tempUserList.forEach((item)=>{//这里的userList就是上面遍历的数据源
                     val.forEach(vitem=>{
                        if(vitem === item.userId){
                            sitem.push(item.nickname)
                        }
                     });
                 });
                 this.$emit('changeHandle', val, sitem);
                }else{
                    this.$emit('changeHandle', val);

                }
            },
        },
        mounted(){
            let that = this
            this.api({
                url: "/user/listStoreUser",
                method: "get",
                params:{pageRow:100,roleID:this.roleID}
            }).then(data => {
                that.tempUserList = data;
                // console.log(that.tempUserList)
            });
        }
    }
</script>