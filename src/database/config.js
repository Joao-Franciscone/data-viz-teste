var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucao) {

    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        // suportar instrução string simples ou objeto { sql, values }
        if (typeof instrucao === 'string') {
            conexao.query(instrucao, function (erro, resultados) {
                conexao.end();
                if (erro) { reject(erro); return; }
                console.log(resultados);
                resolve(resultados);
            });
        } else if (typeof instrucao === 'object' && instrucao.sql) {
            conexao.query(instrucao.sql, instrucao.values || [], function (erro, resultados) {
                conexao.end();
                if (erro) { reject(erro); return; }
                console.log(resultados);
                resolve(resultados);
            });
        } else {
            conexao.end();
            reject(new Error('Instrucao inválida ao executar query'));
        }
        conexao.on('error', function (erro) {
            return ("ERRO NO MySQL SERVER: ", erro.sqlMessage);
        });
    });
}

module.exports = {
    executar
};
