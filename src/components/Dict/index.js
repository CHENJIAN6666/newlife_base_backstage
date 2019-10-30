import DictSelect from  './dictSelect.vue'
import DictMulitSelect from  './dictMulitSelect.vue'
import listSelect from  './listSelect.vue'
const dictSelect={
    install:function(Vue){
        Vue.component("dictSelect",DictSelect);
        Vue.component("dictMulitSelect",DictMulitSelect);
        Vue.component("listSelect",listSelect);
    }
}
export default dictSelect