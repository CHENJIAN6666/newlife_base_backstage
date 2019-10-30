<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>

<script>
import '@/static/UE/ueditor.config.js'
import '@/static/UE/ueditor.all.js'
import '@/static/UE/lang/zh-cn/zh-cn.js'
import '@/static/UE/ueditor.parse.min.js'
  export default {
    
    watch: {
            value:{
                handler:function(newval,oldval){
                    if(newval!=null&&newval!=''&&newval!==oldval)
                        {
                           this.setUEContent(newval);
                        }else{

                          this.setUEContent('');

                        }
                  }
                }

            },
    name: 'ue',
    data () {
      return {
        editor: null,
        tempvalue:this.value
      }
    },
    props: {
      value: {
        type: String,
        default: null,
      },
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    create(){
      console.log("create start");
    }
    ,
    mounted() {
     console.log("mounted start");
      const _this = this;
      this.editor = UE.getEditor('editor', this.config); // 初始化UE
         console.log("初始化UE 完成");

      //this.editor.prototype.getActionUrl ="/api/public/fileUpload";
      
      UE.Editor.prototype._bkGetActionUrl=UE.Editor.prototype.getActionUrl;

      UE.Editor.prototype.getActionUrl = function(action) {
      //判断路径   这里是config.json 中设置执行上传的action名称
          if(action=='config'){
            return 'http://admin.jxnewlife.com/api/public/ueditor'
          }
          if (action == 'uploadimage'){
                return 'http://admin.jxnewlife.com/api/public/uploadimage?category=ue';
                // return 'http://localhost:8080/public/uploadimage?category=ue';    /* 这里填上你自己的上传图片的action */
            }
         return ''
      }
    
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.tempvalue); // 确保UE加载完成后，放入内容。
      });

      this.editor.addListener("contentChange", function () {
            _this.setContent(); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }, 
      setUEContent(val){
         this.editor.setContent(val);
      },
      setContent()
      {
        console.log(this.getUEContent())
         this.$emit('getUeCon', this.getUEContent());
      }

    },
    destroyed() {
      
      this.editor.destroy();
    }
  }
</script>