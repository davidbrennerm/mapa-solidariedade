const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

module.exports = {
  async listarCategorias(req, res) {
    try {
      const categorias = await prisma.categoria.findMany();
      res.status(200).json(categorias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao buscar categorias.' });
    }
  },

  async criarCategoria(req, res) {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const { nome } = req.body;

    try {
      const novaCategoria = await prisma.categoria.create({
        data: { nome }
      });
      res.status(201).json(novaCategoria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao criar categoria.' });
    }
  }
};
