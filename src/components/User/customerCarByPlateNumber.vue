<template id="customCarInput">
    <div>
                    <el-select v-model="myValue" filterable  remote clearable
                      reserve-keyword placeholder="请输入关键词" :style="inputStyle"
                      :remote-method="remoteMethod" @change="handleSelect"
                      :loading="loading">
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
          this.api({
            url: "/customerCar/getCustomerCar",
            method: "post",
            data: { customerCarID: newval }
          }).then(data => {
            if (null != data) {
              this.myValue = data.plateNumber;
              this.$emit("handleCustomCarInput", data);
            } else {
            this.myValue = ""
            }
          });
        } else {
          this.myValue = ""
        }
      }
    }
  },
  data() {
    return {
        customerCarList:[],
        myValue:this.value,
        loading:false,
    };
  },
  props: ["value", "customerID", "inputStyle"],
  methods: {
      remoteMethod(queryString){
        this.loading = true
        let tempParams = "";
        // if (!this.isdigit(queryString))
          tempParams = { plateNumber: queryString };
        // else 
        //     tempParams = { mobile: queryString };
        
        this.api({
            url: "/customerCar/listCustomerCarByPlateNumber",
            method: "get",
            params: tempParams
        }).then(data => {
            this.loading = false;
            this.customerCarList = data.list
        });
      },
    
    handleSelect(item) {
        if(item){
            this.$emit("input", item + "");
            this.$emit("handleCustomCarInput", item);
        }else{
            this.$emit("input",'');
        }
    },
    isdigit(s) {
      let patrn = /^[0-9]{1,20}$/;
      if (!patrn.test(s)) return false;
      return true;
    }
  },
  mounted() {}
};
</script>