import request from '@/utils/request'
// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

//处理添加品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
        // 带给服务器数据携带id
        if (tradeMark.id) {
            return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
        } else {
            return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
        }
    }
    //删除品牌
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })