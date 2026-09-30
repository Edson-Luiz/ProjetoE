# VULNERABILIDADE: Imagem base antiga e sem atualizações de segurança
FROM node:16

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia código fonte
COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "start"]
