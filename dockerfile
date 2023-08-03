FROM node:12-alpine
Run apk --no-cache python2 g++ make
WORDIR /index
COPY..
RUN npm install
CMD ["node","index.js"]
EXPOSE 3000



