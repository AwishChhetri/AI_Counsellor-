<<<<<<< HEAD
FROM node:14

WORKDIR /index.js

COPY package*.json ./

# Install dependencies
=======
FROM node:12-alpine
Run apk --no-cache python2 g++ make
WORDIR /index
COPY..
>>>>>>> 972b6cf30abb7c4ec57d596f69981c49a20a0dac
RUN npm install
CMD ["node","index.js"]
EXPOSE 3000

<<<<<<< HEAD
# Command to run your index
CMD [ "node", "index.js" ]
=======


>>>>>>> 972b6cf30abb7c4ec57d596f69981c49a20a0dac

