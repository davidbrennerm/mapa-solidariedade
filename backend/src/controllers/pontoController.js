const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

module.exports = {
  async listarPontos(req, res) {
    try {
      const pontos = await prisma.pontoDeDoacao.findMany({
        include: {
          categoria: true,
          responsavel: {
            select: { nome: true, email: true }
          }
        }
      });
      res.status(200).json(pontos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar pontos de doação.' });
    }
  },

  async criarPonto(req, res) {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const {
      nome,
      descricao,
      endereco,
      bairro,
      cidade,
      estado,
      latitude,
      longitude,
      horarioFunc,
      categoriaId,
      responsavelId
    } = req.body;

    try {
      const novoPonto = await prisma.pontoDeDoacao.create({
        data: {
          nome,
          descricao,
          endereco,
          bairro,
          cidade,
          estado,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          horarioFunc,
          categoriaId,
          responsavelId
        }
      });
      res.status(201).json(novoPonto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao criar ponto de doação.' });
    }
  }
};