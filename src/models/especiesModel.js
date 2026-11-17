var database = require("../database/config");

function listar(filtros) {
  var cond = [];
  var params = [];
  if (filtros.tipo_agua) { cond.push("a.tipo_agua = ?"); params.push(filtros.tipo_agua); }
  if (filtros.tamanho) { cond.push("a.tamanho = ?"); params.push(filtros.tamanho); }
  if (filtros.idAquario) { cond.push("e.fk_aquario = ?"); params.push(filtros.idAquario); }

  var where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';

  var instrucaoSql = `SELECT e.id, e.nome_original as nome, e.fk_aquario, a.tipo_agua, a.tamanho FROM especies e LEFT JOIN aquario a ON e.fk_aquario = a.id ${where}`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql, params);
  return database.executar({ sql: instrucaoSql, values: params });
}

function buscarPorNomeNormalizado(nomeNorm) {
  var instrucaoSql = `SELECT * FROM especies WHERE nome_normalizado = ?`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql, [nomeNorm]);
  return database.executar({ sql: instrucaoSql, values: [nomeNorm] });
}

function inserir(nomeOriginal, nomeNormalizado, fkAquario, tipoPref) {
  var instrucaoSql = `INSERT INTO especies (nome_original, nome_normalizado, fk_aquario, tipo_agua_preferido) VALUES (?, ?, ?, ?)`;
  var params = [nomeOriginal, nomeNormalizado, fkAquario, tipoPref];
  console.log("Executando a instrução SQL: \n" + instrucaoSql, params);
  return database.executar({ sql: instrucaoSql, values: params });
}

module.exports = {
  listar,
  buscarPorNomeNormalizado,
  inserir
}
