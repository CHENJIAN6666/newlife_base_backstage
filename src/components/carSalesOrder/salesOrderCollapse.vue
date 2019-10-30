<template>
    <div>
    <el-collapse v-model="activeNames">
        <el-collapse-item :name="open?'1':'2'">
			<template slot="title">
              <i class="header-icon el-icon-info"></i> <span class="collapse_title">销售单</span>
            </template>
	        <el-row>
	      <el-col :span="7">
	    	    <el-form-item label="销售单号">
	    	    	{{value.salesOrderNumber}}
	    	    </el-form-item>
	    	    <el-form-item label="销售日期">
	    	    	{{value.salesOrderDate}}
	    	    </el-form-item>
	    	    <el-form-item label="销售类型">
	    	    	{{value.salesTypeName}}
	    	    </el-form-item>

	    	    <el-form-item label="品牌">
	      	    	{{value.carBrandName}}
	    	    </el-form-item>

	    	    <el-form-item label="整车车型">
	    	    	{{value.carModelName}}
	    	    </el-form-item>
	    </el-col>
         <el-col :span="7" :offset="1">
	    	<el-form-item label="客户" >
	    		{{value.customerName}}
				<!-- <customInput disable :value="value.customerName"/> -->
	    	</el-form-item>
	    	<el-form-item label="销售部门">
	    		{{value.salesOrderOrgName}}
				<!-- <orgInput disable :value="value.salesOrderOrgID" /> -->
	    	</el-form-item>
	    	<el-form-item label="销售顾问">
	    		{{value.salesOrderUserName}}
				<!-- <userInput disable :value="value.salesOrderUserID" /> -->
	    	</el-form-item>

	    	<el-form-item label="外观颜色" >
	    			 {{value.carColorName}}
	    		<!-- <carColorSelect disable :value="value.carColorID"/> -->
	    	</el-form-item>
	    	<el-form-item label="内饰颜色" >
	    			{{value.carInteriorColorName}}
				<!-- <carColorInteriorSelect disable :value="value.carInteriorColor"/> -->
	    	</el-form-item>		
	    	</el-col>

	    	<el-col :span="7" :offset="1">
	    	<el-form-item label="">
	    		&nbsp;
	    	</el-form-item>
    
	    	<el-form-item label="合同号">
	    		{{value.carInteriorColorID}}
	    	</el-form-item>
	    	<el-form-item label="备注">
	    		{{value.remarks}}
	    	</el-form-item>
	    	<el-form-item label="">
	    		&nbsp;
	    	</el-form-item>
	    	<el-form-item label="车牌号"  prop="plateNumber" >
	    		<el-input type="text" :value="value.plateNumber"
                    @change="$emit('onPlateNumberUpdate',$event)">
	    		</el-input>
	    	</el-form-item>
	    </el-col>
	    </el-row>
    </el-collapse-item>
    </el-collapse>
    </div>
</template>

<script>
export default {
   props: ['value','open'],
   data() {
       return {
           activeNames: ["1"],
        }
	 }
}
</script>
