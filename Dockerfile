FROM node:24-alpine

RUN apk update && \
    apk add --no-cache \
        git \
        zip \
        bash \
        python3

WORKDIR /var/www/html

CMD ["npm", "run", "dev"]
