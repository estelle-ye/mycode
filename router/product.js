const express=require('express');
const pool=require('../pool.js');//引入上一个目录里的连接池模块
let router=express.Router();
//挂载路由
//1.商品列表 get /list
router.get('/list',(req,res)=>{
    res.send('商品列表');
});
//导出路由
module.exports=router;