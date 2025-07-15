#!/bin/sh

npm install

# Appliquer les migrations Prisma au démarrage
npx prisma migrate deploy

exec "$@"