FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 8080

EXPOSE $PORT

RUN npm run build

CMD ["node", "dist/server.js"]