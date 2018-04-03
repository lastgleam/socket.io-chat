FROM node:boron
MAINTAINER Kim Donghee <lastgleam@gmail.com>

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 30000
CMD ["node", "index.js"]
