const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/usuarios', usuarioRoutes);

const categoriaRoutes = require('./routes/categoriaRoutes');
app.use('/categorias', categoriaRoutes);

const pontoRoutes = require('./routes/pontoRoutes');
app.use('/pontos', pontoRoutes);

const doacaoRoutes = require('./routes/doacaoRoutes');
app.use('/doacoes', doacaoRoutes);

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

const cadastro = require('./routes/cadastro');
app.use('/cadastro', cadastro);



app.get('/', (req, res) => res.send('API Mapa da Solidariedade funcionando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
