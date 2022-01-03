FROM node:latest
WORKDIR /usr/src/app
copy package*.json ./
run npm install 
copy . .  
expose 5000
cmd ["npm", "start" ]