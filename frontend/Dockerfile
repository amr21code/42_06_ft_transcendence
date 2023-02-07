FROM 	node:current-bullseye-slim

WORKDIR /usr/src/app
COPY . .
COPY images/* ./src/avatars/

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]