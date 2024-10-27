FROM node:18-alpine

# Environment variables
ENV NC_ENVIRONMENT "production"

WORKDIR /opt/gizmo-webapi

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN npm run start


EXPOSE 3000

# Rund DB migrations & Start API
# CMD ["sh","-c","npm run migrate && npm run start:prod"]
# Using this for debugging purposes
CMD ["sh","-c","npm run migrate && npm run start:trace2"]