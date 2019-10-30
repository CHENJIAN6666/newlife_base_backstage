<template id="customInput">
    <div>
        <!-- <el-autocomplete :style="inputStyle"
                    :value="tempValue+''"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect" 
                    value-key="customerName" 
                    >
                      <template slot-scope="props" >
                        <div>{{ props.item.customerName }}</div>
                    </template>
                    </el-autocomplete> -->
                    <el-select :disabled="disabled" v-model="myValue" filterable  remote clearable
                      reserve-keyword placeholder="请输入关键词" :style="inputStyle"
                      :remote-method="remoteMethod" @change="handleSelect"
                      :loading="loading">
                      <el-option
                        v-for="item in customerList"
                        :key="item.customerID"
                        :label="item.customerName"
                        :value="item.customerID">
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
            url: "/customer/getCustomer",
            method: "post",
            data: { customerID: newval }
          }).then(data => {
            if (null != data) {
            //   this.tempValue = data.customerName;
              this.myValue = data.customerName;
              this.$emit("handleCustomInput", data);
            } else {
            //   this.tempValue = "";
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
    //   outVisible: false,
    //   state4: "",
    //   tempValue: this.value,
    //   tempName: "cs"
        customerList:[],
        myValue:this.value,
        loading:false,
    };
  },
  props: ["value", "inputStyle","disabled"],
//   tempParams: {},
//   tempName: "",
  methods: {
      remoteMethod(queryString){
        this.loading = true
        let tempParams = "";
        if (!this.isdigit(queryString))
          tempParams = { customerName: queryString };
        else 
            tempParams = { mobile: queryString };
        
        this.api({
            url: "/customer/listOwnCustomer",
            method: "get",
            params: tempParams
        }).then(data => {
            this.loading = false;
            this.customerList = data.list
            // console.log(this.customerList)
        });
      },
    // loadAll() {},
    // querySearchAsync(queryString, cb) {
    //   this.$emit("input", queryString);
    //   this.listLoading = false;
    //   let tempParams = "";
    //   if (!this.isdigit(queryString))
    //     tempParams = { customerName: queryString };
    //   else tempParams = { mobile: queryString };

    //   this.api({
    //     url: "/customer/listOwnCustomer",
    //     method: "get",
    //     params: tempParams
    //   }).then(data => {
    //     this.listLoading = false;
    //     cb(data.list);
    //   });
    // },
    handleSelect(item) {
        //  this.$emit("input", item.customerID + "");
            // this.$emit("handleCustomInput", item);
        if(item){
            this.$emit("input", item + "");
            this.$emit("handleCustomInput", item);
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