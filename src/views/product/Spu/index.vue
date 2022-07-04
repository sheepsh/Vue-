<template>
  <div>
    <el-card style="margin:20px 0 ">
       <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0" ></CategorySelect>
    </el-card>
      <el-card>
        <div v-show="scene==0">
           <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加Spu</el-button>
       <el-table
         style="width: 100%"
         border
         :data="records">
         <el-table-column
           type="index"
           align="center" 
           label="序号" 
           width="80">
         </el-table-column>
            <el-table-column
           align="center"
           prop="spuName"
           label="Spu名称" >
         </el-table-column>
        
           <el-table-column
           align="center"
           prop="description"
           label="Spu描述" >
         </el-table-column>
        
           <el-table-column
           align="center"
           prop="prop"
           label="操作" >
           <template slot-scope="{row,$index}">
            <hint-button type="success" icon="el-icon-plus" size="mini" title="添加SKu" ></hint-button>
            <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改Spu" @click="updateSpu(row)"></hint-button>
            <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前Spu全部sku列表"></hint-button>
            <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除Spu" ></hint-button>
           </template>
         </el-table-column>
       </el-table> 
          <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper, -> , sizes ,total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
        </div>
        <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
        <SkuForm v-show="scene==2"></SkuForm>
    </el-card>
  
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
name:'Spu',
data(){
  return{
    category1Id:'',
    category2Id:'',
    category3Id:'',
    
     // 代表分页器第几页
    page: 1,
      // 当前页面展示数据条数
    limit: 3,
      // 总数据条数
    total: 0,
      // spu列表数据
    records:[],
    scene:0, 
  }
},

methods:{
  getCategoryId({categoryId,level}){ 
    if(level==1){
      this.category1Id=categoryId
      this.category2Id='' 
      this.category3Id=''
    }else if(level==2) {
      this.category2Id=categoryId
      this.category3Id=''
    }else {
      this.category3Id=categoryId
      this.getSupList()
  }
},
 async getSupList(){
  const {page,limit,category3Id} =this
let result =  await this.$API.spu.reqSpuList(page,limit,category3Id)
// console.log(result);
if(result.code==200){
  this.total=result.data.total
  this.records=result.data.records
}
},
handleCurrentChange(page){
     this.page=page
     this.getSupList()
},
handleSizeChange(limit){
   this.limit=limit
   this.getSupList()
},
addSpu(){
  this.scene=1
},
updateSpu(row) {
  this.scene=1;
  this.$refs.spu.initSpuData(row)

},
changeScene(scene){
  this.scene=scene
  this.getSupList(this.page)
}

},
components:{
  SpuForm,
  SkuForm
}
}
</script>

<style>

</style>