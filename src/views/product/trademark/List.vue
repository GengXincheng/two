<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialogo"
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
          <el-button type="waring" size="mini" @click="showUpdataDialogo(row)"
            >修改</el-button
          >
          <el-button type="danger" size="mini" @click="deleteTrademark(row)"
            >删除</el-button
          >
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
      @current-change="getTrademarkList"
      layout=" prev, pager, next, jumper,-> ,sizes,total"
      @size-change="handleSizeChange"
      :total="total"
    >
    </el-pagination>
    <!-- 点击或修改弹出的对话框页面 -->
    <!-- 官网model不行??????  后期看看再改成model(官网样式)  可能还得把data中的的数据拿过来-->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmForm">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
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
          <el-button type="primary" @click="addOrUpdataTrademark"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
// import { Row } from 'node_modules/_element-ui@2.13.2@element-ui/types';
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogFormVisible: false, //决定diglog是否显示
      formLabelWidth: "100px",
      // imageUrl: "",
      tmForm: {
        //收集表单数据
        tmName: "",
        logoUrl: "",
        delivery: false
      }
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
      // console.log(res);
      this.tmForm.logoUrl = res.data;
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      //限制图片的大小和格式
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //展示logo   解决bug
    showAddDialogo() {
      this.dialogFormVisible = true;

      this.tmForm = {
        tmName: "",
        logoUrl: ""
      };
    },
    //修改
    showUpdataDialogo(row) {
      console.log(row);
      this.dialogFormVisible = true;
      this.tmForm = { ...row }; //直接赋值会改变列表里的数据,需要用到拷贝(浅拷贝)    基本数据类型不存在深浅拷贝 里面只有基本数据类型
      //上面的最简单的浅拷贝   11video
    },
    // 删除品牌
    deleteTrademark(row) {
     // console.log(row);
      this.$confirm("此操作将永久删除该品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then( async () => {
          //点击成功的逻辑
          try {
           await this.$API.trademark.delete(row.id);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page-1)
          } catch (error) {
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
        })
        .catch(() => {
          //点击取消按钮的逻辑
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击确定按钮发请求或修改品牌
    async addOrUpdataTrademark() {
      //获取参数
      let trademark = this.tmForm;
      //整理参数

      //发送请求
      try {
        const result = await this.$API.trademark.addOrupdate(trademark);
        //提示成功
        this.$message.success(trademark.id ? "修改成功" : "添加成功");

        //关闭logo   回到
        this.dialogFormVisible = false;
        // 重新发送请求    获取数据    修改还得调到修改的那一页
        this.getTrademarkList(trademark.id ? this.page : 1);
      } catch (error) {
        this.$message.error(trademark.id ? "修改失败" : "添加失败");
      }
      //成功干啥

      //失败
    },
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
  border-color: #409eff;
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
