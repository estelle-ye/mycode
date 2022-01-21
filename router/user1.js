const express=require('express');
//引入上一级目录里的pool链接池
const pool=require('../pool.js');
let router=express.Router();
//挂载路由

//1.用户注册 post /register
router.post('/register',(req,res)=>{
    //1.1获取post请求的数据
    let obj=req.body;
    //1.2验证数据是否为空，如果为空，则提对对应状态码
    if(obj.uname===''){
        res.send({code:401,msg:'uname required'});
        return;
    };
    if(obj.upwd===''){
        res.send({code:402,msg:'upwd required'});
        return;
    };
    if(obj.email===''){
        res.send({code:403,msg:"email required"});
        return;
    };
    if(obj.phone===''){
        res.send({code:404,msg:"phone required"});
        return;
    }
    //插入数据
    //1.3执行sql语句
    pool.query('INSERT INTO xz_user SET ?',[obj],(err,result)=>{
        if(err) throw err;
        console.log(result);
    });
    if(reuslt.affectedRows>0){
        res.send({code:200,msg:'register suc'});
    };
});
//2.用户登录 post /login
router.post('/login',(req,res)=>{
    //2.1获取数据
    let obj=req.body;
    //2.2验证数据是否为空
    if(!obj.uname){
        res.send({code:401,msg:'uname required'});
        return;
    }
    if(!obj.upwd){
        res.send({code:402,msg:'upwd required'});
        return;
    }
    //2.3执行SQL语句
    pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(result.length>0){
            res.send({code:200,msg:'login success'});
        }else{
            res.send({code:301,msg:'login err'});
        }
    });
});
//3.检索用户 get /detail
router.get('/detail',(req,res)=>{
    let obj=req.query;
    if(obj.uid===''){
        res.send({code:401,msg:'uid required'});
    }
    //执行sql命令
    pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],(err,result)=>{
        if(result.length>0){
            res.send({code:200,msg:'ok',data:result[0]});
        }else{
            res.send({code:301,msg:'none exists'});
        }
    });
})
//4.修改用户资料 post /update
router.post('/update',(req,res)=>{
    let obj=req.body;
    //4.1遍历，判断数据是否为空
    let i=400;
    for(let key in obj){
        i++;
        if(obj[key]===''){
            res.send({code:i,msg:key+'required'});
            return;
        };
    };
    //4.2执行sql命令
    pool.query('UPDATE  xz_user SET ? WHERE uid=?',[obj,obj.uid],(err,result)=>{
        if(result.affectedRows>0){
            res.send({code:200,msg:'update success'});
        }else{
            res.send({code:301,msg:'update error'});
        }
    });
});
//5.用户列表 get /list
router.post('/list',(req,res)=>{
    let obj=req.body;
    if(!obj.pno) obj.pno=1;
    if(!obj.count) obj.count=1;
    let start=(obj.pno-1)*obj.count;
    let num=parseInt(obj.count);
    pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,num],(err,result)=>{
        if(result.length>0){
            res.send({
                recordCount:start+1,
                pageSize:num,
                pageCount:obj.count,
                pno:obj.pno,
                data:result
            });
        }else{
                res.send({code:500,msg:'cannot fine user_list'});
            }
    });
});
//导出路由器对象
module.exports=router;