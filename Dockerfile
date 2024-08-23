FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5050
CMD ["npm", "start"]
