module.exports = {
  apps: [
    {
      name: 'backend',
      script: './index.js',
      instances: 1,
      exec_mode: 'fork',
    },
    {
      name: 'login-server',
      script: './login-server.js',
      instances: 1,
      exec_mode: 'fork',
    },
  ],
};
