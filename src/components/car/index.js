import CarSeriesSelect from  './carSeriesSelect.vue'
import CarModelSelect from  './carModelSelect.vue'
// import CarModelPictureClassifySelect from  './carModelPictureClassifySelect.vue'
import CarModelPictureClassifyInput from  './carModelPictureClassifyInput.vue'
import CarSeriesColorSelect from  './carSeriesColorSelect.vue'
import CarSeriesColorInteriorSelect from  './carSeriesColorInteriorSelect.vue'
import CarModelColorSelect from  './carModelColorSelect.vue'
import CarModelInteriorColorSelect from  './carModelInteriorColorSelect.vue'

const car={
    install:function(Vue){
        Vue.component("carSeriesSelect",CarSeriesSelect);
        Vue.component("carModelSelect",CarModelSelect);
        // Vue.component("carModelPictureClassifySelect",CarModelPictureClassifySelect);
        Vue.component("carModelPictureClassifyInput",CarModelPictureClassifyInput);
        Vue.component("carSeriesColorSelect",CarSeriesColorSelect);
        Vue.component("carSeriesColorInteriorSelect",CarSeriesColorInteriorSelect);
        Vue.component("carModelColorSelect",CarModelColorSelect);
        Vue.component("carModelInteriorColorSelect",CarModelInteriorColorSelect);
    }
}
export default car