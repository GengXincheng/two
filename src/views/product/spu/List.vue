<template>
  <div>
    <el-card>
      <CategorySelector @handlerCatgegory="handlerCatgegory"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <!-- spu列表页面 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" @click="showAddSpuForm">添加spu</el-button>
        <el-table :data="spuList" style="width: 100%">
          <el-table-column prop="prop" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                icon="el-icon-plus"
                type="success"
                size="mini"
                title="添加spu"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                icon="el-icon-deit"
                type="waring"
                size="mini"
                title="修改spu"
                @click="showUpdataSpuForm(row)"
              ></HintButton>
              <HintButton
                icon="el-icon-info"
                type="info"
                size="mini"
                title="查看spu的sku列表"
              ></HintButton>
              <HintButton
                icon="el-icon-delete"
                type="danger"
                size="mini"
                title="删除spu"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <!--  @size-change="handleSizeChange"
            @current-change="handleCurrentChange" -->
        <el-pagination
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- spu添加和修改烈面 -->
      <!-- .sync的简单和复杂用法   父子同步 -->
      <!-- <spuForm v-show="isShowSpuForm" :visible='isShowSpuForm' @update:visible = "isShowSpuForm = $event"></spuForm> -->
      <spuForm
        v-show="isShowSpuForm"
        ref="spu"
        :visible.sync="isShowSpuForm"
        @backSuccess="backSuccess"
      ></spuForm>
      <!-- sku添加页面 -->
      <skuForm v-show="isShowSkuForm"></skuForm>
    </el-card>
  </div>
</template>
<script>
// import sku from ''
import skuForm from "@/views/product/components/skuForm";
import spuForm from "@/views/product/components/spuForm";
export default {
  name: "spu",
  components: {
    spuForm,
    skuForm
  },
  data() {
    return {
      flag: "",
      categary1Id: "",
      categary2Id: "",
      categary3Id: "",
      spuList: [],
      page: 1,
      limit: 2,
      total: 0,
      //两个数据控制显示
      isShowSpuForm: false,
      isShowSkuForm: false
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
        // console.log(this.categary3Id);
        //发请求
        this.getSpuList();
      }
    },
    //获取列表分类
    async getSpuList(page = 1) {
      //   console.log();
      this.page = page;
      const result = await this.$API.spu.getList(
        this.page,
        this.limit,
        this.categary3Id
      );
      if (result.code === 200) {
        //   console.log(result.data.records);
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    //修改每页数量,没有修改成功
    handleSizeChange(size) {
      this.size = size;
      this.getSpuList();
    },
    //显示添加spuform的回调
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getAddspuFormInitdata(this.categary3Id);
    },
    //点击修改spu的回调,显示spu的修改页面
    showUpdataSpuForm(row) {
      this.flag = row.id;
      this.isShowSpuForm = true;
      //通过this.refs拿到子组件对象   调用子组件里的方法
      this.$refs.spu.getUpdataspuFormInitdata(row, this.categary3Id);
    },
    //点击添加sku的回调
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
    },
    //保存spu成功
    backSuccess() {
      if (this.flag) {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
      // 重置标志位
      this.flag = null
    }
  }
};
</script>
<style lang="scss"></style>
