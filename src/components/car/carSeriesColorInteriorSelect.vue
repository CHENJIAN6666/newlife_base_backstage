<template id="CarSeriesColorInteriorSelect">
	 <el-select clearable :value="value" placeholder="请选择" @change="change">
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
          colorList:[]
       }
   },

   props: ['value','seriesID'],
   methods:{
      change: function(val) {
        this.$emit('input', val);
      },
      getData(seriesID){
        if(seriesID){
         this.api({
             url: "/carInteriorColor/listCarInteriorColor",
             method: "Get",
            //  params: {'carSeriesID':this.seriesID[this.seriesID.length-1]}
             params: {'carSeriesID':seriesID}
          }).then(data => {
              this.colorList = data.list;
          })
        }else{
          this.colorList = []
          this.$emit("input",'')
        }
      }
    },
    watch:{
      seriesID: function (newValue, oldValue) {
        this.getData(newValue)
      }
    },
     mounted(){
      this.getData(this.seriesID)
    }
}
</script>