<template>
  <div class="upload-container">
    <el-upload
      :show-file-list="true"
      :data="dataobj"
      :action="action"
      :multiple="multiple"
      :name="fileName"
      :accept="accept"
      :drag="drag"
      :limit="limit"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :headers="headers"
      :on-progress="onProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      class="image-uploader"
      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
import { getArrByKey } from "@/utils";
import { getToken } from "@/utils/auth";
import openWindow from "@/utils/openWindow";
export default {
  name: "AvatarUpload",
  props: {
    value: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: {
        fileName: "file",
        limit: 1,
        multiple: false,
        accept: "image/*",
        action: "",
        drag: false
      }
    }
  },
  data() {
    return {
      headers: {
        "x-access-token": getToken() //从cookie里获取token，并赋值  x-access-token ，而不是token
      },
      limit: this.config.limit,
      fileName: this.config.fileName,
      multiple: this.config.multiple,
      accept: this.config.accept,
      action: this.config.action,
      drag: this.config.drag,
      dataobj: { filename: this.config.fileName, group: this.config.group }
    };
  },
  computed: {
    fileList() {
      const imgarr = [];
      if (this.value === "") {
        return [];
      }
      imgarr.push({ url: this.value });
      return imgarr;
    }
  },
  methods: {
    emitInput(val) {
      this.$emit("input", val);
    },
    handleRemove(file, fileList) {
      this.emitInput("");
    },
    handlePreview(file) {
      openWindow(file.url, "图片预览", "500", "400");
    },
    handleExceed(files, fileList) {
      this.$message.error("最多上传" + this.limit + "张图片");
    },
    beforeUpload(file) {
      const isIMG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isIMG) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return false;
      }
      if (!getToken()) {
        this.$message.error("您还没登陆或登陆失效,请重新登陆!");
        return false;
      }
      return isIMG && isLt5M;
    },
    onProgress(event, file, fileList) {
      console.log("========onProgress=========");
      console.log(event, file, fileList);
      console.log("========onProgress=========");
    },
    handleSuccess(res, file, fileList) {
      if (res.status === 1) {
        this.$message.success("上传成功！");
        this.emitInput(res.data.url);
      } else {
        this.$message.error(res.msg);
      }
    },
    handleError(err, file, fileList) {
      this.$message.error(err);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.image-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 160px;
    height: 160px;
    .el-upload-dragger {
      height: 100%;
    }
    &:hover {
      border-color: #409eff;
    }
  }
  .el-upload-list__item {
    width: 160px;
    height: 160px;
  }
  .image {
    width: 178px;
    height: 178px;
    display: block;
  }
  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
}
</style>
