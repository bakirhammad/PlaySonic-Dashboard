const path = require("path");
const rimraf = require("rimraf");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RtlCssPlugin = require("rtlcss-webpack-plugin");

const rootPath = path.resolve(__dirname);
const distPath = rootPath + "/src/assets";
const entries = {
  "css/style": "./src/assets/sass/style.scss",
};

rimraf.sync(distPath + "/css");

module.exports = {
  mode: "development",
  stats: "verbose",
  performance: {
    hints: "error",
    maxAssetSize: 10000000,
    maxEntrypointSize: 4000000,
  },
  entry: entries,
  output: {
    path: distPath,
    filename: "[name].js",
  },
  resolve: {
    extensions: [".scss"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].rtl.css",
    }),
    new RtlCssPlugin({
      filename: "[name].rtl.css",
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
          (async () => {
            await del(distPath + "/css/*.js", { force: true });
          })();
        });
      },
    },
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
