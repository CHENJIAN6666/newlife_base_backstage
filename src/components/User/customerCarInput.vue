<template id="customCarInput">
    <div>
      <el-select clearable  v-model="tempValue"    placeholder="请选择" @change="change" >
				<el-option
					v-for="item in customerCarList"
						:key="item.customerCarID"
							:label="item.plateNumber"
								:value="item.customerCarID">
						</el-option>
			</el-select>

    </div>

</template>

<script>
export default {
  watch: {
    value: {
      immediate: true,
      handler: function(newval, oldval) {
        if (newval != null && newval != "" && newval != oldval) {
          this.tempValue=newval;
          this.$emit("handleCustomCarInput", this.getListItem(this.tempValue));
        } else {
          this.tempValue = ""
          this.$emit("handleCustomCarInput", null);
        }

      }
    },
    customerID:{
        handler: function(newval, oldval) {
          this.loadCarList();
      }
    }
  },
  data() {
    return {
        customerCarList:[],
        myValue:this.value,
        loading:false,
        tempValue:this.value
    };
  },
  props: ["value", "customerID", "inputStyle"],
  methods: {
        change: function(val) {
              this.$emit("input", val );
              this.$emit("handleCustomCarInput", this.getListItem(val));
            },

            getListItem(s){
              let selectItem ;
              this.customerCarList.forEach(function(item,index){
                  if(item.customerCarID == s){
                    selectItem = item;
                  }

              })
              return selectItem;
            },
          loadCarList(){
              if(this.customerID != null&&this.customerID != '')
                this.api({
                    url: "/customerCar/listCustomerCarByCustomer",
                    method: "get",
                    params: { customerID: this.customerID }
                  }).then(data => {
                    if (null != data) {
                      this.customerCarList = data.list;
                      this.customerCarList.forEach(function(item,index){
                        item.tempPlateNumber=item.plateNumber;
                        let carName = item.carBrandName + ' '+ item.carSeriesName+' '+item.carModelName;
                        if(item.carBrandName == null){
                          carName = item.otherCarModel;
                        }
                            if(item.plateNumber == null || item.plateNumber == ''){
                              item.plateNumber = carName
                            }else{
                              item.plateNumber = carName +'('+item.plateNumber+')'
                            }
                        });
                      if(this.customerCarList.length>0){
                        this.$emit("input", this.customerCarList[0].customerCarID   );
                      }
                    } else {
                      this.tempValue = ""
                  }
                });
              else
                  this.customerCarList=[];
        }
  },
  mounted() {
   // console.log("123");
  },
 created(){
   this.loadCarList();
 },
};
</script>
