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
                v-if="row.isEdit"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display:'block;height:'100%';width:'100%'"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <template #reference>
                  <HintButton
                    type="warning"
                    size="mine"
                    icon="el-icon-delete"
                    title="删除"
                  >
                  </HintButton>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" >保存</el-button>
        <el-button type="primary" @click="isShoeList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
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
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
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
    showAddDiv() {
      this.isShoeList = false;
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryI: this.categary3Id,
        categoryLevel: 3
      };
    },
    //点击添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        // id:0,   新添加的属性值没有id
        valueName: "",
        isEdit: true //编辑模式
      });
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    //点击修改属性按钮
    shoeUpdataDiv(row) {
      this.isShoeList = false;
      this.attrForm = cloneDeep(row); //浅拷贝搞不定了   里面有一个数组
      //修改属性值当中已经存在了  属性  双击可编辑
      //   this.attrForm.attrValueList.forEach(item => item.isEdit = false)    不是响应式属性
      this.attrForm.attrValueList.forEach(item =>
        this.$set(item, "isEdit", false)
      );
    },
    //输入框回车事件
    toLook(row) {
      //失去焦点判定是否为空或重复
      // console.log(row);
      // console.log(this.attrForm.attrValueList);

      if (row.valueName.trim() === "") {
        this.$message.warning("请输入属性值");
        row.valueName = "";
        return;
      }
      let isRepeat = this.attrForm.attrValueList.some(item => {
        // console.log(item);
        if (item !== row) {
          //
          return item.valueName === row.valueName;
        }
      });
      if (isRepeat) {
        this.$message.warning("重复");
        row.valueName = "";
        return;
      }
      row.isEdit = false;
    },
    //span点击变input事件
    toEdit(row, index) {
      row.isEdit = true;
      //变为input获取聚焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //保存操作
   async save() {
      //获取参数,整理参数,发送请求,成功... , 失败....
      let attr = this.attrForm;
      attr.attrValueList = attr.attrValueList.filter(item => {
        if (item.valueName !== "") {
          delete item.isEdit;
          return true;
        }
      });
      if(  attr.attrValueList.length === 0){
        return
      }
      try {

      await  this.$API.attr.addAttrValue(attr)
      this.$message.success('成功')
      this.isShoeList = true
      this.getAttrList()
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
};
</script>
<style lang="scss"></style>
