<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
    <div v-show="isShowTable">
         <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr" >添加属性</el-button>
      <el-table style="width: 100%" border :data="attrList">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column> 
        <el-table-column prop="prop" label="属性值列表" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="(attrValue, index) in row.attrValueList"
              :key="attrList.id"
              style="margin: 0 20px"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateAttr(row)"
            ></el-button>
       <!-- 气泡确认框 -->     
        <el-popconfirm :title="`确定删除${row.attrName}`" @onConfirm="deleteAttrValue1($index)">
         <el-button type="danger" icon="el-icon-delete" size="mini"slot="reference" ></el-button>
     </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  <!-- 添加属性｜修改属性的结构 -->
  <div v-show="!isShowTable">
  <el-form :inline="true" ref="form"  label-width="80px" :model="attrInfo">
   <el-form-item label="属性名">
     <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
   </el-form-item>
  </el-form>
  <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName ">添加属性值</el-button>
  <el-button @click="isShowTable=true">取消</el-button>
  <el-table
    style="width: 100%;margin:20px 0" border :data="attrInfo.attrValueList" >
    <el-table-column
      align="center"
      type="index"
      label="序号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="prop"
      label="属性值名称"
      width="width">
      <template slot-scope="{row,$index}">
       <el-input v-model="row.valueName" placeholder="请输入属性名称" size="mini" v-if="row.flag" @blur="tolook(row)" @keyup.native.enter="tolook(row)" :ref="$index"></el-input>
       <span v-else @click="toedit(row,$index)" style="display:block;" >{{row.valueName}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="prop" 
      label="操作"
      width="width">
      <template slot-scope="{row,$index}">
       <!-- 气泡确认框 -->     
        <el-popconfirm :title="`确定删除${row.valueName}`" @onConfirm="deleteAttrValue($index)">
         <el-button type="danger" icon="el-icon-delete" size="mini"slot="reference" ></el-button>
     </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
    <el-button  @click="isShowTable=true">取消</el-button>
  </table>
  </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash中深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0, //三级分类ID
        categoryLevel: 3, //因为服务器也需要区分几级ID
      },
    };
  },
  methods: {
    //自定义事件回调
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
  // 获取平台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrid: this.attrInfo.id,
        valueName: "",
        //给每个属性值添加一个flag，用户切换查看模式与编辑模式，好处：可以独立控制每个属性的模式
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, //三级分类ID
        categoryLevel: 3, //因为服务器也需要区分几级ID
      };
    },
    // 修改某一属性
    updateAttr(row) {
      this.isShowTable = false;
      //由于数据结构中存在对象里面套数组，数组里面又有对象，这时需要深拷贝解决问题
      this.attrInfo = cloneDeep(row);

      this.attrInfo.attrValueList.forEach((item) => {
        // 这样写可以给属性值添加flag，但是视图不会跟着改变，因为flag不是响应式数据
        //   item.flag =false
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点的事件
    tolook(row) {
      if (row.valueName.trim() == "") {
        this.$message("请输入一个存在的属性值");
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) return;
      row.flag = false;
    },
    // 点击span回调，变为编辑模式
    toedit(row, index) { 
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deleteAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1)
  },
    deleteAttrValue1(index){
      this.attrList.splice(index,1)
  },
 async addOrUpdateAttr(){
    // 过滤属性值不是空的
    this.attrInfo.attrValueList= this.attrInfo.attrValueList.filter(item=>{
       if(item.valueName!=''){
         delete item.flag
         return true
       }
     })
     try{
  await  this.$API.attr.reqAddAttr(this.attrInfo)
  this.$message({type:'success',message:'保存成功'})
  this.getAttrList()
  this.isShowTable = true
  }catch(error){
  this.$message({type:'success',message:'保存失败'})
  }
  }
  }
};
</script>

