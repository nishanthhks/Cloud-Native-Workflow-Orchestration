# lightweight os (alpine linux) + nodejs runtime
FROM node:18-alpine

# create and enter folder in root directory
WORKDIR /app

# copy package.json and package-lock.json to the working directory
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code to the working directory
COPY . .

# optional metadata for the container port
EXPOSE 3001

# command to run the application
CMD ["node", "index.js"]

