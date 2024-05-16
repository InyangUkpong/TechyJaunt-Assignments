FROM node:22.2.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3500

CMD ["npm", "start"]
