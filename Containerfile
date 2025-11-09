FROM node:24-alpine

RUN apk add --no-cache git zip bash python3

WORKDIR /app

COPY package*.json .

RUN npm i && \
    npm cache clean --force

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
