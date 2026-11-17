var especiesModel = require("../models/especiesModel");
var aquarioModel = require("../models/aquarioModel");

function normalizarNome(nome) {
  return nome.trim().toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ');
}

function listar(req, res) {
  var filtros = {
    tipo_agua: req.query.tipo_agua,
    tamanho: req.query.tamanho,
    idAquario: req.query.idAquario
  };
  especiesModel.listar(filtros).then((resultado) => {
    res.status(200).json(resultado);
  }).catch((erro) => {
    console.log(erro);
    res.status(500).json(erro.sqlMessage||erro.message);
  });
}

async function cadastrar(req, res) {
  var nome = req.body.nome;
  var fkAquario = req.body.idAquario;
  var tipoPref = req.body.tipo_agua_preferida || null;

  if (!nome || !fkAquario) {
    return res.status(400).send('nome e idAquario são obrigatórios');
  }

  var nomeNorm = normalizarNome(nome);

  try {
    var dup = await especiesModel.buscarPorNomeNormalizado(nomeNorm);
    if (dup.length > 0) return res.status(409).send('Espécie já cadastrada');

    // checar compatibilidade com aquario

    var aquarios = await aquarioModel.buscarPorId(fkAquario);
    var aquario = (aquarios && aquarios.length) ? aquarios[0] : null;

    if (!aquario) return res.status(400).send('Aquário não encontrado');

    if (aquario.tipo_agua && tipoPref && aquario.tipo_agua !== tipoPref) {
      return res.status(400).send('Tipo de água incompatível');
    }

    var resultado = await especiesModel.inserir(nome, nomeNorm, fkAquario, tipoPref);
    res.status(201).json({ id: resultado.insertId, nome: nome, idAquario: fkAquario });
  } catch (erro) {
    console.log(erro);
    res.status(500).json(erro.sqlMessage||erro.message);
  }
}

module.exports = {
  listar,
  cadastrar
};
