FROM node:18-alpine

WORKDIR /user/src/app

COPY /dist/apps/web/.next/standalone ./
COPY /dist/apps/web/.next/static ./dist/apps/web/.next/static
COPY /dist/apps/web/public ./apps/web/public

CMD node apps/web/server.js
