<template>
  <div>
    <el-card>
      <!-- 三级联动 -->

      <CategorySelector @handlerCatgegory="handlerCatgegory"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <div v-show="isShoeList">
        <!-- 属性的列表 -->
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv"
          >添加属性</el-button
        >
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                title="修改"
                size="mini"
                icon="el-icon-edit"
                 @click="shoeUpdataDiv(row)"
              ></HintButton>
              <HintButton
                type="danger"
                title="删除"
                size="mini"
                icon="el-icon-delete"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShoeList">
        <!-- 添加或修改页面 -->
        <el-form :inline="true" label-width="80px" :model="attrForm">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addAttrValue">添加属性值</el-button>
        <el-button type="primary" @click="isShoeList = true">取消</el-button>
        <!-- 展示属性值的列表 -->
        <el-table
          border
          style="width: 100%; margin:20px 0"
          :data="attrForm.attrValueList"
        >
          <el-table-column
            prop="prop"
            type="index"
            label="序号"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
             <HintButton type='warning' size='mine' icon='el-icon-delete'  title="删除" ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button type="primary" @click="isShoeList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
// import { Level } from "node_modules/_chalk@2.4.2@chalk/types";
  import cloneDeep from 'lodash/cloneDeep'
  // import cloneDeep from ''
  // import cloneDeep from ''
export default {
  name: "attr",
  data() {
    return {
      categary1Id: "",
      categary2Id: "",
      categary3Id: "",
      attrList: [],
      isShoeList: true,
      attrForm: {
        attrName:'',
        attrValueList:[],
        categoryId:0,
        categoryLevel:3,
      }
    };
  },
  methods: {
    handlerCatgegory({ categoryId, level }) {
      if (level === 1) {
        this.categary1Id = categoryId;
        this.categary2Id = "";
        this.categary3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.categary2Id = categoryId;
        this.categary3Id = "";
      } else if (level === 3) {
        this.categary3Id = categoryId;
        //发请求
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { categary1Id, categary2Id, categary3Id } = this;
      const result = await this.$API.attr.getlist(
        categary1Id,
        categary2Id,
        categary3Id
      );
      //   console.log(result);
      if (result.code === 200) {
        this.attrList = result.data;
        // console.log(this.attrList);
      }
    },
    //点击添加按钮显示的添加的页面
    showAddDiv(){
      this.isShoeList = false
      this.attrForm = {
        attrName:'',
        attrValueList:[],
        categoryI:this.categary3Id,
        categoryLevel:3,
      }
    },
    //点击添加属性值
    addAttrValue(){
      this.attrForm.attrValueList.push({
        attrId:this.attrForm.id,
        // id:0,   新添加的属性值没有id
        valueName:""
      })
    },
    //点击修改属性按钮   
    shoeUpdataDiv(row){
      this.isShoeList = false
      this.attrForm = cloneDeep(row) //浅拷贝搞不定了   里面有一个数组
    },
  }
};
</script>
<style lang="scss"></style>
