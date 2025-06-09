const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

module.exports = {
  async listarDoacoes(req, res) {
    try {
      const doacoes = await prisma.doacao.findMany({
        include: {
          usuario: { select: { nome: true, email: true } },
          ponto: { select: { nome: true } },
          categoria: { select: { nome: true } }
        }
      });
      res.status(200).json(doacoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar doações.' });
    }
  },

  async criarDoacao(req, res) {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const { usuarioId, pontoId, categoriaId, descricao } = req.body;

    try {
      const novaDoacao = await prisma.doacao.create({
        data: {
          usuarioId,
          pontoId,
          categoriaId,
          descricao
        }
      });
      res.status(201).json(novaDoacao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao registrar doação.' });
    }
  }
};
