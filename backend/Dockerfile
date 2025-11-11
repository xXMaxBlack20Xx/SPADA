# ----- 1. Build Stage -----
# Use a Node.js image to build the app
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your NestJS app
RUN npm run build

# ----- 2. Production Stage -----
# Use a lighter-weight Node.js image for the final container
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json again
COPY package*.json ./

# Install *only* production dependencies
RUN npm install --only=production

# Copy the built app (dist) and node_modules from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the port your NestJS app runs on (default is 3000)
EXPOSE 3000

# The command to run your app
CMD ["node", "dist/main"]