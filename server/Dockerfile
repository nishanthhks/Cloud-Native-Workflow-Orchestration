# lightweight os (bullseye debian 11) + nodejs runtime
FROM node:18-bullseye

# create and enter folder in root directory
WORKDIR /app

# copy package.json and package-lock.json to the working directory
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code to the working directory
COPY . .

# generate Prisma client
RUN npx prisma generate

# optional metadata for the container port
EXPOSE 3000

# command to run the application
CMD ["node", "index.js"]

