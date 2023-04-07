# Dockerfile

# Use the official Node.js image as the base image
FROM node

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the required dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
