# Use the official Node.js base image
FROM node:20.10-slim

# Set the working directory in the container
WORKDIR /nextjs_lsc_inspector_app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install the Node.js dependencies
RUN npm install --legacy-peer-deps

# Copy the application code to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Set the CMD to start the app
CMD ["npm", "run", "start"]