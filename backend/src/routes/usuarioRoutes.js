const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

const validarUsuario = [
  body('nome').notEmpty().withMessage('Nome é obrigatório.'),
  body('email').isEmail().withMessage('Email inválido.'),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
];

router.get('/', usuarioController.listarUsuarios);

module.exports = router;