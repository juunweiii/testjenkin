ARG NODE_ENV
# Use the official Node.js 18 image as a parent image
FROM node:18-bookworm-slim AS base

# Install necessary packages, clean up in one RUN statement to minimize image layers
RUN apt-get update && apt-get install -y \
    git \
    ssh \
    openssh-client \
    dumb-init \
    g++ \
    make \
    python3-pip \
    curl \
    procps \
    dnsutils \
    cron \
    # Clean up cache to reduce layer size
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    # Set up cron
    && echo "* * * * * cd /usr/src/app/SSD/backend && ./dns.sh" >> /etc/cron.d/custom-cron \
    && echo "* * * * * echo running >> /var/log/cron.log" >> /etc/cron.d/custom-cron \
    && crontab -u node /etc/cron.d/custom-cron \
    && chmod u+s /usr/sbin/cron


RUN npm install -g pnpm node-gyp pm2

# Download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Set the working directory
WORKDIR /usr/src/app

FROM base AS base-development
# Create ENV
ENV NODE_ENV ${NODE_ENV} 

# Set to backend branch
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git -b backend-api SSD

FROM base AS base-staging
# Create ENV
ENV NODE_ENV ${NODE_ENV} 

# Set to staging branch
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git -b staging SSD

FROM base AS base-production
# Create ENV
ENV NODE_ENV ${NODE_ENV} 

# Set to main branch
RUN --mount=type=ssh git clone git@github.com:Ik0nw/ICT2216-SSD.git SSD

FROM base-${NODE_ENV} AS repo
# Remove other directories
RUN rm -r SSD/frontend/

# Set the working directory
WORKDIR /usr/src/app/SSD/backend

# Copy env keys
COPY .env.keys .env.keys
COPY entrypoint.sh /usr/local/bin
ENV PATH="/usr/src/app:$PATH"

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
EXPOSE 3010

# Run program
ENTRYPOINT [ "dumb-init", "--", "entrypoint.sh" ]
CMD ["bash", "-c", "pnpm dotenvx run -f .env.docker.local -- pnpm migrate-docker && pnpm docker-dev"] 

FROM repo AS staging

# Expose the port your app runs on
EXPOSE 3010

# Run program
ENTRYPOINT [ "dumb-init", "--", "entrypoint.sh" ]
CMD ["bash", "-c", "pnpm dotenvx run -f .env.staging -- pnpm migrate-docker && pnpm staging"] 

FROM repo AS production

RUN ls -la

# Expose the port your app runs on
EXPOSE 3010

# Run program
ENTRYPOINT [ "dumb-init", "--", "entrypoint.sh" ]
CMD ["bash", "-c", "pnpm dotenvx run -f .env.production -- pnpm migrate-docker && pnpm production"] 