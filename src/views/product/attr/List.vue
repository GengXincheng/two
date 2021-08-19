<template>
  <div>
    <el-card>
      <!-- 三级联动 -->

      <CategorySelector @handlerCatgegory="handlerCatgegory"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <!-- 属性的列表 -->
    </el-card>
  </div>
</template>
<script>
// import { Level } from "node_modules/_chalk@2.4.2@chalk/types";
export default {
  name: "attr",
  data() {
    return {
      categary1Id: "",
      categary2Id: "",
      categary3Id: "",
      attrList:[]
    };
  },
  methods: {
    handlerCatgegory(categoryId, level) {
      if (level === 1) {
        this.categary1Id = categoryId;
        this.categary2Id = '';
        this.categary3Id = '';
    this.attrList = []
      } else if(level === 2){
          this.categary2Id = categoryId
          thsi.categary3Id = ''
      }else if(level === 3){
          this.categary3Id = categoryId
          //发请求
          this.getAttrList()
      }
    },
    getAttrList(){},
  }
};
</script>
<style lang="scss"></style>
