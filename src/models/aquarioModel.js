var database = require("../database/config");

function buscarAquariosPorEmpresa(empresaId) {

  var instrucaoSql = `SELECT * FROM aquario a WHERE fk_empresa = ${empresaId}`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function listarTodos() {
  var instrucaoSql = `SELECT id as id, descricao, tipo_agua, tamanho FROM aquario`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM aquario WHERE id = ?`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql, [id]);
  return database.executar({ sql: instrucaoSql, values: [id] });
}

function cadastrar(empresaId, descricao) {
  var instrucaoSql = `INSERT INTO aquario (descricao, fk_empresa) VALUES (?, ?)`;
  var params = [descricao, empresaId];
  console.log("Executando a instrução SQL: \n" + instrucaoSql, params);
  return database.executar({ sql: instrucaoSql, values: params });
}


module.exports = {
  buscarAquariosPorEmpresa,
  cadastrar,
  listarTodos,
  buscarPorId
}
