<template>
  <div>
    <el-form ref="form" :model="spuInfo" label-width="100px">
      <el-form-item label="spu名称" label-width="100px">
        <el-input
          v-model="spuInfo.spuName"
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
          placeholder="spu描述"
          v-model="spuInfo.description"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="spu图片" label-width="100px">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select value="" placeholder="还有1未选择">
          <el-option label="label" value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary">添加销售属性</el-button>
      <el-table
        style="width: 100%"
        label-width="100px"
        :data="spuInfo.spuSaleAttrList"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性名称列表" width="width">
          <template slot-scope="{ row, $index }">
            <!--   @close="handleClose(tag)"    @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"   @click="showInput"  -->
            <el-tag
              :key="sale.id"
              v-for="(sale, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
            >
              {{ sale.saleAttrValueName }}
            </el-tag>

            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <HintButton type="danger" icon="el-icon-delete"> </HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label-width="100px">
        <el-button type="primary">保存</el-button>
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
      spuForm: {},
      dialogImageUrl: "",
      dialogVisible: false,
      spuForm: {},
      spuInfo: {
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
    //uploda相关函数
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //请求获取修改
    async getUpdataspuFormInitdata(row) {
      const result = await this.$API.spu.get(row.id);
      // console.log(result);
      if (result.code === 200) {
        this.spuInfo = result.data;
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
    async getAddspuFormInitdata() {
      const traderesult = await this.$API.trademark.getList();
      if (traderesult.code === 200) {
        this.trademarkList = traderesult.data;
      }
      const saleAttrListresult = await this.$API.spu.getSaleAttrList();
      if (saleAttrListresult.code === 200) {
        this.saleAttrList = saleAttrListresult.data;
      }
    }
  },
  computed: {
    //根据所有的销售属性列表和spu
    //
    //从saleAttrList: [](总的)  中过滤spuInfo.spuSaleAttrList没有的
    // 过滤失败,
    unUseSaleAttrList() {
      //三个return少了任何一个都不可以
      return this.saleAttrList.filter(item => {
       return this.spuInfo.spuSaleAttrList.every(spuSaleAttr => {
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
