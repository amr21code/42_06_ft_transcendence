FROM 	node:current-bullseye-slim

WORKDIR /usr/src/app
COPY ../../backend/package*.json ./

RUN npm install

EXPOSE 3000

CMD ["node", "main.ts"]