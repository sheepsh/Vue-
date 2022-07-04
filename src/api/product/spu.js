import { _ } from 'core-js'
import request from '../../utils/request'

export const reqSpuList = (page, limit, category3Id) => request({ url: `admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })


//获取spu信息
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

//获取品牌信息
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })
    //获取图片信息
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
    //获取平台销售属性
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}