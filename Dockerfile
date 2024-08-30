# Stage 1: Build the Quasar application
FROM node:lts-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Change to the init_quasar_provision directory
WORKDIR /app

# Build the application
RUN npm run build

# Stage 2: Set up Nginx and copy built files
FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist/spa /usr/share/nginx/html

# Expose the port that Nginx will use
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
