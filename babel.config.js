// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Recomendado para Reanimated. Si no lo usas, igual no estorba.
      "react-native-reanimated/plugin",
    ],
  };
};
