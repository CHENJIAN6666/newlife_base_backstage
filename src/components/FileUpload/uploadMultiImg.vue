<template>
  <div>
    <el-upload
      ref="upload"
      :disabled="disabled"
      action="/api/public/uploadimage"
      list-type="picture-card"
      name="upfile"
      :file-list="fileList"
      :data="uploadData"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  // name:'',
  props:{
    disabled: Boolean,
    uploadData:{
      type : Object,
      required : true
    },
    imgUrlList:{
      type: Array,
      required : true
    }
  },
   data() {
      return {
        fileList:[],
        dialogImageUrl:'',
        dialogVisible: false
      };
    },
    methods: {
      handleSuccess(response, file, fileList){
        this.imgUrlList.push(response.url)
      },
      handleRemove(file, fileList) {
        let index = this.imgUrlList.indexOf(file.response.url)
        this.imgUrlList.splice(index,1)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
    mounted(){
      // if(this.imgUrlList.length === 0){
       
      // }else{
        this.fileList = []
        // this.$refs.upload.clearFiles()
        this.imgUrlList.forEach(item => {
          this.fileList.push({url:item})
        });
        // console.log(this.fileList)
      // }
    }
}
</script>
