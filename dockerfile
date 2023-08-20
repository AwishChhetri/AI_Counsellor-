FROM node:14

# Set the working directory inside the container
WORKDIR /src/index

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your index runs on
EXPOSE 3000

# Command to run your index
CMD [ "node", "index.js" ]