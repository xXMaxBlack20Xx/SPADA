# ----- 1. Build Stage -----
# Use a Node.js image to build the static files
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Run the Vite build command
RUN npm run build

# ----- 2. Serve Stage -----
# Use a small Nginx image to serve the files
FROM nginx:1.25-alpine

# Copy the built static files from the 'builder' stage
# The 'npm run build' command creates a 'dist' folder
COPY --from=builder /app/dist /usr/share/nginx/html

# IMPORTANT: We need to tell Nginx how to handle API requests.
# We will copy a custom Nginx config file.
# We will create this file in the next step.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default for Nginx)
EXPOSE 80