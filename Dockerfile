FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire React app to the container
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]