module.exports = {
  apps: [
    {
      name: 'prod',
      script: './application.js',
      instances: 4,
      autorestart: true,
      exec_mode: 'cluster',
      max_memory_restart: '1G'
    }
  ]
};
