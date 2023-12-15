# Use the official Node.js base image
FROM node:20.10-slim

# Set the working directory in the container
WORKDIR /nextjs_lsc_inspector_app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install serve for serving the static files
RUN npm install --save-dev serve

# Install the Node.js dependencies
RUN npm install --legacy-peer-deps

# Copy the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 80

# Set the CMD to start the app
CMD npx serve -s build -l 80