const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { nome, email, senha, tipo = 'voluntario' } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }
    
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        tipoUsuario: tipo || 'voluntario',
      },
    });

    res.status(201).json({ id: novoUsuario.id, nome: novoUsuario.nome, tipo: novoUsuario.tipo });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

module.exports = router;
