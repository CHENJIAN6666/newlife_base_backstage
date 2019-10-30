<template>
    <el-collapse v-model="activeNames">
    	 <el-collapse-item :name="open?'1':''">
			<template slot="title">
              <i class="header-icon el-icon-info"></i> <span class="collapse_title">交车</span>
            </template>

       <el-row>
         <el-col :span= "7" >
				<el-form-item label="交车类型"  prop="deliveryAuditType" >
					<dictSelect :inputStyle="{width:'240px'}" :disabled="showOnly" type="text" v-model="localDeliveryAuditType" dictTypeCode="DeliveryAuditType">
					</dictSelect>
				</el-form-item>	

        <template v-if="localDeliveryAuditType == 1">
	        <el-form-item label="交车担保凭证">
            <img :style="{width:'500px'}" :src="value.deliveryGuaranteeImg" />
          </el-form-item>
           <el-form-item label="交车担保说明">
            <el-input :disabled="showOnly" type="text" :value = "value.deliveryGuaranteeRemark"/>
          </el-form-item>
        </template>
			
      	<el-form-item label="交车担保人">
					<!-- <userInput :inputStyle="{width:'240px'}" :disabled="showOnly" v-model="localDeliveryGuarantee"/> -->
          	<guaranteeInput v-model="guaranteeInfo.deliveryGuarantee"/>
				</el-form-item>	

				<el-form-item label="银行卡保留情况"  prop="bankCardHold" >
					<dictSelect :inputStyle="{width:'240px'}" :disabled="showOnly" type="text" v-model="localBankCardHold" dictTypeCode="BankCardHold"/>
				</el-form-item>

				<el-form-item label="交车期限">
					<el-input :readonly="showOnly" :style="{width:'240px'}" type="number" 
          :value="value.deliveryDeadline" @change = "handleDeliveryDeadlineChange"/>
				</el-form-item>	
               
				<el-form-item label="交车地点"  prop="deliveryPlace" >
					<el-input :readonly="showOnly" :style="{width:'240px'}" 
          :value="value.deliveryPlace" @change = "handleDeliveryPlaceChange"/>
				</el-form-item>	
				<el-form-item label="交车备注" >
					<el-input :readonly="showOnly" type="textarea" :rows="3" :style="{width:'240px'}" 
          :value="value.deliveryRemarks" @change = "handleDeliveryRemarksChange"/>
				</el-form-item>	
    </el-col>
    <el-col :span= "7"  :offset="1">
            <template v-if="value.businessState == 4">
              <el-form-item label="交车申请人"  prop="carStockContacts" >
                {{value.deliveryApplicantName}}
              </el-form-item>	

              <el-form-item label="交车申请日期"  prop="carStockContacts" >
                {{value.deliveryApplicantTime}}
              </el-form-item>	
              <slot name = "finsishContent"></slot>
            </template>
      </el-col>
    </el-row>
      <slot></slot>
		</el-collapse-item>
		</el-collapse>
</template>

<script>
export default {
  props: ["value", "open", "showOnly"],
  data() {
    return {
      activeNames: ["1"],
      localDeliveryAuditType: this.value.deliveryAuditType,
      localBankCardHold: this.value.bankCardHold,
      localDeliveryGuarantee: this.value.deliveryGuarantee
    };
  },
  watch: {
    'value.deliveryAuditType'(newVal) {
      this.localDeliveryAuditType = newVal;
    },
    'value.bankCardHold'(newVal) {
      this.localBankCardHold = newVal;
    },
    'value.deliveryGuarantee'(newVal) {
      this.localDeliveryGuarantee = newVal;
    },
    localDeliveryAuditType(newVal) {
      this.handleDeliveryAuditTypeChange(newVal);
    },
    localBankCardHold(newVal) {
      this.handleBankCardHoldChange(newVal);
    },
    localDeliveryGuarantee(newVal) {
      this.handleDeliveryGuaranteeChange(newVal);
    }
  },
  methods: {
    handleDeliveryAuditTypeChange(val) {
      this.$emit("onDeliveryAuditTypeUpdate", val);
    },
    handleBankCardHoldChange(val) {
      this.$emit("onBankCardHoldUpdate", val);
    },
    handleDeliveryGuaranteeChange(val) {
      this.$emit("onDeliveryGuaranteeUpdate", val);
    },
    handleDeliveryDeadlineChange(val) {
      this.$emit("onDeliveryDeadlineUpdate", val);
    },
    handleDeliveryPlaceChange(val) {
      this.$emit("onDeliveryPlaceUpdate", val);
    },
    handleDeliveryRemarksChange(val) {
      this.$emit("onDeliveryRemarksUpdate", val);
    },
    // handleDeliveryExecuteRemarkChange(val) {
    //   this.$emit("onDeliveryExecuteRemarkUpdate", val);
    // }
  }
};
</script>
