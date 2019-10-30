<template>
    <el-collapse v-model="activeNames">
		<el-collapse-item :name="open?'1':'2'">
			<template slot="title">
              <i class="header-icon el-icon-info"></i> <span class="collapse_title">配车</span>
            </template>
			<el-row>
			<el-col :span="7">
				<el-form-item label="选车"  prop="carStockID" >
					<el-select style="width:240px"  clearable :disabled="showOnly"
					v-model="tempModel.carStockID"  placeholder="请选择"   
					@clear="cleanCarStock"
					@change = "handleCarStockIDChange">
						<el-option 
							v-for="item in carStoreList"  
							:key="item.carStockID" 
							:label="item.vINCode"
							:value="item.carStockID" 
							:title="item.carStockLocation">
							  <span style="float: left">{{ item.vINCode }}</span>
      					 <div style="width:120px;float: left;overflow: hidden;text-overflow: ellipsis;">
									 ({{ item.carStockLocation }})
									 </div> 
      					<span style="float: right; color: #8492a6; font-size: 13px">
									{{ item.productionDate |formatDate }}</span>
						</el-option>
					</el-select>
				</el-form-item>

			<el-form-item label="完成PDI检查" >
					{{tempModel.finishedPDI==1?'是':'否'}}
				</el-form-item>
			
			
				<el-form-item label="完成PDS检查" >
					{{tempModel.finishedPDS==1?'是':'否'}}

				</el-form-item>
				</el-col>

				<el-col :span="7" :offset="1">

					<el-form-item label="配车备注"  >
					
					<el-input :readonly="showOnly" type="text" v-model="tempModel.carDistributionRemark"
                        @change = "handleCarDistributionRemarkChange"/>
				</el-form-item>	
					<el-form-item label="合格证号"  >
						{{tempModel.certificateNumber}}
				</el-form-item>
				<el-form-item label="商检单号"  >
						{{tempModel.commodityInspectionNumber}}
				</el-form-item>			
				<el-form-item label="关单号"  >
						{{tempModel.customsDeclarationNumber}}
				</el-form-item>
				<el-form-item label="钥匙号"  >
						{{tempModel.keyNumber}}
				</el-form-item>		
				</el-col>

				<el-col :span="7" :offset="1">
				<el-form-item label="">
					&nbsp;
				</el-form-item>
				<el-form-item label="入库仓库"  >
					{{tempModel.warehouse}}
				</el-form-item>	
			
				<el-form-item label="仓位">
					{{tempModel.warehousePosition}}
				</el-form-item>	

				<el-form-item label="车辆所在地"  >
					{{tempModel.carStockLocation}}
				</el-form-item>	
			
				<el-form-item label="联系人"  >
					{{tempModel.carStockContacts}}
				</el-form-item>	
				</el-col>

			  </el-row>
		</el-collapse-item>
	</el-collapse>
</template>
<script>
import  {formatDate} from '@/utils/date.js';
export default {
   props: ['value','open','showOnly'],
   data() {
        return {
            activeNames: ["1"],
            carStoreList:[],
            tempModel:this.value
        }
   },
    created(){
		this.getCarStockList()
		this.handleCarStockIDChange(this.value.carStockID)
    },
    watch:{
        'value.carStockID'(newVal,oldVal){
			this.getCarStockList();
			this.handleCarStockIDChange(newVal)
        }
    },
    methods:{
		handleCarDistributionRemarkChange(val){this.$emit('onCarDistributionRemarkUpdate',val)},
      
       handleCarStockIDChange(carStockID){
		   this.$emit("onCarStockIDUpdate",carStockID)
				this.tempModel.certificateNumber='';
				this.tempModel.commodityInspectionNumber='';
				this.tempModel.customsDeclarationNumber='';
                this.tempModel.keyNumber ='';
                this.tempModel.finishedPDI = '';
				this.tempModel.finishedPDS = '';
				this.tempModel.warehouse = '';
				this.tempModel.warehousePosition = '';
				this.tempModel.carStockLocation = '';
                this.tempModel.carStockContacts = '';

				if(null==carStockID||""==carStockID) return;
					this.api({
						url: "/carStock/getCarStock",
						method: "post",
						data: {carStockID:carStockID}
					}).then(data => {

						this.tempModel.certificateNumber=data.certificateNumber;
						this.tempModel.commodityInspectionNumber=data.commodityInspectionNumber;
						this.tempModel.customsDeclarationNumber=data.customsDeclarationNumber;
						this.tempModel.keyNumber=data.keyNumber;
					
						this.tempModel.finishedPDI = data.finishedPDI;
						this.tempModel.finishedPDS = data.finishedPDS;
						this.tempModel.warehouse = data.warehouse;
						this.tempModel.warehousePosition = data.warehousePosition;
						this.tempModel.carStockLocation = data.carStockLocation;
						this.tempModel.carStockContacts = data.carStockContacts;
					});
			},
			getCarStockList(){
				this.carStoreList=[];
				if(null==this.value.carModelID||this.value.carModelID=='') return;
				this.api({
						url: "/carSalesOrder/listCarStockByOrder",
						method: "get",
						params: {carModelID:this.value.carModelID,
										carColorID:this.value.carColorID,
										carInteriorColorID:this.value.carInteriorColorID,
										carSalesOrderID:this.value.carSalesOrderID
							}
					}).then(data => {
						this.carStoreList  = data.list;
					});
			},
       		cleanCarStock(){
       			 this.$emit("onCarStockIDUpdate",'')
       		}
        },
        filters: {
        formatDate(time) {
            var date = new Date(time);
            return formatDate(date, "yyyy-MM-dd");
        }
   }
}
</script>