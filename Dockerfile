FROM node:10.16.3
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 4000
CMD npm start