FROM --platform=linux/amd64 node:14
WORKDIR /4.2C
COPY package*.json ./
RUN npm install
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]