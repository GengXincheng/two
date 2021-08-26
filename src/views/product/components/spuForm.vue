<template>
  <div>
    <el-form ref="form" :model="spuForm" label-width="100px">
      <el-form-item label="spu名称" label-width="100px">
        <el-input
          v-model="spuForm.spuName"
          placeholder="spu名称"
          style="width='100px'"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuForm.tmId" placeholder="选择品牌">
          <el-option
            :label="tm.tmName"
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
            :value="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述" label-width="100px">
        <el-input
          v-model="spuForm.description"
          placeholder="spu描述"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="spu图片" label-width="100px">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="unUseSaleAttrIdName"
          :placeholder="
            unUseSaleAttrList.length > 0
              ? `还有${unUseSaleAttrList.length}未选择`
              : '没有了'
          "
        >
          <el-option
            :label="unUseSaleAttr.name"
            :value="`${unUseSaleAttr.id}:${unUseSaleAttr.name}`"
            v-for="(unUseSaleAttr, index) in unUseSaleAttrList"
            :key="unUseSaleAttr.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="addSaleAttr">添加销售属性</el-button>
      <el-table
        style="width: 100%"
        label-width="100px"
        :data="spuForm.spuSaleAttrList"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性名称列表" width="width">
          <template slot-scope="{ row, $index }">
            <!--        -->
            <el-tag
              :key="sale.id"
              v-for="(sale, index) in row.spuSaleAttrValueList"
              closable
              @close="handleClose(row, index)"
              :disable-transitions="false"
            >
              {{ sale.saleAttrValueName }}
            </el-tag>

            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
              ref="saveTagInput"
              size="small"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <HintButton
              type="danger"
              icon="el-icon-delete"
              @click="spuForm.spuSaleAttrList.splice($index, 1)"
            >
            </HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="$emit('update:visible', false)"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
    <!-- <el-input v-model="unUseSaleAttrList" placeholder="">{{unUseSaleAttrList}}</el-input> -->
  </div>
</template>

<script>
export default {
  name: "spuForm",
  props: ["visible"],
  data() {
    return {
      category3Id: "",
      unUseSaleAttrIdName: "", //收集name和id
     
      dialogImageUrl: "",
      dialogVisible: false,
      
      spuForm: {
        category3Id: "",
        description: "",
        // id: 2915,
        spuImageList: [],
        spuName: "1",
        spuSaleAttrList: [],
        tmId: ""
      },
      spuImageList: [],
      trademarkList: [],
      saleAttrList: []
    };
  },
  methods: {
    // 点击添加西欧奥兽属性
    showInput(row) {
      //,没改变的话可能是非响应数据
      // row.inputVisible  = true
      this.$set(row, "inputVisible", true);
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //uploda相关函数,删除回调   手机图片
    handleRemove(file, fileList) {
      //
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    //预览大图,官网已经写好 ,不用动
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传成功的回调
    handleAvatarSuccess(res, file, fileList) {
      this.spuImageList = fileList;
    },
    //请求获取修改
    async getUpdataspuFormInitdata(row, category3Id) {
      this.category3Id = category3Id;
      const result = await this.$API.spu.get(row.id);
      // console.log(result);
      if (result.code === 200) {
        this.spuForm = result.data;
      }
      const Imageresult = await this.$API.sku.getSpuImageList(row.id);
      if (Imageresult.code === 200) {
        let spuImageList = Imageresult.data;
        //为了让uploda显示图片,给每一个对象添加name 和url
        spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }
      const traderesult = await this.$API.trademark.getList();
      if (traderesult.code === 200) {
        this.trademarkList = traderesult.data;
      }
      const saleAttrListresult = await this.$API.spu.getSaleAttrList();
      if (saleAttrListresult.code === 200) {
        this.saleAttrList = saleAttrListresult.data;
      }
    },
    //请求获取添加
    async getAddspuFormInitdata(category3Id) {
      this.category3Id = category3Id;
      const traderesult = await this.$API.trademark.getList();
      if (traderesult.code === 200) {
        this.trademarkList = traderesult.data;
      }
      const saleAttrListresult = await this.$API.spu.getSaleAttrList();
      if (saleAttrListresult.code === 200) {
        this.saleAttrList = saleAttrListresult.data;
      }
    },
    //点击添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.unUseSaleAttrIdName.split(":");
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      };
      this.spuForm.spuSaleAttrList.push(obj);
      this.unUseSaleAttrIdName = "";
    },
    //是区域焦点的回调
    handleInputConfirm(row) {
      let saleAttrValueName = row.inputValue;
      let baseSaleAttrId = row.baseSaleAttrId;
      // 判断是否为囧
      if (saleAttrValueName.trim() === "") {
        row.inputValue = "";
        return;
      }
      //盘算当前这个是否重复
      let isrePeat = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === saleAttrValueName;
      });
      if (isrePeat) {
        this.$message.info("重复");
        row.inputValue = "";
        return;
      }
      // 销售shuxingzho
      let obj = {
        saleAttrValueName,
        baseSaleAttrId
      };
      row.spuSaleAttrValueList.push(obj); //销售属性值
      row.inputVisible = false;
      row.inputValue = "";
    },
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index);
    },
    //保存按钮  添加或者修改
    async save() {
      //获取参数
      let { spuForm, spuImageList, category3Id } = this;
      //整理参数
      spuForm.category3Id = category3Id;
      let spuImageLis = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        };
      });
      console.log(spuImageLis);
      spuForm.spuImageList = spuImageLis;
      // spuForm.tmId = this.spuForm.tmId;/

      spuForm.spuSaleAttrList.forEach(item => {
        delete item.inputVisible;
        delete item.inputValue;
      });
      //发送请求
      try {
       await this.$API.spu.addUpdate(spuForm)
        this.$message.success("成功");
        //返回到列表页
        this.$emit("updata:visable", false);
        this.$emit("backSuccess");
        //通知返回列表页成功
        this.resetData();
      } catch (error) {
        this.$message.error("保存失败");
      }
      //成功
      //失败
    },
    resetData() {
      this.category3Id = "";
      this.unUseSaleAttrIdName = ""; //收集name和id
    
      this.dialogImageUrl = "";
      this.dialogVisible = false;
     
      this.spuForm = {
        category3Id: "",
        description: "",

        spuImageList: [],
        spuName: "1",
        spuSaleAttrList: [],
        tmId: ""
      };
      this.spuImageList = [];
      this.trademarkList = [];
      this.saleAttrList = [];
    }
  },
  computed: {
    //根据所有的销售属性列表和spu
    //
    //从saleAttrList: [](总的)  中过滤spuForm.spuSaleAttrList没有的
    // 过滤失败,
    unUseSaleAttrList() {
      //三个return少了任何一个都不可以
      return this.saleAttrList.filter(item => {
        return this.spuForm.spuSaleAttrList.every(spuSaleAttr => {
          // console.log(spuSaleAttr.saleAttrName);
          // console.log(item.name);
          // console.log(spuSaleAttr.saleAttrName !== item.name);
          return spuSaleAttr.saleAttrName !== item.name;
        });
      });
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
