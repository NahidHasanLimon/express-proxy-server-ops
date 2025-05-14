module.exports = {
    apps: [
      {
        name: `express-based-proxy-server`,
        script: 'npm',
        args: "start",
        watch: false,
        interpreter: 'none',
        env: {
          PORT: 5003,
          NODE_ENV: "development",
        },
        env_production: {
          PORT: 5003,
          NODE_ENV: "production",
        },
        autorestart: true,
      },
    ],
  };
  
