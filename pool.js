const mysql=require('mysql');
//创建xz数据库的连接池
let pool=mysql.createPool({
        hsot:'127.0.0.1',
        port:'3306',
        user:'root',
        password:'',
        database:'xz',
        connectionLimit:15
    });
module.exports=pool;