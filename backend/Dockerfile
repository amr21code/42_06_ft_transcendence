FROM 	node:current-bullseye-slim

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 3000
EXPOSE 3002

CMD ["npm", "run", "start"]