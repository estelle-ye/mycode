const express=require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser')
const app=express();
app.listen(8080);
const pool=mysql.createPool({
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'',
    database:'tedu',
    connectionLimit:'15'
});
//使用body-parser中间件，将post请求的数据解析为对象
app.use(bodyParser.urlencoded({
    extended:false
}));
//1.创建获取员工数据的路由-即API（get /v1/emps）
app.get('/v1/emps',(req,res)=>{
    let obj=req.query;
    if(!obj.pno){
        obj.pno=1;
    };
    if(!obj.count){
        obj.count=5;
    };
    let start=(obj.pno-1)*obj.count;
    let count=parseInt(obj.count);
    pool.query('SELECT * FROM emp limit ?,?',[start,count],(err,result)=>{
        if(err){
            res.send({
                code:500,
                msg:'server error'
            });
            return;    
        };
        res.send({
            code:200,
            msg:'success',
            data:result  
        });
    });
});
//2.检索员工（get /v1/emps/编号）
//http://127.0.0.1:8080/v1/emps/1
app.get('/v1/emps/:eid',(req,res)=>{
    //获取路由传参的数据
    let obj=req.params;
    pool.query('SELECT * FROM emp WHERE eid=?',[obj.eid],(err,result)=>{
        if(err){
            res.send({code:500,msg:'serve error'});
            return;
        };
        if(result.length===0){
            res.send({
                code:201,
                msg:'not found',
            });
            return;
        }else{
            res.send({
            code:200,
            msg:'ok',
            data:result[0]
            });
        };
    });
});
//3.添加员工（post /v1/emps）
app.post('/v1/emps',(req,res)=>{
    let obj=req.body;
    pool.query('INSERT INTO emp SET ?',[obj],(err,result)=>{
        if(err) throw err;
        res.send({
            code:20,
            msg:'insert success',
            data:result
        }); 
    })
});
//4.修改员工信息（put /v1/emps/编号）
app.put('/v1/emps/:eid&:ename&:sex&:birthday&:salary&:deptId',(req,res)=>{
    let obj=req.params;
    pool.query('UPDATE emp SET ? WHERE eid=?',[obj,obj.eid],(err,result)=>{
        if (err){
            res.send({code:500,msg:'serve error'});
            return;
        };
        if(result.affectedRows===0){
            res.send({code:201,msg:'update error'});
        }else{
            res.send({code:200,msg:'update success'});
        };
    });
});
//5.删除员工（delete /v1/emps/编号）
app.delete('/v1/emps/:eid',(req,res)=>{
    let obj=req.params;
    pool.query('DELETE FROM emp WHERE eid=?',[obj.eid],(err,result)=>{
            if(err){
                res.send({code:500,msg:'server err'});
                return;
            }
            if(result.affectedRows===0){
                res.send({code:201,msg:'delete err'});
            }else{
                res.send({code:200,msg:'delete success'});
            }
    });
});
