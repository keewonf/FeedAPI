# Use a imagem oficial do Node.js
FROM node:16

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de pacotes para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Instale o pm2 globalmente
RUN npm install -g pm2

# Copie o restante dos arquivos da aplicação
COPY . .

# Exponha a porta que o servidor Express.js usará
EXPOSE 3333

# Comando para iniciar o servidor usando pm2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]