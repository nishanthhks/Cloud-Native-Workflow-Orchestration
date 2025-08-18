# Build stage: lightweight Node.js image to build React app
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the React app
RUN npm run build

# Serve the static files using Nginx

# official Nginx image to serve static files
FROM nginx:stable-alpine

# Copy built React files from the builder stage to the Nginx web root directory
COPY --from=builder /app/dist /usr/share/nginx/html
# If build output folder is 'build', use:
# COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config to enable SPA routing
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground (as a daemon) to keep the container running
CMD ["nginx", "-g", "daemon off;"]
