FROM node:latest
WORKDIR /app
COPY . .
EXPOSE 5050
CMD ["npm", "start"]
