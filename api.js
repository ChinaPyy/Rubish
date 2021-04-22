const express = require('express')      //引入模块
const bodyParser = require('body-parser')       //引入 body-parse 用来解析 接收到的post数据
const mysql = require('mysql')
const app = express()                   // 调用 express
const port = 9000                       // 服务运行的端口


//设置连接参数
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'node'
});


//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-type",);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use(bodyParser.json())

// 用户登录接口
app.post('/user/login',function(req,res){
    //接受客户端req传过来的数据
    //传过来的数据在req数据的body对象里面
    let user_name = req.body.user_name //req.body对象从客户端接受的属性user_name
    let user_pass = req.body.user_pass //req.body对象从客户端接受的属性user_pass

    // 写一条查询的sql语句
    let sql = `SELECT * FROM user WHERE user_name='${user_name}' and user_pwd='${user_pass}'`;
    //通过连接的数据库执行上一句sql语句里面有两个参数err是错误提示,result是查询出来的数据结果
    connection.query(sql,function(err,result){
        console.log(result)
        //根据结果的长度判断是否存在这个用户如果有的话就成功否则失败
        if(result.length>0){
            //定义一个对象
            let response = {
                errno: 0,
                msg: "登录成功",
                data: {
                    user_id:result.user_id
                }
            }
            //把对象转化成JSON数据从服务器端用户登录接口响应到客户端所调用这个接口的数据里面
            res.send(JSON.stringify(response))
        }else{
             //定义一个对象
             let response = {
                errno: 1,
                msg: "登录失败",
                data: {
                    user_id:result.user_id
                }
            }
              //把对象转化成JSON数据从服务器端用户登录接口响应到客户端所调用这个接口的数据里面
              res.send(JSON.stringify(response))
        }
    })

    
})

//个人中心
app.get("/user/center",function(req,res){

})

//用户列表
app.get('/user/list',(req,res)=>{
    let selectSql = "SELECT * FROM user";
    connection.query(selectSql,function(err,result){
        res.send(result)
    })
})

//后台管理员
app.get('/users/list',(req,res)=>{
    let selectSql = "SELECT * FROM user WHERE is_delete=1";
    connection.query(selectSql,function(err,result){
        res.send(result)
    })
})

//用户删除
app.post('/user/del', (req, res) => {
    let user_id =  req.body.user_id
    let delSql = `DELETE FROM user WHERE user_id = ${user_id}`
    connection.query(delSql,function (err,result){
        res.send(result)
    })
})
//用户删除 后台
app.post('/users/del', (req, res) => {
    let user_id =  req.body.user_id
    let delSql = `UPDATE user SET is_delete=0 WHERE user_id = ${user_id}`
    connection.query(delSql,function (err,result){
        res.send(result)
    })
})

//添加
app.post('/usersAdd',function (req,res){
    let user_name = req.body.obj.user_name
    let user_age = req.body.obj.user_age
    let user_pwd = req.body.obj.user_pwd
    let addSql = `INSERT INTO user (user_name,user_age,user_pwd) VALUES ('${user_name}','${user_age}','${user_pwd}')`
    connection.query(addSql,function (err,result){
        res.send(result)
        console.log(result)
    })
})

// 用户注册
app.post('/user/reg',function(req,res){
    // 接收post数据
    const body = req.body
})

//数据查询
app.post('/users/find',function(req,res){
    // 接收post数据
    console.log(req.body)
    let user_id  = req.body.id
    let selectSql = `SELECT * FROM user WHERE user_id = '${user_id}'`;
    connection.query(selectSql,function(err,result){
        res.send({
            errno: 0,
            msg: 'ok',
            data:{
                u:result[0]
            }
        })
    })
})

//数据修改
app.post('/users/edit', (req, res) => {
    let arr = req.body
    let user_id = arr.userinfo.user_id
    let user_name = arr.userinfo.user_name
    let user_age = arr.userinfo.user_age
    let delSql = `UPDATE user SET user_name = '${user_name}',user_age = '${user_age}' WHERE user_id = ${user_id}`
    connection.query(delSql,function (err,result){
        console.log(result)
        res.send({
            errno: 0,
            msg: 'ok'
        })
    })
})

app.listen(port, () => {
    console.log(`D:\\wwwroot\\rubish>node api.js: http://localhost:${port}`)
})