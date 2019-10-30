<template id="pCustomInput">
    <div>
        <el-autocomplete
                    :value="tempValue+''"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect" 
                    value-key="customerName"
                    >
                      <template slot-scope="props" >
                        <div class="name">{{ props.item.customerName }}</div>
                    </template>
                    </el-autocomplete>

      <!-- </el-dialog>  -->

    </div>

</template>

<script>
    export default {
          watch: {
                value:{
                immediate:true,
                handler:function(newval,oldval){
                    if(newval!=null && newval!=''&&newval!==oldval)
                        {
                            this.api({
                                url: "/potentialCustomer/getPotentialCustomer",
                                method: "post",
                                data: {'potentialCustomerID':newval}
                                }).then(data => {
                                this.tempValue = data.customerName;
                                this.$emit('handlePCustomInput', data);
                                });
                        }else{
                             this.tempValue="";
                        }
                  }
                }

            },
    data() {
      return {
        outVisible:false,
        state4: '',
        tempValue:this.value,
        tempName:'cs'

      };
    },
    props:['value'],
    tempParams:{},
    tempName:'',
    methods: {
      loadAll() {

      },
      querySearchAsync(queryString, cb) {
        this.listLoading = false;
       // if(queryString.length<=0) return;
        let tempParams='';
        if(!this.isdigit(queryString))
            tempParams={'customerName':queryString};
        else
            tempParams={'mobile':queryString};

        this.api({url: "/potentialCustomer/listLastPotentialCustomer",
                        method: "get",
                        params: tempParams
                    }).then(data => {
                        this.listLoading = false;
                         cb(data.list);
                    }); 
        
      },
      handleSelect(item) {
        this.$emit('input', item.potentialCustomerID+'');
        this.$emit('handlePCustomInput', item);

      },
      isdigit(s) 
       { let patrn=/^[0-9]{1,20}$/; 
            if (!patrn.test(s)) 
                return false;
            return true; }
    },
    mounted() {

     
    }
 }
</script>