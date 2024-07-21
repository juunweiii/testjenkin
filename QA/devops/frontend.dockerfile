ARG NODE_ENV
# Use the official Node.js 18 image as a parent image for the build stage
FROM node:18-bookworm-slim AS base

# Install pnpm, git, and ssh
RUN apt update -y && apt install -y git ssh openssh-client dumb-init g++ make python3-pip && apt clean && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm node-gyp

# Download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Set the working directory
WORKDIR /usr/src/app

# Create ENV
ENV NODE_ENV ${NODE_ENV}

FROM base AS base-development
# Set to frontend branch
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git -b frontend SSD

FROM base AS base-staging
# Set to staging branch
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git -b staging SSD

FROM base AS base-production
# Set to main branch
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git SSD

FROM base-${NODE_ENV} AS repo
# Remove other directories
RUN rm -r SSD/backend/

# Set the working directory
WORKDIR /usr/src/app/SSD/frontend

# Copy .env.keys
COPY frontend.env.keys .env.keys

# Least privilege owner
RUN chown -R node:node /usr/src/app && chmod 755 /usr/src/app

# Create user
USER node

# Install dependencies
RUN pnpm install

# Decrypt the vault
RUN pnpm decrypt

FROM repo AS development

# Expose the port your app runs on
EXPOSE 3000

# Run program
RUN pnpm build-dev
ENTRYPOINT ["dumb-init", "--"]
CMD ["bash", "-c", "pnpm prod"]

FROM repo AS staging

# Expose the port your app runs on
EXPOSE 3000

# Run program
RUN pnpm build
ENTRYPOINT ["dumb-init", "--"]
CMD ["bash", "-c", "pnpm prod"]

FROM repo AS production

# Expose the port your app runs on
EXPOSE 3000

# Run program
RUN pnpm build
ENTRYPOINT ["dumb-init", "--"]
CMD ["bash", "-c", "pnpm prod"]