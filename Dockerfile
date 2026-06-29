FROM node:20-alpine

WORKDIR /app

# Ensure NODE_ENV is set to development during build so Vite and devDependencies install correctly on Railway
ENV NODE_ENV=development

COPY package.json package-lock.json* ./
RUN npm install --include=dev

COPY . .

RUN npm --prefix parent-ui install --include=dev
RUN npm run build

# Switch back to production for runtime execution
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
