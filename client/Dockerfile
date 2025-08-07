FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Serve the static files using Nginx

# official Nginx image to serve static files
FROM nginx:stable-alpine

# Copy built React files from the builder stage to the Nginx web root directory
COPY --from=builder /app/dist /usr/share/nginx/html
# If build output folder is 'build', use:
# COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

# Run Nginx in the foreground (as a daemon) to keep the container running
CMD ["nginx", "-g", "daemon off;"]
