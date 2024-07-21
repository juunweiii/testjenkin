# Use the official Node.js 16 image as a parent image
FROM node:18-bookworm-slim AS base

# Set the working directory
WORKDIR /usr/src/app
RUN apt update -y && apt install -y g++ make python3-pip iputils-ping curl procps dnsutils cron

# Install pnpm
RUN npm install -g pnpm pm2

# Copy the rest of your application code
COPY . .
RUN (crontab -l 2>/dev/null; echo "* * * * * cd /usr/src/app && ./dns.sh") | crontab -
RUN (crontab -l 2>/dev/null; echo "* * * * * echo hello >> /var/log/cron.log") | crontab -

# Give entrypoint file permission
# RUN chmod +x entrypoint.sh && chmod 755 entrypoint.sh && touch /var/log/cron.log
RUN chmod +x entrypoint.sh && chmod 755 entrypoint.sh 
RUN service cron start

# Add entrypoint into PATH
COPY entrypoint.sh /usr/local/bin
ENV PATH="/usr/src/app:$PATH"

# Install dependencies
RUN pnpm install

# Expose the port your app runs on
EXPOSE 3010

# Command to run your app
ENTRYPOINT [ "entrypoint.sh" ]
CMD ["bash", "-c", "pnpm dev"] 
# CMD ["bash", "-c", "pnpm production "] 