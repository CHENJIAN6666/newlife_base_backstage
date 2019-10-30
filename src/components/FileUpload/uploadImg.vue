<template>
    <el-upload ref="upload" 
            action="/api/public/uploadimage"
            :data="uploadPicData"
            name="upfile"
            accept="image/*" 
            listType="picture-card"
            :multiple="false"
            :file-list="uploadPicList"
            :show-file-list="false"
            :on-success="handlePictureSuccess" >
            <img v-if="value" :src="value" width="100%" height="100%">
            <i v-else class="el-icon-plus"></i>
    </el-upload>

</template>
<script>
    export default {
        data:function(){
            return {
                uploadPicList:[],
                imageUrl:this.value

            }
        },
         
        props:['value',
                'uploadPicData',
                'show-file-list','label'],
        methods:{


        handlePictureSuccess(res,file,filelist){
            file.name=res.name;
            file.url=res.url;
            this.imageUrl=file.url;
            this.uploadPicList=filelist;
            //this.$emit('handleUpload',file.url);
            this.$emit('input', file.url);

      }
        },
        mounted(){
        },
        computed: {
        }
    }
</script>