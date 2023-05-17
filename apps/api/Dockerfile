FROM node:18-alpine as deps

WORKDIR /user/src/app

COPY dist/apps/api/package*.json ./
COPY prisma ./prisma/

RUN npm install

FROM node:18-alpine as runner

WORKDIR /user/src/app

COPY --from=deps /user/src/app/node_modules ./node_modules
COPY --from=deps /user/src/app/package*.json ./
COPY dist/apps/api ./

USER node

EXPOSE 3000
CMD [ "node", "./main.js" ]
