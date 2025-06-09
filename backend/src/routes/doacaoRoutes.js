const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const doacaoController = require('../controllers/doacaoController');

const validarDoacao = [
  body('usuarioId').isInt().withMessage('Usuário inválido.'),
  body('pontoId').isInt().withMessage('Ponto inválido.'),
  body('categoriaId').isInt().withMessage('Categoria inválida.'),
  body('descricao').optional().isString().withMessage('Descrição deve ser texto.')
];

router.get('/', doacaoController.listarDoacoes);
router.post('/', validarDoacao, doacaoController.criarDoacao);

module.exports = router;