<template >
    <el-upload ref="upload" 
            action="/api/public/fileUpload"
            :data="uploadFileData"
            name="files"
            listType="text"
            :file-list="uploadFileList"
            :limit="limit"
            :show-file-list="true"
            :on-success="handleFileSuccess" >
              <el-button size="small" type="primary">点击上传</el-button>

    </el-upload>

</template>
<script>
    export default {
          watch: {

                value:{
                immediate:true,
                handler:function(newval,oldval){
                    if(newval!=null && newval!=''&&newval!=oldval)
                        {
                            this.uploadFileList=this.str2Arr(newval);
                        }else{
                           this.uploadFileList=this.str2Arr("");
                        }
                  }
                }

            },

        data:function(){


            return {
                tempValue:this.value,
                uploadFileList:this.str2Arr(this.value),
            }
        },
        tempValue:'',
        props:['value',
                'uploadFileData',
                'show-file-list','label','limit'],
        uploadFileList:[],
        methods:{
        str2Arr(str){
            let upl = [];
            if(str=="") return upl;
            str.split(',').forEach(
                s=>upl.push({'name':s.substring(s.lastIndexOf('/')+1),'url':s })
            );
            return upl;

        },

        handleFileSuccess(res,file,filelist){
            file.name=res.returnData.list[0].name;
            file.url=res.returnData.list[0].url;
            let curls='';
            filelist.forEach(s=>curls=curls+ ","+s.url);
            //this.$emit('handleUpload',{url:curls.substring(1)});
             this.$emit('input', curls.substring(1));
      }
        },
        mounted(){
        },
        computed: {
        }
    }
</script>