const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

const validarCategoria = [
  body('nome').notEmpty().withMessage('Nome é obrigatório.')
];

router.get('/', categoriaController.listarCategorias);
router.post('/', validarCategoria, categoriaController.criarCategoria);

module.exports = router;