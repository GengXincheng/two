import request from '@/utils/request'
import { add } from 'lodash'

export default{
//     /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark
    delete(id){
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    } ,
// POST /admin/product/baseTrademark/save
// 新增BaseTrademark
    // add(){
    //     return request.post('/admin/product/baseTrademark/save')
    // },   错误示范
// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark
    addOrupdate(trademark){
      if(trademark.id){
          //修改
            return request.put('/admin/product/baseTrademark/update',trademark)
      }else{
          //增加
          return request.post('/admin/product/baseTrademark/save',trademark)
      }
    },
// GET /admin/product/baseTrademark/{page}/{limit}
// 分页列表
    getPageList(page,limit){
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
    },
    //获取所有的分页列表
    getList(){
        return request.get('/admin/product/baseTrademark/getTrademarkList')
    }

}
//最终往外暴露的是
// {
//     default:{}
// }