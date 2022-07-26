<template>
  <div>
    <el-form ref="form"  label-width="80px">
      <el-form-item label="Spu名称">
       {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称" >
        <el-input  placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
        <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
        <el-form-item label="重量(千克)">
        <el-input  placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
          <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性" >
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in AttrInfoList" key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
       <el-form-item label="销售属性">
        <el-form :inline="true" ref="form"  label-width="80px">
          <el-form-item :label="sale.saleAttrName" v-for="(sale,index) in spuSaleAttrList" :key="sale.id">
            <el-select placeholder="请选择" v-model="sale.attrIdAndValueId">
              <el-option :label="saleAttr.saleAttrValueName" :value="`${sale.id}:${saleAttr.id}`" v-for="(saleAttr,index) in sale.spuSaleAttrValueList" :key="saleAttr.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" >
        <el-table
          style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column
            prop="prop"
            type="selection"
            width="80">
          </el-table-column>
           <el-table-column
            prop="prop"
            label="图片"
            width="width">
            <template slot-scope="{row,$index}">
             <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
           <el-table-column
            prop="imgName"
            label="名称"
            width="width">
          </el-table-column>
           <el-table-column
            prop="prop"
            label="操作"
            width="width">
            <template slot-scope="{row,$index}">
            <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设为默认</el-button>
            <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ItemVue from '@/layout/components/Sidebar/Item.vue';
export default {
name:'SkuForm',
data(){
  return{
    spuImageList:[],
    spuSaleAttrList:[],
    AttrInfoList:[],
    skuInfo:{
      //第一类：父组件给的数据
      category3Id:0,
      spuId:0,
      tmId:0,
      //第二类：通过数据双向绑定v-model
      skuName:'',
      price:'',
      weight:'',
      skuDesc:'',
      //第三类：自己书写代码
      //默认图片
      skuDefaultImg:"",
      skuImageList:[],
      //平台属性
      skuAttrValueList:[
        // {
        //   attrId:0,
        //   ValueId:0
        // }
      ],
      //销售属性
      skuSaleAttrValueList:[],
      
      
    },
    spu:{},
    //收集图片数据字段：但是缺少了isDefault字段，提交给服务器时需要整理参数

    imgList:[],
  }
},
methods:{
async getData(category1Id,category2Id,spu){
  this.skuInfo.category3Id=spu.category3Id;
  this.skuInfo.spuId=spu.spuId;
  this.skuInfo.tmId=spu.tmId;
  this.spu=spu
 let result =  await this.$API.sku.reqSpuImageList(spu.id)
 if(result.code==200){
  //给服务器返回数据加isDefault字段
 let list = result.data
 list.forEach(item=> {
  item.isDefault = 0
 });
 this.spuImageList = list
 }
 let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)
 if(result1.code==200){
  this.spuSaleAttrList=result1.data
 }
 let result2 = await this.$API.sku.reqAttrInfoList(category1Id,category2Id,spu.category3Id)
 if(result2.code==200){
  this.AttrInfoList=result2.data
}
},
handleSelectionChange(params){
//获取到用户选中图片的信息数据，但是需要注意，当前收集的数据中缺少了isDefault字段
this.imgList=params
},
changeDefault(row){
  this.spuImageList.forEach(item=>{
    item.isDefault=0
  })
  row.isDefault=1;
  this.skuInfo.skuDefaultImg = row.imgUrl
},
cancel(){
  this.$emit('changeScenes',0)
  //清除数据
  Object.assign(this._data,this.$options.data())
},
save(){
  const {attrInfoList,skuInfo,spuSaleAttrList} = this
  let arr= []
  attrInfoList.forEach(element => {
    //当前平台属性用户进行选择
    if(element.attrIdAndValueId){
       const [attrId,valueId] = element.attrIdAndValueId.split(":")
       //携带给服务器的参数应该是对象
       let obj = {valueId,attrId}
       arr.push(obj)
    }
  });
  //将整理好的参数赋值给
  skuInfo.skuAttrValueList = arr
}
}
}
</script>

<style>

</style>