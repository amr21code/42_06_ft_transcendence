FROM 	node:current-bullseye-slim

WORKDIR /usr/src/app
COPY . .
COPY images/bitcoin.png src/avatars/bitcoin.png
COPY images/mrburns.png src/avatars/mrburns.png

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]