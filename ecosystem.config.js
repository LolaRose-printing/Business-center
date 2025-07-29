module.exports = {
    apps: [
      {
        name: "business-center",
        script: "node_modules/next/dist/bin/next",
        args: "start -p 3004",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  