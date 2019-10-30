<template>
    <el-collapse v-model="activeNames">
    <el-collapse-item :name="open?'1':''">
			<template slot="title">
              <i class="header-icon el-icon-info"></i> <span class="collapse_title">精品加装</span>
            </template>
            	<el-form-item  label="加装"  >
                   <!-- <el-input :readonly="showOnly" :value="value.frontDetail" @change="handleFrontDetailChange">
                </el-input> -->
                {{value.frontDetail}}
				</el-form-item>	

				<el-form-item  label="精品" >			
                 <!-- <el-input :readonly="showOnly" :value="value.decorationDetail" @change="handleDecorationDetailChange">
                  </el-input> -->
                {{value.decorationDetail}}
				</el-form-item>	

                <template v-if="value.businessState ==3 || value.businessState==4">
				    <el-form-item  label="装潢处理人">
				    	<!-- {{value.decorationPersonName}} -->
                        <userInput :disabled="showOnly" :value="value.decorationPerson"/>
				    </el-form-item>	

				    <el-form-item  label="装潢日期">
				    	{{value.decorationTime}}
				    </el-form-item>	
                </template>
				<el-form-item label="装潢备注">
				    <el-input :readonly="showOnly" type="text" :value="value.decorationRemark" @change="handleDecorationRemarkChange">
				    </el-input>
				</el-form-item>	
                
			</el-collapse-item>
	</el-collapse>
</template>


<script>
export default {
     props: ['value','open','showOnly'],
        data(){
            return{
                activeNames:['1'],
            }
        },
    methods:{
        handleFrontDetailChange(val){this.$emit("onFrontDetailUpdate",val)},
        handleDecorationDetailChange(val){this.$emit("onDecorationDetailUpdate",val)},
        handleDecorationRemarkChange(val){this.$emit("onDecorationRemarkUpdate",val)},    
    }
}
</script>
