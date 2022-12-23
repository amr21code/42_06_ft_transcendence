FROM 	node:current-bullseye-slim

WORKDIR /usr/src/app
COPY package*.json main.js ./

RUN npm install

EXPOSE 5000

CMD ["node", "main.js"]