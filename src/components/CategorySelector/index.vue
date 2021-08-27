<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.categary1Id"
          placeholder="请选择"
          @change="handleCategory1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.categary2Id"
          placeholder="请选择"
          @change="handleCategory2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.categary3Id"
          placeholder="请选择"
          @change="handleCategory3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Categoryselector",
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        categary1Id: "",
        categary2Id: "",
        categary3Id: ""
      }
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      const result = await this.$API.category.getCategory1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    //选中了一级风分类
    async handleCategory1(category1Id) {
      //需要清空二三级
      this.category2List = [];
      this.category3List = [];
      this.cForm.categary2Id = "";
      this.cForm.categary3Id = "";
        this.$emit('handlerCategory',{categoryId:category1Id,level:1})
      const result = await this.$API.category.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    //选中了二级id
    async handleCategory2(category2Id) {
      this.category3List = [];
      this.cForm.categary3Id = "";
      this.$emit('handlerCategory',{categoryId:category2Id,level:2})
      const result = await this.$API.category.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
    //选中昂3级分类列表
    handleCategory3(category3Id) {
        this.$emit('handlerCategory',{categoryId:category3Id,level:3})
    }
  }
};
</script>

<style></style>
