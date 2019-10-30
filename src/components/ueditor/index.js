import Ueditor from  './ueditor.vue'
const ueditor={
    install:function(Vue){
        Vue.component("ueditor",Ueditor);
    }
}
export default ueditor