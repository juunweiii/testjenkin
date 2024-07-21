ARG NODE_ENV
# Use the official Node.js 18 image as a parent image
FROM node:18-bookworm-slim AS base

# Install pnpm, git and ssh
RUN apt update -y
RUN apt install -y git ssh openssh-client dumb-init g++ make python3-pip curl procps
RUN npm install -g pnpm node-gyp pm2

# Download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Set the working directory
WORKDIR /usr/src/app

# Clone private repo
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git SSD
WORKDIR /usr/src/app/SSD/
RUN git init
RUN git remote set-url origin git@github.com:Ik0nw/ICT2216-SSD.git

FROM base AS base-development
# Create ENV
ENV NODE_ENV ${NODE_ENV} 

# Set to backend branch
RUN git checkout --orphan backend-api
RUN git reset --hard origin/backend-api
RUN --mount=type=ssh git pull origin backend-api

FROM base AS base-staging
# Create ENV
ENV NODE_ENV ${NODE_ENV} 

# Set to backend branch
RUN git checkout --orphan staging
RUN git reset --hard origin/staging
RUN --mount=type=ssh git pull origin staging

FROM base AS base-production
# Create ENV
ENV NODE_ENV ${NODE_ENV} 

# Set to backend branch
# RUN git checkout -b main
RUN --mount=type=ssh git pull origin main

FROM base-${NODE_ENV} AS repo
# Remove other directories
RUN rm -r frontend
RUN rm -r $(ls -d backend/src/services/* | grep -v users)

# Set the working directory
WORKDIR /usr/src/app/SSD/backend

# Copy env keys
COPY .env.keys .env.keys

# Least privilege owner
RUN chown -R node:node /usr/src/app/SSD
RUN chmod 755 /usr/src/app/SSD

# Create user
USER node

# Install dependencies
RUN pnpm install

# Decrypt the vault
RUN pnpm decrypt

FROM repo AS development

# Use correct .env
RUN mv .env.docker.local .env

# Adjust port and svc name
RUN pnpm dotenvx set PORT $(pnpm dotenvx get USERS_SVC_PORT)
RUN pnpm dotenvx set SVC_NAME $(pnpm dotenvx get USERS_SVC_NAME)

# Expose the port your app runs on
EXPOSE 3020

# Run program
ENTRYPOINT ["dumb-init", "--"]
# CMD ["sh", "-c", "pnpm migrate && pnpm start"]
CMD ["bash", "-c", "pnpm start --no-daemon ecosystem.config.js"] 

FROM repo AS staging

# Use correct .env
RUN mv .env.staging .env

# Adjust port and svc name
RUN pnpm dotenvx set PORT $(pnpm dotenvx get USERS_SVC_PORT)
RUN pnpm dotenvx set SVC_NAME $(pnpm dotenvx get USERS_SVC_NAME)

# Expose the port your app runs on
EXPOSE 3020

# Run program
ENTRYPOINT ["dumb-init", "--"]
# CMD ["sh", "-c", "pnpm migrate && pnpm start"]
CMD ["bash", "-c", "pnpm start --no-daemon ecosystem.config.js"] 

FROM repo AS production

# Use correct .env
RUN mv .env.production .env

# Adjust port and svc name
RUN pnpm dotenvx set PORT $(pnpm dotenvx get USERS_SVC_PORT)
RUN pnpm dotenvx set SVC_NAME $(pnpm dotenvx get USERS_SVC_NAME)

# Expose the port your app runs on
EXPOSE 3020

# Run program
ENTRYPOINT ["dumb-init", "--"]
# CMD ["sh", "-c", "pnpm migrate && pnpm start"]
CMD ["bash", "-c", "pnpm start --no-daemon ecosystem.config.js"] 