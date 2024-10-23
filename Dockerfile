FROM node:20
# change BE_SERVER_POR=4678 ? 
ENV BE_SERVER_PORT=8764  
WORKDIR /app
COPY package.json .

RUN npm install
COPY . .
EXPOSE ${BE_SERVER_PORT}
CMD ["npm", "start"]                                
