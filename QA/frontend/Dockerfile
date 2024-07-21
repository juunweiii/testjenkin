ARG NODE_ENV
# Use the official Node.js 18 image as a parent image
FROM node:18-bookworm-slim AS base

# Install pnpm, git and ssh
RUN apt update -y
RUN apt install -y git ssh openssh-client dumb-init g++ make python3-pip
RUN npm install -g pnpm node-gyp

# Download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Set the working directory
WORKDIR /usr/src/app

# Clone private repo
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git SSD
WORKDIR /usr/src/app/SSD/
RUN git init
RUN git remote set-url origin git@github.com:Ik0nw/ICT2216-SSD.git

# Set to frontend branch
RUN git checkout -b frontend
RUN --mount=type=ssh git pull origin frontend

# Set the working directory
WORKDIR /usr/src/app/SSD/frontend

# Least privilege owner
RUN chown -R node:node /usr/src/app/SSD
RUN chmod 755 /usr/src/app/SSD

# Create user
USER node

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Run program
CMD ["sh", "-c","npm start"]
