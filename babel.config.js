// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Si usás react-native-reanimated instalalo y descomentá la línea siguiente:
      // "react-native-reanimated/plugin",
    ],
  };
};
