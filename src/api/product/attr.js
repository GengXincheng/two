import request from '@/utils/request'

export default {
    getlist(category1Id,category2Id,category3Id){
        return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },
    delete(attrId){
        return request.delete(`/admin/product/deleteAttr/${attrId}`)
    },
    addOrUpdata(attr){
        return request.post('/admin/product/saveAttrInfo',attr)
    }
}
//属性的增删改查接口
//根据选中的123及分类id获取属性列表
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// attrInfoList
//根据属性id删除某个属性
// DELETE /admin/product/deleteAttr/{attrId}
// deleteAttr

//增加或修改属性
// POST /admin/product/saveAttrInfo