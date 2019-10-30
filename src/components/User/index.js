import OrgInput from  './orgInput.vue'
import UserInput from  './userInput.vue'
import CustomInput from  './customInput.vue'
import PotentialCustomInput from  './potentialCustomInput.vue'
import SalesConsultantInput from  './salesConsultantInput.vue'
import CustomerCarCarInput from  './customerCarInput.vue'
import StoreUser from  './storeUser.vue'
import CustomerCarByPlateNumber from  './customerCarByPlateNumber.vue'
import GuaranteeInput from  './guaranteeInput.vue'
import CustomerCarTable from  './customerCarTable.vue'
import CustomerCarMulitTable from  './customerCarMulitTable.vue'




const userInput={
    install:function(Vue){
        Vue.component("orgInput",OrgInput);
        Vue.component("userInput",UserInput);
        Vue.component("guaranteeInput",GuaranteeInput);
        Vue.component("customInput",CustomInput);
        Vue.component("customerCarInput",CustomerCarCarInput);
        Vue.component("potentialCustomInput",PotentialCustomInput);
        Vue.component("salesConsultantInput",SalesConsultantInput);
        Vue.component("storeUser",StoreUser);
        Vue.component("customerCarByPlateNumber",CustomerCarByPlateNumber);
        Vue.component("customerCarTable",CustomerCarTable);
        Vue.component("customerCarMulitTable",CustomerCarMulitTable);

    }
}
export default userInput