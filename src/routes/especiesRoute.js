var express = require("express");
var router = express.Router();

var especiesController = require("../controllers/especiesController");

router.get("/", function (req, res) {
  especiesController.listar(req, res);
});

router.post("/", function (req, res) {
  especiesController.cadastrar(req, res);
});

module.exports = router;
