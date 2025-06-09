# Mapa da Solidariedade

Projeto de extensão do curso de Análise e Desenvolvimento de Sistemas — UNIDOCTUM  
Sistema web para mapeamento de pontos de doação e registro de doações na cidade de Teófilo Otoni – MG.

---

## 🔍 Sobre o projeto

O **Mapa da Solidariedade** conecta voluntários e doadores a locais de coleta de doações, com geolocalização via mapa interativo, formulários funcionais e controle de usuários. É uma solução prática e socialmente engajada para combater os efeitos do frio e da vulnerabilidade social.

---

## 🚀 Tecnologias utilizadas

- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL  
- **Frontend:** HTML, CSS, JavaScript, Leaflet.js  
- **Banco de dados:** PostgreSQL  
- **Segurança:** Criptografia de senhas com bcrypt  
- **Validação:** express-validator

---

## 🧰 Pré-requisitos

- [Node.js](https://nodejs.org/) instalado  
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando  
- [Git](https://git-scm.com/) (opcional, mas recomendado)

---

## 🛠️ Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/mapa-solidariedade.git
cd mapa-solidariedade
```

### 2. Configure o banco de dados

Crie um arquivo `.env` na raiz do projeto com a seguinte variável:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/mapa_solidariedade"
```

### 3. Instale as dependências

```bash
cd backend
npm install
```


### 4. Execute as migrações Prisma

```bash
npx prisma migrate dev --name init
```

### 5. Inicie o backend

```bash
npm run dev
```

O backend rodará em: http://localhost:3000


### 6. Inicie o frontend

Abra o arquivo index.html da pasta frontend/ no navegador:

```bash
cd ../frontend
start index.html   # (Windows)
# ou
open index.html    # (Mac)
```

---

### 👤 Acesso e uso

- Crie sua conta clicando em "Criar Conta"

- Faça login com e-mail e senha

- Registre pontos de doação e doações diretamente no mapa

- Visualize tudo de forma interativa

---

### 📷 Telas do sistema

- Mapa interativo com marcadores de pontos de doação

- Formulário de login e cadastro

- Formulário com mapa para registrar ponto de coleta

- Filtros por categoria e bairro

---

### 🗺️ Mapa com Pontos de Doação
![Mapa interativo](assets/mapa.png)

### 📋 Formulário de Doação
![Formulário de Doação](assets/formulario-doacao.png)

### 📋 Formulário cadastro de Ponto de Doação
![Formulário de Doação](assets/formulario-pontos.png)

### 🔐 Tela de Login
![Login](assets/login.png)

---

### 📘 Documentação

O relatório completo do projeto pode ser acessado no Google Drive:
📎 https://docs.google.com/document/d/1nGwK16EJvRI5LZczBPpV3B7Fq7iWESqpzWXmLWy2WZ4/edit?usp=sharing

---

### 📄 Licença

Projeto acadêmico — uso livre para fins educacionais e sociais.
