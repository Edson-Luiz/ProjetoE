# Imagem base atualizada e mais leve (Alpine)
FROM node:20-alpine

# Atualiza pacotes do SO para corrigir vulnerabilidades (ex: libcrypto3, libssl3)
RUN apk upgrade --no-cache

WORKDIR /app

# Atualiza npm globalmente para corrigir vulnerabilidades do node-pkg (ex: tar, pacote, etc.)
RUN npm install -g npm@10

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia código fonte
COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "start"]
