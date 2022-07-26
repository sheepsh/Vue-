<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="Spu名称">
        <el-input placeholder="请输入Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input
          type="textarea"
          placeholder="Spu描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="SpuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"> </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr" >添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column prop="baseSaleAttrId" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="160px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
                <!-- @close="handleClose(tag)" -->
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
                   <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" --> 
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
                
              >
              </el-input>
               <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="160px">
            <template slot-scope="{row,$index}">
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="$emit('changeScene', {scene:0,flag:''})">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>  

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: 0,
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tradeMarkList: [], //储存品牌信息
      SpuImageList: [], //spu图片数据
      SaleAttrList: [], //销售属性数据
      attrIdAndAttrName:'', //未选择的销售属性id
    };
  },
  methods: {
    handleRemove(file, fileList) {
     this.spuImageList=fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async initSpuData(spu) {
      //获取spu信息数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let TradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (TradeMarkResult.code == 200) {
        this.tradeMarkList = TradeMarkResult.data;
      }
      //获取spu图片的数据
      let SpuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (SpuImageResult.code == 200) {
        let listArr = SpuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.SpuImageList = listArr;
      }
     //获取平台全部销售属性
      let SaleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (SaleResult.code == 200) {   
        this.SaleAttrList =SaleResult.data;
      }
    },
    //照片墙图片收集
    handlerSuccess(response, file, fileList){
    this.spuImageList=fileList
    },
    addSaleAttr(){
     const [baseSaleAttrId,saleAttrName]= this.attrIdAndAttrName.split(':')
     let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleValueList:[]}
     this.spu.spuSaleAttrList.push(newSaleAttr)
    },
    //添加按钮回调
    addSaleAttrValue(row){
    this.$set(row,'inputVisible',true);
    this.$set(row,'inputValue','')
    
    },
    //el-input失去焦点事件
    handleInputConfirm(row){
      // 解构销售属性当中收集数据
      const{baseSaleAttrId,inputValue} = row
      if(inputValue.trim()==''){
        this.$message('属性值不能为空')
        return   
      }
      // 新增销售属性值
      let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      if(!result)return
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
     row.inputVisible = false
    },
    async addOrUpdateSpu(){
      this.spu.spuImageList = this.spuImageList.map((item)=>{
        return{
          imgName:item.name,
          imgUrl:(item.response && item.response.data)||item.url
        }
      })
      let result =  await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code==200){
        this.$message({type:'success',message:'修改成功'})
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
      }
      Object.assign(this._data,this.$options.data())
    },
    //点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id){
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的（清除数据）
      Object.assign(this._data,this.$options.data())
      //添加spu的时候收集3级分类id
      this.spu.category3Id=category3Id
      let TradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (TradeMarkResult.code == 200) {
      this.tradeMarkList = TradeMarkResult.data;
      }
      //获取平台全部销售属性
      let SaleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (SaleResult.code == 200) {   
        this.SaleAttrList =SaleResult.data;
      }
    }
  },
  computed:{
  unSelectSaleAttr(){
  let result =  this.SaleAttrList.filter(item=>{
  return this.spu.spuSaleAttrList.every(item1=>{
   return item.name!=item1.saleAttrName;
  }) 
  })
  return result
}
  },
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