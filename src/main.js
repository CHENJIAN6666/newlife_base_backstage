import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
import {default as api} from './utils/api'
import {hasPermission} from "./utils/hasPermission";

import {commonUtil} from "./utils/commonUtil";

import {resetModel} from "./utils/resetModel";

import uploadFile from './components/FileUpload'
import dictSelect from './components/Dict'
import orgSelect from './components/Org'
import userInput from './components/User'
import Ueditor from './components/ueditor'
import categorySelect from './components/cms'
import car from './components/car'
import followDetail from './components/cell'
import VueAMap from 'vue-amap';

Vue.use(VueAMap);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '246d89ff58e15542b443f99db8de9d8a',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView',
    'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.GraspRoad',
    'AMap.MarkerClusterer', 'AMap.Geocoder'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.13'
})


Vue.use(Ueditor);
Vue.use(uploadFile);
Vue.use(dictSelect);
Vue.use(userInput);
Vue.use(categorySelect);
Vue.use(car);
Vue.use(orgSelect);
Vue.use(followDetail);

Vue.use(ElementUI, {locale})
Vue.prototype.api = api
//重置表单
Vue.prototype.resetModel = resetModel
//全局的常量
Vue.prototype.hasPerm = hasPermission

//全局的常量
Vue.prototype.commonUtil = commonUtil

//生产环境时自动设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = (process.env.NODE_ENV != 'production')
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
