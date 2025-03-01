# Use a imagem oficial do Node.js
FROM node:16

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de pacotes para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Exponha a porta que o servidor Express.js usará
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]