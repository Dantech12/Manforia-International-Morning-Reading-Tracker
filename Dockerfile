# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy application code
COPY . .

# Run build step
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
