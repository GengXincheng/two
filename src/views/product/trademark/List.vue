<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="dialogFormVisible = true"
      >添加</el-button
    >

    <el-table border style="width: 100%;margin:20px 0" :data="trademarkList">
      <el-table-column
        prop="prop"
        label="序号"
        align="center"
        width="80"
        type="index"
      >
      </el-table-column>
      <el-table-column label="名称" width="width" prop="tmName">
      </el-table-column>
      <el-table-column label="logo" width="width">
        <!-- 有额外的结构 就会用到 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="height:80px;width:80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="waring" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
         @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
         -->
    <el-pagination
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      page-count="3"
      @current-change="getTrademarkList"
      layout=" prev, pager, next, jumper,-> ,sizes,total"
      @size-change="handleSizeChange"
      :total="total"
    >
    </el-pagination>
    <!-- 点击或修改弹出的对话框页面 -->
    <!-- 官网model不行??????  后期看看再改成model(官网样式)-->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width:80%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <template #tip>
    <div class="el-upload__tip">
      只能上传 jpg/png 文件，且不超过 500kb
    </div>
  </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogFormVisible: true, //决定diglog是否显示
      formLabelWidth: "100px",
      imageUrl: '',
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
     handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    //切换页码
    //   handleCurrentChange(page){
    //       this.page=page
    //       this.getTrademarkList()
    //   },
    //
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    }
  }
};
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
