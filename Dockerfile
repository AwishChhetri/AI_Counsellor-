
FROM node:12-alpine
# Changed the base image to node:12-alpine, as node:14 was giving an error

RUN apk --no-cache add python2 g++ make
# Corrected the typo "Run" to "RUN" and added "add" after "--no-cache"

WORKDIR /index
# Corrected the typo "WORDIR" to "WORKDIR" and changed the directory to "/index"

COPY . .
# Added a space between "COPY" and ".."

RUN npm install
CMD ["node","index.js"]
EXPOSE 3000

# Removed the duplicate "CMD" command

