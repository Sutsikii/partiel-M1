FROM node:18-bullseye-slim AS next

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY . . 

RUN npx prisma generate

RUN npm run build

COPY docker/next/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

CMD ["npm", "start"]