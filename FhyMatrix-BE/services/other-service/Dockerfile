FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .

RUN pnpm run prisma:gen

EXPOSE 50053

CMD ["pnpm", "start"]
