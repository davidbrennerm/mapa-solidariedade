const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

module.exports = {
  async listarUsuarios(req, res) {
    try {
      const usuarios = await prisma.usuario.findMany();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }
  },

  async criarUsuario(req, res) {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const { nome, email, senha, tipoUsuario } = req.body;

    try {
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaCriptografada,
          tipoUsuario: tipoUsuario || 'voluntario',
        },
      });
      
      res.status(201).json(novoUsuario);

    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao criar usuário.' });
    }
  }
};
