# Imagem base atualizada e mais leve (Alpine)
FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia código fonte
COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "start"]
