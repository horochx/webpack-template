module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          corejs: {
            version: 3,
            proposals: true,
          },
          useBuiltIns: "usage",
        },
      ],
      "@babel/preset-react",
    ],
    plugins: [
      api.env("production") &&
        "@babel/plugin-transform-react-constant-elements",
      api.env("production") && "@babel/plugin-transform-react-inline-elements",
      !api.env("production") && "react-refresh/babel",
    ].filter(Boolean),
  };
};
