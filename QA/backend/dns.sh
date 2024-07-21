#!/bin/bash

# Retrieve domain from environment variable and get current ip
domain=$(awk -F'=' '/LOG_SERVER_DOMAIN=/ {print $2}' .env)
echo "domain = ${domain}"
envip=$(awk -F'=' '/LOG_SERVER_IP=/ {print $2}' .env)
echo "env ip = ${envip}"

newip=$(dig +short ${domain})
echo "new ip = ${newip}"

# See old IP
oldip=$(awk -F' = ' '/process.env.LOG_SERVER_IP/ {print $2}' ./src/app.js  )
echo "old ip = ${oldip}"

# Replace only if do not match, avoid editing below
if [ "\"$envip\";" != "$oldip" ]; then
    if [ "$newip" != "$oldip" ]; then
        # Replace line in app.js
        awk -v new_ip="$newip" '/process.env.LOG_SERVER_IP/ {gsub(/=.*/, "= \"" new_ip "\";");} {print}' ./src/app.js > tmp && mv tmp ./src/app.js
    fi
fi
