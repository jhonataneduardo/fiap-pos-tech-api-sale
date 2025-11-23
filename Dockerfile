FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY yarn.lock* ./

RUN yarn install

COPY . .

RUN npx prisma generate --schema prisma/schema.prisma

RUN yarn build && npx tsc-alias

EXPOSE 3000

CMD ["yarn", "start"]
