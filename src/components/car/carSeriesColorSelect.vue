<template id="CarSeriesColorSelect">
	<el-select clearable :value="value" placeholder="请选择" @change="change">
        <el-option  
          v-for="item in colorList"
          	:key="item.carColorID"
              :label="item.carColorName"
                :value="item.carColorID">
            </el-option>
      </el-select>
</template>

<script>
import eventBus from '@/utils/eventBus';
export default {

    data:function(){
        return {
        	// colorId:this.value,
          colorList:[]
       }
   },
   props:['value','seriesID'],

   methods:{
      change: function(val) {
        this.$emit('input', val);
      },
      getData(seriesID){
      	this.api({
    	     url: "/carColor/listCarColor",
    	     method: "Get",
    	     params: {'carSeriesID':seriesID}
    	    }).then(data => {
    	        this.colorList = data.list;
    	})
      }
    },
    watch: {
    	seriesID: function (seriesID) {
    		if(seriesID){
    			this.getData(seriesID)
    		}else{
          		this.colorList = []
          		this.$emit("input",'')
        	}
    	}
  	},
    mounted(){
    	var self=this;
    	if(this.seriesID){
    		// this.getData(this.seriesID[this.seriesID.length -1]);
    		this.getData(this.seriesID);
    	}
    }
}
</script>