const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  console.log('🚀 Requisição de login recebida:');
  console.log('Email:', email);
  console.log('Senha enviada:', senha ? '[FORNECIDA]' : '[NÃO FORNECIDA]');

  if (!email || !senha) {
    console.warn('⚠️ Falha de validação: email e senha são obrigatórios.');
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    console.log('Usuário encontrado no banco?', usuario ? 'SIM' : 'NÃO');

    if (!usuario) {
      console.warn(`⚠️ Usuário com email ${email} não encontrado.`);
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    console.log('Senha armazenada no banco:', usuario.senha ? '[HASH EXISTENTE]' : '[SEM SENHA]');

    if (!usuario.senha || typeof usuario.senha !== 'string') {
      console.error('Erro: campo senha inválido no banco de dados:', usuario.senha);
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);
    console.log('Comparação de senha:', senhaConfere ? 'OK' : 'FALHOU');

    if (!senhaConfere) {
      console.warn(`⚠️ Senha incorreta para o usuário ${email}.`);
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const { id, nome, tipo } = usuario;
    console.log(`✅ Login realizado com sucesso para o usuário ${email}.`);
    return res.json({ id, nome, tipo });

  } catch (error) {
    console.error('❌ Erro ao realizar login:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

module.exports = router;
