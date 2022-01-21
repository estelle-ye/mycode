const express=require('express');
const userRouter=require('./router/user1');//是自定义模块，括号内写路由文件的路径即可
const productRouter=require('./router/product');
const bodyParser=require('body-parser');
let app=express();
app.listen(8080);
//内置中间件express.static：托管静态资源到public
app.use( express.static('public') );
//内置中间件body-parser，解析获取到的数据,注意该中间件一定要放在挂载之前，否则挂载的路由无法使用该中间件
app.use( bodyParser.urlencoded({
    extended:false
}) );
//内置中间件userRouter,把路由器挂在到服务器下,添加前缀/user
app.use('/user',userRouter);
app.use('/procduct',productRouter);



