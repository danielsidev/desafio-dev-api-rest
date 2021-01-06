var sql = require('./sql_create_tables');
var sql_test = require('./sql_create_tables_test');
var mysql = require('mysql'); 
var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    debug: false,
    multipleStatements: true
});
connection.connect();
connection.query(sql, [], function(error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log("Migração concluída...criando banco de teste...");
    connection.query("CREATE DATABASE IF NOT EXISTS dock_bank_test;", [], function(error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log("Banco de teste criado com sucesso!");
        connection.query(sql_test, [], function(error, results, fields) {
            if (error) {
                console.log(error);
            }
            console.log("Criação das tabelas do banco de teste e inserção de dados concluída.");
             
            connection.end();
        });
    });
});



