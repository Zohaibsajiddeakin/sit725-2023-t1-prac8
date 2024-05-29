from node 

WORKDIR /app

copy . .

run npm install

cmd ["npm", "start"]

