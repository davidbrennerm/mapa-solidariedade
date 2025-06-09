const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const pontoController = require('../controllers/pontoController');

const validarPonto = [
  body('nome').notEmpty().withMessage('Nome é obrigatório.'),
  body('endereco').notEmpty().withMessage('Endereço é obrigatório.'),
  body('bairro').notEmpty().withMessage('Bairro é obrigatório.'),
  body('cidade').notEmpty().withMessage('Cidade é obrigatória.'),
  body('estado').notEmpty().withMessage('Estado é obrigatório.'),
  body('latitude').isFloat().withMessage('Latitude deve ser um número válido.'),
  body('longitude').isFloat().withMessage('Longitude deve ser um número válido.'),
  body('horarioFunc').notEmpty().withMessage('Horário de funcionamento é obrigatório.'),
  body('categoriaId').isInt().withMessage('Categoria inválida.'),
  body('responsavelId').isInt().withMessage('Responsável inválido.'),
  body('descricao').optional().isString().withMessage('Descrição deve ser texto.')
];

router.get('/', pontoController.listarPontos);
router.post('/', validarPonto, pontoController.criarPonto);

module.exports = router;