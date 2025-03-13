FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV HOST=0.0.0.0
ENV WDS_SOCKET_PORT=3000
ENV VITE_PORT=3000

CMD ["npm", "run", "dev"]