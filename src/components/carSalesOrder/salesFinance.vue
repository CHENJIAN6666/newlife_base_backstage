<template>
    <el-collapse v-model="activeNames">
    	 <el-collapse-item :name="open?'1':''">
			<template slot="title">
              <i class="header-icon el-icon-info"></i> <span class="collapse_title">财务</span>
            </template>

            			<el-row>
			<el-col :span="7">
	            <el-form-item label="结算车价"  prop="carSettlementPrice" >
											{{tempModel.carSettlementPrice}}
										</el-form-item>
									
					
							
										<el-form-item label="其他费用"  prop="otherExpenses" >
											{{tempModel.otherExpenses}}
										</el-form-item>
									
					
							
										<el-form-item label="差额扣税"  prop="differenceTax" >
									  	{{tempModel.differenceTax}}
										</el-form-item>
									
					
							
										<el-form-item label="应收合计"  prop="receivableTotal" >
											{{receivableTotal}}
										</el-form-item>


                   <el-form-item label="结算客户"  prop="settlementCustomer" >
												{{tempModel.settlementCustomerName}}
										</el-form-item>

	    	<el-form-item label="">
	    		&nbsp;
	    	</el-form-item>
										<el-form-item label="购买方式"  prop="deposit" >
												{{tempModel.purchaseWayName}}
										</el-form-item>



										</el-col>
				            <el-col :span="7" :offset="1">

										<el-form-item label="发票类别"  prop="invoiceCategory" >
											{{tempModel.invoiceCategory}}
										</el-form-item>
							
										<el-form-item label="光车税率"  prop="carTaxRate" >
											{{tempModel.carTaxRate}}
										</el-form-item>	
									
							
										<el-form-item label="税额"  prop="carTax" >
											{{tempModel.carTax}}
										</el-form-item>

										<el-form-item label="车价是否含税"  prop="isPriceIncludingTax" >
											<el-radio v-model="tempModel.isPriceIncludingTax" :label="1">是</el-radio>
            								<el-radio v-model="tempModel.isPriceIncludingTax" :label="0">否</el-radio>
										</el-form-item>

										<el-form-item label="开票价"  prop="invoicePrice" >
											{{tempModel.invoicePrice}}
										</el-form-item>


	    	<el-form-item label="">
	    		&nbsp;
	    	</el-form-item>
										<el-form-item label="累计冲帐"  prop="cumulativeOffset" >
											{{tempModel.cumulativeOffset}}
										</el-form-item>






										</el-col>
				            <el-col :span="7" :offset="1">

										<el-form-item label="已收订金"  prop="paidDeposit" >
											{{tempModel.paidDeposit}}
										</el-form-item>

										<el-form-item label="需订金"  prop="deposit" >
											{{tempModel.deposit}}
										</el-form-item>


						    	<el-form-item label="">
	    		&nbsp;
	    	</el-form-item>
							
										<el-form-item label="开票客户"  prop="invoiceCustomer" >
											{{tempModel.invoiceCustomerName}}
										</el-form-item>
                    	<el-form-item label="开票差额"  prop="invoiceDifference" >
										{{invoiceDifference}}
										</el-form-item>

	    	<el-form-item label="">
	    		&nbsp;
	    	</el-form-item>
											<el-form-item label="挂账余额"  >
											{{tempModel.creditBalance}}
										</el-form-item>
                  </el-col>
            			</el-row>
					
                <slot></slot>
		</el-collapse-item>
		</el-collapse>
</template>

<script>
export default {
    computed: {
    receivableTotal: function() {
      this.tempModel.receivableTotal = (
        this.toMoney(this.tempModel.carSettlementPrice) +
        this.toMoney(this.tempModel.otherExpenses) +
        this.toMoney(this.tempModel.differenceTax)
      ).toFixed(2);
      return this.tempModel.receivableTotal;
    },
    invoiceDifference: function() {
      if (this.toMoney(this.tempModel.invoicePrice) == 0)
        return this.toMoney(this.tempModel.invoicePrice).toFixed(2);

      this.tempModel.invoiceDifference = (
        this.toMoney(this.tempModel.invoicePrice) -
        this.toMoney(this.tempModel.carSettlementPrice)
      ).toFixed(2);
      return this.tempModel.invoiceDifference;
    }
  },
  props: ["value", "open", "showOnly"],
  data() {
    return {
        activeNames: ["1"],
      tempModel:this.value
    };
  },
  watch: {

  },
  methods: {
    isMoney(s) {
      if (null == s || s == "") return 0;
      return /^[0-9]*(\.[0-9]{1,2})?$/.test(s);
    },
    toMoney(s) {
      return this.isMoney(s) ? parseFloat(s) : 0;
    }
  }
};
</script>
