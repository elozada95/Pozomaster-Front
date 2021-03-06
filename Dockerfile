FROM node:8.9.4

ENV NODE_ENV=development
ENV HOST 0.0.0.0

RUN mkdir -p /app
COPY . /app
WORKDIR /app
# Expose the app port
EXPOSE 8080

RUN npm install
RUN npm run build
CMD ["npm", "run", "dev"]
