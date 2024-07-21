require("@dotenvx/dotenvx").config()

module.exports = {
  apps : [{
    name   : "backend-app",
    instances: 1,
    // exec_mode: "cluster",
    exec_mode: "fork",
    watch: true,
    increment_var: "PORT",
    interpreter: "./node_modules/.bin/fastify",
    interpreter_args: "start --options",
    script: "./src/app.js",
    ignore_watch: [
      "src/logs",
      "node_modules"
    ],
    // script : "dotenvx run -- ./node_modules/.bin/fastify start --options ./src/app.js",
    max_memory_restart: "1024M",
    max_restarts: 30,
    // combine_logs: true,
    // log_file: "/var/log/ssd/pm2/pm2.log",
    env: {
      PORT: process.env.PORT,
      NODE_ENV: "development",
    },
    env_staging: {
      PORT: process.env.PORT,
      NODE_ENV: "staging",
    },
    env_production: {
      PORT: process.env.PORT,
      NODE_ENV: "production",
    },

  }]
}
