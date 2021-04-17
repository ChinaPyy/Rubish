const express = require('express');
const app = express()
const mysql = require('mysql');
let connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'node'
});
connection.connect();
app.get('/user',(req,res)=>{
    // 列表查询
    connection.query('SELECT * FROM user limit 10',function (error, results, fields) {
        res.send(JSON.stringify(results))
    })
})
connection.end()