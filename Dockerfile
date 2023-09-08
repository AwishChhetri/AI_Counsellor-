
FROM node:14

WORKDIR /index.js

COPY package*.json ./

# Install dependencies
RUN npm install

# Set the working directory to /index
WORKDIR /index

# Copy the project files to the working directory
COPY . .

CMD ["node","index.js"]

# Expose port 3000
# (No changes required as only one port is exposed)

# Command to run your index
# (No changes required as this is the correct command to run the index)
