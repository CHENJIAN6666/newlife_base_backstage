import NewLifeUploadImg from  './uploadImg.vue'
import NewLifeUploadFile from  './uploadFile.vue'
import NewLifeUploadMultiImg from  './uploadMultiImg.vue'
const newLifeupload={
    install:function(Vue){
        Vue.component("newLifeUploadImg",NewLifeUploadImg);
        Vue.component("newLifeUploadFile",NewLifeUploadFile);
        Vue.component("newLifeUploadMultiImg",NewLifeUploadMultiImg);
    }
}
export default newLifeupload