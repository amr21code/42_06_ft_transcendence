FROM 	node:current-bullseye-slim

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 5173

COPY images/bitcoin.png src/avatars/bitcoin.png
COPY images/mrburns.png src/avatars/mrburns.png
CMD ["npm", "run", "dev"]